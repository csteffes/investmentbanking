import type Stripe from "stripe";

import { getStripe } from "@/lib/stripe";
import { getAdminSupabase } from "@/lib/supabase";

// Stripe removed current_period_end from the Subscription type in newer SDK versions;
// cast to access it for backwards-compatible webhook handling.
type StripeSubscriptionWithPeriod = Stripe.Subscription & { current_period_end: number };

function getSubscriptionItem(subscription: Stripe.Subscription) {
  return subscription.items.data[0];
}

export type SubscriptionRecord = {
  user_id: string | null;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  status: string;
  price_id: string | null;
  current_period_end: string | null;
};

async function findUserIdForCustomer(customerId: string) {
  const supabase = getAdminSupabase();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if ((data as { user_id?: string | null } | null)?.user_id) {
    return (data as { user_id: string }).user_id;
  }

  const stripe = getStripe();
  const customer = await stripe.customers.retrieve(customerId);
  if (!("deleted" in customer) && typeof customer.metadata?.userId === "string" && customer.metadata.userId) {
    return customer.metadata.userId;
  }

  return null;
}

export async function getSubscriptionForUser(userId: string) {
  const supabase = getAdminSupabase();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select("user_id, stripe_customer_id, stripe_subscription_id, status, price_id, current_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as SubscriptionRecord | null) ?? null;
}

export async function upsertSubscriptionFromCheckout(session: Stripe.Checkout.Session) {
  const supabase = getAdminSupabase();
  const customerId = typeof session.customer === "string" ? session.customer : null;

  if (!supabase || !customerId) {
    return;
  }

  const userId = session.metadata?.userId || null;
  if (userId) {
    const stripe = getStripe();
    await stripe.customers.update(customerId, {
      metadata: {
        userId,
      },
    });
  }

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
      status: "active",
      price_id: session.metadata?.priceId || null
    },
    { onConflict: "stripe_customer_id" }
  );
}

export async function upsertSubscriptionFromStripe(subscription: Stripe.Subscription) {
  const supabase = getAdminSupabase();

  if (!supabase) {
    return;
  }

  const item = getSubscriptionItem(subscription);
  const sub = subscription as StripeSubscriptionWithPeriod;
  const customerId = String(subscription.customer);
  const userId = await findUserIdForCustomer(customerId);

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      price_id: item?.price?.id || null,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString()
    },
    { onConflict: "stripe_customer_id" }
  );
}

export async function cancelSubscriptionFromStripe(subscription: Stripe.Subscription) {
  const supabase = getAdminSupabase();

  if (!supabase) {
    return;
  }

  const sub = subscription as StripeSubscriptionWithPeriod;
  const customerId = String(subscription.customer);
  const userId = await findUserIdForCustomer(customerId);

  await supabase
    .from("subscriptions")
    .update({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString()
    })
    .eq("stripe_customer_id", customerId);
}

export async function handleInvoiceSubscriptionEvent(invoice: Stripe.Invoice) {
  const parentSubscription = invoice.parent?.subscription_details?.subscription;
  const subscriptionId =
    typeof parentSubscription === "string"
      ? parentSubscription
      : parentSubscription?.id ?? null;
  if (!subscriptionId) {
    return;
  }

  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await upsertSubscriptionFromStripe(subscription);
}

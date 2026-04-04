import type Stripe from "stripe";

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

  await supabase.from("subscriptions").upsert(
    {
      user_id: session.metadata?.userId || null,
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

  await supabase.from("subscriptions").upsert(
    {
      stripe_customer_id: String(subscription.customer),
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

  await supabase
    .from("subscriptions")
    .update({
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString()
    })
    .eq("stripe_customer_id", String(subscription.customer));
}

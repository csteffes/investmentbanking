import type Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { env, requireEnv } from "@/lib/env";
import { logBillingEvent, logServerError } from "@/lib/observability";
import { getStripe } from "@/lib/stripe";
import {
  cancelSubscriptionFromStripe,
  handleInvoiceSubscriptionEvent,
  upsertSubscriptionFromCheckout,
  upsertSubscriptionFromStripe
} from "@/lib/subscriptions";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
    }

    const body = await request.text();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      requireEnv("STRIPE_WEBHOOK_SECRET", env.stripeWebhookSecret)
    );

    switch (event.type) {
      case "checkout.session.completed":
        await upsertSubscriptionFromCheckout(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await upsertSubscriptionFromStripe(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await cancelSubscriptionFromStripe(event.data.object as Stripe.Subscription);
        break;
      case "invoice.paid":
      case "invoice.payment_failed":
        await handleInvoiceSubscriptionEvent(event.data.object as Stripe.Invoice);
        break;
      default:
        break;
    }

    logBillingEvent("Stripe webhook processed.", {
      eventType: event.type,
    });
    return NextResponse.json({ received: true });
  } catch (error) {
    logServerError("Stripe webhook handling failed.", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Webhook handling failed."
      },
      { status: 400 }
    );
  }
}

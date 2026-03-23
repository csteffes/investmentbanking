import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { env, requireEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import {
  cancelSubscriptionFromStripe,
  upsertSubscriptionFromCheckout,
  upsertSubscriptionFromStripe
} from "@/lib/subscriptions";

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
        await upsertSubscriptionFromCheckout(event.data.object);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await upsertSubscriptionFromStripe(event.data.object);
        break;
      case "customer.subscription.deleted":
        await cancelSubscriptionFromStripe(event.data.object);
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Webhook handling failed."
      },
      { status: 400 }
    );
  }
}

import { NextResponse } from "next/server";

import { requireBillingAccess } from "@/lib/access-control";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { getSubscriptionForUser } from "@/lib/subscriptions";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const access = await requireBillingAccess(request);
    if (!access.ok) {
      return NextResponse.json({ error: access.error }, { status: access.status });
    }

    const priceId = env.stripeProPriceId;

    if (!priceId) {
      return NextResponse.json({ error: "Missing Stripe price id." }, { status: 500 });
    }

    const stripe = getStripe();
    const existingSubscription = await getSubscriptionForUser(access.userId);

    if (existingSubscription?.stripe_customer_id && existingSubscription.status === "active") {
      const portal = await stripe.billingPortal.sessions.create({
        customer: existingSubscription.stripe_customer_id,
        return_url: `${env.siteUrl}/assessment`,
      });

      return NextResponse.json({ url: portal.url });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      allow_promotion_codes: true,
      customer: existingSubscription?.stripe_customer_id || undefined,
      customer_email: existingSubscription?.stripe_customer_id ? undefined : access.email ?? undefined,
      success_url: `${env.siteUrl}/assessment?checkout=success`,
      cancel_url: `${env.siteUrl}/#pricing`,
      metadata: {
        userId: access.userId,
        priceId
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to create checkout session."
      },
      { status: 500 }
    );
  }
}

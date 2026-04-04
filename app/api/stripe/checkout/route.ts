import { NextResponse } from "next/server";

import { requireBillingAccess } from "@/lib/access-control";
import { env } from "@/lib/env";
import { logBillingEvent, logServerError } from "@/lib/observability";
import { guardBrowserPostRequest } from "@/lib/request-security";
import { getStripe } from "@/lib/stripe";
import { getSubscriptionForUser } from "@/lib/subscriptions";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const guarded = guardBrowserPostRequest(request);
    if (guarded) {
      return guarded.response;
    }

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
    const customerId = existingSubscription?.stripe_customer_id
      ? existingSubscription.stripe_customer_id
      : (
          await stripe.customers.create({
            email: access.email ?? undefined,
            metadata: {
              userId: access.userId,
            },
          })
        ).id;

    await stripe.customers.update(customerId, {
      email: access.email ?? undefined,
      metadata: {
        userId: access.userId,
      },
    });

    if (existingSubscription?.stripe_customer_id && existingSubscription.status === "active") {
      const portal = await stripe.billingPortal.sessions.create({
        customer: existingSubscription.stripe_customer_id,
        return_url: `${env.siteUrl}/mock-interview`,
      });

      return NextResponse.json(
        { url: portal.url },
        { headers: { "Cache-Control": "no-store" } }
      );
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
      customer: customerId,
      success_url: `${env.siteUrl}/mock-interview?checkout=success`,
      cancel_url: `${env.siteUrl}/#pricing`,
      metadata: {
        userId: access.userId,
        priceId
      }
    });

    logBillingEvent("Checkout session created.", {
      userId: access.userId,
      customerId,
      priceId,
    });

    return NextResponse.json(
      { url: session.url },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    logServerError("Checkout session creation failed.", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to create checkout session."
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

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

    const subscription = await getSubscriptionForUser(access.userId);
    if (!subscription?.stripe_customer_id) {
      return NextResponse.json({ error: "No billing profile found for this user." }, { status: 404 });
    }

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${env.siteUrl}/mock-interview`
    });

    logBillingEvent("Billing portal opened.", {
      userId: access.userId,
      customerId: subscription.stripe_customer_id,
    });

    return NextResponse.json(
      { url: session.url },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    logServerError("Billing portal creation failed.", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to open billing portal."
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      priceId?: string;
      email?: string;
      userId?: string;
      successUrl?: string;
      cancelUrl?: string;
    };

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: body.priceId || env.stripeProPriceId,
          quantity: 1
        }
      ],
      allow_promotion_codes: true,
      customer_email: body.email,
      success_url: body.successUrl || `${env.siteUrl}/assessment?checkout=success`,
      cancel_url: body.cancelUrl || `${env.siteUrl}/#pricing`,
      metadata: {
        userId: body.userId || "",
        priceId: body.priceId || env.stripeProPriceId || ""
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

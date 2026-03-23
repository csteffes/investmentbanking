import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { customerId?: string; returnUrl?: string };

    if (!body.customerId) {
      return NextResponse.json({ error: "customerId is required." }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: body.customerId,
      return_url: body.returnUrl || `${env.siteUrl}/assessment`
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to open billing portal."
      },
      { status: 500 }
    );
  }
}

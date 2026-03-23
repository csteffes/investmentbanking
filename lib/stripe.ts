import Stripe from "stripe";

import { env, requireEnv } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (!stripeClient) {
    stripeClient = new Stripe(requireEnv("STRIPE_SECRET_KEY", env.stripeSecretKey));
  }

  return stripeClient;
}

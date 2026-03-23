export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.superdayready.com",
  openAiKey: process.env.OPENAI_API_KEY,
  openAiRealtimeModel: process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-mini",
  openAiRealtimeVoice: process.env.OPENAI_REALTIME_VOICE || "alloy",
  openAiReviewModel: process.env.OPENAI_REVIEW_MODEL || "gpt-4.1-mini",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  stripeProPriceId: process.env.STRIPE_PRO_PRICE_ID,
  supabaseUrl: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
};

export function requireEnv(name: string, value?: string | null) {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

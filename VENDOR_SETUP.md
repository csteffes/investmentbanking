# Superday AI Vendor Setup

## Required vendors

1. `GitHub`
   Source control for Codex, Claude Code, and Vercel deployments.

2. `Vercel`
   Production hosting for the Next.js app.

3. `OpenAI`
   Required for voice sessions and session debriefs.

4. `Supabase`
   Required for auth verification, Postgres, and storage.

5. `Stripe`
   Required for the `$50/month` plan, checkout, webhooks, and billing portal.

6. `Namecheap`
   DNS for `superdayready.com`.

## Recommended vendors

7. `PostHog`
   Product analytics.

8. `Sentry`
   Error monitoring.

9. `Resend`
   Transactional email.

## Environment variables

Add these in Vercel:

- `NEXT_PUBLIC_SITE_URL`
- `APP_SESSION_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_REALTIME_MODEL`
- `OPENAI_REALTIME_VOICE`
- `OPENAI_DEBRIEF_MODEL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRO_PRICE_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional:

- `TRIAL_SESSION_LIMIT`
- `TRIAL_DEBRIEF_LIMIT`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `SENTRY_DSN`
- `RESEND_API_KEY`

## Repo endpoints that depend on vendors

- `POST /api/realtime/session` -> `OpenAI`
- `POST /api/session/debrief` -> `OpenAI` + `Supabase`
- `POST /api/stripe/checkout` -> `Stripe` + `Supabase auth context`
- `POST /api/stripe/webhook` -> `Stripe` + `Supabase`
- `POST /api/portal` -> `Stripe` + `Supabase auth context`

## Launch order

1. Create accounts for `Vercel`, `OpenAI`, `Supabase`, and `Stripe`
2. Import the repo into `Vercel`
3. Add all env vars from [.env.example](./.env.example)
4. Apply [schema.sql](./supabase/schema.sql) in `Supabase`
5. Create the `$50/month` Stripe product and save the price ID in Vercel
6. Configure the Stripe webhook to hit `/api/stripe/webhook`
7. Test voice session access, debrief persistence, and billing flows
8. Point `superdayready.com` to `Vercel`

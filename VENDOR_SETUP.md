# Superday AI Vendor Setup

## Simple List

1. `GitHub`
   Use this repo as the source of truth for Codex and Vercel.

2. `Vercel`
   Host the real app here. This is the production platform for the Next.js app.

3. `OpenAI`
   Needed for voice sessions and transcript review.
   Add `OPENAI_API_KEY`, `OPENAI_REALTIME_MODEL`, `OPENAI_REALTIME_VOICE`, and `OPENAI_REVIEW_MODEL` in Vercel.

4. `Supabase`
   Needed for auth, Postgres, and storage.
   Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in Vercel.
   Run [schema.sql](/Users/cartersteffes/Documents/New%20project/supabase/schema.sql).

5. `Stripe`
   Needed for the `$50/month` plan, checkout, webhooks, and billing portal.
   Add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `STRIPE_PRO_PRICE_ID` in Vercel.
   Point the webhook to `/api/stripe/webhook`.

6. `Namecheap`
   Needed for `superdayready.com`.
   Point the domain to Vercel for production.

7. `PostHog`
   Recommended for analytics.
   Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` in Vercel.

8. `Sentry`
   Recommended for error monitoring.
   Add `SENTRY_DSN` in Vercel.

9. `Resend`
   Recommended for transactional email.
   Add `RESEND_API_KEY` in Vercel.

## What Codex Needs

- Access to this `GitHub` repo
- The environment variable names and values from the vendors above
- The Vercel project connected to the repo

Codex does not replace the vendor dashboards. You still create the accounts and keys in each service, then paste the keys into Vercel.

## Repo Endpoints That Depend On Vendors

- `POST /api/realtime/session` -> `OpenAI`
- `POST /api/session/review` -> `OpenAI`
- `POST /api/stripe/checkout` -> `Stripe`
- `POST /api/stripe/webhook` -> `Stripe` + `Supabase`
- `POST /api/portal` -> `Stripe`

## What You Can Skip For V1

- `GitHub Pages` as the real app host
- `LiveKit`
- `ElevenLabs`
- A headless CMS

## Launch Order

1. Create accounts for `Vercel`, `OpenAI`, `Supabase`, and `Stripe`.
2. Import the repo into `Vercel`.
3. Add all env vars from [.env.example](/Users/cartersteffes/Documents/New%20project/.env.example).
4. Run [schema.sql](/Users/cartersteffes/Documents/New%20project/supabase/schema.sql) in `Supabase`.
5. Create the `$50/month` product in `Stripe` and save the price ID in Vercel.
6. Configure the Stripe webhook to hit `/api/stripe/webhook`.
7. Test the voice session, checkout flow, and Supabase writes.
8. Point `superdayready.com` to `Vercel`.

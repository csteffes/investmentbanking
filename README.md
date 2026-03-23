# Superday AI

Superday AI is a Vercel-ready `Next.js` web app for investment banking interview prep. The app now includes:

- a concise marketing homepage
- an interactive assessment preview
- MDX-backed `/guides` and `/blog` routes for SEO
- API scaffolding for OpenAI Realtime, transcript review, Stripe billing, and Supabase persistence

## Stack

- `Next.js` App Router
- `OpenAI Realtime API` for browser voice sessions
- `Stripe` for subscriptions and billing portal
- `Supabase` for auth, Postgres, and resume storage
- `MDX` content stored in-repo under `content/`

## Local setup

1. Install dependencies:
   `npm install`
2. Copy env vars:
   `cp .env.example .env.local`
3. Fill in your OpenAI, Stripe, and Supabase keys.
4. Start the app:
   `npm run dev`

## Deployment

The app is designed for `Vercel`, not GitHub Pages, because server routes are required for:

- OpenAI Realtime session creation
- transcript review
- Stripe checkout and webhooks
- Supabase-backed product state

### Vercel checklist

1. Import this repo into Vercel.
2. Add all variables from `.env.example`.
3. Point `www.superdayready.com` to Vercel once preview and production builds are healthy.
4. Configure the Stripe webhook to hit `/api/stripe/webhook`.
5. Apply `supabase/schema.sql` in your Supabase project.

## Content

- Guides live in `content/guides`
- Blog posts live in `content/blog`
- Add new `.mdx` files with frontmatter for title, description, date, readingTime, and keywords

## Notes

- The legacy static prototype files are still in the repo as a fallback, but the active app source is now the `Next.js` code under `app/`, `components/`, and `lib/`.
- This environment did not have `node` or `npm` installed, so the new app could not be build-tested locally during implementation.

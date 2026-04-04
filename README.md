# Superday AI

Superday AI is a `Next.js` web app for investment banking interview prep, deployed on `Vercel`.

## What’s in the repo

- public marketing pages and a live mock interview surface
- MDX-backed `/guides` and `/blog` routes for SEO
- server routes for OpenAI Realtime, session debriefs, Stripe billing, and Supabase persistence
- a single active app path under `app/`, `components/`, `hooks/`, and `lib/`

## Core architecture

- `Next.js` App Router
- `OpenAI Realtime API` for voice sessions
- `Stripe` for subscriptions and billing portal
- `Supabase` for auth verification, Postgres, and storage
- `MDX` content stored in-repo under `content/`

## Local setup

1. `npm install`
2. `cp .env.example .env.local`
3. Add your OpenAI, Stripe, Supabase, and session secret values
4. `npm run dev`

## Scripts

- `npm run dev` starts local development
- `npm run lint` runs ESLint directly
- `npm run check` runs lint + TypeScript checks
- `npm run build` runs the production webpack build used for verification
- `npm run checkpoint` shows git status and the latest commit

## Deployment

This repo is designed for `Vercel`, not GitHub Pages. The app depends on server routes for:

- OpenAI Realtime session creation
- transcript debriefs and session persistence
- Stripe checkout and webhooks
- Supabase-backed gated product actions

### Vercel checklist

1. Import the repo into `Vercel`
2. Add all variables from `.env.example`
3. Apply [schema.sql](./supabase/schema.sql) in Supabase
4. Configure the Stripe webhook at `/api/stripe/webhook`
5. Point `www.superdayready.com` to Vercel

## Product access model

- marketing pages stay public
- voice sessions and session debriefs are trial-scoped and rate-limited unless a user is authenticated
- billing actions require authenticated user context

## Working between apps

Use [MULTI_APP_WORKFLOW.md](./MULTI_APP_WORKFLOW.md) when switching between Codex and Claude Code.

## Supporting docs

- [VENDOR_SETUP.md](./VENDOR_SETUP.md)
- [MULTI_APP_WORKFLOW.md](./MULTI_APP_WORKFLOW.md)
- [supabase/schema.sql](./supabase/schema.sql)

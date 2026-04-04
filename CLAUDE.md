# CLAUDE.md — Superday AI

Read this before making changes in Claude Code.

## Current architecture

- Active product: `Next.js` App Router app deployed to `Vercel`
- Source of truth: `app/`, `components/`, `hooks/`, `lib/`, `content/`, `supabase/`
- Legacy static/GitHub Pages path has been removed. Do not recreate it.
- Public assets live under `public/` only.

## Product rules

- Marketing pages are public.
- Voice sessions and session debriefs are trial-scoped and rate-limited unless the caller is authenticated.
- Billing actions are authenticated-only.
- Keep one trust-logo system: `components/logo-grid.tsx`.

## Important backend files

- `app/api/realtime/session/route.ts`
- `app/api/session/debrief/route.ts`
- `app/api/stripe/checkout/route.ts`
- `app/api/stripe/webhook/route.ts`
- `app/api/portal/route.ts`
- `lib/access-control.ts`
- `lib/openai.ts`
- `lib/mock-sessions.ts`
- `lib/subscriptions.ts`
- `lib/supabase.ts`
- `supabase/schema.sql`

## Development rules

- Use `npm run check` before shipping changes.
- Use `npm run build` for production verification.
- Keep `next-env.d.ts` in its stable generated form.
- Do not add duplicate assets, duplicate deploy paths, or alternate logo systems.
- Prefer shared types from `lib/api-types.ts` when touching API routes or the mock interview flow.

## Current priorities

- keep the billing and AI-cost routes locked down
- keep the repo Vercel-only
- keep docs and repo guidance aligned with the actual codebase

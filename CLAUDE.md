# CLAUDE.md — Superday AI

This file governs all AI-assisted development on this project. Read it fully before touching any code.

---

## Audit Summary (March 2026)

### What was reviewed
Every file in the repository: all components, API routes, lib utilities, CSS, content, schema, config.

### Verdict: REFACTOR (not rewrite)

The backend is genuinely solid. The API route design, OpenAI Realtime integration, Stripe webhook handling, Supabase schema, content/MDX pipeline, and TypeScript strictness are all production-quality. A rewrite would discard months of correct work to arrive at the same architecture. The problems are confined to: (1) the CSS layer (1,400-line monolith, wrong color system, no design tokens enforced), (2) the frontend product shell (AssessmentStudio is a static demo — never wired to real APIs), and (3) missing auth/session layer that the DB already models.

### Specific issues to fix during refactor
- `output: "export"` in `next.config.mjs` must be removed — static export blocks SSR, ISR, and proper middleware needed for auth-gated routes
- `styles.css` at project root is a duplicate of `app/globals.css` — delete it
- `getAdminSupabase()` creates a new Supabase client on every call — needs module-level singleton
- `slugifyHeading` is duplicated in `lib/content.ts` and `components/mdx-components.tsx` — extract to `lib/utils.ts`
- `AppSidebar` component is dead code — never imported, never rendered
- `any` types in `lib/openai.ts` (`extractOutputText`) — replace with proper types
- `AssessmentStudio` is entirely hardcoded demo data — needs real API wiring
- No auth flow exists despite the DB having `auth.users` FK on every table
- Stripe checkout is configured but no UI calls it
- No error boundaries, no loading states, no skeleton screens
- `blog/[slug]/page.tsx` and `guides/[slug]/page.tsx` are ~95% duplicate — extract shared layout

### What to preserve
- All API routes (`/api/realtime/session`, `/api/session/review`, `/api/stripe/*`, `/api/portal`)
- `lib/openai.ts` logic (buildRealtimeInstructions, reviewTranscript)
- `lib/content.ts` (the MDX content pipeline is clean)
- `lib/env.ts` pattern (all env vars through one typed module)
- `lib/stripe.ts`, `lib/subscriptions.ts` (Stripe integration is correct)
- `supabase/schema.sql` (schema is well-designed)
- All MDX content in `content/blog/` and `content/guides/`
- `components/mdx-components.tsx` structure (just restyle)
- `components/logo-marquee.tsx` logic (just restyle)

---

## Recommended Tech Stack

### Framework
**Next.js 15 (App Router)** — keep as-is. Do NOT switch to Vite. Next.js is the right choice for this product: SSR for auth-gated routes, API routes as serverless functions, MDX static generation, and Vercel deployment.

Remove `output: "export"` from `next.config.mjs`. Switch to standard server/hybrid rendering.

### Styling
**Tailwind CSS v4 + shadcn/ui**

- Use Tailwind for all layout, spacing, and typography
- Use shadcn/ui for interactive primitives (Dialog, Select, Slider, Tabs, Tooltip) only
- shadcn components MUST be restyled to match the design system below — never use default shadcn appearance
- No CSS modules, no styled-components, no emotion
- Delete `app/globals.css` and `styles.css` after migrating — replace with a single `app/globals.css` for Tailwind directives + CSS variable definitions only

### Voice / AI Layer
**OpenAI Realtime API (keep existing)** — `lib/openai.ts` already implements the session creation and review pipeline correctly. Do NOT switch to Vapi or ElevenLabs unless the user explicitly requests it. The backend is done; the gap is the frontend WebRTC client connection that needs to be built in `AssessmentStudio`.

When building the voice client in the browser:
- Use the OpenAI Realtime client secret returned by `/api/realtime/session`
- Connect via WebRTC using `RTCPeerConnection` directly or the `openai/realtime` JS package
- Stream transcript segments to state as they arrive
- On session end, POST full transcript to `/api/session/review` for scoring

### Auth
**Supabase Auth** — the DB schema already FKs everything to `auth.users`. Implement magic link or OAuth (Google). Use `@supabase/ssr` (not `@supabase/auth-helpers-nextjs`) for server-side session management. Create middleware at `middleware.ts` to protect `/assessment` and any future app routes.

### Database
**Supabase** — keep as-is. No schema changes needed. Fix `getAdminSupabase()` to be a true module-level singleton.

### Payments
**Stripe** — keep all existing code. The only missing piece is the UI that calls `/api/stripe/checkout`. Add a checkout button on the pricing section that POSTs to that route with the user's email and Stripe price ID.

---

## Design System

### Color palette

```css
/* Dark background — mandatory, no exceptions */
--background:       #0A0A0A;
--surface:          #111111;
--surface-raised:   #1A1A1A;
--border:           rgba(255, 255, 255, 0.08);
--border-strong:    rgba(255, 255, 255, 0.15);

/* Single accent — gold, not blue */
--accent:           #C9A227;
--accent-soft:      rgba(201, 162, 39, 0.12);
--accent-strong:    #E8BC30;

/* Text */
--text-primary:     #F8F8F8;
--text-secondary:   #A0A0A0;
--text-muted:       #606060;

/* Semantic */
--success:          #22C55E;
--danger:           #EF4444;
```

**Rules:**
- Background is always `#0A0A0A` or darker. Never white, never light gray.
- Accent is gold (`#C9A227`). No blue Tailwind defaults. No purple. No teal.
- Cards are `#111111` or `#1A1A1A` with `1px solid var(--border)`. Never shadcn default white cards.
- On white-background marketing sections (trust bands), use `#F8F8F8` max — never `#FFFFFF` for card fills.

### Typography
**Font: Geist** (replace current Google Fonts setup)
- Import via `next/font/google` with `Geist` and `Geist_Mono`
- Apply via CSS variables: `--font-sans` and `--font-mono`

```
Headings:     font-weight 700, letter-spacing -0.02em, line-height 1.1
Subheadings:  font-weight 600, letter-spacing -0.01em, line-height 1.25
Body:         font-weight 400, letter-spacing 0, line-height 1.7
Captions/UI:  font-weight 500, font-size 0.75rem, letter-spacing 0.04em uppercase
```

### Micro-animations
Every interactive state change uses `transition: all 150ms ease-out` or `transition: all 200ms ease-out`. No longer durations except for page-level reveals (300ms max).

Specific rules:
- Button hover: scale(1.02) + brightness(1.08), 150ms ease-out
- Card hover: translateY(-2px) + border brightens, 150ms ease-out
- Tab switches: opacity + translateX, 150ms ease-out
- Score bars: width transition on mount, 400ms ease-out with staggered delay
- Voice waveform bars: animate only when session is live (pause animation when idle)

### Component style rules
- Buttons: rounded-lg (8px), no sharp corners, no fully rounded pill unless it's a status badge
- Cards: `bg-[#111111] border border-[--border] rounded-xl` — never box-shadow as the only depth signal
- Status chips/badges: `text-xs font-medium uppercase tracking-widest` + accent-soft background
- Score bars: thin (4px height), accent color fill, muted track
- Inputs/selects: dark background, border on focus accent-colored, no white fills
- Modals: `bg-[#111111]` backdrop-blur, never white

---

## Forbidden Defaults

| Forbidden | Use instead |
|---|---|
| White or `#F9FAFB` backgrounds | `#0A0A0A` or `#111111` |
| Unstyled shadcn components | Always override with design tokens |
| Tailwind blue palette (blue-500 etc.) | `var(--accent)` gold only |
| Purple defaults | Forbidden entirely |
| Generic `rounded-full` pill cards | `rounded-xl` (12px) for cards |
| `shadow-md` as the only depth signal | Border + background contrast |
| Multiple accent colors | One accent: gold `#C9A227` |
| Class components | Functional components only |
| `console.log` left in production code | Remove before commit |
| Hardcoded pixel values in Tailwind | Use spacing scale (4, 6, 8, 12, 16, 24...) |

---

## Code Conventions

### Components
- **Functional components only** — zero class components
- Every component file exports one named export (not default export for components)
- Client components: add `"use client"` only when the component uses hooks or browser APIs
- Keep components small: if a component exceeds ~150 lines, extract sub-components
- Props interfaces above the component, named `[ComponentName]Props`

### TypeScript
- **Strict TypeScript always** — `strict: true` is already set, never disable it
- No `any` types — use `unknown` + type narrowing, or proper interfaces
- All API response shapes must be typed (define in `lib/types.ts` or colocated)
- Prefer `type` over `interface` for data shapes; `interface` for extensible contracts

### File naming
- Components: `kebab-case.tsx` (e.g., `assessment-studio.tsx`)
- Pages: `page.tsx` (Next.js convention)
- Utilities/libs: `kebab-case.ts`
- Types: colocated or in `lib/types.ts`

### Environment variables
- All env vars documented in `.env.example` — never leave a variable undocumented
- Server-only vars: no `NEXT_PUBLIC_` prefix
- Client-safe vars: `NEXT_PUBLIC_` prefix only
- Access all env vars through `lib/env.ts` — never `process.env.X` directly in components

### Error handling
- Every API route has a try/catch that returns a typed error JSON
- Every client-side API call handles error state in UI (not just console)
- Use React error boundaries for the voice session component

### Project structure (target state)

```
app/
  (marketing)/          # Route group: unauthenticated public pages
    page.tsx            # Homepage
    blog/
    guides/
    layout.tsx          # Marketing layout (header + footer)
  (app)/                # Route group: auth-gated product pages
    assessment/
      page.tsx
    layout.tsx          # App layout (may differ from marketing)
  api/                  # API routes (keep existing structure)
  globals.css           # Tailwind directives + CSS variables only
  layout.tsx            # Root layout

components/
  ui/                   # shadcn primitives (auto-generated, do not hand-edit)
  [feature]/            # Feature-scoped components
    assessment-studio.tsx
    voice-session.tsx
    score-card.tsx
  layout/               # Shared layout components
    site-header.tsx
    site-footer.tsx
    logo-marquee.tsx

lib/
  content.ts            # MDX content pipeline
  env.ts                # Typed env vars
  openai.ts             # OpenAI Realtime + review
  stripe.ts             # Stripe singleton
  subscriptions.ts      # Supabase subscription helpers
  supabase.ts           # Supabase admin singleton
  types.ts              # Shared TypeScript types
  utils.ts              # Shared utilities (slugifyHeading etc.)

hooks/                  # Custom React hooks
  use-voice-session.ts  # WebRTC + OpenAI Realtime connection
  use-subscription.ts   # Subscription status

content/
  blog/
  guides/

supabase/
  schema.sql
```

---

## Current Refactor Priority Order

When the user says "go", execute in this order:

1. **Remove `output: "export"`** from `next.config.mjs`, add Tailwind, configure Geist font, set up CSS variables
2. **Delete duplicate CSS** — remove `styles.css`, strip `globals.css` down to Tailwind directives + variables
3. **Fix Supabase singleton** in `lib/supabase.ts`
4. **Extract `slugifyHeading`** to `lib/utils.ts`, remove duplicates
5. **Restyle layout shell** — `SiteHeader`, `SiteFooter`, `RootLayout` with dark design system
6. **Restyle homepage** (`app/page.tsx`) with new design system
7. **Restyle content pages** — blog index, blog post, guides (extract shared article layout)
8. **Restyle `AssessmentStudio`** with dark system + real Tailwind/shadcn components
9. **Wire voice session** — build `useVoiceSession` hook, connect to `/api/realtime/session`, stream transcript
10. **Wire scorecard** — connect session end to `/api/session/review`, render real scorecard
11. **Add Supabase Auth** — magic link or Google OAuth, middleware for protected routes
12. **Add checkout flow** — connect "Try for Free" button to `/api/stripe/checkout`
13. **Remove dead code** — `AppSidebar`, duplicate CSS
14. **Add error boundaries + loading states**
15. **Audit and fix all `any` types**

Do not proceed past step 1 until the user approves this CLAUDE.md.

# Superday AI PRD For Claude Code

## Summary
Build `Superday AI`, a premium web app for investment banking interview preparation. The product helps candidates practice live voice interviews with an AI interviewer, receive concise transcript-backed coach notes, and improve through repeated reps. The app should feel like a serious recruiting tool, not generic edtech.

This PRD is for a **strong blank-slate v1**, informed by the current Superday AI product but written as the cleaner, more complete version Claude should build from scratch. The implementation target is a production-ready `Next.js + TypeScript + Vercel + Supabase + Stripe + OpenAI Realtime` app.

The product has three pillars:
1. `Live interview practice`
2. `Concise debriefs and saved history`
3. `SEO-driven content library`

The business model is one simple plan:
- `3-day free trial`
- `$50/month` after trial
- one plan only

The product should serve **investment banking candidates broadly**, not just undergrads or MBAs. Avoid niche audience copy. Use terms like `investment banking candidates`, `users`, or `students` only when needed.

## Product Definition

### Product name
- `Superday AI`

### Core promise
- Practice investment banking interviews with an AI interviewer.
- Run live mocks anytime.
- Get concise coach notes, not bloated reports.
- Build confidence through repetition before real interviews and superdays.

### Primary users
- Students and early-career candidates preparing for:
  - networking interviews
  - first rounds
  - superdays
- Users targeting:
  - elite boutiques
  - bulge brackets
  - middle-market firms
- Typical banks/groups:
  - Evercore
  - Goldman Sachs
  - J.P. Morgan
  - Morgan Stanley
  - Lazard
  - Centerview
  - M&A
  - Healthcare
  - TMT
  - Industrials
  - FIG
  - LevFin

### Core product principles
- Voice-first, not text-first
- Short and sharp feedback, not heavy scoring
- Premium and serious visual design
- Mobile-friendly, but desktop-first for practice depth
- Strong trust and credibility in the UI
- Simple conversion funnel
- Minimal friction from homepage to first rep

### Non-goals for v1
- No spreadsheet/modeling simulator
- No recruiter CRM
- No social/community layer
- No multi-plan pricing complexity
- No LiveKit or ElevenLabs dependency
- No phone or SIP experience
- No native app

## Brand And Design Requirements

### Visual direction
- Premium, sharp, modern Wall Street aesthetic
- Serious, polished, high-performance, AI-native
- Think: institutional credibility + modern product polish
- Avoid playful, cartoonish, crypto, neon, or generic AI-chatbot aesthetics

### Brand palette
- `Deep Navy`: `#0B1F3A`
- `Electric Blue`: `#2F6BFF`
- `Off-White`: `#F8FAFC`
- `Muted Gold`: `#C9A227`

### Color usage
- Deep Navy for header, key panels, high-trust sections
- Electric Blue for interactive elements and key CTAs
- Off-White for page background and content surfaces
- Muted Gold only as a restrained accent

### UI tone
- Clean, premium B2C SaaS
- Strong typography
- Generous but controlled spacing
- No noisy outlines or decorative clutter
- No “box inside box inside box” layouts
- Use whitespace, contrast, and hierarchy instead of excessive borders

## Information Architecture

### Public routes
- `/`
- `/mock-interview`
- `/guides`
- `/guides/[slug]`
- `/blog`
- `/blog/[slug]`
- `/privacy`
- `/terms`
- `/refund-policy`

### Homepage sections
The homepage should be concise and premium. It should include:
1. `Hero`
   - trust pill: `Trusted by investment banking candidates nationwide`
   - hero headline
   - short supporting paragraph
   - primary CTA: `Start mock interview`
   - proof row below CTA
   - employer logo marquee
2. `How it works`
   - three steps:
     - Set Your Target
     - Practice Out Loud
     - Read Coach Notes
3. `Live preview`
   - interviewer panel
   - transcript snippet
   - session debrief preview
4. `Resources`
   - latest 3 guides
   - latest 3 blog posts
5. `Pricing`
   - one premium pricing panel
   - 3-day free trial
   - $50/month
   - CTA: `Start 3-day free trial`
6. `FAQ`
7. `Footer`

### Homepage trust elements
- school logos
- employer logos
- concise proof row
- no noisy badges or cluttered metadata strips

## Core User Experience

### 1. Landing page flow
Goal: move a user from awareness to trial quickly.

Requirements:
- Primary CTA from hero should go to `/mock-interview`
- Pricing CTA should go to `/mock-interview#account`
- Copy should be short, crisp, and non-academic in tone
- Avoid over-explaining the product

### 2. Mock interview flow
The `/mock-interview` page is the core product surface.

Layout:
- Left panel:
  - candidate setup
  - school/program
  - background
  - target bank
  - target group
  - recruiting stage
  - interview date
  - account / billing module
  - saved history module
- Right panel:
  - mode selector
  - active interviewer state
  - transcript area
  - debrief area

Supported practice modes:
- `Story / Resume`
- `Technical Core`
- `Deals & Markets`

Candidate profile fields:
- `school`
- `background`
- `bank`
- `group`
- `stage`
- `prompt`
- `mode`

Interview stages:
- `Networking`
- `First round`
- `Superday`

Behavior:
- User chooses a mode and fills the profile
- User clicks `Start Mock Interview`
- Browser requests microphone access
- Browser establishes OpenAI Realtime session via server-issued ephemeral token
- User speaks with AI interviewer
- Transcript accumulates
- User clicks `End Mock Interview`
- App sends transcript plus profile to debrief endpoint
- User receives:
  - `summary`
  - `coachNotes[]`
  - `nextRep`
- Session is saved for signed-in users and trial users

### 3. Feedback philosophy
Do not present the product as a grading engine.

Feedback output should be:
- concise
- transcript-backed
- actionable
- non-robotic

Every session debrief must include:
- `summary`
- `coachNotes` array
- `nextRep`

Avoid exposing numeric scores in the main UX, even if internal fields exist.

### 4. Account and billing flow
Authentication should be required for:
- checkout
- billing portal
- saved session history
- unlimited usage after trial

Auth flow:
- use Supabase Auth magic link email sign-in
- sync Supabase browser session into first-party cookies through `/api/auth/session`
- allow anonymous users to begin trial usage
- if a user signs in after anonymous trial usage, claim their trial sessions into their account

### 5. Trial and subscription logic
Anonymous trial:
- limited, not unlimited
- enforced server-side
- default quotas:
  - `TRIAL_SESSION_LIMIT = 5`
  - `TRIAL_DEBRIEF_LIMIT = 8`
  - `TRIAL_SOURCE_DAILY_LIMIT = 20`

Paid plan:
- one plan only
- `$50/month`
- `3-day free trial`
- active subscribers get unlimited live mocks and saved history

### 6. Saved history
Signed-in users should see recent saved sessions.

Each saved history item should show:
- bank
- group
- stage
- mode
- created date
- debrief summary

## Content And SEO

### Content system
Use in-repo MDX for both `guides` and `blog`.

Content folders:
- `content/guides/*.mdx`
- `content/blog/*.mdx`

Frontmatter fields:
- `title`
- `description`
- `date`
- `readingTime`
- `keywords`
- `featured`

### Content behavior
- featured content should sort first
- then sort by most recent date
- homepage shows latest 3 entries for each collection
- collection pages show:
  - hero
  - featured entry
  - selected reads
  - archive grid

### SEO pillars
Initial guide set should include:
- `Investment Banking Interview Questions`
- `Investment Banking Superday Prep`
- `Investment Banking Technical Questions`
- `Why Investment Banking`
- `Walk Me Through Your Resume`

Initial blog cluster should target:
- investment banking behavioral questions
- investment banking technical interview questions
- DCF interview questions
- superday prep
- questions to ask in an investment banking interview

Primary keyword cluster:
- `investment banking interview prep`
- `investment banking interview questions`
- `investment banking technical questions`
- `investment banking behavioral questions`
- `investment banking superday`
- `superday interview questions`
- `why investment banking`
- `walk me through your resume investment banking`
- `investment banking valuation questions`
- `DCF interview questions investment banking`
- `merger math interview questions`
- `questions to ask in an investment banking interview`

## Technical Architecture

### Stack
- `Next.js App Router`
- `TypeScript`
- `Tailwind CSS` or utility-first styling with custom CSS where needed
- `Vercel` for hosting
- `Supabase` for auth, Postgres, and Storage
- `Stripe` for billing
- `OpenAI Realtime API` for live interview sessions
- `OpenAI text model` for debrief generation
- `MDX` for guides and blog

### Environment variables
Required:
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
- `TRIAL_SOURCE_DAILY_LIMIT`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `SENTRY_DSN`
- `RESEND_API_KEY`

### Core API routes
Implement these routes:

#### `POST /api/realtime/session`
Purpose:
- validate same-origin browser request
- validate trial or authenticated access
- create OpenAI Realtime session
- return ephemeral client secret

Input:
- `InterviewProfile`

Output:
- OpenAI Realtime session payload containing `client_secret.value`

#### `POST /api/session/debrief`
Purpose:
- validate same-origin browser request
- validate trial or authenticated access
- accept transcript plus interview profile
- generate concise debrief
- persist session and scorecard

Input:
- `InterviewProfile & { transcript: string }`

Output:
- `summary`
- `coachNotes: string[]`
- `nextRep: string | null`
- `sessionId: string | null`

#### `POST /api/stripe/checkout`
Purpose:
- authenticated-only
- create or reuse Stripe customer
- start subscription checkout
- if already active, redirect to billing portal instead

Output:
- `{ url: string }`

#### `POST /api/portal`
Purpose:
- authenticated-only
- create Stripe billing portal session

Output:
- `{ url: string }`

#### `POST /api/stripe/webhook`
Purpose:
- handle Stripe lifecycle events
- keep subscription table in sync

Handle at minimum:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

#### `GET /api/auth/session`
Returns current authenticated state from first-party cookies.

#### `POST /api/auth/session`
Accepts Supabase access token + refresh token from browser session and sets first-party cookies.

#### `DELETE /api/auth/session`
Clears first-party auth cookies.

## Data Model

### Tables

#### `candidate_profiles`
Fields:
- `user_id`
- `full_name`
- `school_program`
- `background`
- `target_banks[]`
- `target_groups[]`
- `recruiting_stage`
- `interview_date`
- `technical_confidence`
- `resume_path`
- timestamps

#### `subscriptions`
Fields:
- `id`
- `user_id`
- `stripe_customer_id`
- `stripe_subscription_id`
- `status`
- `price_id`
- `current_period_end`
- timestamps

#### `mock_sessions`
Fields:
- `id`
- `user_id`
- `trial_id`
- `bank`
- `group_name`
- `interview_stage`
- `mode`
- `prompt`
- `transcript_text`
- `readiness_score`
- `created_at`

#### `transcript_segments`
Fields:
- `id`
- `session_id`
- `speaker`
- `segment_order`
- `content`
- `created_at`

#### `scorecards`
Fields:
- `id`
- `session_id`
- `technical_accuracy`
- `structure`
- `communication`
- `poise`
- `commercial_judgment`
- `summary`
- `evidence`
- `next_steps`
- `created_at`

#### `trial_usage_counters`
Fields:
- `trial_id`
- `realtime_count`
- `debrief_count`
- `first_seen_at`
- `last_seen_at`
- `last_ip`

#### `anonymous_source_limits`
Fields:
- `source_key`
- `bucket_date`
- `realtime_count`
- `debrief_count`
- timestamps

### Storage
- private `resumes` bucket in Supabase Storage

### Access control
- enable RLS on all user tables
- users can only read/write their own rows
- transcript segments and scorecards must be accessible only through owned sessions

## Security And Abuse Prevention

### Required protections
- same-origin request validation on all costly `POST` routes
- require `Content-Type: application/json`
- validate `Origin` and `Host`
- use `APP_SESSION_SECRET`
- do not fall back to Stripe or OpenAI keys as auth secrets
- durable trial quota enforcement, not just in-memory rate limiting
- first-party auth cookies for billing and saved history
- Stripe metadata must always include `userId`
- trial sessions must be claimable after sign-in

### Response behavior
Use clear status handling:
- `400` for malformed request
- `401` for unauthenticated
- `403` for blocked access
- `429` for quota/rate limit
- `500` for server failure

### Headers
Ship with:
- CSP
- HSTS in production
- `X-Content-Type-Options`
- `Referrer-Policy`
- frame protection
- microphone permissions locked to self

### Cleanup
Schedule:
- `select public.cleanup_anonymous_trial_data();`

This should purge stale anonymous trial data regularly.

## Authentication Details

### Auth UX
- anonymous user can browse homepage, blog, guides
- anonymous user can access limited trial practice
- user signs in with magic link
- browser syncs Supabase session to first-party cookies
- after sign-in:
  - checkout becomes available
  - billing portal becomes available
  - saved history loads
  - anonymous trial sessions are claimed

### Practice account panel requirements
On `/mock-interview`, include:
- sign-in state
- email / account identity
- subscription status badge
- `Start 3-day free trial` CTA if not active
- `Manage billing` if signed in
- `Sign out`
- saved history list for recent sessions

## UX Copy Requirements

### Tone
- concise
- confident
- premium
- non-generic
- not playful
- not academic
- not overly verbose

### Hero copy direction
Homepage hero should communicate:
- AI interviewer
- investment banking specificity
- repeated reps
- calm under pressure
- realistic follow-ups

### Messaging constraints
- Do not position as “for MBAs only”
- Do not position as “for undergrads only”
- Do not use gimmicky AI language
- Avoid “chatbot” framing
- Emphasize:
  - realistic reps
  - live voice practice
  - coach notes
  - superday readiness

## Design Requirements

### Header
- sticky
- translucent white background with blur
- premium, minimal nav
- nav items:
  - About
  - Practice
  - Pricing
  - Blog
  - Sign in

### Hero
- trust pill
- large editorial headline
- premium CTA
- proof row beneath CTA
- employer marquee below hero content

### Pricing
- single premium pricing panel
- dark navy panel on light background
- one plan only
- CTA: `Start 3-day free trial`
- no nested slabs
- no cluttered borders

### Mock interview page
- premium dashboard feel
- left setup card, right interaction area
- calm, readable transcript and debrief layout
- no game-like scoring UI

### Library pages
- editorial, not blog-template generic
- large title
- strong lead article
- selected reads side panel
- clean archive grid

## Analytics And Monitoring

### Product analytics
Track:
- hero CTA clicks
- pricing CTA clicks
- sign-in success
- checkout start
- checkout success
- billing portal opens
- live session start
- live session end
- debrief completion
- saved history views
- blog/guides CTA conversions

### Error monitoring
Capture:
- Realtime session creation failures
- debrief generation failures
- webhook failures
- auth sync failures
- billing failures

Recommended tools:
- `PostHog`
- `Sentry`

## Acceptance Criteria

### Marketing
- homepage is public
- premium investment-banking design language is visible across hero, pricing, resources, and footer
- one simple pricing plan is shown
- CTA paths are clear and consistent

### Practice product
- user can start a voice session from `/mock-interview`
- browser microphone permission is requested properly
- live transcript populates during the session
- ending a session produces concise coach notes
- debrief persists as saved history
- signed-in users can view recent sessions

### Billing
- unauthenticated users cannot open checkout or billing portal
- signed-in users can start checkout
- active subscribers can access billing portal
- subscription state stays synced from Stripe webhooks

### Content
- `/guides` and `/blog` are indexable and use MDX-backed content
- individual article pages render with title, description, date, reading time, and body
- homepage resources section shows latest entries

### Security
- protected `POST` routes reject malformed or cross-site requests
- trial usage is limited server-side
- anonymous usage is durable across serverless invocations
- auth cookies gate billing and history access

### Operational
- app deploys on Vercel
- environment variables are documented
- Supabase schema is applied
- Stripe webhook is configured
- production build passes

## Defaults And Assumptions
- Build on `Next.js App Router`
- Use `OpenAI Realtime` directly, not LiveKit
- Use `OpenAI` for debrief generation
- Use `Supabase Auth` magic links
- Use `Stripe Checkout` and `Stripe Billing Portal`
- Use `MDX` stored in-repo, not a CMS
- Use one subscription plan only
- Keep anonymous trial access, but limited
- Do not expose heavy grading or gamified scoring
- Optimize for a polished, shippable v1, not a giant platform

## Build Instruction For Claude
Use this PRD as the source of truth and implement the app from scratch as a production-ready v1 of Superday AI. Favor clean architecture, strong UX polish, and decision-complete implementation over placeholder scaffolding. Recreate the full stack described here: marketing site, mock interview flow, auth, trial gating, billing, saved history, blog/guides, and deployment-ready APIs.

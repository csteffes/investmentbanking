import Link from "next/link";

import { formatDate, getLatestEntries } from "@/lib/content";
import { homepageFaqs, site } from "@/lib/site";

const heroHighlights = [
  "Coach notes after every session",
  "No scoring or grading",
] as const;

const howItWorksSteps = [
  {
    title: "Set Your Target",
    description:
      "Choose your bank, group, and interview stage so the interviewer meets you in the exact room you are preparing for.",
  },
  {
    title: "Practice Out Loud",
    description:
      "Run a live mock interview and handle realistic follow-ups across story, technicals, and deals without hiding behind notes.",
  },
  {
    title: "Read Coach Notes",
    description:
      "End with a concise debrief, transcript-backed coach notes, and one clear next rep to run right away.",
  },
] as const;

const previewTranscript = [
  {
    speaker: "Interviewer",
    tag: "opening",
    text: "Start with the pivot. Do not make me wait for why now.",
  },
  {
    speaker: "You",
    tag: "candidate",
    text: "I want the pace, client exposure, and execution intensity that banking offers.",
  },
] as const;

const previewCoachNotes = [
  "Lead with the banking pivot earlier.",
  "Cut the long setup before why banking.",
  "Close with one bank-specific line.",
] as const;

const pricingFeatures = [
  "Unlimited live mock interviews",
  "Transcript-backed coach notes",
  "Behavioral, technical, and superday reps",
  "Full guide access",
] as const;

export default async function HomePage() {
  const [latestGuides, latestPosts] = await Promise.all([
    getLatestEntries("guides", 3),
    getLatestEntries("blog", 3),
  ]);

  return (
    <main className="marketing-page">
      <section className="marketing-section marketing-section--hero marketing-section--trim-bottom">
        <div className="marketing-shell">
          <div className="marketing-intro">
            <div className="marketing-pill">
              <span aria-hidden="true" className="marketing-pill__dot" />
              <span>Trusted by investment banking candidates nationwide</span>
            </div>

            <h1 className="max-w-[13ch] text-[clamp(3.1rem,8vw,5.35rem)] font-semibold tracking-[-0.07em] leading-[0.95] text-[#111827]">
              Get the interview reps that make
              <span className="block text-[#9A7620]">
                the real thing feel familiar
              </span>
            </h1>

            <p className="marketing-muted max-w-[36rem] text-base sm:text-lg">
              Practice with a banker-style AI interviewer so your answers sound
              sharp, specific, and calm when the real follow-ups start coming.
            </p>

            <div className="flex flex-col items-center gap-5 pt-4">
              <Link
                href="/mock-interview"
                className="marketing-primary-cta px-7 text-base sm:px-8"
              >
                Start mock interview
                <span aria-hidden="true" className="text-lg">
                  →
                </span>
              </Link>

              <div className="hero-trust-row" aria-label="Early user proof points">
                <div className="hero-trust-row__rating">
                  <div
                    className="hero-trust-row__stars"
                    aria-label="4.8 out of 5 stars"
                  >
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                  <span className="hero-trust-row__score">4.8/5</span>
                  <span className="hero-trust-row__caption">from early users</span>
                </div>

                {heroHighlights.map((item) => (
                  <div key={item} className="hero-trust-row__group">
                    <span aria-hidden="true" className="hero-trust-row__separator" />
                    <span className="hero-trust-row__item">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="marketing-section marketing-section--trim-top"
      >
        <div className="marketing-shell">
          <div className="marketing-intro mb-10 sm:mb-12">
            <p className="marketing-eyebrow">How it works</p>
            <h2 className="max-w-[14ch] text-3xl font-semibold tracking-[-0.05em] leading-[1.02] text-[#111827] sm:text-4xl lg:text-[2.8rem]">
              Three steps to better interview reps.
            </h2>
          </div>

          <div className="marketing-split marketing-split--three">
            {howItWorksSteps.map((item) => (
              <article
                key={item.title}
                className="marketing-card marketing-card--soft marketing-card--centered flex h-full flex-col gap-6"
              >
                <div className="flex justify-center">
                  <span className="marketing-step-pill">{item.title}</span>
                </div>
                <p className="mx-auto max-w-[18rem] marketing-muted text-sm sm:text-[0.95rem]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-section--surface marketing-section--trim-bottom">
        <div className="marketing-shell">
          <div className="marketing-intro mb-12 sm:mb-14">
            <p className="marketing-eyebrow">Live preview</p>
            <h2 className="max-w-[14ch] text-3xl font-semibold tracking-[-0.05em] leading-[1.02] text-[#111827] sm:text-4xl lg:text-[2.8rem]">
              Built to feel like the real conversation.
            </h2>
            <p className="marketing-muted max-w-[33rem]">
              Every session adapts to your profile and keeps the focus on live
              reps, concise coach notes, and the next rep to run.
            </p>
          </div>

          <div className="marketing-split marketing-split--two">
            <article className="marketing-card marketing-card--centered flex h-full flex-col gap-6">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="inline-flex items-center rounded-full bg-[rgba(201,162,39,0.12)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7620]">
                  Live interviewer
                </span>
                <span className="text-xs text-[#9CA3AF]">
                  Realistic follow-up pressure
                </span>
              </div>

              <div className="mx-auto max-w-[30rem] space-y-3">
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#111827]">
                  Walk me through your story, why banking, and why this team.
                </h3>
                <p className="marketing-muted text-sm">
                  Practice the opening that decides whether the rest of the
                  interview feels credible.
                </p>
              </div>

              <ul className="mx-auto w-full max-w-[30rem] space-y-4">
                {previewTranscript.map((item) => (
                  <li
                    key={item.tag}
                    className="rounded-[1.25rem] border border-[#ECEEF1] bg-[#F9FAFB] p-5 text-center"
                  >
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <strong className="text-xs font-semibold text-[#111827]">
                        {item.speaker}
                      </strong>
                      <span className="text-[10px] uppercase tracking-[0.1em] text-[#9CA3AF]">
                        {item.tag}
                      </span>
                    </div>
                    <p className="marketing-muted text-sm">{item.text}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="marketing-card marketing-card--centered marketing-card--tint flex h-full flex-col gap-6">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7620] shadow-[0_10px_24px_rgba(17,24,39,0.05)]">
                  Session debrief
                </span>
                <span className="text-xs text-[#9CA3AF]">Story / Resume</span>
              </div>

              <div className="w-full max-w-[30rem] rounded-[1.25rem] border border-[#E5E7EB] bg-white p-5 text-center">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
                  Recap
                </p>
                <p className="marketing-muted text-sm">
                  The opener is credible and pointed in the right direction. The
                  next improvement is getting to the banking pivot even faster.
                </p>
              </div>

              <div className="mx-auto grid w-full max-w-[34rem] gap-4 sm:grid-cols-2">
                <div className="rounded-[1.25rem] border border-[#E5E7EB] bg-white p-5 text-center">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
                    Coach notes
                  </p>
                  <ul className="space-y-2.5">
                    {previewCoachNotes.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-[#6B7280]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[1.25rem] border border-[#E5E7EB] bg-white p-5 text-center">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
                    Next rep
                  </p>
                  <p className="marketing-muted text-sm">
                    Run the same opener again and keep it inside 90 seconds.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-section--trim-top">
        <div className="marketing-shell">
          <div className="marketing-intro mb-20 sm:mb-24 lg:mb-28">
            <p className="marketing-eyebrow">Resources</p>
            <h2 className="max-w-[18ch] text-3xl font-semibold tracking-[-0.05em] leading-[1.02] text-[#111827] sm:text-4xl lg:max-w-[none] lg:text-[2.8rem]">
              Prep content that actually helps.
            </h2>
          </div>

          <div className="resources-grid">
            {[
              {
                kind: "guides" as const,
                label: "Guides",
                href: "/guides",
                items: latestGuides,
              },
              {
                kind: "blog" as const,
                label: "Blog",
                href: "/blog",
                items: latestPosts,
              },
            ].map(({ kind, label, href, items }) => (
              <article key={kind} className="resources-column">
                <div className="resources-column__header">
                  <p className="marketing-eyebrow mb-3">Library</p>
                  <h3 className="resources-column__title">{label}</h3>
                </div>

                <div className="resources-list">
                  {items.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${kind}/${item.slug}`}
                      className="resources-entry"
                    >
                      <p className="resources-entry__meta">
                        {formatDate(item.date)} · {item.readingTime}
                      </p>
                      <h4 className="resources-entry__title">
                        {item.title}
                      </h4>
                      <p className="resources-entry__description line-clamp-2">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>

                <div className="resources-column__footer">
                  <Link href={href} className="resources-column__cta">
                    {kind === "guides" ? "See all guides" : "See all blog posts"}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="marketing-section marketing-section--surface">
        <div className="marketing-shell">
          <div className="pricing-block">
            <div className="marketing-intro pricing-intro">
              <p className="marketing-eyebrow">Pricing</p>
              <h2 className="max-w-[12ch] text-3xl font-semibold tracking-[-0.05em] leading-[1.02] text-[#111827] sm:text-4xl lg:text-[2.8rem]">
                Simple pricing, unlimited practice.
              </h2>
              <p className="marketing-muted max-w-[30rem]">
                One plan with everything you need. Start free, cancel anytime,
                and keep stacking reps when it matters most.
              </p>
            </div>

            <article className="pricing-panel">
              <div className="pricing-panel__summary">
                <div className="pricing-panel__badge">
                  {site.pricing.trialDays}-Day Free Trial
                </div>
                <p className="pricing-panel__plan">Superday AI Pro</p>
                <div className="pricing-panel__price-lockup">
                  <span className="pricing-panel__currency">$</span>
                  <span className="pricing-panel__price">
                    {site.pricing.monthly}
                  </span>
                  <span className="pricing-panel__interval">/month</span>
                </div>
                <p className="pricing-panel__copy">
                  For ambitious candidates who want more reps, sharper coach
                  notes, and a real edge going into first rounds and superdays.
                </p>

                <Link
                  href="/mock-interview#account"
                  className="pricing-panel__cta"
                >
                  Start {site.pricing.trialDays}-day free trial
                  <span aria-hidden="true" className="text-lg">
                    →
                  </span>
                </Link>

                <p className="pricing-panel__fineprint">
                  Cancel anytime · {site.pricing.label} after your{" "}
                  {site.pricing.trialDays}-day trial
                </p>
              </div>

              <div className="pricing-panel__details">
                <ul className="pricing-panel__features">
                  {pricingFeatures.map((item) => (
                    <li
                      key={item}
                      className="pricing-panel__feature"
                    >
                      <span className="pricing-panel__feature-mark" aria-hidden="true">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="faq" className="marketing-section">
        <div className="marketing-shell">
          <div className="marketing-intro mb-12 sm:mb-14">
            <p className="marketing-eyebrow">FAQ</p>
            <h2 className="max-w-[13ch] text-3xl font-semibold tracking-[-0.05em] leading-[1.02] text-[#111827] sm:text-4xl lg:text-[2.8rem]">
              What candidates usually ask first.
            </h2>
            <p className="marketing-muted max-w-[33rem]">
              Clear answers on how the mock interview works, what you practice,
              and what happens after the session ends.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {homepageFaqs.map((item) => (
              <article
                key={item.question}
                className="marketing-card marketing-card--soft marketing-card--centered flex h-full flex-col gap-4"
              >
                <h3 className="mx-auto max-w-[18rem] text-lg font-semibold tracking-[-0.03em] text-[#111827]">
                  {item.question}
                </h3>
                <p className="marketing-muted mx-auto max-w-[18rem] text-sm">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

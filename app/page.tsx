import Link from "next/link";

import { EmployerLogoMarquee } from "@/components/employer-logo-marquee";
import { HomepageFaqAccordion } from "@/components/homepage-faq-accordion";
import { formatDate, getLatestEntries } from "@/lib/content";
import { employerMarqueeLogos, homepageFaqs, site } from "@/lib/site";

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

          <EmployerLogoMarquee
            label="Our users have landed jobs at:"
            logos={employerMarqueeLogos}
          />
        </div>
      </section>

      <section
        id="about"
        className="marketing-section marketing-section--trim-top"
      >
        <div className="marketing-shell">
          <div className="marketing-intro mb-14 sm:mb-16">
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

      <section className="marketing-section marketing-section--surface marketing-section--trim-bottom homepage-preview-section">
        <div className="marketing-shell">
          <div className="marketing-intro homepage-preview-intro">
            <p className="marketing-eyebrow">Live preview</p>
            <h2 className="max-w-[14ch] text-3xl font-semibold tracking-[-0.05em] leading-[1.02] text-[#111827] sm:text-4xl lg:text-[2.8rem]">
              Built to feel like the real conversation.
            </h2>
            <p className="marketing-muted max-w-[33rem]">
              Practice with the same pressure, then leave with concise coach
              notes and one clear next rep to run.
            </p>
          </div>

          <div className="homepage-preview-stage">
            <div className="homepage-preview-grid">
              <article className="homepage-preview-panel homepage-preview-panel--interviewer">
                <div className="homepage-preview-panel__header">
                  <span className="homepage-preview-chip homepage-preview-chip--live">
                    Live interviewer
                  </span>
                  <span className="homepage-preview-panel__context">
                    Behavioral opener · Realistic follow-up pressure
                  </span>
                </div>

                <div className="homepage-preview-question">
                  <p className="homepage-preview-question__eyebrow">
                    Active prompt
                  </p>
                  <h3 className="homepage-preview-question__title">
                    Walk me through your story, why banking, and why this team.
                  </h3>
                  <p className="homepage-preview-question__body">
                    Practice the opening that decides whether the rest of the
                    interview feels credible.
                  </p>
                </div>

                <ul className="homepage-preview-transcript">
                {previewTranscript.map((item) => (
                  <li
                    key={item.tag}
                    className={`homepage-preview-transcript__item ${
                      item.speaker === "Interviewer"
                        ? "homepage-preview-transcript__item--interviewer"
                        : "homepage-preview-transcript__item--candidate"
                    }`}
                  >
                    <div className="homepage-preview-transcript__meta">
                      <strong className="homepage-preview-transcript__speaker">
                        {item.speaker}
                      </strong>
                      <span className="homepage-preview-transcript__tag">
                        {item.tag}
                      </span>
                    </div>
                    <p className="homepage-preview-transcript__text">
                      {item.text}
                    </p>
                  </li>
                ))}
                </ul>
              </article>

              <article className="homepage-preview-panel homepage-preview-panel--debrief">
                <div className="homepage-preview-panel__header">
                  <span className="homepage-preview-chip homepage-preview-chip--debrief">
                    Session debrief
                  </span>
                  <span className="homepage-preview-panel__context">
                    Story / Resume
                  </span>
                </div>

                <div className="homepage-preview-debrief">
                  <div className="homepage-preview-note homepage-preview-note--primary">
                    <p className="homepage-preview-note__label">Recap</p>
                    <p className="homepage-preview-note__text">
                      The opener is credible and pointed in the right direction.
                      The next improvement is getting to the banking pivot even
                      faster.
                    </p>
                  </div>

                  <div className="homepage-preview-note homepage-preview-note--action">
                    <p className="homepage-preview-note__label homepage-preview-note__label--action">
                      Next rep
                    </p>
                    <p className="homepage-preview-note__text homepage-preview-note__text--action">
                      Run the same opener again and keep it inside 90 seconds.
                    </p>
                  </div>

                  <div className="homepage-preview-note homepage-preview-note--list">
                    <p className="homepage-preview-note__label">Coach notes</p>
                    <ul className="homepage-preview-bullets">
                    {previewCoachNotes.map((item) => (
                      <li key={item} className="homepage-preview-bullets__item">
                        <span
                          aria-hidden="true"
                          className="homepage-preview-bullets__dot"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                    </ul>
                  </div>
                </div>
              </article>
            </div>
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

      <section id="faq" className="marketing-section homepage-faq-section">
        <div className="marketing-shell">
          <div className="marketing-intro homepage-faq-intro">
            <p className="marketing-eyebrow">FAQ</p>
            <h2 className="max-w-[18ch] text-3xl font-semibold tracking-[-0.05em] leading-[1.02] text-[#111827] sm:text-4xl lg:max-w-none lg:text-[2.8rem]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="homepage-faq-stage">
            <div className="homepage-faq-rail">
              <HomepageFaqAccordion items={homepageFaqs} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

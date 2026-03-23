import Link from "next/link";

import { LogoMarquee } from "@/components/logo-marquee";
import { formatDate, getLatestEntries } from "@/lib/content";
import { bankLogos, homepageFaqs, schoolLogos, site } from "@/lib/site";

export default async function HomePage() {
  const [latestGuides, latestPosts] = await Promise.all([getLatestEntries("guides", 3), getLatestEntries("blog", 3)]);

  return (
    <main className="dashboard">

      {/* ── Command Center ────────────────────────────── */}
      <div className="dash-command">
        <div className="dash-command-copy">
          <h1>Train for your Superday before your Superday runs a train on you.</h1>
          <p className="hero-summary">
            Run live mocks, tighten technical answers, and review transcript-backed scorecards anytime.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary button-hero" href="/assessment">
              Try for Free Today
            </Link>
          </div>
          <dl className="hero-stats">
            <div>
              <dt>Practice</dt>
              <dd>24/7</dd>
            </div>
            <div>
              <dt>Modes</dt>
              <dd>3</dd>
            </div>
            <div>
              <dt>Feedback</dt>
              <dd>Instant</dd>
            </div>
          </dl>
          <LogoMarquee
            ariaLabel="Our users have landed jobs at leading investment banks"
            compact
            label="Our users have landed jobs at:"
            logos={bankLogos}
            variant="light"
          />
        </div>

        <div className="dash-command-panels">
          <article className="panel panel-live">
            <div className="panel-topline">
              <span className="status-chip">Live mock</span>
              <span className="muted-copy">Realistic follow-up pressure</span>
            </div>
            <h2>Walk me through your story, why banking, and why this team.</h2>
            <p className="panel-summary">
              Practice the opening that decides whether the rest of the interview feels credible.
            </p>
            <ul className="transcript-list">
              <li>
                <div className="speaker-row">
                  <strong>Coach</strong>
                  <span>opening</span>
                </div>
                <p>Start with the pivot. Do not make them wait for the why now.</p>
              </li>
              <li>
                <div className="speaker-row">
                  <strong>You</strong>
                  <span>candidate</span>
                </div>
                <p>I want the pace, client exposure, and execution intensity that banking offers.</p>
              </li>
            </ul>
          </article>

          <article className="panel panel-scorecard">
            <div className="panel-topline">
              <span className="muted-copy">Latest review</span>
              <span className="score-pill">84/100 readiness</span>
            </div>
            <ul className="brief-list">
              <li>Clear why-now story.</li>
              <li>Technicals still need more speed.</li>
              <li>Bring one live deal to the room.</li>
            </ul>
          </article>
        </div>
      </div>

      {/* ── School trust band ─────────────────────────── */}
      <LogoMarquee ariaLabel="Trusted by students from top schools" label="Trusted by Students From" logos={schoolLogos} />

      {/* ── Resources ─────────────────────────────────── */}
      <section className="dash-section resource-section">
        <div className="dash-section-header">
          <p className="section-kicker">Resources</p>
          <h2>Built to rank for the prep questions candidates actually search.</h2>
          <p>Use the guide hub for pillar topics and the blog for focused breakdowns, then move straight into practice.</p>
        </div>
        <div className="resource-grid">
          <div className="resource-column">
            <div className="resource-header">
              <h3>Guides</h3>
              <Link href="/guides">See all guides</Link>
            </div>
            {latestGuides.map((item) => (
              <Link className="resource-card" href={`/guides/${item.slug}`} key={item.slug}>
                <p className="resource-date">{formatDate(item.date)} · {item.readingTime}</p>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
          <div className="resource-column">
            <div className="resource-header">
              <h3>Blog</h3>
              <Link href="/blog">See all posts</Link>
            </div>
            {latestPosts.map((item) => (
              <Link className="resource-card" href={`/blog/${item.slug}`} key={item.slug}>
                <p className="resource-date">{formatDate(item.date)} · {item.readingTime}</p>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────── */}
      <section className="dash-section pricing-section" id="pricing">
        <div className="dash-section-header pricing-section-header">
          <h2>Simple pricing, unlimited practice</h2>
          <p>One plan with everything you need. Start with a free trial, cancel anytime.</p>
        </div>
        <article className="pricing-card pricing-card-premium">
          <div className="pricing-main">
            <div className="pricing-overview">
              <p className="pricing-trial">{site.pricing.trialDays}-Day Free Trial</p>
              <p className="pricing-label">Superday AI Pro</p>
              <p className="pricing-value">
                <span className="pricing-currency">$</span>
                {site.pricing.monthly}
                <span className="pricing-period">/month</span>
              </p>
              <p className="pricing-copy">
                For ambitious candidates who want more reps, sharper feedback, and a real edge going into first rounds and superdays.
              </p>
            </div>
            <div className="pricing-features">
              <ul className="pricing-feature-list">
                <li>Unlimited live mock interviews per month</li>
                <li>Detailed feedback after every session</li>
                <li>Behavioral, technical, and superday drills</li>
                <li>Saved scorecards and full guide access</li>
              </ul>
            </div>
          </div>
          <div className="pricing-footer">
            <div className="pricing-cta-group">
              <Link className="button button-pricing" href="/assessment">
                Try for Free Today <span aria-hidden="true">→</span>
              </Link>
              <p className="pricing-footnote">Cancel anytime</p>
            </div>
            <p className="pricing-footnote pricing-footnote-secondary">
              One plan only. {site.pricing.label} after your {site.pricing.trialDays}-Day Free Trial.
            </p>
          </div>
        </article>
      </section>

      {/* ── FAQ ───────────────────────────────────────── */}
      <section className="dash-section">
        <div className="dash-section-header">
          <p className="section-kicker">FAQ</p>
          <h2>What candidates usually ask first.</h2>
        </div>
        <div className="faq-grid">
          {homepageFaqs.map((item) => (
            <article className="faq-card" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

    </main>
  );
}

import Link from "next/link";

import { LogoMarquee } from "@/components/logo-marquee";
import { formatDate, getLatestEntries } from "@/lib/content";
import { homepageFaqs, site } from "@/lib/site";

export default async function HomePage() {
  const [latestGuides, latestPosts] = await Promise.all([getLatestEntries("guides", 3), getLatestEntries("blog", 3)]);

  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="section-kicker">AI-native investment banking interview prep</p>
          <h1>Practice investment banking interviews with an AI voice coach.</h1>
          <p className="hero-summary">
            Run live mocks, tighten technical answers, and review transcript-backed scorecards anytime.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/assessment">
              Start your assessment
            </Link>
            <Link className="button button-secondary" href="/guides">
              Read the prep guides
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
        </div>

        <div className="hero-proof">
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
      </section>

      <LogoMarquee />

      <section className="section">
        <div className="section-head">
          <p className="section-kicker">Practice modes</p>
          <h2>Three ways to train.</h2>
          <p>Use the full mock when you need pressure, the drill mode when you need reps, and the review when you need proof.</p>
        </div>
        <div className="card-grid card-grid--three">
          <article className="feature-card">
            <span className="card-index">01</span>
            <h3>Live Mock</h3>
            <p>Voice-led interviews with realistic follow-ups and a clear readiness score.</p>
          </article>
          <article className="feature-card feature-card--accent">
            <span className="card-index">02</span>
            <h3>Quick Drill</h3>
            <p>Short sessions for technicals, story work, markets, and closing questions.</p>
          </article>
          <article className="feature-card">
            <span className="card-index">03</span>
            <h3>Post-Mortem Review</h3>
            <p>Transcript-backed feedback with evidence, misses, and the next reps to run.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <p className="section-kicker">Coverage</p>
          <h2>Everything the interview can turn into.</h2>
          <p>Behavioral answers, technical questions, deals and markets, and final-round superday pressure all live in one workflow.</p>
        </div>
        <div className="card-grid card-grid--four">
          <article className="mini-card">
            <h3>Behavioral</h3>
            <p>Story, leadership, conflict, and why banking.</p>
          </article>
          <article className="mini-card">
            <h3>Technical</h3>
            <p>Accounting, valuation, DCF, comps, and merger math.</p>
          </article>
          <article className="mini-card">
            <h3>Deals & Markets</h3>
            <p>Recent transactions, market views, and banker-style judgment.</p>
          </article>
          <article className="mini-card">
            <h3>Superday</h3>
            <p>Pressure-tested follow-ups and cleaner closing questions.</p>
          </article>
        </div>
      </section>

      <section className="section section-split">
        <div className="section-head section-head--left">
          <p className="section-kicker">Why it works</p>
          <h2>Simple loop. Better reps.</h2>
          <p>
            The product is built around one job: help you sound sharper when the interviewer pushes. You do not
            need a long course to get there. You need realistic practice, feedback you can trust, and a fast way
            to run the next rep.
          </p>
        </div>
        <div className="proof-stack">
          <article className="mini-card">
            <h3>Realistic follow-ups</h3>
            <p>The mock changes based on your target bank, group, and interview stage.</p>
          </article>
          <article className="mini-card">
            <h3>Transcript-backed reviews</h3>
            <p>Every score ties back to what you actually said, not generic advice.</p>
          </article>
          <article className="mini-card">
            <h3>Practice anytime</h3>
            <p>Open a drill from your laptop or phone whenever you have ten free minutes.</p>
          </article>
        </div>
      </section>

      <section className="section resource-section">
        <div className="section-head">
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

      <section className="section pricing-section" id="pricing">
        <div className="section-head">
          <p className="section-kicker">Pricing</p>
          <h2>One plan. Full access.</h2>
          <p>Start with the full prep loop: live mocks, quick drills, saved reviews, and the full content library.</p>
        </div>
        <article className="pricing-card">
          <p className="pricing-label">Superday AI Pro</p>
          <p className="pricing-value">{site.pricing.label}</p>
          <p className="pricing-copy">Built for candidates who want realistic reps without paying for a coach every time they practice.</p>
          <ul className="brief-list">
            <li>Live voice mock sessions</li>
            <li>Technical, behavioral, and superday drills</li>
            <li>Saved scorecards and next-step reps</li>
          </ul>
          <Link className="button button-primary" href="/assessment">
            Start your assessment
          </Link>
        </article>
      </section>

      <section className="section">
        <div className="section-head">
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

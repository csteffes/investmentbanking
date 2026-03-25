import Link from "next/link";

import { LogoMarquee } from "@/components/logo-marquee";
import { formatDate, getLatestEntries } from "@/lib/content";
import { bankLogos, homepageFaqs, schoolLogos, site } from "@/lib/site";

export default async function HomePage() {
  const [latestGuides, latestPosts] = await Promise.all([
    getLatestEntries("guides", 3),
    getLatestEntries("blog", 3),
  ]);

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative px-6 pt-24 pb-20 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#C9A227] mb-5">
            Investment Banking Interview Prep
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-[#F8F8F8] mb-5">
            Train for your Superday before your Superday runs a train on you.
          </h1>
          <p className="text-[#A0A0A0] text-lg leading-relaxed mb-8 max-w-xl">
            Run live mocks, tighten technical answers, and review transcript-backed scorecards anytime.
          </p>
          <div className="flex items-center gap-3 flex-wrap mb-12">
            <Link
              href="/assessment"
              className="px-6 py-3 rounded-lg bg-[#C9A227] text-[#0A0A0A] font-semibold text-sm hover:bg-[#E8BC30] transition-colors duration-150"
            >
              Try for Free Today
            </Link>
          </div>
          <dl className="flex items-center gap-8">
            {[
              { dt: "Practice", dd: "24/7" },
              { dt: "Modes", dd: "3" },
              { dt: "Feedback", dd: "Instant" },
            ].map(({ dt, dd }) => (
              <div key={dt}>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#606060] mb-0.5">{dt}</dt>
                <dd className="text-xl font-bold text-[#F8F8F8]">{dd}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Demo cards */}
        <div className="mt-16 grid sm:grid-cols-2 gap-4 max-w-3xl">
          <article className="bg-[#111111] border border-white/[0.08] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#C9A227] bg-[rgba(201,162,39,0.1)] px-2 py-0.5 rounded">
                Live mock
              </span>
              <span className="text-xs text-[#606060]">Realistic follow-up pressure</span>
            </div>
            <h2 className="text-sm font-semibold text-[#F8F8F8] leading-snug mb-2">
              Walk me through your story, why banking, and why this team.
            </h2>
            <p className="text-xs text-[#606060] mb-4">
              Practice the opening that decides whether the rest of the interview feels credible.
            </p>
            <ul className="space-y-2.5">
              {[
                { speaker: "Coach", tag: "opening", text: "Start with the pivot. Do not make them wait for the why now." },
                { speaker: "You", tag: "candidate", text: "I want the pace, client exposure, and execution intensity that banking offers." },
              ].map((item) => (
                <li key={item.tag} className="text-xs">
                  <div className="flex items-center gap-2 mb-0.5">
                    <strong className="text-[#F8F8F8] font-semibold">{item.speaker}</strong>
                    <span className="text-[#606060]">{item.tag}</span>
                  </div>
                  <p className="text-[#A0A0A0] leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="bg-[#111111] border border-white/[0.08] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-[#606060]">Latest review</span>
              <span className="text-[10px] font-semibold text-[#C9A227] bg-[rgba(201,162,39,0.1)] px-2 py-0.5 rounded">
                84/100 readiness
              </span>
            </div>
            <div className="space-y-2.5">
              {[
                ["Structure", 88],
                ["Communication", 82],
                ["Technical", 80],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#A0A0A0]">{label}</span>
                    <strong className="text-[#F8F8F8]">{value}</strong>
                  </div>
                  <div className="h-1 w-full rounded-full bg-white/[0.06]">
                    <span
                      className="block h-full rounded-full bg-[#C9A227] transition-all duration-[400ms] ease-out"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <ul className="mt-4 space-y-1.5">
              {["Clear why-now story.", "Technicals still need more speed.", "Bring one live deal to the room."].map((item) => (
                <li key={item} className="text-xs text-[#A0A0A0] flex items-start gap-1.5">
                  <span className="text-[#C9A227] mt-0.5 flex-shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* ── Bank trust band ──────────────────────────────── */}
      <LogoMarquee
        ariaLabel="Our users have landed jobs at leading investment banks"
        label="Our Users Have Landed Jobs at:"
        logos={bankLogos}
        variant="dark"
      />

      {/* ── School trust band ────────────────────────────── */}
      <LogoMarquee
        ariaLabel="Trusted by students from top schools"
        label="Trusted by Students From:"
        logos={schoolLogos}
        variant="dark"
      />

      {/* ── Resources ────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#C9A227] mb-3">
            Resources
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8F8F8] mb-3">
            Built to rank for the prep questions candidates actually search.
          </h2>
          <p className="text-[#A0A0A0] max-w-xl">
            Use the guide hub for pillar topics and the blog for focused breakdowns, then move straight into practice.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-8">
          {[
            { kind: "guides" as const, label: "Guides", href: "/guides", items: latestGuides },
            { kind: "blog" as const, label: "Blog", href: "/blog", items: latestPosts },
          ].map(({ label, href, items, kind }) => (
            <div key={kind}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#F8F8F8]">{label}</h3>
                <Link
                  href={href}
                  className="text-xs text-[#606060] hover:text-[#A0A0A0] transition-colors duration-150"
                >
                  See all →
                </Link>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${kind}/${item.slug}`}
                    className="block bg-[#111111] border border-white/[0.08] rounded-xl p-4 hover:border-white/[0.15] hover:-translate-y-px transition-all duration-150"
                  >
                    <p className="text-[10px] text-[#606060] mb-1.5 uppercase tracking-wide">
                      {formatDate(item.date)} · {item.readingTime}
                    </p>
                    <h4 className="text-sm font-semibold text-[#F8F8F8] leading-snug mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#606060] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <section id="pricing" className="px-6 py-20 border-t border-white/[0.06]">
        <div className="max-w-lg mx-auto text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8F8F8] mb-3">
            Simple pricing, unlimited practice
          </h2>
          <p className="text-[#A0A0A0]">
            One plan with everything you need. Start with a free trial, cancel anytime.
          </p>
        </div>
        <article className="max-w-md mx-auto bg-[#111111] border border-white/[0.1] rounded-2xl overflow-hidden">
          <div className="p-8 border-b border-white/[0.08]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C9A227] mb-2">
              {site.pricing.trialDays}-Day Free Trial
            </p>
            <p className="text-sm font-semibold text-[#A0A0A0] mb-4">Superday AI Pro</p>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-lg text-[#A0A0A0]">$</span>
              <span className="text-5xl font-bold tracking-tight text-[#F8F8F8]">
                {site.pricing.monthly}
              </span>
              <span className="text-[#606060] text-sm">/month</span>
            </div>
            <p className="text-sm text-[#A0A0A0] leading-relaxed">
              For ambitious candidates who want more reps, sharper feedback, and a real edge going into first rounds and superdays.
            </p>
          </div>
          <div className="p-8">
            <ul className="space-y-3 mb-8">
              {[
                "Unlimited live mock interviews per month",
                "Detailed feedback after every session",
                "Behavioral, technical, and superday drills",
                "Saved scorecards and full guide access",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#A0A0A0]">
                  <span className="text-[#C9A227] font-bold mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/assessment"
              className="block w-full text-center px-6 py-3 rounded-lg bg-[#C9A227] text-[#0A0A0A] font-semibold text-sm hover:bg-[#E8BC30] transition-colors duration-150 mb-3"
            >
              Try for Free Today →
            </Link>
            <p className="text-center text-xs text-[#606060]">
              Cancel anytime · {site.pricing.label} after your {site.pricing.trialDays}-day trial
            </p>
          </div>
        </article>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#C9A227] mb-3">FAQ</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8F8F8]">
            What candidates usually ask first.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {homepageFaqs.map((item) => (
            <article
              key={item.question}
              className="bg-[#111111] border border-white/[0.08] rounded-xl p-5"
            >
              <h3 className="text-sm font-semibold text-[#F8F8F8] leading-snug mb-2">
                {item.question}
              </h3>
              <p className="text-xs text-[#A0A0A0] leading-relaxed">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

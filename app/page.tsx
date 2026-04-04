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
      <section className="px-6 pt-32 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-[#F8F8F8] mb-6">
            Build confidence that gets you the offer.
          </h1>
          <p className="text-lg sm:text-xl text-[#A0A0A0] leading-relaxed max-w-2xl mx-auto mb-10">
            Run live mock interviews with an AI voice coach, sharpen your technicals,
            and review transcript-backed scorecards — anytime, anywhere.
          </p>
          <div className="flex items-center justify-center gap-4 mb-12">
            <Link
              href="/assessment"
              className="px-8 py-3.5 rounded-lg bg-[#C9A227] text-[#0A0A0A] font-semibold text-sm hover:bg-[#E8BC30] transition-all duration-150"
            >
              Try for free today
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-[#606060]">
            <span className="text-[#C9A227] font-semibold">4.8/5</span>
            <span>from early users</span>
            <span className="mx-1">·</span>
            <span>No credit card required</span>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A227] mb-4">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8F8F8]">
              Three tracks. One readiness score.
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Set your target",
                description: "Choose your bank, group, and interview stage. The AI tailors every prompt to your exact situation.",
              },
              {
                step: "02",
                title: "Practice out loud",
                description: "Run a live voice mock. The coach pushes back with realistic follow-ups — behavioral, technical, or deals.",
              },
              {
                step: "03",
                title: "Review your scorecard",
                description: "Get a transcript-backed readiness score with evidence, dimension scores, and specific next steps.",
              },
            ].map((item) => (
              <article
                key={item.step}
                className="bg-[#111111] border border-white/[0.08] rounded-2xl p-8 hover:border-white/[0.15] transition-colors duration-150"
              >
                <span className="text-xs font-semibold text-[#C9A227] mb-4 block">{item.step}</span>
                <h3 className="text-lg font-semibold text-[#F8F8F8] tracking-tight mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-[#A0A0A0] leading-relaxed">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product preview ──────────────────────────────── */}
      <section className="px-6 py-24 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A227] mb-4">
              Live preview
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8F8F8] mb-4">
              Structured like the real thing.
            </h2>
            <p className="text-[#A0A0A0] max-w-xl mx-auto">
              Every session adapts to your profile and delivers the same pressure you will face in the room.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Live mock card */}
            <article className="bg-[#111111] border border-white/[0.08] rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#C9A227] bg-[rgba(201,162,39,0.08)] px-2.5 py-1 rounded-md">
                  Live mock
                </span>
                <span className="text-xs text-[#606060]">Realistic follow-up pressure</span>
              </div>
              <h3 className="text-base font-semibold text-[#F8F8F8] leading-snug mb-3">
                Walk me through your story, why banking, and why this team.
              </h3>
              <p className="text-xs text-[#606060] mb-6">
                Practice the opening that decides whether the rest of the interview feels credible.
              </p>
              <div className="waveform mb-6" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, i) => <span key={i} />)}
              </div>
              <ul className="space-y-4">
                {[
                  { speaker: "Coach", tag: "opening", text: "Start with the pivot. Do not make them wait for the why now." },
                  { speaker: "You", tag: "candidate", text: "I want the pace, client exposure, and execution intensity that banking offers." },
                ].map((item) => (
                  <li key={item.tag}>
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-xs font-semibold text-[#F8F8F8]">{item.speaker}</strong>
                      <span className="text-[10px] text-[#606060]">{item.tag}</span>
                    </div>
                    <p className="text-sm text-[#A0A0A0] leading-relaxed">{item.text}</p>
                  </li>
                ))}
              </ul>
            </article>

            {/* Scorecard card */}
            <article className="bg-[#111111] border border-white/[0.08] rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs text-[#606060]">Latest review</span>
                <span className="text-xs font-semibold text-[#C9A227] bg-[rgba(201,162,39,0.08)] px-2.5 py-1 rounded-md">
                  84/100 readiness
                </span>
              </div>
              <div className="space-y-5 mb-8">
                {[
                  ["Structure", 88],
                  ["Communication", 82],
                  ["Technical", 80],
                  ["Poise", 85],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[#A0A0A0]">{label}</span>
                      <strong className="text-[#F8F8F8] font-semibold">{value}</strong>
                    </div>
                    <div className="metric-bar">
                      <span style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/[0.06] pt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#606060] mb-3">Key feedback</p>
                <ul className="space-y-2">
                  {["Clear why-now story.", "Technicals still need more speed.", "Bring one live deal to the room."].map((item) => (
                    <li key={item} className="text-sm text-[#A0A0A0] flex items-start gap-2">
                      <span className="text-[#C9A227] mt-0.5 flex-shrink-0">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── Bank trust band ──────────────────────────────── */}
      <LogoMarquee
        ariaLabel="Our users have landed jobs at leading investment banks"
        label="Our users have landed jobs at:"
        logos={bankLogos}
        variant="dark"
      />

      {/* ── School trust band ────────────────────────────── */}
      <LogoMarquee
        ariaLabel="Trusted by students from top schools"
        label="Trusted by students from:"
        logos={schoolLogos}
        variant="dark"
      />

      {/* ── Resources ────────────────────────────────────── */}
      <section className="px-6 py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A227] mb-4">
              Resources
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8F8F8] mb-4">
              Built to rank for the prep questions candidates actually search.
            </h2>
            <p className="text-[#A0A0A0] max-w-xl mx-auto">
              Use the guide hub for pillar topics and the blog for focused breakdowns,
              then move straight into practice.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-12">
            {[
              { kind: "guides" as const, label: "Guides", href: "/guides", items: latestGuides },
              { kind: "blog" as const, label: "Blog", href: "/blog", items: latestPosts },
            ].map(({ label, href, items, kind }) => (
              <div key={kind}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-semibold text-[#F8F8F8]">{label}</h3>
                  <Link
                    href={href}
                    className="text-xs text-[#606060] hover:text-[#A0A0A0] transition-colors duration-150"
                  >
                    See all →
                  </Link>
                </div>
                <div className="space-y-4">
                  {items.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${kind}/${item.slug}`}
                      className="block bg-[#111111] border border-white/[0.08] rounded-xl p-6 hover:border-white/[0.15] hover:-translate-y-0.5 transition-all duration-150"
                    >
                      <p className="text-[10px] text-[#606060] uppercase tracking-wide mb-2">
                        {formatDate(item.date)} · {item.readingTime}
                      </p>
                      <h4 className="text-sm font-semibold text-[#F8F8F8] leading-snug mb-2">
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
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <section id="pricing" className="px-6 py-28 border-t border-white/[0.06]">
        <div className="max-w-lg mx-auto text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A227] mb-4">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8F8F8] mb-4">
            Simple pricing, unlimited practice.
          </h2>
          <p className="text-[#A0A0A0]">
            One plan with everything you need. Start free, cancel anytime.
          </p>
        </div>
        <article className="max-w-md mx-auto bg-[#111111] border border-white/[0.1] rounded-2xl overflow-hidden">
          <div className="p-10 border-b border-white/[0.08]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#C9A227] mb-3">
              {site.pricing.trialDays}-Day Free Trial
            </p>
            <p className="text-sm font-semibold text-[#A0A0A0] mb-6">Superday AI Pro</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-lg text-[#606060]">$</span>
              <span className="text-6xl font-bold tracking-tight text-[#F8F8F8]">
                {site.pricing.monthly}
              </span>
              <span className="text-[#606060] text-sm ml-1">/month</span>
            </div>
            <p className="text-sm text-[#A0A0A0] leading-relaxed">
              For ambitious candidates who want more reps, sharper feedback, and a real edge
              going into first rounds and superdays.
            </p>
          </div>
          <div className="p-10">
            <ul className="space-y-4 mb-10">
              {[
                "Unlimited live mock interviews",
                "Detailed feedback after every session",
                "Behavioral, technical, and superday drills",
                "Saved scorecards and full guide access",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#A0A0A0]">
                  <span className="text-[#C9A227] font-bold mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/assessment"
              className="block w-full text-center px-6 py-3.5 rounded-lg bg-[#C9A227] text-[#0A0A0A] font-semibold text-sm hover:bg-[#E8BC30] transition-all duration-150"
            >
              Try for free today
            </Link>
            <p className="text-center text-xs text-[#606060] mt-4">
              Cancel anytime · {site.pricing.label} after your {site.pricing.trialDays}-day trial
            </p>
          </div>
        </article>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="px-6 py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A227] mb-4">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8F8F8]">
              What candidates usually ask first.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {homepageFaqs.map((item) => (
              <article
                key={item.question}
                className="bg-[#111111] border border-white/[0.08] rounded-2xl p-8"
              >
                <h3 className="text-sm font-semibold text-[#F8F8F8] leading-snug mb-3">
                  {item.question}
                </h3>
                <p className="text-sm text-[#A0A0A0] leading-relaxed">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

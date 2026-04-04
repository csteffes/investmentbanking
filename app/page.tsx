import Link from "next/link";

import { LogoGrid } from "@/components/logo-grid";
import { formatDate, getLatestEntries } from "@/lib/content";
import { bankLogos, homepageFaqs, schoolLogos, site } from "@/lib/site";

export default async function HomePage() {
  const [latestGuides, latestPosts] = await Promise.all([
    getLatestEntries("guides", 3),
    getLatestEntries("blog", 3),
  ]);

  return (
    <main className="w-full">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="w-full px-6 pt-28 pb-20 sm:pt-40 sm:pb-28">
        <div className="w-full max-w-[680px] mx-auto text-center">
          {/* Trust badge */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#22C55E]" />
              <span className="text-sm text-[#6B7280]">
                Trusted by investment banking candidates nationwide
              </span>
            </div>
          </div>

          <h1 className="text-[2.5rem] sm:text-[3.25rem] lg:text-[3.75rem] font-bold tracking-[-0.03em] leading-[1.08] text-[#111827] mb-6">
            Build confidence that
            <br />
            <span className="text-[#C9A227]">gets you the offer</span>
          </h1>

          <p className="text-base sm:text-lg text-[#6B7280] leading-[1.75] max-w-[520px] mx-auto mb-10">
            Confidence isn&apos;t a personality trait — it&apos;s practiced.
            Simulate real investment banking interviews so your thinking,
            structure, and delivery feel natural under pressure.
          </p>

          <div className="flex justify-center mb-8">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-xl bg-[#111827] text-white font-semibold text-base hover:bg-[#1F2937] transition-all duration-150 shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
            >
              Try for free today
              <span aria-hidden="true" className="text-lg">→</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2.5 text-sm">
            <div className="flex gap-0.5 text-[#C9A227] text-base" aria-label="4.8 out of 5 stars">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <span className="font-semibold text-[#111827]">4.8/5</span>
            <span className="text-[#9CA3AF]">from early users</span>
          </div>
        </div>
      </section>

      {/* ── Bank logo band ───────────────────────────────── */}
      <LogoGrid
        label="Our users have landed jobs at:"
        logos={bankLogos}
      />

      {/* ── How it works ─────────────────────────────────── */}
      <section id="about" className="w-full px-6 py-24 sm:py-32">
        <div className="w-full max-w-[960px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A227] mb-4">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827]">
              Three steps to interview-ready.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Set your target",
                description:
                  "Choose your bank, group, and interview stage. The AI tailors every prompt to your exact situation.",
              },
              {
                step: "02",
                title: "Practice out loud",
                description:
                  "Run a live voice mock. The coach pushes back with realistic follow-ups — behavioral, technical, or deals.",
              },
              {
                step: "03",
                title: "Review your scorecard",
                description:
                  "Get a transcript-backed readiness score with evidence, dimension scores, and specific next steps.",
              },
            ].map((item) => (
              <article
                key={item.step}
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-8 text-center hover:border-[#D1D5DB] transition-colors duration-150"
              >
                <div className="flex justify-center mb-5">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#C9A227]/10 text-[#C9A227] text-sm font-bold">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#111827] tracking-tight mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product preview ──────────────────────────────── */}
      <section className="w-full px-6 py-24 sm:py-32 bg-[#FAFAFA]">
        <div className="w-full max-w-[960px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A227] mb-4">
              Live preview
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] mb-4">
              Structured like the real thing.
            </h2>
            <p className="text-[#6B7280] max-w-[520px] mx-auto">
              Every session adapts to your profile and delivers the same pressure
              you&apos;ll face in the room.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Live mock card */}
            <article className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#C9A227]">
                  Live mock
                </span>
                <span className="text-xs text-[#9CA3AF]">
                  Realistic follow-up pressure
                </span>
              </div>
              <h3 className="text-base font-semibold text-[#111827] leading-snug mb-3">
                Walk me through your story, why banking, and why this team.
              </h3>
              <p className="text-xs text-[#9CA3AF] mb-6">
                Practice the opening that decides whether the rest of the
                interview feels credible.
              </p>
              <ul className="space-y-4">
                {[
                  {
                    speaker: "Coach",
                    tag: "opening",
                    text: "Start with the pivot. Do not make them wait for the why now.",
                  },
                  {
                    speaker: "You",
                    tag: "candidate",
                    text: "I want the pace, client exposure, and execution intensity that banking offers.",
                  },
                ].map((item) => (
                  <li key={item.tag}>
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-xs font-semibold text-[#111827]">
                        {item.speaker}
                      </strong>
                      <span className="text-[10px] text-[#9CA3AF]">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
            </article>

            {/* Scorecard card */}
            <article className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs text-[#9CA3AF]">Latest review</span>
                <span className="text-xs font-semibold text-[#C9A227]">
                  84/100 readiness
                </span>
              </div>
              <div className="space-y-5 mb-8">
                {(
                  [
                    ["Structure", 88],
                    ["Communication", 82],
                    ["Technical", 80],
                    ["Poise", 85],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[#6B7280]">{label}</span>
                      <strong className="text-[#111827] font-semibold">
                        {value}
                      </strong>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                      <span
                        className="block h-full rounded-full bg-[#C9A227] transition-all duration-500"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#E5E7EB] pt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF] mb-3">
                  Key feedback
                </p>
                <ul className="space-y-2">
                  {[
                    "Clear why-now story.",
                    "Technicals still need more speed.",
                    "Bring one live deal to the room.",
                  ].map((item) => (
                    <li
                      key={item}
                      className="text-sm text-[#6B7280] flex items-start gap-2"
                    >
                      <span className="text-[#C9A227] mt-0.5 flex-shrink-0">
                        ·
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── School logo band ─────────────────────────────── */}
      <LogoGrid
        label="Trusted by students from:"
        logos={schoolLogos}
      />

      {/* ── Resources ────────────────────────────────────── */}
      <section className="w-full px-6 py-24 sm:py-32">
        <div className="w-full max-w-[960px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A227] mb-4">
              Resources
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] mb-4">
              Prep content that actually helps.
            </h2>
            <p className="text-[#6B7280] max-w-[520px] mx-auto">
              Use the guide hub for pillar topics and the blog for focused
              breakdowns, then move straight into practice.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
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
            ].map(({ label, href, items, kind }) => (
              <div key={kind}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-semibold text-[#111827]">
                    {label}
                  </h3>
                  <Link
                    href={href}
                    className="text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors duration-150"
                  >
                    See all →
                  </Link>
                </div>
                <div className="space-y-4">
                  {items.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${kind}/${item.slug}`}
                      className="block bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-6 hover:border-[#D1D5DB] hover:-translate-y-0.5 transition-all duration-150"
                    >
                      <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-2">
                        {formatDate(item.date)} · {item.readingTime}
                      </p>
                      <h4 className="text-sm font-semibold text-[#111827] leading-snug mb-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#9CA3AF] leading-relaxed line-clamp-2">
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
      <section id="pricing" className="w-full px-6 py-24 sm:py-32 bg-[#FAFAFA]">
        <div className="w-full max-w-[520px] mx-auto text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A227] mb-4">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] mb-4">
            Simple pricing, unlimited practice.
          </h2>
          <p className="text-[#6B7280]">
            One plan with everything you need. Start free, cancel anytime.
          </p>
        </div>
        <article className="w-full max-w-[440px] mx-auto bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="p-10 border-b border-[#E5E7EB] text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#C9A227] mb-3">
              {site.pricing.trialDays}-Day Free Trial
            </p>
            <p className="text-sm font-semibold text-[#6B7280] mb-6">
              Superday AI Pro
            </p>
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-lg text-[#9CA3AF]">$</span>
              <span className="text-6xl font-bold tracking-tight text-[#111827]">
                {site.pricing.monthly}
              </span>
              <span className="text-[#9CA3AF] text-sm ml-1">/month</span>
            </div>
            <p className="text-sm text-[#6B7280] leading-relaxed max-w-[340px] mx-auto">
              For ambitious candidates who want more reps, sharper feedback, and
              a real edge going into first rounds and superdays.
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
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-[#6B7280]"
                >
                  <span className="text-[#C9A227] font-bold mt-0.5 flex-shrink-0">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/assessment"
              className="flex items-center justify-center gap-2.5 w-full text-center px-6 py-4 rounded-xl bg-[#111827] text-white font-semibold text-base hover:bg-[#1F2937] transition-all duration-150"
            >
              Try for free today
              <span aria-hidden="true" className="text-lg">→</span>
            </Link>
            <p className="text-center text-xs text-[#9CA3AF] mt-4">
              Cancel anytime · {site.pricing.label} after your{" "}
              {site.pricing.trialDays}-day trial
            </p>
          </div>
        </article>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section id="faq" className="w-full px-6 py-24 sm:py-32">
        <div className="w-full max-w-[960px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A227] mb-4">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827]">
              What candidates usually ask first.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {homepageFaqs.map((item) => (
              <article
                key={item.question}
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-8"
              >
                <h3 className="text-sm font-semibold text-[#111827] leading-snug mb-3">
                  {item.question}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
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

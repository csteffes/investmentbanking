import Link from "next/link";

const footerHighlights = [
  {
    title: "Mock like the real room",
    body:
      "Run voice interviews that pressure-test your story, technicals, and follow-up depth before first rounds and superdays.",
  },
  {
    title: "Tighten every weak answer",
    body:
      "Use transcript-backed reviews to see where your structure breaks, where your technicals slow down, and what to fix next.",
  },
  {
    title: "Keep your reps moving",
    body:
      "Practice anytime, stack cleaner reps, and walk into recruiting with a sharper process than a static question bank can give you.",
  },
] as const;

const footerColumns = [
  {
    title: "Company",
    links: [
      { href: "/#about", label: "About us" },
      { href: "mailto:support@superdayready.com", label: "Contact us" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/guides", label: "Guides" },
      { href: "/blog", label: "Blog" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Legals",
    links: [
      { href: "/refund-policy", label: "Refund policy" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy policy" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-8">
      <section className="bg-[#232326] text-white px-6 py-20 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C9A227] mb-4">
              Superday AI
            </p>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#F8FAFC]">
              Built for the pressure of recruiting season.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {footerHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.35rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-7 sm:p-8"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C9A227] mb-4">
                  {item.title}
                </p>
                <p className="text-[15px] leading-8 text-[#D1D5DB]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5E7EB] bg-white px-6 py-14 sm:py-16">
        <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[1.15fr_1.85fr]">
          <div>
            <Link href="/" className="inline-flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="Superday AI"
                className="h-8 w-auto"
                decoding="async"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#6B7280]">
              Voice-led interview prep for candidates who want sharper reps, cleaner answers,
              and a calmer walk into the room.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/assessment"
                className="inline-flex items-center rounded-full bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#1F2937]"
              >
                Try for free today
              </Link>
              <Link
                href="mailto:support@superdayready.com"
                className="inline-flex items-center rounded-full border border-[#D1D5DB] px-5 py-2.5 text-sm font-medium text-[#4B5563] transition-colors duration-150 hover:border-[#9CA3AF] hover:text-[#111827]"
              >
                support@superdayready.com
              </Link>
            </div>
            <p className="mt-8 text-sm text-[#9CA3AF]">
              © {new Date().getFullYear()} Superday AI. All rights reserved.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-semibold text-[#111827] mb-5">{column.title}</p>
                <ul className="space-y-3.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#6B7280] transition-colors duration-150 hover:text-[#111827]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </footer>
  );
}

import Link from "next/link";

const footerColumns = [
  {
    title: "Product",
    links: [
      { href: "/#about", label: "About" },
      { href: "/assessment", label: "Practice" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/guides", label: "Guides" },
      { href: "/blog", label: "Blog" },
      { href: "mailto:support@superdayready.com", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/refund-policy", label: "Refund policy" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy policy" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-white px-6 py-16 sm:py-20">
      <div className="max-w-5xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1.75fr]">
          {/* Left column */}
          <div>
            <Link href="/" className="inline-flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="Superday AI"
                className="h-7 w-auto"
                decoding="async"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#6B7280]">
              Voice-led interview prep for candidates who want sharper reps,
              cleaner answers, and a calmer walk into the room.
            </p>
            <div className="mt-6">
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 rounded-lg bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#1F2937]"
              >
                Try for free today
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Right columns */}
          <div className="grid gap-10 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-semibold text-[#111827] mb-5">
                  {column.title}
                </p>
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

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-[#F3F4F6] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#9CA3AF]">
            &copy; {new Date().getFullYear()} Superday AI. All rights reserved.
          </p>
          <Link
            href="mailto:support@superdayready.com"
            className="text-sm text-[#9CA3AF] hover:text-[#6B7280] transition-colors duration-150"
          >
            support@superdayready.com
          </Link>
        </div>
      </div>
    </footer>
  );
}

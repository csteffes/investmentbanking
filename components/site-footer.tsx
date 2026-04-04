import Link from "next/link";

const footerColumns = [
  {
    title: "Product",
    links: [
      { href: "/#about", label: "About" },
      { href: "/mock-interview", label: "Practice" },
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
    <footer className="border-t border-[#E5E7EB] bg-[#FCFBF8]">
      <div className="marketing-shell py-16 sm:py-20">
        <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_1.85fr]">
          {/* Left column */}
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="Superday AI"
                className="h-7 w-auto"
                decoding="async"
              />
            </Link>
            <p className="mt-5 text-sm leading-7 text-[#6B7280]">
              AI-led interview practice for candidates who want more reps,
              cleaner answers, and a calmer walk into the room.
            </p>
            <div className="mt-7">
              <Link
                href="/mock-interview"
                className="marketing-primary-cta px-5 py-3 text-sm"
              >
                Start mock interview
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Right columns */}
          <div className="grid gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="mb-5 text-sm font-semibold text-[#111827]">
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
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#EAECEF] pt-8 sm:flex-row">
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

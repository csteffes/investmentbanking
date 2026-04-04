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
    <footer className="border-t border-[rgba(17,24,39,0.08)] bg-[#FCFBF8]">
      <div className="marketing-shell pt-20 pb-12 sm:pt-24 sm:pb-14">
        <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_1.95fr]">
          {/* Left column */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="Superday AI"
                className="h-7 w-auto"
                decoding="async"
              />
            </Link>
            <p className="mt-6 text-sm leading-7 text-[#6B7280]">
              AI-led interview practice for candidates who want more reps,
              cleaner answers, and a calmer walk into the room.
            </p>
          </div>

          {/* Right columns */}
          <div className="grid gap-10 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="mb-4 text-[0.95rem] font-semibold tracking-[-0.01em] text-[#111827]">
                  {column.title}
                </p>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm leading-6 text-[#6B7280] transition-colors duration-150 hover:text-[#111827]"
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
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[rgba(17,24,39,0.08)] pt-7 sm:mt-20 sm:flex-row sm:pt-8">
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

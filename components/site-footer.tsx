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
    <footer className="site-footer">
      <div className="marketing-shell">
        <div className="site-footer__panel">
          <div className="site-footer__main">
            <div className="site-footer__brand">
              <Link href="/" className="site-footer__logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.svg"
                  alt="Superday AI"
                  className="h-7 w-auto"
                  decoding="async"
                />
              </Link>

              <p className="site-footer__copy">
                AI-led interview practice for candidates who want more reps,
                cleaner answers, and a calmer walk into the room.
              </p>
            </div>

            <div className="site-footer__nav">
              {footerColumns.map((column) => (
                <div key={column.title} className="site-footer__column">
                  <p className="site-footer__heading">{column.title}</p>
                  <ul className="site-footer__list">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="site-footer__link">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="site-footer__meta">
            <p className="site-footer__copyright">
              &copy; {new Date().getFullYear()} Superday AI. All rights reserved.
            </p>
            <Link
              href="mailto:support@superdayready.com"
              className="site-footer__support"
            >
              support@superdayready.com
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

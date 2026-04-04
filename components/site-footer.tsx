import Link from "next/link";

export function SiteFooter() {
  const columns = [
    {
      title: "Product",
      links: [
        { href: "/assessment", label: "Assessment" },
        { href: "/#pricing", label: "Pricing" },
      ],
    },
    {
      title: "Resources",
      links: [
        { href: "/guides", label: "Guides" },
        { href: "/blog", label: "Blog" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/#about", label: "About" },
        { href: "mailto:support@superdayready.com", label: "Contact" },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/[0.06] px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <p className="text-base font-semibold text-[#F8F8F8] tracking-tight mb-2">Superday AI</p>
            <p className="text-sm text-[#606060] leading-relaxed max-w-[200px]">
              Voice-led interview prep for investment banking candidates.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#606060] mb-4">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#A0A0A0] hover:text-[#F8F8F8] transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex items-center justify-between">
          <p className="text-xs text-[#606060]">
            © {new Date().getFullYear()} Superday AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

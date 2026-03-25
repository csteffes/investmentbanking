import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.07] px-8 py-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="text-sm font-semibold text-[#F8F8F8] tracking-tight">Superday AI</p>
          <p className="text-xs text-[#606060] mt-0.5">Voice-led interview prep for investment banking candidates.</p>
        </div>
        <nav className="flex items-center gap-4">
          {[
            { href: "/guides", label: "Guides" },
            { href: "/blog", label: "Blog" },
            { href: "/assessment", label: "Assessment" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs text-[#606060] hover:text-[#A0A0A0] transition-colors duration-150"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

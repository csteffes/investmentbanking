import Link from "next/link";

import { navigation } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-6 px-8 h-14 bg-[#0A0A0A]/95 border-b border-white/[0.07] backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2.5 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="Superday AI"
          className="h-6 w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-150"
          decoding="async"
        />
      </Link>

      <nav className="flex items-center gap-1" aria-label="Primary">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-3 py-1.5 text-sm text-[#A0A0A0] hover:text-[#F8F8F8] rounded-md transition-colors duration-150"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

import Link from "next/link";

import { navigation } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
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
              className="px-3.5 py-2 text-sm text-[#A0A0A0] hover:text-[#F8F8F8] rounded-md transition-colors duration-150"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/assessment"
            className="ml-4 px-5 py-2 rounded-lg bg-[#C9A227] text-[#0A0A0A] text-sm font-semibold hover:bg-[#E8BC30] transition-all duration-150"
          >
            Try for free
          </Link>
        </nav>
      </div>
    </header>
  );
}

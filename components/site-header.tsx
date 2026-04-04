import Link from "next/link";

import { navigation } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#F3F4F6]">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 h-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Superday AI"
            className="h-6 w-auto"
            decoding="async"
          />
        </Link>

        <nav className="flex items-center gap-1" aria-label="Primary">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3.5 py-2 text-sm text-[#6B7280] hover:text-[#111827] rounded-md transition-colors duration-150"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/assessment"
            className="ml-4 px-5 py-2.5 rounded-lg bg-[#111827] text-white text-sm font-semibold hover:bg-[#1F2937] transition-all duration-150"
          >
            Try for free today
          </Link>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";

import { navigation } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#F3F4F6] bg-white/88 backdrop-blur-xl">
      <div className="marketing-shell flex h-[4.5rem] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Superday AI"
            className="h-6 w-auto"
            decoding="async"
          />
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-[#6B7280] transition-colors duration-150 hover:text-[#111827]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/mock-interview"
            className="marketing-secondary-cta px-4 py-2.5 text-sm font-semibold"
          >
            Start mock interview
          </Link>
        </div>
      </div>
    </header>
  );
}

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

        <nav
          className="flex items-center justify-end gap-3 text-[13px] font-medium text-[#6B7280] sm:gap-5 sm:text-sm md:gap-7"
          aria-label="Primary"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="leading-none transition-colors duration-150 hover:text-[#111827]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

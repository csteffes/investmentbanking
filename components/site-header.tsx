import Link from "next/link";

import { navigation } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <img alt="Superday AI" className="brand-logo" decoding="async" src="/logo.svg" />
      </Link>

      <nav className="site-nav" aria-label="Primary">
        {navigation.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <Link className="button button-primary button-nav" href="/assessment">
        Try for Free Today
      </Link>
    </header>
  );
}

import Link from "next/link";

import { navigation } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-mark">SA</span>
        <span className="brand-copy">
          <strong>Superday AI</strong>
          <span>Investment Banking Interview Prep</span>
        </span>
      </Link>

      <nav className="site-nav" aria-label="Primary">
        {navigation.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <Link className="button button-primary button-nav" href="/assessment">
        Start assessment
      </Link>
    </header>
  );
}

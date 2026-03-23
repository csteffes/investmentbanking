import Link from "next/link";

import { navigation } from "@/lib/site";

export function AppSidebar() {
  return (
    <aside className="app-sidebar">
      <Link className="sidebar-brand" href="/">
        <img alt="Superday AI" className="sidebar-logo" decoding="async" src="/logo.svg" />
      </Link>

      <nav className="sidebar-nav" aria-label="Primary">
        {navigation.map((item) => (
          <Link className="sidebar-nav-link" href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-divider" />
        <Link className="sidebar-cta" href="/assessment">
          Try for Free Today
        </Link>
      </div>
    </aside>
  );
}

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function isChromelessPath(pathname: string | null) {
  if (!pathname) {
    return false;
  }

  return (
    pathname === "/login" ||
    pathname === "/create-account" ||
    pathname.startsWith("/auth/")
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (isChromelessPath(pathname)) {
    return <div className="flex-1">{children}</div>;
  }

  return (
    <>
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </>
  );
}

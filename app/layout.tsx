import type { ReactNode } from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { AuthSyncProvider } from "@/components/auth-sync-provider";
import { SiteChrome } from "@/components/site-chrome";
import { seoKeywords, site } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Investment Banking Interview Prep`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: seoKeywords,
  applicationName: site.name,
  manifest: "/site.webmanifest",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-white text-[#111827] font-sans min-h-dvh flex flex-col antialiased">
        <AuthSyncProvider>
          <SiteChrome>{children}</SiteChrome>
        </AuthSyncProvider>
      </body>
    </html>
  );
}

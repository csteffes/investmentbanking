import type { ReactNode } from "react";

type LegalPageProps = {
  title: string;
  updated: string;
  children: ReactNode;
};

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <main className="px-6 py-24 sm:py-28">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A227] mb-4">
          Legal
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#111827] mb-4">
          {title}
        </h1>
        <p className="text-sm text-[#9CA3AF] mb-10">Last updated {updated}</p>
        <div className="space-y-8 text-[#4B5563] leading-8">
          {children}
        </div>
      </div>
    </main>
  );
}

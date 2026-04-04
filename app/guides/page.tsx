import type { Metadata } from "next";
import Link from "next/link";

import { formatDate, getCollection } from "@/lib/content";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Investment banking interview prep guides covering superday preparation, technical questions, behavioral frameworks, resume walkthroughs, and why investment banking.",
};

export default async function GuidesIndexPage() {
  const guides = await getCollection("guides");

  return (
    <main className="px-6 py-20 max-w-4xl mx-auto">
      <section className="text-center mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A227] mb-4">Guides</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] mb-3">
          Deep-dive guides for every stage of the interview process.
        </h1>
        <p className="text-[#6B7280] max-w-xl mx-auto leading-relaxed">
          Pillar content on the topics that matter most — from the technical core to superday preparation.
          Read the guide, then run it in a live mock.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-5">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-6 hover:border-[#D1D5DB] hover:-translate-y-0.5 transition-all duration-150 block"
          >
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-2">
              {formatDate(guide.date)} · {guide.readingTime}
            </p>
            <h2 className="text-sm font-semibold text-[#111827] leading-snug mb-2">{guide.title}</h2>
            <p className="text-xs text-[#9CA3AF] leading-relaxed line-clamp-3">{guide.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

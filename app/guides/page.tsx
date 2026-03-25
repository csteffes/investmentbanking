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
    <main className="px-6 py-16 max-w-4xl mx-auto">
      <section className="mb-12">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#C9A227] mb-4">Guides</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8F8F8] mb-3">
          Deep-dive guides for every stage of the interview process.
        </h1>
        <p className="text-[#A0A0A0] max-w-xl leading-relaxed">
          Pillar content on the topics that matter most — from the technical core to superday preparation.
          Read the guide, then practice it live.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-4">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="bg-[#111111] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.15] hover:-translate-y-px transition-all duration-150 block"
          >
            <p className="text-[10px] text-[#606060] uppercase tracking-wide mb-2">
              {formatDate(guide.date)} · {guide.readingTime}
            </p>
            <h2 className="text-sm font-semibold text-[#F8F8F8] leading-snug mb-2">{guide.title}</h2>
            <p className="text-xs text-[#606060] leading-relaxed line-clamp-3">{guide.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

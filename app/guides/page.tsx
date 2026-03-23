import type { Metadata } from "next";
import Link from "next/link";

import { formatDate, getCollection } from "@/lib/content";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Pillar guides for investment banking interview questions, superday prep, technical questions, and the answers candidates need most."
};

export default async function GuidesIndexPage() {
  const guides = await getCollection("guides");

  return (
    <main className="content-main">
      <section className="section page-intro">
        <p className="section-kicker">Guides</p>
        <h1>Pillar content for the highest-intent interview prep searches.</h1>
        <p>
          Start here for the topics candidates search most: interview questions, superday prep, technicals, and the
          answers that shape first impressions.
        </p>
      </section>

      <section className="section">
        <div className="content-grid">
          {guides.map((guide) => (
            <Link className="resource-card" href={`/guides/${guide.slug}`} key={guide.slug}>
              <p className="resource-date">{formatDate(guide.date)} · {guide.readingTime}</p>
              <h2>{guide.title}</h2>
              <p>{guide.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

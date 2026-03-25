import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleLayout } from "@/components/article-layout";
import { getAllSlugs, getEntry } from "@/lib/content";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllSlugs("guides");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntry("guides", slug);
  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.description,
    keywords: entry.keywords,
    alternates: { canonical: `/guides/${entry.slug}` },
    openGraph: {
      title: entry.title,
      description: entry.description,
      url: `${site.url}/guides/${entry.slug}`,
      type: "article",
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const entry = await getEntry("guides", slug);
  if (!entry) notFound();

  return <ArticleLayout entry={entry} kind="guides" />;
}

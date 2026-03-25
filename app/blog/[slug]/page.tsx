import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleLayout } from "@/components/article-layout";
import { getAllSlugs, getEntry } from "@/lib/content";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllSlugs("blog");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntry("blog", slug);
  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.description,
    keywords: entry.keywords,
    alternates: { canonical: `/blog/${entry.slug}` },
    openGraph: {
      title: entry.title,
      description: entry.description,
      url: `${site.url}/blog/${entry.slug}`,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const entry = await getEntry("blog", slug);
  if (!entry) notFound();

  return <ArticleLayout entry={entry} kind="blog" />;
}

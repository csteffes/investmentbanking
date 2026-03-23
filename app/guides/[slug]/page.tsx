import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "@/components/mdx-components";
import { formatDate, getAllSlugs, getEntry } from "@/lib/content";
import { site } from "@/lib/site";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getAllSlugs("guides");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const entry = await getEntry("guides", slug);

  if (!entry) {
    return {};
  }

  return {
    title: entry.title,
    description: entry.description,
    keywords: entry.keywords,
    alternates: {
      canonical: `/guides/${entry.slug}`
    },
    openGraph: {
      title: entry.title,
      description: entry.description,
      url: `${site.url}/guides/${entry.slug}`,
      type: "article"
    }
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = params;
  const entry = await getEntry("guides", slug);

  if (!entry) {
    notFound();
  }

  const { content } = await compileMDX({
    source: entry.source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm]
      }
    }
  });

  return (
    <main className="content-main">
      <article className="article-shell">
        <header className="section page-intro">
          <p className="section-kicker">Guide</p>
          <h1>{entry.title}</h1>
          <p>{entry.description}</p>
          <div className="article-meta">
            <span>{formatDate(entry.date)}</span>
            <span>{entry.readingTime}</span>
          </div>
        </header>

        <div className="article-layout">
          <aside className="article-sidebar">
            <div className="toc-card">
              <p className="brief-label">On this page</p>
              <ul className="toc-list">
                {entry.headings.map((heading) => (
                  <li className={`toc-item toc-item--${heading.depth}`} key={heading.id}>
                    <a href={`#${heading.id}`}>{heading.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="article-body">{content}</div>
        </div>
      </article>
    </main>
  );
}

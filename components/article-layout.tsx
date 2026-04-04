import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "@/components/mdx-components";
import { formatDate } from "@/lib/content";
import type { ContentEntry } from "@/lib/content";

type ArticleLayoutProps = {
  entry: ContentEntry;
  kind: "blog" | "guides";
};

export async function ArticleLayout({ entry, kind }: ArticleLayoutProps) {
  const { content } = await compileMDX({
    source: entry.source,
    components: mdxComponents,
    options: {
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
  });

  const kicker = kind === "blog" ? "Blog" : "Guide";

  return (
    <main className="article-shell">
      <article className="article-frame">
        <header className="article-header">
          <p className="article-kicker">{kicker}</p>
          <h1 className="article-title">{entry.title}</h1>
          <p className="article-dek">{entry.description}</p>
          <div className="article-meta" aria-label="Article details">
            <time dateTime={entry.date}>{formatDate(entry.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{entry.readingTime}</span>
          </div>
        </header>

        <div className="article-prose">{content}</div>
      </article>
    </main>
  );
}

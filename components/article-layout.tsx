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
    <main className="px-6 py-16 max-w-5xl mx-auto">
      <article>
        <header className="mb-12 max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#C9A227] mb-4">
            {kicker}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8F8F8] leading-[1.1] mb-4">
            {entry.title}
          </h1>
          <p className="text-[#A0A0A0] text-base leading-relaxed mb-5">{entry.description}</p>
          <div className="flex items-center gap-4 text-xs text-[#606060]">
            <span>{formatDate(entry.date)}</span>
            <span>·</span>
            <span>{entry.readingTime}</span>
          </div>
        </header>

        <div className="flex gap-12 items-start">
          {/* TOC */}
          {entry.headings.length > 0 && (
            <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-20">
              <div className="bg-[#111111] border border-white/[0.08] rounded-xl p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#606060] mb-3">
                  On this page
                </p>
                <ul className="space-y-1.5">
                  {entry.headings.map((heading) => (
                    <li
                      key={heading.id}
                      className={heading.depth === 3 ? "pl-3" : ""}
                    >
                      <a
                        href={`#${heading.id}`}
                        className="text-xs text-[#606060] hover:text-[#A0A0A0] transition-colors duration-150 leading-relaxed block"
                      >
                        {heading.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}

          {/* Body */}
          <div className="flex-1 min-w-0 max-w-2xl">{content}</div>
        </div>
      </article>
    </main>
  );
}

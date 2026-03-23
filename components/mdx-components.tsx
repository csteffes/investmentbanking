import type { MDXComponents } from "mdx/types";
import Link from "next/link";

import { ArticleCTA } from "@/components/article-cta";

export const mdxComponents: MDXComponents = {
  h2: (props) => <h2 className="prose-h2" {...props} />,
  h3: (props) => <h3 className="prose-h3" {...props} />,
  p: (props) => <p className="prose-p" {...props} />,
  ul: (props) => <ul className="prose-list" {...props} />,
  ol: (props) => <ol className="prose-list prose-list-numbered" {...props} />,
  li: (props) => <li className="prose-li" {...props} />,
  blockquote: (props) => <blockquote className="prose-quote" {...props} />,
  hr: (props) => <hr className="prose-rule" {...props} />,
  strong: (props) => <strong className="prose-strong" {...props} />,
  a: ({ href = "", ...props }) => {
    const external = href.startsWith("http");

    if (external) {
      return <a className="prose-link" href={href} rel="noreferrer" target="_blank" {...props} />;
    }

    return <Link className="prose-link" href={href} {...props} />;
  },
  ArticleCTA
};

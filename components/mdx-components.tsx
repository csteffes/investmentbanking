import type { ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";

import { ArticleCTA } from "@/components/article-cta";

function flattenText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(flattenText).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    return flattenText(node.props.children as ReactNode);
  }

  return "";
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export const mdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2 className="prose-h2" id={slugifyHeading(flattenText(children))} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="prose-h3" id={slugifyHeading(flattenText(children))} {...props}>
      {children}
    </h3>
  ),
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

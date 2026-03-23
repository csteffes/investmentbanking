import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";

import { ArticleCTA } from "@/components/article-cta";

// Renders JSON-LD structured data directly in the document body.
// Usage in MDX: <JsonLd schema={{ "@context": "https://schema.org", ... }} />
function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

function flattenText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(flattenText).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    return flattenText(props?.children ?? "");
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

export const mdxComponents = {
  h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="prose-h2" id={slugifyHeading(flattenText(children))} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="prose-h3" id={slugifyHeading(flattenText(children))} {...props}>
      {children}
    </h3>
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => <p className="prose-p" {...props} />,
  ul: (props: ComponentPropsWithoutRef<"ul">) => <ul className="prose-list" {...props} />,
  ol: (props: ComponentPropsWithoutRef<"ol">) => <ol className="prose-list prose-list-numbered" {...props} />,
  li: (props: ComponentPropsWithoutRef<"li">) => <li className="prose-li" {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => <blockquote className="prose-quote" {...props} />,
  hr: (props: ComponentPropsWithoutRef<"hr">) => <hr className="prose-rule" {...props} />,
  strong: (props: ComponentPropsWithoutRef<"strong">) => <strong className="prose-strong" {...props} />,
  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) => {
    const external = href.startsWith("http");

    if (external) {
      return <a className="prose-link" href={href} rel="noreferrer" target="_blank" {...props} />;
    }

    return <Link className="prose-link" href={href} {...props} />;
  },
  ArticleCTA,
  JsonLd
};

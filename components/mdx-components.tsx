import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";

import { slugifyHeading } from "@/lib/utils";
import { ArticleCTA } from "@/components/article-cta";

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

export const mdxComponents = {
  h2: ({ children, className, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2 className={clsx("article-h2", className)} id={slugifyHeading(flattenText(children))} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, className, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3 className={clsx("article-h3", className)} id={slugifyHeading(flattenText(children))} {...props}>
      {children}
    </h3>
  ),
  p: ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p className={clsx("article-p", className)} {...props} />
  ),
  ul: ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul className={clsx("article-list", className)} {...props} />
  ),
  ol: ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol className={clsx("article-list", "article-list-numbered", className)} {...props} />
  ),
  li: ({ className, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li className={clsx("article-li", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className={clsx("article-quote", className)} {...props} />
  ),
  hr: ({ className, ...props }: ComponentPropsWithoutRef<"hr">) => (
    <hr className={clsx("article-rule", className)} {...props} />
  ),
  strong: ({ className, ...props }: ComponentPropsWithoutRef<"strong">) => (
    <strong className={clsx("article-strong", className)} {...props} />
  ),
  a: ({ href = "", className, ...props }: ComponentPropsWithoutRef<"a">) => {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a
          className={clsx("article-link", className)}
          href={href}
          rel="noreferrer"
          target="_blank"
          {...props}
        />
      );
    }
    return <Link className={clsx("article-link", className)} href={href} {...props} />;
  },
  ArticleCTA,
  JsonLd,
};

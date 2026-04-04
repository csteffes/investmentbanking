import type { Metadata } from "next";

import { CollectionIndex } from "@/components/collection-index";
import { getCollection } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Investment banking interview prep articles focused on superdays, technical questions, behavioral answers, and banker-style follow-ups.",
};

export default async function BlogIndexPage() {
  const posts = await getCollection("blog");

  return (
    <CollectionIndex
      label="Blog"
      title="Interview prep writing with real hierarchy, not a dump of links."
      description="A sharper editorial library for the questions candidates actually search, the stories they need to tighten, and the final-round moments that decide outcomes."
      kind="blog"
      items={posts}
    />
  );
}

import type { Metadata } from "next";

import { CollectionIndex } from "@/components/collection-index";
import { getCollection } from "@/lib/content";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Investment banking interview prep guides covering superday preparation, technical questions, behavioral frameworks, resume walkthroughs, and why investment banking.",
};

export default async function GuidesIndexPage() {
  const guides = await getCollection("guides");

  return (
    <CollectionIndex
      label="Guides"
      title="The core library for every stage of banking interview prep."
      description="Long-form guides for the buckets that matter most: technicals, behavioral answers, resume framing, and the pressure points that show up when the room gets harder."
      kind="guides"
      items={guides}
    />
  );
}

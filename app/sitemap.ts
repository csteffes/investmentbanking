import type { MetadataRoute } from "next";

import { getCollection } from "@/lib/content";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blog, guides] = await Promise.all([getCollection("blog"), getCollection("guides")]);

  return [
    {
      url: site.url,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${site.url}/assessment`,
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${site.url}/blog`,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${site.url}/guides`,
      changeFrequency: "weekly",
      priority: 0.85
    },
    ...blog.map((item) => ({
      url: `${site.url}/blog/${item.slug}`,
      lastModified: item.date,
      changeFrequency: "monthly" as const,
      priority: 0.7
    })),
    ...guides.map((item) => ({
      url: `${site.url}/guides/${item.slug}`,
      lastModified: item.date,
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}

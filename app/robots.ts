import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/blog", "/guides", "/mock-interview"]
    },
    sitemap: `${site.url}/sitemap.xml`
  };
}

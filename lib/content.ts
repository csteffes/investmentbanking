import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { formatDate } from "@/lib/utils";

export { formatDate };

export type ContentKind = "blog" | "guides";

export type ContentMeta = {
  slug: string;
  kind: ContentKind;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  keywords: string[];
  featured?: boolean;
};

export type ContentEntry = ContentMeta & {
  source: string;
};

const CONTENT_ROOT = path.join(process.cwd(), "content");

function mapMeta(kind: ContentKind, slug: string, raw: Record<string, unknown>): ContentMeta {
  return {
    slug,
    kind,
    title: String(raw.title),
    description: String(raw.description),
    date: String(raw.date),
    readingTime: String(raw.readingTime),
    keywords: Array.isArray(raw.keywords) ? raw.keywords.map(String) : [],
    featured: Boolean(raw.featured),
  };
}

async function readDirectory(kind: ContentKind) {
  const directory = path.join(CONTENT_ROOT, kind);
  const files = await fs.readdir(directory);
  return files.filter((file) => file.endsWith(".mdx"));
}

export async function getCollection(kind: ContentKind): Promise<ContentMeta[]> {
  const files = await readDirectory(kind);
  const items = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const fullPath = path.join(CONTENT_ROOT, kind, file);
      const raw = await fs.readFile(fullPath, "utf8");
      const { data } = matter(raw);
      return mapMeta(kind, slug, data as Record<string, unknown>);
    })
  );

  return items.sort((left, right) => {
    if (left.featured && !right.featured) return -1;
    if (!left.featured && right.featured) return 1;
    return new Date(right.date).getTime() - new Date(left.date).getTime();
  });
}

export async function getEntry(kind: ContentKind, slug: string): Promise<ContentEntry | null> {
  const fullPath = path.join(CONTENT_ROOT, kind, `${slug}.mdx`);

  try {
    const raw = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(raw);
    const meta = mapMeta(kind, slug, data as Record<string, unknown>);

    return {
      ...meta,
      source: content,
    };
  } catch {
    return null;
  }
}

export async function getAllSlugs(kind: ContentKind) {
  const items = await getCollection(kind);
  return items.map((item) => item.slug);
}

export async function getLatestEntries(kind: ContentKind, limit = 3) {
  const items = await getCollection(kind);
  return items.slice(0, limit);
}

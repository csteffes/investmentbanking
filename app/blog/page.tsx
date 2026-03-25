import type { Metadata } from "next";
import Link from "next/link";

import { formatDate, getCollection } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Investment banking interview prep articles focused on superdays, technical questions, behavioral answers, and banker-style interview judgment.",
};

export default async function BlogIndexPage() {
  const posts = await getCollection("blog");

  return (
    <main className="px-6 py-16 max-w-4xl mx-auto">
      <section className="mb-12">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#C9A227] mb-4">Blog</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8F8F8] mb-3">
          Interview prep posts built for search and real practice.
        </h1>
        <p className="text-[#A0A0A0] max-w-xl leading-relaxed">
          These posts answer the questions candidates actually search before first rounds and superdays,
          then push you into the next practice rep.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="bg-[#111111] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.15] hover:-translate-y-px transition-all duration-150 block"
          >
            <p className="text-[10px] text-[#606060] uppercase tracking-wide mb-2">
              {formatDate(post.date)} · {post.readingTime}
            </p>
            <h2 className="text-sm font-semibold text-[#F8F8F8] leading-snug mb-2">{post.title}</h2>
            <p className="text-xs text-[#606060] leading-relaxed line-clamp-3">{post.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { formatDate, getCollection } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Investment banking interview prep articles focused on superdays, technical questions, behavioral answers, and banker-style follow-ups.",
};

export default async function BlogIndexPage() {
  const posts = await getCollection("blog");

  return (
    <main className="px-6 py-20 max-w-4xl mx-auto">
      <section className="text-center mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C9A227] mb-4">Blog</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] mb-3">
          Interview prep posts built for search and real practice.
        </h1>
        <p className="text-[#6B7280] max-w-xl mx-auto leading-relaxed">
          These posts answer the questions candidates actually search before first rounds and superdays,
          then push you into the next mock interview rep.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-5">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-6 hover:border-[#D1D5DB] hover:-translate-y-0.5 transition-all duration-150 block"
          >
            <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mb-2">
              {formatDate(post.date)} · {post.readingTime}
            </p>
            <h2 className="text-sm font-semibold text-[#111827] leading-snug mb-2">{post.title}</h2>
            <p className="text-xs text-[#9CA3AF] leading-relaxed line-clamp-3">{post.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

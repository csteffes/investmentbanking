import type { Metadata } from "next";
import Link from "next/link";

import { formatDate, getCollection } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Investment banking interview prep articles focused on superdays, technical questions, behavioral answers, and banker-style interview judgment."
};

export default async function BlogIndexPage() {
  const posts = await getCollection("blog");

  return (
    <main className="content-main">
      <section className="section page-intro">
        <p className="section-kicker">Blog</p>
        <h1>Interview prep posts built for search and real practice.</h1>
        <p>
          These posts answer the questions candidates actually search before first rounds and superdays, then push
          you into the next practice rep.
        </p>
      </section>

      <section className="section">
        <div className="content-grid">
          {posts.map((post) => (
            <Link className="resource-card" href={`/blog/${post.slug}`} key={post.slug}>
              <p className="resource-date">{formatDate(post.date)} · {post.readingTime}</p>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

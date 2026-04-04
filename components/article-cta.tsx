import Link from "next/link";

export function ArticleCTA() {
  return (
    <aside className="article-cta">
      <p className="article-cta-label">Next step</p>
      <h3 className="article-cta-title">Practice the answer out loud.</h3>
      <p className="article-cta-copy">
        Read the framework, then run it live with the interviewer so you know how it sounds under follow-up.
      </p>
      <Link href="/mock-interview" className="article-cta-button">
        Open mock interview
      </Link>
    </aside>
  );
}

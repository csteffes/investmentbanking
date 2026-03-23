import Link from "next/link";

export function ArticleCTA() {
  return (
    <aside className="article-cta">
      <p className="article-cta-label">Next step</p>
      <h3>Practice the answer out loud.</h3>
      <p>
        Read the framework, then pressure test it in a live mock so you know what holds up under follow-up.
      </p>
      <Link className="button button-primary" href="/assessment">
        Open the assessment
      </Link>
    </aside>
  );
}

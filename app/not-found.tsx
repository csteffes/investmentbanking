import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="content-main">
      <section className="section page-intro">
        <p className="section-kicker">Not found</p>
        <h1>That page is not here.</h1>
        <p>The guide or post may have moved. You can head back to the home page or browse the resource hub.</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/">
            Go home
          </Link>
          <Link className="button button-secondary" href="/guides">
            Browse guides
          </Link>
        </div>
      </section>
    </main>
  );
}

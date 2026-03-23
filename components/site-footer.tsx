import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="footer-brand">Superday AI</p>
        <p className="footer-copy">Voice-led interview prep for investment banking candidates.</p>
      </div>
      <div className="footer-links">
        <Link href="/guides">Guides</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/assessment">Assessment</Link>
      </div>
    </footer>
  );
}

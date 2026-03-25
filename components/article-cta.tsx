import Link from "next/link";

export function ArticleCTA() {
  return (
    <aside className="article-cta my-8">
      <p className="article-cta-label">Next step</p>
      <h3 className="text-base font-semibold text-[#F8F8F8] mt-1 mb-1.5 tracking-tight">
        Practice the answer out loud.
      </h3>
      <p className="text-sm text-[#A0A0A0] mb-4 leading-relaxed">
        Read the framework, then pressure test it in a live mock so you know what holds up under follow-up.
      </p>
      <Link
        href="/assessment"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C9A227] text-[#0A0A0A] text-sm font-semibold hover:bg-[#E8BC30] transition-colors duration-150"
      >
        Open the assessment
      </Link>
    </aside>
  );
}

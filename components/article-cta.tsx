import Link from "next/link";

export function ArticleCTA() {
  return (
    <aside className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-6 my-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#C9A227] mb-2">Next step</p>
      <h3 className="text-base font-semibold text-[#111827] mt-1 mb-1.5 tracking-tight">
        Practice the answer out loud.
      </h3>
      <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">
        Read the framework, then pressure test it in a live mock so you know what holds up under follow-up.
      </p>
      <Link
        href="/assessment"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111827] text-white text-sm font-semibold hover:bg-[#1F2937] transition-colors duration-150"
      >
        Open the assessment
      </Link>
    </aside>
  );
}

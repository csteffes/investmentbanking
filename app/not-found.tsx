import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C9A227] mb-4">
          Not found
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[#F8F8F8] mb-3">
          That page is not here.
        </h1>
        <p className="text-[#A0A0A0] mb-8 leading-relaxed">
          The guide or post may have moved. Head back home or browse the resource hub.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg bg-[#C9A227] text-[#0A0A0A] text-sm font-semibold hover:bg-[#E8BC30] transition-colors duration-150"
          >
            Go home
          </Link>
          <Link
            href="/guides"
            className="px-5 py-2.5 rounded-lg bg-[#1A1A1A] border border-white/[0.1] text-sm text-[#F8F8F8] hover:border-white/20 transition-colors duration-150"
          >
            Browse guides
          </Link>
        </div>
      </div>
    </main>
  );
}

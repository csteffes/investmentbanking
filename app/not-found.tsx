import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#C9A227] mb-4">
          Not found
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[#111827] mb-3">
          That page is not here.
        </h1>
        <p className="text-[#6B7280] mb-8 leading-relaxed">
          The guide or post may have moved. Head back home or browse the resource hub.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg bg-[#111827] text-white text-sm font-semibold hover:bg-[#1F2937] transition-colors duration-150"
          >
            Go home
          </Link>
          <Link
            href="/guides"
            className="px-5 py-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-sm text-[#111827] hover:border-[#D1D5DB] transition-colors duration-150"
          >
            Browse guides
          </Link>
        </div>
      </div>
    </main>
  );
}

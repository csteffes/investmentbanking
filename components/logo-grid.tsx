import type { LogoItem } from "@/lib/site";

type LogoGridProps = {
  label: string;
  logos: readonly LogoItem[];
};

export function LogoGrid({ label, logos }: LogoGridProps) {
  return (
    <section className="px-6 py-14 border-y border-[#F3F4F6]">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-sm text-[#9CA3AF] mb-8">{label}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {logos.map((logo) => (
            <span key={logo.src} className={`flex-shrink-0 ${logo.className ?? ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={logo.alt}
                className="logo-grid-image"
                decoding="async"
                src={logo.src}
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

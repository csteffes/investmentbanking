import type { LogoItem } from "@/lib/site";

type LogoGridProps = {
  label: string;
  logos: readonly LogoItem[];
};

export function LogoGrid({ label, logos }: LogoGridProps) {
  return (
    <section className="w-full px-6 py-12 border-y border-[#F3F4F6]">
      <div className="w-full max-w-[960px] mx-auto text-center">
        <p className="text-sm text-[#9CA3AF] mb-8">{label}</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 items-center justify-items-center gap-y-8 gap-x-6">
          {logos.map((logo) => (
            <div
              key={logo.src}
              className={`flex items-center justify-center ${logo.className ?? ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={logo.alt}
                className="logo-grid-image"
                decoding="async"
                src={logo.src}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

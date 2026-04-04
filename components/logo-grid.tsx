import type { LogoItem } from "@/lib/site";

type LogoGridProps = {
  label: string;
  logos: readonly LogoItem[];
};

export function LogoGrid({ label, logos }: LogoGridProps) {
  return (
    <section className="logo-band">
      <div className="marketing-shell">
        <div className="logo-band__intro">
          <p className="logo-band__label">{label}</p>
          <div className="logo-band__grid">
            {logos.map((logo) => (
              <div
                key={logo.src}
                className={`logo-band__item ${logo.className ?? ""}`}
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
      </div>
    </section>
  );
}

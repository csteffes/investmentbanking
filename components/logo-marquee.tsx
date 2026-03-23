import type { LogoItem } from "@/lib/site";

type LogoMarqueeProps = {
  label: string;
  logos: readonly LogoItem[];
  ariaLabel?: string;
  variant?: "dark" | "light";
  compact?: boolean;
};

export function LogoMarquee({
  label,
  logos,
  ariaLabel,
  variant = "dark",
  compact = false
}: LogoMarqueeProps) {
  const className = ["trust-band", `trust-band--${variant}`, compact ? "trust-band--compact" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={className} aria-label={ariaLabel ?? label}>
      <p className="trust-band-label">{label}</p>
      <div className="logo-carousel">
        <div className="logo-track">
          {[0, 1].map((setIndex) => (
            <div className="logo-set" aria-hidden={setIndex === 1} key={setIndex}>
              {logos.map((logo) => (
                <span className={["logo-card", logo.className].filter(Boolean).join(" ")} key={`${setIndex}-${logo.src}`}>
                  <img
                    alt={setIndex === 1 ? "" : logo.alt}
                    className="logo-card-image"
                    decoding="async"
                    src={logo.src}
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
  compact = false,
}: LogoMarqueeProps) {
  const isLight = variant === "light";
  const sectionClasses = [
    "logo-marquee overflow-hidden",
    isLight
      ? "logo-marquee--light border-y border-[#DCE5F1] bg-[#FBFCFE]"
      : "logo-marquee--dark border-y border-white/[0.07] bg-[#0A0A0A]",
    compact ? "py-6" : "py-8",
  ].join(" ");
  const pillClasses = [
    "logo-marquee-pill",
    isLight ? "logo-marquee-pill--light" : "logo-marquee-pill--dark",
  ].join(" ");

  return (
    <section className={sectionClasses} aria-label={ariaLabel ?? label}>
      <div className="logo-marquee-shell">
        <p className={pillClasses}>{label}</p>
        <div className="logo-marquee-window">
          <div className="logo-track">
            {[0, 1].map((setIndex) => (
              <div className="logo-set" aria-hidden={setIndex === 1} key={setIndex}>
                {logos.map((logo) => (
                  <span
                    className={["logo-card", logo.className].filter(Boolean).join(" ")}
                    key={`${setIndex}-${logo.src}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
      </div>
    </section>
  );
}

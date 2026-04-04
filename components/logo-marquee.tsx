import type { LogoItem } from "@/lib/site";

type LogoMarqueeProps = {
  label: string;
  logos: readonly LogoItem[];
  ariaLabel?: string;
  variant?: "dark" | "light";
};

export function LogoMarquee({
  label,
  logos,
  ariaLabel,
  variant = "light",
}: LogoMarqueeProps) {
  const isLight = variant === "light";

  return (
    <section
      className={[
        "py-14 overflow-hidden",
        isLight
          ? "logo-marquee--light border-y border-[#F3F4F6] bg-white"
          : "logo-marquee--dark border-y border-white/[0.06] bg-[#0A0A0A]",
      ].join(" ")}
      aria-label={ariaLabel ?? label}
    >
      <div className="logo-marquee-shell">
        <p
          className={[
            "logo-marquee-pill",
            isLight ? "logo-marquee-pill--light" : "logo-marquee-pill--dark",
          ].join(" ")}
        >
          {label}
        </p>
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

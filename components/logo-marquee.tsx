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
  const bg = variant === "light"
    ? "bg-[#0A0A0A] border-white/[0.07]"
    : "bg-[#0A0A0A] border-white/[0.07]";

  return (
    <section
      className={`${bg} border-y py-${compact ? "6" : "8"} overflow-hidden`}
      aria-label={ariaLabel ?? label}
    >
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#606060] mb-5">
        {label}
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
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
    </section>
  );
}

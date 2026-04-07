import type { LogoItem } from "@/lib/site";

type EmployerLogoMarqueeProps = {
  label: string;
  logos: readonly LogoItem[];
};

export function EmployerLogoMarquee({
  label,
  logos,
}: EmployerLogoMarqueeProps) {
  return (
    <div className="hero-jobs-marquee">
      <p className="hero-jobs-marquee__label">{label}</p>

      <div className="hero-jobs-marquee__viewport">
        <div className="hero-jobs-marquee__track">
          {[0, 1].map((copyIndex) => (
            <ul
              key={copyIndex}
              className={`hero-jobs-marquee__group${
                copyIndex === 1 ? " hero-jobs-marquee__group--duplicate" : ""
              }`}
              aria-hidden={copyIndex === 1}
            >
              {logos.map((logo) => (
                <li
                  key={`${copyIndex}-${logo.src}`}
                  className={`hero-jobs-marquee__item ${logo.className ?? ""}`}
                >
                  <span className="hero-jobs-marquee__slot">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={logo.alt}
                      className="hero-jobs-marquee__image"
                      decoding="async"
                      src={logo.src}
                    />
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

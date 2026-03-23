import { schoolLogos } from "@/lib/site";

export function LogoMarquee() {
  return (
    <section className="trust-band" aria-label="Trusted by students from top schools">
      <p className="section-kicker">Trusted by Students From</p>
      <div className="logo-carousel">
        <div className="logo-track">
          {[0, 1].map((setIndex) => (
            <div className="logo-set" aria-hidden={setIndex === 1} key={setIndex}>
              {schoolLogos.map((logo) => (
                <span className={`school-logo ${logo.className}`} key={`${setIndex}-${logo.src}`}>
                  <img
                    alt={setIndex === 1 ? "" : logo.alt}
                    className="school-logo-image"
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

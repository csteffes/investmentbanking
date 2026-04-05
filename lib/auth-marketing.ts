export type AuthMarqueeLogo = {
  alt: string;
  src: string;
};

export const authValueProps = [
  {
    title: "Save $200/hr",
    description: "Compared to traditional coaching",
  },
  {
    title: "Live reps",
    description: "Practice banker-style follow-ups before the real room",
  },
  {
    title: "Anytime",
    description: "Run focused mocks on your schedule without coordination",
  },
] as const;

export const authMarqueeLogos: readonly AuthMarqueeLogo[] = [
  {
    alt: "Goldman Sachs logo",
    src: "/assets/logos/goldman-sachs.svg",
  },
  {
    alt: "J.P. Morgan logo",
    src: "/assets/logos/jp-morgan-brown.svg",
  },
  {
    alt: "Morgan Stanley logo",
    src: "/assets/logos/morgan-stanley.svg",
  },
  {
    alt: "Lazard logo",
    src: "/assets/logos/lazard-new.svg",
  },
  {
    alt: "Jefferies logo",
    src: "/assets/logos/jefferies.svg",
  },
  {
    alt: "Bank of America logo",
    src: "/assets/logos/bank-of-america.svg",
  },
] as const;

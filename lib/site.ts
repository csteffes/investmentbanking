export const site = {
  name: "Superday AI",
  shortName: "Superday AI",
  url: "https://www.superdayready.com",
  description:
    "Practice investment banking interviews with an AI interviewer. Run live mocks, get concise coach notes, and stack reps anytime.",
  pricing: {
    trialDays: 3,
    monthly: 50,
    label: "$50/month"
  }
} as const;

export type LogoItem = {
  src: string;
  alt: string;
  className?: string;
};

export const navigation = [
  { href: "/#about", label: "About" },
  { href: "/mock-interview", label: "Practice" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" }
] as const;

export const schoolLogos = [
  { src: "/assets/logos/harvard.svg", alt: "Harvard University logo", className: "school-logo--harvard" },
  { src: "/assets/logos/columbia.svg", alt: "Columbia University logo", className: "school-logo--columbia" },
  { src: "/assets/logos/dartmouth.svg", alt: "Dartmouth College logo", className: "school-logo--dartmouth" },
  { src: "/assets/logos/princeton.svg", alt: "Princeton University logo", className: "school-logo--princeton" },
  { src: "/assets/logos/chicago-booth.png", alt: "Chicago Booth logo", className: "school-logo--booth" },
  { src: "/assets/logos/northwestern.svg", alt: "Northwestern University logo", className: "school-logo--northwestern" },
  { src: "/assets/logos/penn.svg", alt: "University of Pennsylvania logo", className: "school-logo--penn" },
  { src: "/assets/logos/usc.svg", alt: "University of Southern California logo", className: "school-logo--usc" },
  { src: "/assets/logos/ut-austin.svg", alt: "University of Texas at Austin logo", className: "school-logo--ut" }
] satisfies readonly LogoItem[];

export const bankLogos = [
  { src: "/assets/logos/jp-morgan-brown.svg", alt: "J.P. Morgan logo", className: "bank-logo--jpmorgan" },
  { src: "/assets/logos/evercore.png", alt: "Evercore logo", className: "bank-logo--evercore" },
  { src: "/assets/logos/goldman-sachs.svg", alt: "Goldman Sachs logo", className: "bank-logo--goldman" },
  { src: "/assets/logos/barclays.svg", alt: "Barclays logo", className: "bank-logo--barclays" },
  { src: "/assets/logos/jefferies.svg", alt: "Jefferies logo", className: "bank-logo--jefferies" },
  { src: "/assets/logos/lazard-new.svg", alt: "Lazard logo", className: "bank-logo--lazard" }
] satisfies readonly LogoItem[];

export const employerMarqueeLogos = [
  { src: "/assets/logos/barclays.svg", alt: "Barclays logo", className: "bank-logo--barclays" },
  { src: "/assets/logos/evercore.png", alt: "Evercore logo", className: "bank-logo--evercore" },
  { src: "/assets/logos/jp-morgan-brown.svg", alt: "J.P. Morgan logo", className: "bank-logo--jpmorgan" },
  { src: "/assets/logos/morgan-stanley.svg", alt: "Morgan Stanley logo", className: "bank-logo--morgan-stanley" },
  { src: "/assets/logos/jefferies.svg", alt: "Jefferies logo", className: "bank-logo--jefferies" },
  { src: "/assets/logos/bank-of-america.svg", alt: "Bank of America logo", className: "bank-logo--bank-of-america" }
] satisfies readonly LogoItem[];

export const homepageFaqs = [
  {
    question: "What does Superday AI help me practice?",
    answer:
      "Behavioral answers, technical questions, recent deals, markets discussion, and final-round superday follow-ups."
  },
  {
    question: "Is this only for one type of candidate?",
    answer:
      "No. The product is built for investment banking candidates broadly, with coaching that adapts to your profile, target bank, and interview stage."
  },
  {
    question: "How does the feedback work?",
    answer:
      "Each session ends with transcript-backed coach notes and one clear next rep to run. No scoring or grading."
  },
  {
    question: "How quickly can I start?",
    answer:
      "The goal is to get you from signup to your first practice session in a few minutes, from any laptop or phone."
  },
  {
    question: "What is included in the paid plan?",
    answer:
      "The launch plan includes live mocks, quick drills, session debriefs, the interview prep library, and the full SEO guide hub."
  }
] as const;

export const seoKeywords = [
  "investment banking interview prep",
  "investment banking interview questions",
  "investment banking technical questions",
  "investment banking behavioral questions",
  "investment banking superday",
  "superday interview questions",
  "why investment banking",
  "walk me through your resume investment banking",
  "investment banking valuation questions",
  "DCF interview questions investment banking",
  "merger math interview questions",
  "questions to ask in an investment banking interview"
];

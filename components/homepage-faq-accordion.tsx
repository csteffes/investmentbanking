"use client";

import { useState } from "react";

type HomepageFaqItem = {
  question: string;
  answer: string;
};

type HomepageFaqAccordionProps = {
  items: readonly HomepageFaqItem[];
};

export function HomepageFaqAccordion({
  items,
}: HomepageFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    items.length > 0 ? 0 : null,
  );

  return (
    <div className="homepage-faq" aria-label="Frequently asked questions">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const triggerId = `homepage-faq-trigger-${index}`;
        const panelId = `homepage-faq-panel-${index}`;

        return (
          <article
            key={item.question}
            className={`homepage-faq__item${isOpen ? " is-open" : ""}`}
          >
            <h3 className="homepage-faq__title">
              <button
                type="button"
                id={triggerId}
                className="homepage-faq__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="homepage-faq__question">{item.question}</span>
                <span className="homepage-faq__toggle" aria-hidden="true">
                  <span className="homepage-faq__toggle-line homepage-faq__toggle-line--horizontal" />
                  <span className="homepage-faq__toggle-line homepage-faq__toggle-line--vertical" />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
              className={`homepage-faq__panel${isOpen ? " is-open" : ""}`}
            >
              <div className="homepage-faq__panel-inner">
                <p className="homepage-faq__answer">{item.answer}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

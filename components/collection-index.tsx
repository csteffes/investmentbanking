import Link from "next/link";

import { formatDate } from "@/lib/content";
import type { ContentKind, ContentMeta } from "@/lib/content";

type CollectionIndexProps = {
  label: string;
  title: string;
  description: string;
  kind: ContentKind;
  items: ContentMeta[];
};

function getCollectionCopy(kind: ContentKind) {
  if (kind === "blog") {
    return {
      noun: "post",
      plural: "posts",
      selectedCopy: "Sharp reads for specific questions, recruiting moments, and final-round prep.",
      archiveTitle: "Latest posts",
      archiveCopy: "Tactical pieces built for candidates who want cleaner answers and better reps.",
      leadCta: "Read featured post",
      archiveCta: "Read post",
    };
  }

  return {
    noun: "guide",
    plural: "guides",
    selectedCopy: "Foundational reads covering the buckets you need to lock in before interview day.",
    archiveTitle: "More guides",
    archiveCopy: "Deep-dive pieces for the core banking questions that keep showing up.",
    leadCta: "Read featured guide",
    archiveCta: "Read guide",
  };
}

export function CollectionIndex({
  label,
  title,
  description,
  kind,
  items,
}: CollectionIndexProps) {
  const [lead, ...remaining] = items;
  const selectedReads = remaining.slice(0, 3);
  const archive = remaining.slice(3);
  const copy = getCollectionCopy(kind);

  return (
    <main className="library-page">
      <section className="library-hero">
        <div className="library-shell">
          <div className="library-hero__inner">
            <p className="library-hero__eyebrow">{label}</p>
            <h1 className="library-hero__title">{title}</h1>
            <p className="library-hero__copy">{description}</p>
          </div>
        </div>
      </section>

      <section className="library-shell library-section">
        {!lead ? (
          <div className="library-empty">
            <p className="library-empty__eyebrow">{label}</p>
            <h2 className="library-empty__title">Fresh material is on the way.</h2>
            <p className="library-empty__copy">
              We&apos;re building this library now. Check back shortly for new {copy.plural}.
            </p>
          </div>
        ) : (
          <>
            <div className="library-editorial">
              <Link href={`/${kind}/${lead.slug}`} className="library-lead">
                <div className="library-lead__content">
                  <p className="library-lead__eyebrow">Featured {copy.noun}</p>
                  <div className="library-lead__meta">
                    <span>{formatDate(lead.date)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{lead.readingTime}</span>
                  </div>
                  <h2 className="library-lead__title">{lead.title}</h2>
                  <p className="library-lead__description">{lead.description}</p>
                </div>

                <div className="library-lead__footer">
                  <span className="library-lead__cta">
                    {copy.leadCta}
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>

              {selectedReads.length > 0 ? (
                <aside className="library-side">
                  <div className="library-side__header">
                    <p className="library-side__eyebrow">Selected reads</p>
                    <p className="library-side__copy">{copy.selectedCopy}</p>
                  </div>

                  <div className="library-side__list">
                    {selectedReads.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/${kind}/${item.slug}`}
                        className="library-side-entry"
                      >
                        <p className="library-side-entry__meta">
                          {formatDate(item.date)} · {item.readingTime}
                        </p>
                        <h3 className="library-side-entry__title">{item.title}</h3>
                        <p className="library-side-entry__description">{item.description}</p>
                      </Link>
                    ))}
                  </div>
                </aside>
              ) : null}
            </div>

            {archive.length > 0 ? (
              <section className="library-archive" aria-labelledby={`${kind}-archive-heading`}>
                <div className="library-archive__header">
                  <div className="library-archive__intro">
                    <p className="library-archive__eyebrow">Archive</p>
                    <h2 id={`${kind}-archive-heading`} className="library-archive__title">
                      {copy.archiveTitle}
                    </h2>
                  </div>
                  <p className="library-archive__copy">{copy.archiveCopy}</p>
                </div>

                <div className="library-archive__grid">
                  {archive.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${kind}/${item.slug}`}
                      className="library-archive-entry"
                    >
                      <p className="library-archive-entry__meta">
                        {formatDate(item.date)} · {item.readingTime}
                      </p>
                      <h3 className="library-archive-entry__title">{item.title}</h3>
                      <p className="library-archive-entry__description">{item.description}</p>
                      <span className="library-archive-entry__cta">
                        {copy.archiveCta}
                        <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}

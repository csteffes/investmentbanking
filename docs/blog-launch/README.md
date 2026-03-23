# Superday AI — Blog Launch Package

This directory contains everything needed to publish, track, and iterate on the Superday AI blog content strategy.

---

## File List

```
docs/blog-launch/
├── README.md                    ← This file
├── keywords.csv                 ← Primary keyword list with volume, intent, geo, priority
├── editorial-calendar.csv       ← 12-month content plan with themes, slugs, and targets
├── competitors.csv              ← Competitor analysis with differentiation notes
├── outreach-templates.md        ← 3 outreach email templates + UTM convention
├── site_structure.mmd           ← Mermaid diagram: blog pillar/cluster architecture
└── timeline_12mo.mmd            ← Mermaid diagram: 12-month editorial cadence

content/blog/                    ← All 8 live blog posts (MDX)
├── investment-banking-interview-prep-roadmap.mdx           ← Post A (Pillar)
├── investment-banking-technical-interview-questions-study-plan.mdx  ← Post B (Pillar)
├── investment-banking-behavioral-fit-questions-frameworks.mdx       ← Post C (Pillar)
├── walk-me-through-a-dcf-interview.mdx                     ← Post D (How-to Cluster)
├── investment-banking-superday-prep-7-day-plan.mdx         ← Post E (Process Cluster)
├── hirevue-investment-banking-prep.mdx                     ← Post F (Situational Cluster)
├── investment-banking-recruiting-by-region.mdx             ← Post G (GEO Hub)
└── investment-banking-networking-cold-email-templates.mdx  ← Post H (Tools Cluster)

public/downloads/                ← Lead magnet placeholder files (replace with final assets)
├── ib-superday-prep-roadmap.md
├── technical-drill-tracker.md
├── behavioral-story-bank.md
├── dcf-practice-template.md
├── 7-day-superday-plan.md
├── hirevue-practice-script.md
├── regional-recruiting-checklist.md
└── cold-email-followup-tracker.md
```

---

## How to Publish (Generic)

1. **Add MDX files** to `content/blog/`. The content system reads all `.mdx` files automatically.
2. **Frontmatter fields required** per `lib/content.ts`:
   - `title`: String — used as page title and H1
   - `description`: String — used as meta description; target 140–160 characters
   - `date`: ISO date string (YYYY-MM-DD)
   - `readingTime`: String (e.g., "9 min read")
   - `featured`: Boolean (optional) — featured posts sort first
   - `keywords`: Array of strings — used in page metadata keywords field
3. **Internal links** use relative Next.js paths: `/blog/[slug]`
4. **The `<ArticleCTA />` component** is already registered in `mdx-components.tsx`. Drop it at the end of each post body.
5. **Canonical URLs** are auto-generated from slug: `/blog/[slug]` — see `app/blog/[slug]/page.tsx`

---

## Where to Replace Placeholders

### Lead magnet files (`public/downloads/`)
All files in `public/downloads/` are Markdown placeholders. Replace with:
- **PDFs** (Roadmap, Story Bank, 7-Day Plan, HireVue Script, Regional Checklist): Design in Figma or Canva; export as PDF; name to match existing filename conventions.
- **Excel/Sheets** (Technical Drill Tracker, DCF Template, Cold Email Tracker): Build in Excel or Google Sheets; export as `.xlsx`; host in `public/downloads/` or behind a Supabase email capture wall.

### ArticleCTA component
The current `ArticleCTA` links to `/assessment`. Update it per-post to point to the relevant lead magnet download or email capture flow once those are built.

### JSON-LD structured data
Each MDX post has a JSON-LD block in an HTML comment at the bottom of the file. To activate:
1. Add a `JsonLd` component to `components/mdx-components.tsx` that renders a `<script type="application/ld+json">` tag.
2. Or extract the JSON-LD into the `generateMetadata` function in `app/blog/[slug]/page.tsx` using Next.js `<Script>` component with `strategy="beforeInteractive"`.

**Validate all structured data** using the Rich Results Test:
→ https://search.google.com/test/rich-results

---

## GA4 Tracking Events to Implement

Reference: https://developers.google.com/analytics/devguides/collection/ga4/reference/events

| Event name | Trigger | Notes |
|---|---|---|
| `sign_up` | Email capture form submission (lead magnet) | Include `method: "lead_magnet"` parameter |
| `generate_lead` | Coaching inquiry form submission | Include `lead_type: "coaching"` |
| `file_download` | Lead magnet PDF or Excel download click | Include `file_name`, `file_extension` parameters |
| `video_start` | Video embed play (if added to Post E) | Include `video_title` parameter |
| `video_complete` | Video embed 90%+ watched | Include `video_title` parameter |
| `view_item` | Pricing or product page view | Include `item_name`, `item_category` parameters |
| `page_view` | Standard — enabled by default in GA4 | Confirm enhanced measurement is active |

### Conversion goals to set in GA4
1. `sign_up` → Primary conversion (lead magnet email capture)
2. `generate_lead` → Primary conversion (coaching inquiry)
3. `file_download` → Secondary conversion

### UTM conventions for campus outreach
```
utm_source = [school-or-club-slug]       e.g., wharton-finance-club
utm_medium = campus-partnership | newsletter | alumni-network | guest-post
utm_campaign = ib-recruiting-[year]      e.g., ib-recruiting-2026
utm_content = [post-slug]                e.g., investment-banking-interview-prep-roadmap
```

### KPI tracking table

| KPI | Source | Target (Month 3) | Target (Month 6) | Target (Month 12) |
|---|---|---|---|---|
| Organic impressions | Google Search Console | 5,000/mo | 25,000/mo | 100,000/mo |
| Organic clicks | Google Search Console | 500/mo | 3,000/mo | 15,000/mo |
| Average CTR | Google Search Console | 3–5% | 5–8% | 6–10% |
| Indexed blog pages | Google Search Console → Coverage | 8 | 12 | 20 |
| Lead magnet CVR | GA4 Events | 5% | 7% | 8% |
| Email-to-call booked rate | CRM / email platform | 10% | 15% | 18% |
| Assisted conversions (blog → assessment) | GA4 Attribution | Track only | 50/mo | 200/mo |

---

## How to Validate Structured Data

1. Go to: https://search.google.com/test/rich-results
2. Enter the URL of each published post.
3. Verify that `Article` (BlogPosting) schema is detected without errors.
4. For Post D (`walk-me-through-a-dcf-interview`), verify optional `HowTo` schema if implemented.
5. For any post with FAQ section, verify optional `FAQPage` schema if implemented.

**Note:** HowTo rich results have reduced display per Google (https://developers.google.com/search/blog/2023/08/howto-faq-changes). Include for semantic clarity, but do not rely on rich snippet display.

---

## Content Quality and Compliance Notes

All posts were written in compliance with:
- **Google people-first content guidelines:** https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- **Google gen-AI content guidance:** https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- **Google spam policies:** https://developers.google.com/search/docs/essentials/spam-policies

Each post includes:
- An answer-first summary paragraph immediately after H1
- A "Not financial advice" disclaimer
- Internal links to at least 3 other posts in the package
- A sources section citing only approved allowlist URLs
- An `<ArticleCTA />` component for lead capture

---

## Sitemap and Crawlability

The Next.js app includes `app/sitemap.ts`. Verify it includes all blog post slugs after publishing. Reference:
→ https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

Submit sitemap to Google Search Console after launch.

---

## Hreflang Guidance (Future Localization)

If localized versions are created for UK, India, HK, or SG markets:
- Do NOT duplicate pages without substantial content differentiation (70%+ unique content).
- Implement `hreflang` annotations per: https://developers.google.com/search/docs/specialty/international/localized-versions
- Use `canonical` tags on each localized version pointing to the appropriate locale's canonical.
- Post G (`investment-banking-recruiting-by-region`) is the logical foundation for regional hub pages.

---

## Core Web Vitals

Monitor blog post performance in Google Search Console → Core Web Vitals.
Reference: https://developers.google.com/search/docs/appearance/core-web-vitals

Primary targets:
- LCP (Largest Contentful Paint): < 2.5 seconds
- INP (Interaction to Next Paint): < 200 ms
- CLS (Cumulative Layout Shift): < 0.1

MDX blog posts are static pages and should perform well out of the box. Watch for CLS issues from images (add explicit width/height to all `<img>` elements) and for LCP issues from unoptimized lead magnet download buttons.

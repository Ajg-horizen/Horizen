import type { Metadata } from "next";
import type { CaseStudy } from "@/lib/cases";

const SITE = "https://horizen.dk";

/**
 * Metadata til en case-side. Delingsbilledets mål angives ikke, fordi
 * case-billederne har forskellige formater (forkerte mål er værre end ingen).
 */
export function caseMetadata(
  c: CaseStudy,
  title: string,
  description: string,
  ogImage: string,
): Metadata {
  const url = `/cases/${c.slug}`;
  const alt = c.imageAlt ?? `${c.title}, ${c.subtitle} af Horizen`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Horizen",
      locale: "da_DK",
      type: "article",
      images: [{ url: ogImage, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Strukturerede data til en case-side: selve casen (CreativeWork) med kunden
 * som emne og Horizen som udgiver, plus brødkrummer (Forside › Cases › Case).
 */
export function caseSchema(c: CaseStudy, description: string, ogImage: string) {
  const url = `${SITE}/cases/${c.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#case`,
        name: `${c.title}: ${c.subtitle.replaceAll(" · ", ", ")}`,
        headline: c.title,
        description,
        url,
        image: `${SITE}${ogImage}`,
        inLanguage: "da-DK",
        keywords: c.subtitle.split(" · ").join(", "),
        about: {
          "@type": "Organization",
          name: c.title,
          ...(c.liveUrl ? { url: c.liveUrl } : {}),
        },
        creator: { "@type": "Organization", name: "Horizen", url: SITE },
        publisher: { "@type": "Organization", name: "Horizen", url: SITE },
        isPartOf: {
          "@type": "CollectionPage",
          name: "Case studies",
          url: `${SITE}/cases`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Forside", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Case studies",
            item: `${SITE}/cases`,
          },
          { "@type": "ListItem", position: 3, name: c.title, item: url },
        ],
      },
    ],
  };
}

export function getCase(cases: CaseStudy[], slug: string): CaseStudy {
  const c = cases.find((x) => x.slug === slug);
  if (!c) throw new Error(`Case not found: ${slug}`);
  return c;
}

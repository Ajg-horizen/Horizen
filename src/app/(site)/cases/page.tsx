import type { Metadata } from "next";
import CasesOverview from "./CasesOverview";
import { visibleCases, caseHref } from "@/lib/cases";

const title = "Case studies | Horizen";
const description =
  "Udvalgte projekter fra Horizen. Webdesign, branding og udvikling, og hvad det har gjort for vores kunder.";
const ogImage = "/cases/BettrPlans-Case-Image-02.webp";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/cases",
  },
  openGraph: {
    title,
    description,
    url: "/cases",
    siteName: "Horizen",
    locale: "da_DK",
    type: "website",
    images: [{ url: ogImage, alt: "Case studies fra Horizen" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

const listSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Case studies",
  description,
  url: "https://horizen.dk/cases",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: visibleCases.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://horizen.dk${c.noCasePage ? `/cases#${c.slug}` : caseHref(c)}`,
      name: c.title,
    })),
  },
};

export default function Page() {
  return (
    <>
      <script
        id="schema-cases"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />
      <CasesOverview />
    </>
  );
}

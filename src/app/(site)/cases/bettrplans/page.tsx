import type { Metadata } from "next";
import CaseContent from "./CaseContent";

const title = "BettrPlans | Webdesign & Interiør | Horizen";
const description =
  "Ny hjemmeside for BettrPlans. Overblik der hjælper folk med at designe bedre interiører.";
const ogImage = "/cases/BettrPlans-Case-Image-02.webp";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/cases/bettrplans",
  },
  openGraph: {
    title,
    description,
    url: "/cases/bettrplans",
    siteName: "Horizen",
    locale: "da_DK",
    type: "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "BettrPlans case" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

const caseSchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "BettrPlans",
  description,
  image: `https://horizen.dk${ogImage}`,
  creator: { "@type": "Organization", name: "Horizen", url: "https://horizen.dk" },
};

export default function Page() {
  return (
    <>
      <script
        id="schema-case-bettrplans"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema) }}
      />
      <CaseContent />
    </>
  );
}

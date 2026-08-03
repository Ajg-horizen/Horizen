import type { Metadata } from "next";
import CaseContent from "./CaseContent";

const title = "Ensemble Hermes | Webdesign & System | Horizen";
const description =
  "Ensemble Hermes. Fra en tung Wix-side til et nyt fundament med system til koncertoversigten, enklere brugerflade og et CMS de selv styrer.";
const ogImage = "/cases/Case-Hermes.webp";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/cases/ensemble-hermes",
  },
  openGraph: {
    title,
    description,
    url: "/cases/ensemble-hermes",
    siteName: "Horizen",
    locale: "da_DK",
    type: "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Ensemble Hermes case" }],
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
  name: "Ensemble Hermes",
  description,
  image: `https://horizen.dk${ogImage}`,
  creator: { "@type": "Organization", name: "Horizen", url: "https://horizen.dk" },
};

export default function Page() {
  return (
    <>
      <script
        id="schema-case-ensemble-hermes"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema) }}
      />
      <CaseContent />
    </>
  );
}

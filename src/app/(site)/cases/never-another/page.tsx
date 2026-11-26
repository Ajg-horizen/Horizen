import type { Metadata } from "next";
import CaseContent from "./CaseContent";

const title = "Never Another | Branding & Webdesign | Horizen";
const description =
  "Never Another. Branding og webdesign der balancerer det visuelle udtryk med en stærk teknisk grundstruktur.";
const ogImage = "/og/horizen-og.jpg";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/cases/never-another",
  },
  openGraph: {
    title,
    description,
    url: "/cases/never-another",
    siteName: "Horizen",
    locale: "da_DK",
    type: "website",
    images: [{ url: ogImage, alt: "Never Another case" }],
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
  name: "Never Another",
  description,
  image: `https://horizen.dk${ogImage}`,
  creator: { "@type": "Organization", name: "Horizen", url: "https://horizen.dk" },
};

export default function Page() {
  return (
    <>
      <script
        id="schema-case-never-another"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema) }}
      />
      <CaseContent />
    </>
  );
}

import type { Metadata } from "next";
import CaseContent from "./CaseContent";

const title = "OD Pro | Webdesign & Udvikling | Horizen";
const description =
  "En professionel hjemmeside for OD Pro, et bilværksted i Glostrup. Se hvordan vi leverede +312% organisk trafik.";
const ogImage = "/cases/OD-Cases-image-car.webp";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/cases/od-biler-pro",
    siteName: "Horizen",
    locale: "da_DK",
    type: "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "OD Pro case" }],
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
  name: "OD Pro",
  description,
  image: `https://horizen.dk${ogImage}`,
  creator: { "@type": "Organization", name: "Horizen", url: "https://horizen.dk" },
};

export default function Page() {
  return (
    <>
      <script
        id="schema-case-od-biler-pro"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema) }}
      />
      <CaseContent />
    </>
  );
}

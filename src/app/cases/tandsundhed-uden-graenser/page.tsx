import type { Metadata } from "next";
import CaseContent from "./CaseContent";

const title = "Tandsundhed Uden Grænser | UI/UX & CMS | Horizen";
const description =
  "Komplet redesign for NGO. Fra forældet WPBakery til moderne CMS. Redigeringstiden reduceret med 83%.";
const ogImage = "/cases/smilende_kvinde_fra_Mongoliet.webp";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/cases/tandsundhed-uden-graenser",
  },
  openGraph: {
    title,
    description,
    url: "/cases/tandsundhed-uden-graenser",
    siteName: "Horizen",
    locale: "da_DK",
    type: "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Tandsundhed Uden Grænser case" }],
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
  name: "Tandsundhed Uden Grænser",
  description,
  image: `https://horizen.dk${ogImage}`,
  creator: { "@type": "Organization", name: "Horizen", url: "https://horizen.dk" },
};

export default function Page() {
  return (
    <>
      <script
        id="schema-case-tandsundhed"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema) }}
      />
      <CaseContent />
    </>
  );
}

import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/og";
import OmOsContent from "./OmOsContent";

const title = "Om Horizen: holdet bag bureauet i Aarhus";
const description =
  "Mød menneskene bag Horizen. Et digitalt design bureau i Aarhus med 8+ års erfaring i hjemmesider, branding og UI/UX.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/om-os",
  },
  // UDKAST: fjern når holdets tekster er godkendt og siden skal i Google.
  robots: { index: false, follow: true },
  openGraph: {
    title,
    description,
    url: "/om-os",
    siteName: "Horizen",
    locale: "da_DK",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
};

// Knytter siden og stifteren til organisationen fra layoutets ProfessionalService.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://horizen.dk/om-os#webpage",
  url: "https://horizen.dk/om-os",
  name: title,
  inLanguage: "da-DK",
  about: { "@id": "https://horizen.dk/#organization" },
  mainEntity: {
    "@type": "Person",
    "@id": "https://horizen.dk/om-os#andreas-jose",
    name: "Andreas José",
    jobTitle: "Founder",
    image: "https://horizen.dk/team/andreas-jose.jpg",
    worksFor: { "@id": "https://horizen.dk/#organization" },
  },
};

export default function OmOsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OmOsContent />
    </>
  );
}

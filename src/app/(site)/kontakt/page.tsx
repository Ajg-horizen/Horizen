import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/og";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactPageContent from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Kontakt | Horizen",
  description:
    "Har du et projekt, en idé eller bare brug for en sparring? Skriv til os.",
  alternates: {
    canonical: "/kontakt",
  },
  openGraph: {
    title: "Kontakt | Horizen",
    description:
      "Har du et projekt, en idé eller bare brug for en sparring? Skriv til os.",
    url: "/kontakt",
    siteName: "Horizen",
    locale: "da_DK",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kontakt | Horizen",
    description:
      "Har du et projekt, en idé eller bare brug for en sparring? Skriv til os.",
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function KontaktPage() {
  return (
    <main>
      <Navbar alwaysVisible />
      <ContactPageContent />
      <Footer />
    </main>
  );
}

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GodtFormaalContent from "./GodtFormaalContent";

export const metadata: Metadata = {
  title: "Godt formål | Horizen",
  description:
    "Driver I en forening eller NGO med et godt formål? Søg om en gratis hjemmeside. Vi vurderer hver ansøgning personligt.",
  openGraph: {
    title: "Godt formål | Horizen",
    description:
      "Driver I en forening eller NGO med et godt formål? Søg om en gratis hjemmeside. Vi vurderer hver ansøgning personligt.",
    url: "/godt-formaal",
    siteName: "Horizen",
    locale: "da_DK",
    type: "website",
    images: [
      {
        url: "/graphics/Hero-image-branding-services.webp",
        width: 1200,
        height: 630,
        alt: "Horizen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Godt formål | Horizen",
    description:
      "Driver I en forening eller NGO med et godt formål? Søg om en gratis hjemmeside. Vi vurderer hver ansøgning personligt.",
    images: ["/graphics/Hero-image-branding-services.webp"],
  },
};

export default function GodtFormaalPage() {
  return (
    <main>
      <Navbar alwaysVisible />
      <GodtFormaalContent />
      <Footer />
    </main>
  );
}

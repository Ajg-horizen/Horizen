import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/og";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GodtFormaalContent from "./GodtFormaalContent";

export const metadata: Metadata = {
  title: "Godt formål | Horizen",
  description:
    "Driver I en forening eller NGO med et godt formål? Søg om en gratis hjemmeside. Vi vurderer hver ansøgning personligt.",
  alternates: {
    canonical: "/godt-formaal",
  },
  openGraph: {
    title: "Godt formål | Horizen",
    description:
      "Driver I en forening eller NGO med et godt formål? Søg om en gratis hjemmeside. Vi vurderer hver ansøgning personligt.",
    url: "/godt-formaal",
    siteName: "Horizen",
    locale: "da_DK",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Godt formål | Horizen",
    description:
      "Driver I en forening eller NGO med et godt formål? Søg om en gratis hjemmeside. Vi vurderer hver ansøgning personligt.",
    images: [DEFAULT_OG_IMAGE.url],
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

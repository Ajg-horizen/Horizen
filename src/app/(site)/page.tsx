import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/og";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Digitalt design bureau i Aarhus, Horizen",
  description:
    "Digitalt design bureau i Aarhus med 8+ års erfaring. Vi laver hjemmesider, branding og UI/UX, og AI er værktøjet, der gør, at vi kan levere mere.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Digitalt design bureau i Aarhus, Horizen",
    description:
      "Digitalt design bureau i Aarhus med 8+ års erfaring. Vi laver hjemmesider, branding og UI/UX, og AI er værktøjet, der gør, at vi kan levere mere.",
    url: "/",
    siteName: "Horizen",
    locale: "da_DK",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digitalt design bureau i Aarhus, Horizen",
    description:
      "Digitalt design bureau i Aarhus med 8+ års erfaring. Vi laver hjemmesider, branding og UI/UX, og AI er værktøjet, der gør, at vi kan levere mere.",
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function Home() {
  return <HomeClient />;
}

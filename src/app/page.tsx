import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Digitalt design bureau i Aarhus, Horizen",
  description:
    "Digitalt design bureau med 8+ års erfaring. Vi laver hjemmesider, branding og UI/UX. AI er ikke en undskyldning for at arbejde mindre. Det er værktøjet, der gør, at vi kan levere mere.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Digitalt design bureau i Aarhus, Horizen",
    description:
      "Digitalt design bureau med 8+ års erfaring. Vi laver hjemmesider, branding og UI/UX. AI er ikke en undskyldning for at arbejde mindre. Det er værktøjet, der gør, at vi kan levere mere.",
    url: "/",
    siteName: "Horizen",
    locale: "da_DK",
    type: "website",
    images: [
      {
        url: "/graphics/Hero-image-branding-services.webp",
        width: 1200,
        height: 630,
        alt: "Horizen, digitalt design bureau",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digitalt design bureau i Aarhus, Horizen",
    description:
      "Digitalt design bureau med 8+ års erfaring. Vi laver hjemmesider, branding og UI/UX. AI er ikke en undskyldning for at arbejde mindre. Det er værktøjet, der gør, at vi kan levere mere.",
    images: ["/graphics/Hero-image-branding-services.webp"],
  },
};

export default function Home() {
  return <HomeClient />;
}

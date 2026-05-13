import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Digital design bureau i Aarhus, Horizen",
  description:
    "Digital design bureau med 8+ års erfaring. Vi laver hjemmesider, branding og UI/UX. Andre bruger AI til at arbejde mindre, vi bruger det til at levere mere.",
  openGraph: {
    title: "Digital design bureau i Aarhus, Horizen",
    description:
      "Digital design bureau med 8+ års erfaring. Vi laver hjemmesider, branding og UI/UX. Andre bruger AI til at arbejde mindre, vi bruger det til at levere mere.",
    url: "/",
    siteName: "Horizen",
    locale: "da_DK",
    type: "website",
    images: [
      {
        url: "/graphics/Hero-image-branding-services.webp",
        width: 1200,
        height: 630,
        alt: "Horizen, digital design bureau",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital design bureau i Aarhus, Horizen",
    description:
      "Digital design bureau med 8+ års erfaring. Vi laver hjemmesider, branding og UI/UX. Andre bruger AI til at arbejde mindre, vi bruger det til at levere mere.",
    images: ["/graphics/Hero-image-branding-services.webp"],
  },
};

export default function Home() {
  return <HomeClient />;
}

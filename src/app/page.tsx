import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Horizen | Web, Design & Branding",
  description:
    "Vi skaber digitale oplevelser der konverterer. Web, logo, grafisk design og branding.",
  openGraph: {
    title: "Horizen | Web, Design & Branding",
    description:
      "Vi skaber digitale oplevelser der konverterer. Web, logo, grafisk design og branding.",
    url: "/",
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
    title: "Horizen | Web, Design & Branding",
    description:
      "Vi skaber digitale oplevelser der konverterer. Web, logo, grafisk design og branding.",
    images: ["/graphics/Hero-image-branding-services.webp"],
  },
};

export default function Home() {
  return <HomeClient />;
}

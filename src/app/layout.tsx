import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ScrollToTop from "@/components/ScrollToTop";
import SmoothScroll from "@/components/SmoothScroll";
import BackToTopButton from "@/components/BackToTopButton";
import CalEmbed from "@/components/CalEmbed";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://horizen.dk"),
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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Horizen",
  url: "https://horizen.dk",
  logo: "https://horizen.dk/logo/Horizen-LogoType-Black.svg",
  email: "hej@horizen.dk",
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Horizen",
  url: "https://horizen.dk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <html lang="da" className={`${inter.variable} h-full antialiased`}>
      {isProduction && <GoogleTagManager gtmId="GTM-WFZ26CS4" />}
      <body className="min-h-full flex flex-col">
        <a href="#main" className="skip-link">
          Spring til indhold
        </a>
        <SmoothScroll />
        <ScrollToTop />
        {children}
        <script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <BackToTopButton />
        <CalEmbed />
        {isProduction && <GoogleAnalytics gaId="G-HC4NR97H1P" />}
      </body>
    </html>
  );
}

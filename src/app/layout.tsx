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
  title: "Horizen, digital design bureau",
  description:
    "Digital design bureau med 8+ års erfaring. Hjemmesider, branding, UI/UX og webudvikling drevet af erfaring og forstærket af AI.",
  openGraph: {
    title: "Horizen, digital design bureau",
    description:
      "Digital design bureau med 8+ års erfaring. Hjemmesider, branding, UI/UX og webudvikling drevet af erfaring og forstærket af AI.",
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
    title: "Horizen, digital design bureau",
    description:
      "Digital design bureau med 8+ års erfaring. Hjemmesider, branding, UI/UX og webudvikling drevet af erfaring og forstærket af AI.",
    images: ["/graphics/Hero-image-branding-services.webp"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://horizen.dk/#organization",
  name: "Horizen",
  alternateName: "Horizen Digital Design Bureau",
  description:
    "Digital design bureau med 8+ års erfaring. Vi laver hjemmesider, branding, UI/UX og webudvikling. Drevet af erfaring, forstærket af AI.",
  url: "https://horizen.dk",
  logo: "https://horizen.dk/logo/Horizen-LogoType-Black.svg",
  image: "https://horizen.dk/graphics/Hero-image-branding-services.webp",
  email: "hej@horizen.dk",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Aarhus",
    addressRegion: "Midtjylland",
    addressCountry: "DK",
  },
  areaServed: {
    "@type": "Country",
    name: "Danmark",
  },
  knowsAbout: [
    "Webudvikling",
    "UI/UX Design",
    "Branding",
    "Grafisk Design",
    "WordPress",
    "Digital design",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Webudvikling",
          url: "https://horizen.dk/services/webudvikling",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "UI/UX Design",
          url: "https://horizen.dk/services/ui-ux-design",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Branding",
          url: "https://horizen.dk/services/branding",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Grafisk Design",
          url: "https://horizen.dk/services/grafisk-design",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "WordPress",
          url: "https://horizen.dk/services/wordpress",
        },
      },
    ],
  },
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://horizen.dk/#website",
  name: "Horizen",
  url: "https://horizen.dk",
  inLanguage: "da-DK",
  publisher: {
    "@id": "https://horizen.dk/#organization",
  },
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
        {/* View-source signatur (ignoreres af browseren, synlig i kildekoden) */}
        <script
          type="text/x-horizen-signature"
          dangerouslySetInnerHTML={{
            __html: `

   ██╗  ██╗ ██████╗ ██████╗ ██╗███████╗███████╗███╗   ██╗
   ██║  ██║██╔═══██╗██╔══██╗██║╚══███╔╝██╔════╝████╗  ██║
   ███████║██║   ██║██████╔╝██║  ███╔╝ █████╗  ██╔██╗ ██║
   ██╔══██║██║   ██║██╔══██╗██║ ███╔╝  ██╔══╝  ██║╚██╗██║
   ██║  ██║╚██████╔╝██║  ██║██║███████╗███████╗██║ ╚████║
   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝

   Digital design bureau, baseret i Aarhus.
   Drevet af erfaring. Forstærket af AI.

   Kan du li' det du ser? Skriv til os: hej@horizen.dk
   horizen.dk

`,
          }}
        />
        {/* Console-signatur (synlig i DevTools) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var b='font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:1.2;color:#0f0f0f;';var t='font-style:italic;color:#666;font-size:12px;';var l='color:#0066cc;font-size:12px;';console.log('%c\\n   ██╗  ██╗ ██████╗ ██████╗ ██╗███████╗███████╗███╗   ██╗\\n   ██║  ██║██╔═══██╗██╔══██╗██║╚══███╔╝██╔════╝████╗  ██║\\n   ███████║██║   ██║██████╔╝██║  ███╔╝ █████╗  ██╔██╗ ██║\\n   ██╔══██║██║   ██║██╔══██╗██║ ███╔╝  ██╔══╝  ██║╚██╗██║\\n   ██║  ██║╚██████╔╝██║  ██║██║███████╗███████╗██║ ╚████║\\n   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝\\n',b);console.log('%cDigital design bureau, baseret i Aarhus.\\nDrevet af erfaring. Forstærket af AI.',t);console.log('%cKan du li det du ser? Skriv til os: hej@horizen.dk',l);}catch(e){}})();`,
          }}
        />
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

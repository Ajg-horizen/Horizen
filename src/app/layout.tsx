import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ScrollToTop from "@/components/ScrollToTop";
import SmoothScroll from "@/components/SmoothScroll";
import BackToTopButton from "@/components/BackToTopButton";
import CalEmbed from "@/components/CalEmbed";
import Script from "next/script";
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
        {isProduction && (
          <>
            <Script id="gtm-init" strategy="lazyOnload">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WFZ26CS4');`}
            </Script>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-HC4NR97H1P"
              strategy="lazyOnload"
            />
            <Script id="gtag-init" strategy="lazyOnload">
              {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-HC4NR97H1P');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}

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
  title: "Horizen | Web, Design & Branding",
  description:
    "Vi skaber digitale oplevelser der konverterer. Web, logo, grafisk design og branding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" className={`${inter.variable} h-full antialiased`}>
      <GoogleTagManager gtmId="GTM-WFZ26CS4" />
      <body className="min-h-full flex flex-col">
        <a href="#main" className="skip-link">
          Spring til indhold
        </a>
        <SmoothScroll />
        <ScrollToTop />
        {children}
        <BackToTopButton />
        <CalEmbed />
        <GoogleAnalytics gaId="G-HC4NR97H1P" />
      </body>
    </html>
  );
}

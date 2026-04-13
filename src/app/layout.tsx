import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ScrollToTop from "@/components/ScrollToTop";
import GlobalCursor from "@/components/GlobalCursor";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Horizen — Web, Design & Branding",
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
      <body className="min-h-full flex flex-col">
        <a href="#main" className="skip-link">
          Spring til indhold
        </a>
        <GlobalCursor />
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}

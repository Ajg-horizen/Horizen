// Dansk 404 for adresser, der slet ikke findes. Next springer layouts over
// her, så styles og skrifttyper hentes direkte (se Next-guiden om
// global-not-found). Sitet har to root-layouts (sitet og Studio), derfor
// kan en almindelig not-found.tsx ikke dække ukendte adresser.
import "./(site)/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NotFoundContent from "@/components/NotFoundContent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Siden findes ikke | Horizen",
  description: "Siden findes ikke. Den er måske flyttet eller slettet.",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="da" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <NotFoundContent />
      </body>
    </html>
  );
}

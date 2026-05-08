import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { ArrowRightIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Ikke WordPress — Horizen",
  description:
    "Du leder efter WordPress. Den her side er bygget fra bunden i kode.",
  robots: { index: false, follow: false },
};

export default function IkkeWordPressPage() {
  return (
    <main>
      <Navbar alwaysVisible />

      <Container as="section" size="site" className="py-32 md:py-40">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
            wp-admin · 200 OK
          </p>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Du leder efter WordPress.
          </h1>

          <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
            <p>
              Tæt på. Siden her er ikke bygget på WordPress, og vi bruger
              heller ikke YooTheme, WPBakery eller andre page-buildere som
              mange bureauer læner sig op ad.
            </p>
            <p>
              Vi bygger fra bunden i kode, så siden er hurtigere, sikrere og
              uden et plugin-bundt der trækker den ned. Det er en bevidst
              beslutning — ikke en mode.
            </p>
            <p>
              Vil du vide hvordan vi har bygget den? Vi sætter gerne en gratis
              konsultation op og fortæller om det.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
            >
              Book en samtale
              <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="mailto:hej@horizen.dk"
              className="text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              eller skriv til hej@horizen.dk
            </a>
          </div>
        </div>
      </Container>

      <Footer />
    </main>
  );
}

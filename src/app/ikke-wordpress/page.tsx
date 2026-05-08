import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { ArrowRightIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Hov! — Horizen",
  description:
    "Prøv at se, om vi har lavet siden i WordPress eller ej. Vi afslører lidt om vores stack.",
  robots: { index: false, follow: false },
};

export default function IkkeWordPressPage() {
  return (
    <main>
      <Navbar alwaysVisible />

      <Container as="section" size="site" className="py-24 md:py-32">
        <div className="mx-auto max-w-2xl rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-8 shadow-sm md:p-14">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            wp-admin · 200 OK
          </p>

          <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">
            Hov! Prøv at se, om vi har lavet den i WordPress — eller ej?
          </h1>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              Vi kan afsløre, at vi muligvis har lavet vores løsning i
              WordPress. Og måske ikke.
            </p>
            <p>
              Det vi i hvert fald kan afsløre, er at vi hverken har brugt{" "}
              <strong className="text-foreground">WPBakery</strong>,{" "}
              <strong className="text-foreground">Divi</strong> eller{" "}
              <strong className="text-foreground">YooTheme</strong> — fordi vi
              foretrækker stærkere og mere moderne værktøjer, der ikke er
              bundet af opinionated design og dårlige strukturer.
            </p>
            <p>
              Vi bygger alle vores løsninger i et moderne stack, så de er
              fremtidssikrede.
            </p>
            <p>
              Har du brug for en konsulent eller bare en snak, tager vi altid
              et uforpligtende møde, så du kan lære hvordan du får et bedre
              stack end de gamle webløsninger, vi lige har nævnt.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
            >
              Book et uforpligtende møde
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

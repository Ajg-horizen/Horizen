import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

const LINKS = [
  {
    href: "/cases",
    label: "Case studies",
    text: "Se, hvad vi har lavet for andre.",
  },
  {
    href: "/services/webudvikling",
    label: "Webudvikling",
    text: "Hjemmesider bygget til at blive fundet.",
  },
  {
    href: "/services/ui-ux-design",
    label: "UI/UX design",
    text: "Design baseret på brugeradfærd og data.",
  },
  { href: "/blog", label: "Blog", text: "Artikler om design, SEO og AI." },
];

/** Dansk 404-side. Bruges både for ukendte adresser og ved notFound(). */
export default function NotFoundContent() {
  return (
    <main>
      <Navbar alwaysVisible />
      <Container as="section" size="site" className="pt-40 pb-24 md:pt-48">
        <p className="text-xs font-medium tracking-[0.3em] text-muted uppercase">
          Fejl 404
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          Siden findes ikke.{" "}
          <span className="text-muted">
            Den er måske flyttet eller slettet.
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
          Tjek adressen, eller find vej herfra. Leder du efter noget bestemt, så
          skriv til os, så hjælper vi.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: "#f5f5f0" }}
          >
            Til forsiden
            <ArrowRightIcon className="size-4" />
          </Link>
          <Link
            href="/kontakt"
            className="text-sm font-medium text-muted underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            Kontakt os
          </Link>
        </div>

        <ul className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {LINKS.map((l) => (
            <li key={l.href} className="bg-background">
              <Link
                href={l.href}
                className="group flex h-full flex-col p-6 transition-colors hover:bg-foreground/[0.03]"
              >
                <span className="inline-flex items-center gap-1.5 text-base font-semibold">
                  {l.label}
                  <ArrowRightIcon className="size-3.5 text-muted transition-colors group-hover:text-foreground" />
                </span>
                <span className="mt-1.5 text-sm text-muted">{l.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
      <Footer />
    </main>
  );
}

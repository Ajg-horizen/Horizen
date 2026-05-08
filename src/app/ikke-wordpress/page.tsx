import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Hov! — Horizen",
  description:
    "Lille besked til den nysgerrige. Vi afslører lidt om vores stack.",
  robots: { index: false, follow: false },
};

export default function IkkeWordPressPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-8 shadow-sm md:p-14">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          wp-admin · 200 OK
        </p>

        <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-5xl">
          Hov, der er vist en der er nysgerrig på, hvordan vi har bygget vores side.
        </h1>

        <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>
            Hvad vi kan afsløre er, at vi måske — måske ikke — har bygget
            vores løsning i WordPress.
          </p>
          <p>
            Men hvad vi i hvert fald kan afsløre, er at vi ikke har brugt
            buildere som{" "}
            <strong className="text-foreground">Divi</strong>,{" "}
            <strong className="text-foreground">WPBakery</strong> eller{" "}
            <strong className="text-foreground">YooTheme</strong>, da vi
            foretrækker værktøjer man faktisk kan bygge med — frem for
            opinionated design og dårlige CMS-strukturer fyldt med
            begrænsninger.
          </p>
          <p>
            Sidder du i en lignende situation og kan genkende dig selv, er du
            altid velkommen til at kontakte os.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
          >
            Kontakt os
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
    </main>
  );
}

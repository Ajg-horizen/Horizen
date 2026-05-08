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
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          Hov, der er vist en der er nysgerrig på, hvordan vi har bygget vores side.
        </h1>

        <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>
            Hvad vi kan afsløre er, at vi måske — måske ikke — har bygget
            vores løsning i WordPress.
          </p>
          <p>
            Men det vi i hvert fald kan afsløre, er at vi ikke har brugt
            buildere som{" "}
            <strong className="text-foreground">Divi</strong>,{" "}
            <strong className="text-foreground">WPBakery</strong> eller{" "}
            <strong className="text-foreground">YooTheme</strong>. Vi
            foretrækker værktøjer der er teknisk tungere at arbejde i — men
            til gengæld giver os den frihed, opinionated buildere og dårlige
            CMS-strukturer aldrig kan.
          </p>
          <p>
            Det kræver et højere teknisk niveau. Det er det værd.
          </p>
          <p>
            Har du fået bygget en løsning i en af ovenstående og er træt af
            begrænsningerne? Vi kigger gerne på den og viser hvordan en
            moderne React-baseret stack kan løfte den videre.
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/#contact"
            style={{ color: "#ffffff" }}
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5"
          >
            Kontakt os
            <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}

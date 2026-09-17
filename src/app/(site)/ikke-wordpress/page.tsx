import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Hov! | Horizen",
  description:
    "Lille besked til den nysgerrige. Vil du vide hvordan vi har bygget vores side, så tag fat i os.",
  robots: { index: false, follow: false },
};

export default function IkkeWordPressPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-8 shadow-sm md:p-14">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          Hov, en nysgerrig sjæl.
        </h1>

        <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>
            Hvis du er interesseret i at høre, hvordan vi har bygget vores
            side, så er du altid velkommen til at kontakte os.
          </p>
          <p>
            Vi tager gerne en snak om vores stack, og hvad vi har lært på
            vejen.
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/kontakt"
            style={{ color: "#ffffff" }}
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5"
          >
            Tag en snak
            <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}

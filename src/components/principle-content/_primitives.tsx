/**
 * Genbrugelige byggesten til principindhold.
 * Brug Section til sektioner med h2 + paragraffer, Quote til pull-quotes.
 */

import type { ReactNode } from "react";

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-muted leading-relaxed [&_p]:text-muted">
        {children}
      </div>
    </section>
  );
}

/**
 * Læg to (eller flere) sektioner side om side i en grid.
 * Bruges til at parre relaterede sektioner og gøre lange artikler
 * mere overskuelige.
 */
export function SectionGrid({ children }: { children: ReactNode }) {
  return (
    <div className="mt-12 grid gap-10 md:grid-cols-2 [&>section]:!mt-0">
      {children}
    </div>
  );
}

/**
 * Typografisk callout der krediterer originalstudiet bag et princip.
 * Ingen ansigter, bare ren typografi med tydeligt hierarki.
 */
export function ResearchOrigin({
  authors,
  institution,
  year,
  tint,
}: {
  authors: string[];
  institution: string;
  year: number | string;
  /** Valgfri pastelfarve som baggrund, fx kategoriens egen pastel. */
  tint?: string;
}) {
  return (
    <aside
      className="my-12 rounded-3xl border-l-2 border-foreground border-y border-r border-y-foreground/10 border-r-foreground/10 p-6 md:p-8"
      style={{ backgroundColor: tint ?? "rgba(15,15,15,0.02)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        Originalstudie
      </p>
      <p className="mt-3 text-xl font-bold leading-snug tracking-tight md:text-2xl">
        {authors.join(" & ")}
      </p>
      <p className="mt-2 text-sm text-muted">
        {institution} · {year}
      </p>
    </aside>
  );
}

export function Quote({
  children,
  author,
}: {
  children: ReactNode;
  author: string;
}) {
  return (
    <blockquote className="my-16 border-l-2 border-foreground pl-6 md:pl-8">
      <p className="text-xl font-medium leading-snug tracking-tight md:text-2xl">
        &ldquo;{children}&rdquo;
      </p>
      <cite className="mt-4 block text-sm text-muted not-italic">
        {author}
      </cite>
    </blockquote>
  );
}

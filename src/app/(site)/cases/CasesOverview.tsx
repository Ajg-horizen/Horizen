"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import LazyCaseVideo from "@/components/LazyCaseVideo";
import HoverCaseVideo from "@/components/HoverCaseVideo";
import { ContactButton } from "@/components/ContactButton";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { visibleCases, caseHref, type CaseStudy } from "@/lib/cases";
import { getTestimonial } from "@/lib/testimonials";
import { fadeIn } from "@/lib/animations";

/**
 * Oversigt over alle cases: én lang liste, tekst til venstre og billede til
 * højre (på mobil billedet øverst). Rækkerne toner ind én gang.
 */

// Billedet fylder 7 af 12 kolonner fra lg, hele bredden under.
const IMAGE_SIZES = "(min-width: 1024px) 58vw, 100vw";

/** Link til casens egen side, eller til kundens live site, hvis casen ikke har en side endnu. */
function CaseLink({
  c,
  className,
  label,
  children,
}: {
  c: CaseStudy;
  className: string;
  label?: string;
  children: React.ReactNode;
}) {
  if (!c.noCasePage) {
    return (
      <Link href={caseHref(c)} aria-label={label} className={className}>
        {children}
      </Link>
    );
  }
  if (c.liveUrl) {
    return (
      <a
        href={c.liveUrl}
        target="_blank"
        rel="noopener"
        aria-label={label}
        className={className}
      >
        {children}
      </a>
    );
  }
  return <div className={className}>{children}</div>;
}

function CaseRow({ c, index }: { c: CaseStudy; index: number }) {
  const t = c.testimonial;
  const author = t?.id ? getTestimonial(t.id).author : t?.author;
  const alt = c.imageAlt ?? `${c.title}, ${c.subtitle} af Horizen`;
  const linkLabel = c.noCasePage
    ? `Besøg ${c.title}s hjemmeside`
    : `Se casen om ${c.title}`;

  return (
    <motion.article
      id={c.slug}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
      className="grid scroll-mt-28 gap-8 border-t border-foreground/[0.08] py-14 md:py-20 lg:grid-cols-12 lg:gap-16"
    >
      {/* Billede */}
      <CaseLink
        c={c}
        label={linkLabel}
        className="group relative block aspect-[16/10] overflow-hidden rounded-2xl bg-foreground/[0.04] lg:order-2 lg:col-span-7"
      >
        {c.video ? (
          <LazyCaseVideo src={c.video} poster={c.image} label={alt} />
        ) : (
          <img
            src={c.image}
            srcSet={c.srcSet}
            sizes={c.srcSet ? IMAGE_SIZES : undefined}
            alt={alt}
            loading={index === 0 ? "eager" : "lazy"}
            style={
              c.imagePosition ? { objectPosition: c.imagePosition } : undefined
            }
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}
        {c.hoverVideo && (
          <HoverCaseVideo
            src={c.hoverVideo}
            backdrop={c.hoverVideoBackdrop}
            label={`${c.title}, video af hjemmesiden`}
          />
        )}
        {c.team && c.team.length > 0 && (
          <div className="absolute top-4 right-4 flex -space-x-1.5 md:top-5 md:right-5">
            {c.team.map((m) => (
              <img
                key={m.name}
                src={m.avatar}
                alt={m.name}
                title={m.name}
                loading="lazy"
                className="size-7 rounded-full border border-white/40 bg-background object-cover"
              />
            ))}
          </div>
        )}
      </CaseLink>

      {/* Tekst */}
      <div className="flex flex-col lg:order-1 lg:col-span-5 lg:py-2">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-foreground">
            {c.logo ? (
              <img
                src={c.logo}
                alt={`${c.title} bomærke`}
                loading="lazy"
                className="size-7 object-contain"
              />
            ) : (
              <span className="text-xs font-bold tracking-wide text-white">
                {c.initials ?? c.title.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              {c.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{c.subtitle}</p>
          </div>
        </div>

        <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/80 md:text-lg">
          {c.summary}
        </p>

        {c.result && (
          <div className="mt-8 flex items-baseline gap-3">
            <span className="text-4xl font-bold tracking-tight md:text-5xl">
              {c.result.value}
            </span>
            <span className="text-sm text-muted">{c.result.label}</span>
          </div>
        )}

        {author && (
          <div className="mt-8 flex items-center gap-3">
            {author.photo ? (
              <img
                src={author.photo}
                alt={author.name}
                loading="lazy"
                className="size-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold"
              >
                {author.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            )}
            <p className="text-sm leading-snug">
              <span className="text-muted">Anbefalet af </span>
              <span className="font-medium">{author.name}</span>
              {(author.role || author.company) && (
                <span className="block text-muted">
                  {[author.role, author.company].filter(Boolean).join(", ")}
                </span>
              )}
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          {(!c.noCasePage || c.liveUrl) && (
            <CaseLink
              c={c}
              className="group/link inline-flex w-fit items-center gap-2 text-sm font-semibold"
            >
              {c.noCasePage ? "Besøg sitet" : "Se casen"}
              {c.noCasePage ? (
                <ArrowUpRightIcon className="size-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
              ) : (
                <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover/link:translate-x-1" />
              )}
            </CaseLink>
          )}
          {!c.noCasePage && c.liveUrl && (
            <a
              href={c.liveUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-300 hover:text-foreground"
            >
              {c.liveUrl.replace(/^https?:\/\//, "")}
              <ArrowUpRightIcon className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function CasesOverview() {
  return (
    <>
      <Navbar alwaysVisible />
      <main className="min-h-screen bg-background pt-32">
        <Container size="site">
          <motion.header
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeIn}
            className="pb-14 md:pb-20"
          >
            <ScrambleEyebrow>Udvalgte projekter</ScrambleEyebrow>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Case studies.{" "}
              <span className="text-muted">
                Det vi har bygget, og hvad det har gjort for kunderne.
              </span>
            </h1>
          </motion.header>

          <div>
            {visibleCases.map((c, i) => (
              <CaseRow key={c.slug} c={c} index={i} />
            ))}
          </div>

          <section className="flex flex-col items-start justify-between gap-8 border-t border-foreground/[0.08] py-20 md:flex-row md:items-end md:py-28">
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
              Næste case kan være jeres.{" "}
              <span className="text-muted">Fortæl os, hvad I står med.</span>
            </h2>
            <ContactButton />
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}

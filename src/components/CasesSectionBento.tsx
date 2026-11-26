"use client";

import { fadeIn } from "@/lib/animations";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import Container from "@/components/Container";
import LazyCaseVideo from "@/components/LazyCaseVideo";
import { homepageCases, caseHref } from "@/lib/cases";
import HoverCaseVideo from "@/components/HoverCaseVideo";

// Mobil: ét kort pr. række. Tablet: to pr. række. Desktop: 3 + 3.
const CARD_SIZES = "(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw";
// Tredje rækkes kort er bredere (7 eller 5 af 12 kolonner).
const WIDE_CARD_SIZES = "(min-width: 768px) 60vw, 100vw";

// Desktop (12 kolonner): to rækker med tre lige store kort (4+4+4) og en
// tredje række med to kort, hvor venstre er bredest (7+5).
// Tablet: to kort pr. række (tredje række 7+5). Mobil: ét.
const SPANS = [
  ...Array.from({ length: 6 }, () => "md:col-span-6 lg:col-span-4"),
  "md:col-span-7",
  "md:col-span-5",
];

export default function CasesSectionBento() {
  return (
    <Container as="section" size="site" className="py-32" id="cases">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="mb-10"
      >
        <ScrambleEyebrow>Udvalgte projekter</ScrambleEyebrow>
        <div className="mt-4 flex items-end justify-between">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Cases
          </h2>
          <Link
            href="/cases"
            className="group/all mb-1 hidden shrink-0 items-center gap-2 text-sm font-semibold sm:inline-flex"
          >
            Se alle cases
            <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover/all:translate-x-1" />
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {/* Forsidens fire cases vælges i HOMEPAGE_CASES (src/lib/cases.ts). Resten ligger på /cases. */}
        {homepageCases.slice(0, SPANS.length).map((c, i) => {
          const cardClassName = `group relative block h-full min-h-[340px] overflow-hidden rounded-2xl bg-foreground/[0.04] md:min-h-[420px] xl:min-h-[520px] 2xl:min-h-[620px] ${c.comingSoon ? "cursor-default" : ""}`;
          const cardInner = (
            <>
              {c.video ? (
                <LazyCaseVideo
                  src={c.video}
                  poster={c.image}
                  label={`${c.title}, ${c.subtitle} af Horizen`}
                />
              ) : (
                <img
                  src={c.image}
                  srcSet={c.srcSet}
                  sizes={c.srcSet ? (i >= 6 ? WIDE_CARD_SIZES : CARD_SIZES) : undefined}
                  alt={c.imageAlt ?? `${c.title}, ${c.subtitle} af Horizen`}
                  loading="lazy"
                  style={
                    c.imagePosition
                      ? { objectPosition: c.imagePosition }
                      : undefined
                  }
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              )}
              {c.hoverVideo && (
                <HoverCaseVideo src={c.hoverVideo} backdrop={c.hoverVideoBackdrop}
                  label={`${c.title}, video af hjemmesiden`}
                />
              )}

              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
              />

              {c.comingSoon && (
                <div className="absolute top-4 left-4 z-10 rounded-full bg-foreground/90 px-3 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur-sm md:top-5 md:left-5">
                  Kommer snart
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-foreground">
                    {c.logo ? (
                      <img
                        src={c.logo}
                        alt={`${c.title} bomærke`}
                        loading="lazy"
                        className="size-7 object-contain"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-white/80">
                        {c.initials ?? c.title.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-white md:text-lg">
                      {c.title}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-white/70 md:text-sm">
                      {c.subtitle}
                    </p>
                  </div>
                </div>

                {!c.comingSoon && (
                  <div className="flex shrink-0 translate-x-2 items-center gap-1.5 text-sm font-medium text-white opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                    Se case
                    <ArrowRightIcon className="size-4" />
                  </div>
                )}
              </div>
            </>
          );

          return (
            <motion.div
              key={caseHref(c)}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeIn}
              className={SPANS[i]}
            >
              {c.comingSoon ? (
                <div className={cardClassName} aria-disabled="true">
                  {cardInner}
                </div>
              ) : (
                <Link href={caseHref(c)} className={cardClassName}>
                  {cardInner}
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>

      <Link
        href="/cases"
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold sm:hidden"
      >
        Se alle cases
        <ArrowRightIcon className="size-4" />
      </Link>
    </Container>
  );
}

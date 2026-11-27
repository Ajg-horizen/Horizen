"use client";

import { useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { TestimonialBody } from "@/components/FeaturedTestimonial";
import { fadeIn, fadeUp } from "@/lib/animations";
import { PASTEL, PASTEL_ORDER } from "@/lib/pastel-tones";
import { visibleCases, caseHref, type CaseStudy } from "@/lib/cases";
import type { Testimonial } from "@/lib/testimonials";
import {
  DisciplinesSection,
  StorySection,
  VisibilitySection,
  type CaseStory,
  type Disciplines,
  type Visibility,
} from "@/components/CaseResults";

/**
 * Fælles skabelon til case-sider. Samme opbygning som de håndbyggede sider
 * (Ensemble Hermes m.fl.), men alt indhold kommer fra et CaseDetail-objekt,
 * så en ny case kun er tekst og billeder.
 */

type TextBlock = { eyebrow: string; heading: string; paragraphs: string[] };

export type CaseDetail = {
  /** Casen i den fælles liste (titel, ydelser, team, link til live site). */
  base: CaseStudy;
  year: string;
  hero: {
    image: string;
    /** Mindre udgaver til mobil, fx "/x-800w.webp 800w, /x-1600w.webp 1600w". */
    srcSet?: string;
    position?: string;
    /** Skub billedet op med denne procentdel, så mere af bunden ses (fx 10). */
    shiftUp?: number;
    /** Beskrivende alt-tekst. Uden den bruges "<titel>, <ydelser> af Horizen". */
    alt?: string;
    /** Fotografen bag billederne. Vises i infolinjen med link til hjemmesiden. */
    photographer?: { name: string; url?: string };
  };
  /** Kort tekst i hero-kortet. */
  intro: string;
  /** Udfordring og løsning hver for sig. Bruges kun, når `story` ikke er sat. */
  challenge?: TextBlock;
  solution?: TextBlock;
  /** Mørk sektion med tre søjler. */
  highlight: TextBlock & {
    pillars: { title: string; text: string; icon?: LucideIcon }[];
  };
  deliverables: { icon: LucideIcon; title: string; text: string }[];
  /** Resultater i tal. Kun verificerede tal. */
  stats?: { value: string; label: string }[];
  testimonial?: Testimonial;
  /**
   * Hvor kundecitatet står. "story" = lige efter udgangspunktet (godt til
   * korte citater om samarbejdet). Standard: nederst før teknologierne.
   */
  testimonialAfter?: "story" | "end";
  technologies: string[];
  /**
   * Valgfrit: udgangspunktet samlet i én redaktionel sektion (overskrift,
   * prosa og nøgletal). Når den er sat, erstatter den challenge og solution.
   */
  story?: CaseStory;
  /** Valgfrit: målt synlighed i Google før og efter. */
  visibility?: Visibility;
  /** Valgfrit: discipliner vi arbejder med løbende, fx SEO. */
  disciplines?: Disciplines;
};

const inView = {
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, margin: "-100px" },
  variants: fadeIn,
};

function TwoColumn({ block }: { block: TextBlock }) {
  return (
    <div className="grid gap-12 md:grid-cols-2 md:gap-16">
      <motion.div {...inView} custom={0}>
        <ScrambleEyebrow>{block.eyebrow}</ScrambleEyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          {block.heading}
        </h2>
      </motion.div>
      <motion.div {...inView} custom={1}>
        {block.paragraphs.map((p, i) => (
          <p
            key={i}
            className={`text-base leading-relaxed text-muted ${i ? "mt-4" : ""}`}
          >
            {p}
          </p>
        ))}
      </motion.div>
    </div>
  );
}

export default function CaseStudyPage({ detail }: { detail: CaseDetail }) {
  const { base } = detail;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 800], [0, 160]);
  const imageScale = useTransform(scrollY, [0, 400], [1, 1.15]);
  const overlayOpacity = useTransform(scrollY, [0, 300], [0.4, 0]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const contentY = useTransform(scrollY, [0, 400], [0, 80]);

  const otherCases = visibleCases
    .filter((c) => c.slug !== base.slug && !c.noCasePage)
    .slice(0, 3);

  return (
    <main>
      <Navbar alwaysVisible />

      <Container size="site" noPadding>
        {/* Hero */}
        <section
          className="relative -mt-3 mx-[calc(50%-50vw)] h-screen w-screen overflow-hidden"
          style={{
            boxShadow: "0 0 0 100vmax #000",
            clipPath: "inset(0 -100vmax)",
          }}
        >
          <motion.img
            src={detail.hero.image}
            srcSet={detail.hero.srcSet}
            sizes={detail.hero.srcSet ? "100vw" : undefined}
            alt={
              detail.hero.alt ?? `${base.title}, ${base.subtitle} af Horizen`
            }
            fetchPriority="high"
            decoding="async"
            style={{
              y: imageY,
              scale: imageScale,
              objectPosition: detail.hero.position,
              top: detail.hero.shiftUp ? `-${detail.hero.shiftUp}%` : undefined,
            }}
            className="absolute inset-0 h-[120%] w-full object-cover"
          />
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-black"
          />

          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="absolute inset-0 z-10"
          >
            <motion.div
              custom={0.4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="absolute right-[calc(1.25rem+1.5rem)] bottom-32 left-[calc(1.25rem+1.5rem)] max-w-2xl md:right-auto md:bottom-12 md:left-[calc(1.25rem+2.5rem)] lg:left-[calc(1.25rem+4rem)]"
            >
              <div className="rounded-2xl border border-white/[0.15] bg-white/[0.08] p-8 shadow-2xl backdrop-blur-2xl backdrop-saturate-150">
                <ScrambleEyebrow className="text-xs font-medium tracking-[0.3em] text-white/60 uppercase">
                  {base.subtitle}
                </ScrambleEyebrow>
                <motion.h1
                  custom={0.6}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
                >
                  {base.title}
                </motion.h1>
                <motion.p
                  custom={0.8}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="mt-4 text-sm leading-relaxed text-white/70 md:text-base"
                >
                  {detail.intro}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Meta */}
        <Container
          as="section"
          size="site"
          className="border-y border-foreground/[0.06] py-12"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`grid grid-cols-2 gap-8 ${detail.hero.photographer ? "md:grid-cols-3 lg:grid-cols-5" : "md:grid-cols-4"}`}
          >
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
                Klient
              </p>
              <p className="mt-2 text-sm font-semibold">{base.title}</p>
            </div>
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
                År
              </p>
              <p className="mt-2 text-sm font-semibold">{detail.year}</p>
            </div>
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
                Kategori
              </p>
              <p className="mt-2 text-sm font-semibold">{base.subtitle}</p>
            </div>
            {base.team && base.team.length > 0 ? (
              <div>
                <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
                  Team
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {base.team.map((m) => (
                    <img
                      key={m.name}
                      src={m.avatar}
                      alt={m.name}
                      title={m.name}
                      className="h-7 w-7 rounded-full border-2 border-background object-cover"
                    />
                  ))}
                </div>
              </div>
            ) : base.liveUrl ? (
              <div>
                <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
                  Live
                </p>
                <a
                  href={base.liveUrl}
                  target="_blank"
                  rel="noopener"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-semibold"
                >
                  {base.liveUrl.replace(/^https?:\/\//, "")}
                  <ArrowUpRightIcon className="size-3.5" />
                </a>
              </div>
            ) : null}
            {detail.hero.photographer && (
              <div>
                <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
                  Fotograf
                </p>
                {detail.hero.photographer.url ? (
                  <a
                    href={detail.hero.photographer.url}
                    target="_blank"
                    rel="noopener"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold"
                  >
                    {detail.hero.photographer.name}
                    <ArrowUpRightIcon className="size-3.5" />
                  </a>
                ) : (
                  <p className="mt-2 text-sm font-semibold">
                    {detail.hero.photographer.name}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </Container>

        {/* Udgangspunktet: enten samlet (story) eller udfordring + løsning hver for sig */}
        {detail.story && <StorySection data={detail.story} />}
        {!detail.story && detail.challenge && (
          <Container as="section" size="site" className="py-24">
            <TwoColumn block={detail.challenge} />
          </Container>
        )}
        {!detail.story && detail.solution && (
          <section className="mx-4 rounded-3xl bg-accent/50 py-24 md:mx-8">
            <Container size="site">
              <TwoColumn block={detail.solution} />
            </Container>
          </section>
        )}

        {/* Kundens egne ord, lige efter historien */}
        {detail.testimonial && detail.testimonialAfter === "story" && (
          <Container
            as="section"
            size="site"
            className="border-t border-foreground/[0.06] py-24"
          >
            <TestimonialBody testimonial={detail.testimonial} align="center" />
          </Container>
        )}

        {/* Resultater: synlighed og løbende indsatser */}
        {detail.visibility && <VisibilitySection data={detail.visibility} />}
        {detail.disciplines && <DisciplinesSection data={detail.disciplines} />}

        {/* Under overfladen */}
        <section
          className="bg-[#0f0f0f] text-[#f5f5f0]"
          style={{
            boxShadow: "0 0 0 100vmax #0f0f0f",
            clipPath: "inset(0 -100vmax)",
          }}
        >
          <Container size="site" className="py-24">
            <motion.div {...inView} custom={0} className="max-w-2xl">
              <ScrambleEyebrow className="text-xs font-medium tracking-[0.3em] text-white/40 uppercase">
                {detail.highlight.eyebrow}
              </ScrambleEyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight whitespace-pre-line md:text-4xl">
                {detail.highlight.heading}
              </h2>
              {detail.highlight.paragraphs.map((p, i) => (
                <p key={i} className="mt-4 leading-relaxed text-white/60">
                  {p}
                </p>
              ))}
            </motion.div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {detail.highlight.pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeIn}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6"
                >
                  {pillar.icon && (
                    <pillar.icon
                      className="mb-5 h-6 w-6 text-white/70"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  )}
                  <p className="text-lg font-semibold">{pillar.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {pillar.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {detail.stats && detail.stats.length > 0 && (
              <div className="mt-16 grid gap-10 border-t border-white/[0.08] pt-12 sm:grid-cols-2 lg:grid-cols-3">
                {detail.stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-4xl font-bold tracking-tight md:text-5xl">
                      {s.value}
                    </p>
                    <p className="mt-2 text-sm text-white/50">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            <motion.div
              custom={1.2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="mt-12 flex flex-wrap gap-4"
            >
              <a
                href="/kontakt"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-8 py-3.5 text-sm font-medium transition-colors duration-300 hover:bg-white/90"
                style={{ color: "#0f0f0f" }}
              >
                Start et projekt
                <ArrowRightIcon className="size-4" />
              </a>
              {base.liveUrl && (
                <a
                  href={base.liveUrl}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-white/10"
                >
                  Besøg sitet
                  <ArrowUpRightIcon className="size-4" />
                </a>
              )}
            </motion.div>
          </Container>
        </section>

        {/* Leverancer */}
        <Container as="section" size="site" className="py-24">
          <motion.div {...inView} custom={0} className="mb-14 max-w-2xl">
            <ScrambleEyebrow>Hvad vi leverede</ScrambleEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Det hele, ét sted
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {detail.deliverables.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeIn}
                  className="flex gap-5 rounded-2xl border border-foreground/[0.06] bg-accent/30 p-6"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${PASTEL[PASTEL_ORDER[i % PASTEL_ORDER.length]].bg} ${PASTEL[PASTEL_ORDER[i % PASTEL_ORDER.length]].ink}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Container>

        {/* Kundecitat */}
        {detail.testimonial && detail.testimonialAfter !== "story" && (
          <Container
            as="section"
            size="site"
            className="border-t border-foreground/[0.06] py-24"
          >
            <TestimonialBody testimonial={detail.testimonial} align="center" />
          </Container>
        )}

        {/* Teknologi */}
        <Container
          as="section"
          size="site"
          className="border-t border-foreground/[0.06] py-24"
        >
          <motion.div {...inView} custom={0}>
            <ScrambleEyebrow>Tech stack</ScrambleEyebrow>
            <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
              Bygget med
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {detail.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-foreground/[0.08] bg-accent/50 px-4 py-2 text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </Container>

        {/* Andre cases */}
        <Container
          as="section"
          size="site"
          className="border-t border-foreground/[0.06] py-24"
        >
          <motion.div {...inView} custom={0} className="mb-10">
            <ScrambleEyebrow>Mere arbejde</ScrambleEyebrow>
            <div className="mt-4 flex items-end justify-between">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Andre cases
              </h2>
              <Link
                href="/cases"
                className="group flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-300 hover:text-foreground"
              >
                Se alle
                <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {otherCases.map((c, i) => (
              <motion.div
                key={c.slug}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeIn}
              >
                <Link href={caseHref(c)} className="group block">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-accent">
                    <img
                      src={c.image}
                      srcSet={c.srcSet}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      alt={c.imageAlt ?? `${c.title}, ${c.subtitle} af Horizen`}
                      loading="lazy"
                      style={
                        c.imagePosition
                          ? { objectPosition: c.imagePosition }
                          : undefined
                      }
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {c.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{c.subtitle}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>

        <Footer />
      </Container>
    </main>
  );
}

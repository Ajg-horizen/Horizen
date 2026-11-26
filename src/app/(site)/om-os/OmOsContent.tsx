"use client";

/**
 * Om os. Bygget med sitets egne mønstre (hero som service-siderne, ScrambleEyebrow,
 * to-delte overskrifter, PositioningBlock, ProcessBlock, GradientCtaBlock).
 * Kun opbygningen og informationsmængden er inspireret udefra, ikke det visuelle.
 * Holdet vises tre ad gangen med navn på et glas-mærke.
 * Billederne ligger i fuld opløsning i public/team (public/staff er små avatarer).
 */

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRightIcon, ClockIcon, KeyRoundIcon, SparklesIcon, UsersIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import PositioningBlock from "@/components/blocks/PositioningBlock";
import ProcessBlock from "@/components/blocks/ProcessBlock";
import GradientCtaBlock from "@/components/blocks/GradientCtaBlock";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeUp, fadeIn } from "@/lib/animations";
import { getService, type ProcessBlock as ProcessBlockData } from "@/lib/services";

type Member = {
  id: string;
  name: string;
  role: string;
  src: string;
  /** Fokuspunkt i billedet, så ansigtet ikke beskæres. */
  position?: string;
};

// Roller som de står på forsiden i dag.
const team: Member[] = [
  { id: "andreas-jose", name: "Andreas José", role: "Founder · Digital design og udvikling", src: "/team/andreas-jose.jpg", position: "68% 30%" },
  { id: "johanne", name: "Johanne", role: "Webdesign og udvikling", src: "/team/johanne.avif", position: "50% 30%" },
  { id: "anne-sofie", name: "Anne-Sofie", role: "Marketing og strategi", src: "/team/anne-sofie.webp" },
  { id: "ludvig", name: "Ludvig", role: "Kommunikation og salg", src: "/team/ludvig.webp" },
  { id: "sebastian", name: "Sebastian", role: "Meta-annoncering", src: "/team/sebastian.jpg" },
  { id: "gurli", name: "Gurli", role: "Kontorhund", src: "/team/gurli.webp" },
];

const heroIds = ["johanne", "andreas-jose", "anne-sofie"];

const pillars = [
  {
    icon: ClockIcon,
    accent: "#00b67a",
    title: "Tid tilbage, hver dag",
    body: "Tandsundhed Uden Grænser brugte tre timer om dagen på at opdatere deres side. Nu tager det en halv time.",
  },
  {
    icon: SparklesIcon,
    accent: "#e8915a",
    title: "Erfaring først, AI bagefter",
    body: "AI gør os hurtigere. Vi bruger tiden på at gøre arbejdet bedre, ikke på at gøre mindre.",
  },
  {
    icon: KeyRoundIcon,
    accent: "#6b8aed",
    title: "Du ejer alt",
    body: "Kode, design og filer er jeres. Vi binder jer ikke til os.",
  },
];

// Samme proces som webudviklingssiden, så den kun vedligeholdes ét sted.
const process = getService("webudvikling")?.blocks.find(
  (b): b is ProcessBlockData => b.type === "process",
);

const reveal = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, margin: "-80px" },
  variants: fadeIn,
} as const;

export default function OmOsContent() {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <main>
      <Navbar alwaysVisible />

      {/* Hero: samme opbygning som service-siderne, med holdet som billede */}
      <section className="relative pt-32 pb-0">
        <div
          className="fixed inset-0 -z-10 pointer-events-none opacity-[0.55] lg:opacity-[0.45]"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/graphics/bg-control.svg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 100%)",
            }}
          />
        </div>

        <Container size="site">
          <div className="max-w-3xl">
            <motion.div custom={0.2} initial="hidden" animate="visible" variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-foreground/[0.08] bg-accent/50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
                <UsersIcon className="size-3" />
                Om Horizen
              </span>
            </motion.div>
            <motion.h1
              custom={0.5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-6 text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl md:text-5xl"
            >
              Alle sælger hjemmesider.{" "}
              <span className="text-muted">Vi bygger det, der sparer jer tid hver dag.</span>
            </motion.h1>
            <motion.p
              custom={1.0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-4 max-w-lg text-base leading-relaxed text-muted"
            >
              Et lille digitalt design bureau i Aarhus med 8+ års erfaring. Vi bygger
              hjemmesider og løsninger, der gør jeres hverdag lettere.
            </motion.p>
            <motion.div custom={1.4} initial="hidden" animate="visible" variants={fadeUp} className="mt-6">
              <a
                href="/kontakt"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ color: "#f5f5f0" }}
              >
                Tag en snak
                <ArrowRightIcon className="size-3.5" />
              </a>
            </motion.div>
          </div>
        </Container>

        {/* Billedbånd i fuld bredde som på service-siderne, her tre portrætter */}
        <motion.div
          ref={imageRef}
          custom={1.8}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative mt-12 grid aspect-[16/9] w-full grid-cols-2 overflow-hidden sm:aspect-[21/8] sm:grid-cols-3"
        >
          {heroIds.map((id, i) => {
            const m = team.find((t) => t.id === id)!;
            return (
              <div key={id} className={`relative overflow-hidden ${i === 2 ? "hidden sm:block" : ""}`}>
                <motion.div className="absolute inset-[-8%_0]" style={{ y: imageY }}>
                  <Image
                    src={m.src}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 640px) 34vw, 50vw"
                    className="object-cover"
                    style={{ objectPosition: m.position ?? "50% 35%" }}
                  />
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* Resten ligger over hero-gitteret, som på service-siderne */}
      <div className="relative z-10 bg-background">
        {/* Om Horizen: tre søjler */}
        <Container as="section" size="site" className="py-24 md:py-32">
          <motion.div {...reveal} custom={0} className="max-w-2xl">
            <ScrambleEyebrow>Det vi bygger</ScrambleEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Fra 3 timer til 30 minutter om dagen.
              <br />
              <span className="text-muted">Det er det, vi måler på.</span>
            </h2>
          </motion.div>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div key={p.title} {...reveal} custom={i + 1}>
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${p.accent}20` }}
                  >
                    <Icon className="size-5" style={{ color: p.accent }} />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
                </motion.div>
              );
            })}
          </div>
        </Container>

        {/* Holdet */}
        <Container as="section" id="holdet" size="site" className="pb-24 md:pb-32 scroll-mt-24">
          <motion.div {...reveal} custom={0} className="mb-12 max-w-2xl">
            <ScrambleEyebrow>Holdet</ScrambleEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Få mennesker.
              <br />
              <span className="text-muted">Alle tæt på arbejdet.</span>
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              Andreas José startede som webudvikler i 2014 og blev siden mediegrafiker og
              digital designer. I 2024 blev det til Horizen.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {team.map((m, i) => (
              <motion.figure
                key={m.id}
                id={m.id}
                custom={i % 3}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeIn}
                className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-accent scroll-mt-28"
              >
                <Image
                  src={m.src}
                  alt={`${m.name}, ${m.role} hos Horizen`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  style={{ objectPosition: m.position ?? "50% 35%" }}
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent"
                  aria-hidden="true"
                />
                <figcaption className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto">
                  <div className="inline-flex flex-col rounded-2xl border border-white/25 bg-white/15 px-5 py-3.5 text-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl backdrop-saturate-150">
                    <span className="text-lg font-semibold tracking-tight">{m.name}</span>
                    <span className="text-sm text-white/80">{m.role}</span>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </Container>

        {/* Det vi tror på + tal */}
        <PositioningBlock
          id="det-vi-tror-paa"
          data={{
            type: "positioning",
            eyebrow: "Det vi tror på",
            heading: { lead: "Vi tror ikke på et mig.", mutedTail: "Vi tror på et os." },
            paragraphs: [
              "Det er holdet, der tæller, ikke den enkelte. Vi lytter til hinanden, og ingen holdning er så stærk, at den får lov at bremse resten af os.",
              "Tiden ændrer sig hurtigt, og vi ændrer os med den. For jer betyder det, at den bedste idé vinder, uanset hvem den kommer fra.",
            ],
            stats: [
              { value: "8+", label: "års erfaring" },
              { value: "150+", label: "projekter" },
              { value: "4,4", label: "på Trustpilot" },
              { value: "1", label: "kontorhund" },
            ],
          }}
        />

        {/* Sådan arbejder vi: sitets egen proces-blok */}
        {process && <ProcessBlock id="proces" data={process} />}

        <GradientCtaBlock
          data={{
            type: "gradientCta",
            heading: "Det hele kunne starte her.",
            body: "Vi hører altid gerne om jeres visioner, og hvordan vi i fællesskab kan bygge dem.",
            primaryCta: { label: "Tag en snak", href: "/kontakt" },
            secondaryCta: { label: "ajg@horizen.dk", href: "mailto:ajg@horizen.dk" },
          }}
        />

        <Footer />
      </div>
    </main>
  );
}

"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRightIcon,
  PenToolIcon,
  MousePointerClickIcon,
  GitBranchIcon,
  TriangleIcon,
  DatabaseIcon,
  BrushIcon,
  GlobeIcon,
  LayersIcon,
  ClockIcon,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp, fadeUp } from "@/lib/animations";
import Container from "@/components/Container";
import { TestimonialBody } from "@/components/FeaturedTestimonial";
import { getTestimonial } from "@/lib/testimonials";

const project = {
  title: "Ensemble Hermes",
  category: "Webdesign · UI/UX · Redesign",
  year: "2026",
  client: "Ensemble Hermes",
  image: "/cases/Hermes-billede.webp",
  description:
    "Ensemble Hermes havde en Wix-side der var svær at navigere og tung at vedligeholde. Vi byggede et nyt fundament fra bunden. Et system til koncertoversigten, en enklere brugerflade og et CMS de selv styrer.",
  team: [
    {
      name: "José",
      role: "Webdesign & Udvikling",
      avatar: "/staff/staff-jose-digital-design.jpg",
    },
    {
      name: "Anne-Sofie",
      role: "Marketing & Strategi",
      avatar: "/staff/staff-Marketing-ansvarlig-Anne-Sofie.webp",
    },
  ],
  deliverables: [
    {
      icon: BrushIcon,
      title: "Redesign & ny UI",
      text: "En enklere brugerflade hele vejen igennem, hvor publikum hurtigt finder rundt.",
    },
    {
      icon: LayersIcon,
      title: "Koncertoversigt-system",
      text: "Hver opførelse oprettes ét sted og lander automatisk i oversigten, altid opdateret.",
    },
    {
      icon: DatabaseIcon,
      title: "Headless CMS",
      text: "Fuldt ejerskab over indholdet. Ensemble Hermes redigerer selv, uden at kæmpe med systemet.",
    },
    {
      icon: ClockIcon,
      title: "Løbende drift & service",
      text: "Vi står for vedligehold og videreudvikling, så fundamentet bliver ved med at holde.",
    },
  ],
  technologies: [
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Headless CMS",
    "Vercel",
    "Figma",
  ],
  tools: [
    { name: "Figma", icon: PenToolIcon },
    { name: "Cursor", icon: MousePointerClickIcon },
    { name: "GitHub", icon: GitBranchIcon },
    { name: "Vercel", icon: TriangleIcon },
    { name: "Sanity", icon: DatabaseIcon },
    { name: "Adobe", icon: BrushIcon },
    { name: "Google", icon: GlobeIcon },
    { name: "Layers", icon: LayersIcon },
  ],
  otherCases: [
    {
      title: "Tandsundhed Uden Grænser",
      href: "/cases/tandsundhed-uden-graenser",
      image: "/cases/Tand-sundhed-hero-image.webp",
      category: "Webdesign · CMS · Udvikling",
    },
    {
      title: "OD Pro",
      href: "/cases/od-biler-pro",
      image: "/cases/OD-Cases-image-car.webp",
      category: "Webdesign · Udvikling",
    },
    {
      title: "BettrPlans",
      href: "/cases/bettrplans",
      image: "/cases/BettrPlans-Case-Image-01.webp",
      category: "Webdesign · Branding",
    },
  ],
};

export default function CaseContent() {
  const heroImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { scrollY } = useScroll();

  const imageY = useTransform(scrollY, [0, 800], [0, 160]);
  const imageScale = useTransform(scrollY, [0, 400], [1, 1.15]);
  const overlayOpacity = useTransform(scrollY, [0, 300], [0.4, 0]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const contentY = useTransform(scrollY, [0, 400], [0, 80]);

  return (
    <main>
      <Navbar alwaysVisible />

      <Container size="site" noPadding>
        {/* Hero */}
        <section
          ref={heroImageRef}
          className="relative h-screen w-screen overflow-hidden -mt-3 mx-[calc(50%-50vw)]"
          style={{ boxShadow: "0 0 0 100vmax #000", clipPath: "inset(0 -100vmax)" }}
        >
          <motion.img
            src={project.image}
            alt={project.title}
            style={{ y: imageY, scale: imageScale }}
            className="absolute inset-0 w-full h-[120%] object-cover"
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
              className="absolute bottom-32 md:bottom-12 left-[calc(1.25rem+1.5rem)] right-[calc(1.25rem+1.5rem)] md:left-[calc(1.25rem+2.5rem)] md:right-auto lg:left-[calc(1.25rem+4rem)] max-w-2xl"
            >
              <div className="rounded-2xl border border-white/[0.15] bg-white/[0.08] backdrop-blur-2xl backdrop-saturate-150 p-8 shadow-2xl">
                <ScrambleEyebrow className="text-xs font-medium tracking-[0.3em] text-white/60 uppercase">
                  {project.category}
                </ScrambleEyebrow>

                <motion.h1
                  custom={0.6}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
                >
                  {project.title}
                </motion.h1>

                <motion.p
                  custom={0.8}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  className="mt-4 text-sm text-white/70 leading-relaxed md:text-base"
                >
                  {project.description}
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0, duration: 1 }}
              className="absolute bottom-16 right-[calc(1.25rem+1.5rem)] hidden sm:flex items-center gap-2 md:right-[calc(1.25rem+2.5rem)] lg:right-[calc(1.25rem+4rem)]"
            >
              <span
                className="text-xs font-bold tracking-[0.2em] uppercase"
                style={{
                  background:
                    "linear-gradient(90deg, #ffffff 40%, #888 50%, #ffffff 60%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "shimmer-slow 6s linear infinite",
                }}
              >
                Scroll
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="animate-[bounce_2s_ease-in-out_infinite]"
              >
                <path
                  d="M8 3v10m0 0l-3-3m3 3l3-3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/60"
                />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        {/* Meta */}
        <Container as="section" size="site" className="py-12 border-y border-foreground/[0.06]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Klient</p>
              <p className="mt-2 text-sm font-semibold">{project.client}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{"År"}</p>
              <p className="mt-2 text-sm font-semibold">{project.year}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Kategori</p>
              <p className="mt-2 text-sm font-semibold">{project.category}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Team</p>
              <div className="mt-2 flex items-center gap-2">
                {project.team.map((member) => (
                  <img
                    key={member.name}
                    src={member.avatar}
                    alt={member.name}
                    title={`${member.name}, ${member.role}`}
                    className="h-7 w-7 rounded-full border-2 border-background object-cover"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </Container>

        {/* Udfordringen */}
        <Container as="section" size="site" className="py-24">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={0}
              variants={fadeInUp}
            >
              <ScrambleEyebrow>Udfordringen</ScrambleEyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                En Wix-side der stod i vejen
              </h2>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={1}
              variants={fadeInUp}
            >
              <p className="text-base text-muted leading-relaxed">
                Ensemble Hermes skaber utraditionelle koncertprojekter, men
                hjemmesiden fulgte ikke med. Den gamle Wix-side var svær at
                navigere, og efterhånden som den voksede, blev den kun mere
                uoverskuelig.
              </p>
              <p className="mt-4 text-base text-muted leading-relaxed">
                Hver ny koncert betød manuelt arbejde, og brugerfladen føltes
                tungere for hvert lag der kom til. Publikum brugte for lang tid
                på at finde det næste de kunne opleve.
              </p>
            </motion.div>
          </div>
        </Container>

        {/* Løsningen */}
        <section className="py-24 bg-accent/50 rounded-3xl mx-4 md:mx-8">
          <Container size="site">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                custom={0}
                variants={fadeInUp}
              >
                <ScrambleEyebrow>Løsningen</ScrambleEyebrow>
                <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                  Et nyt fundament, bygget til at vokse
                </h2>
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                custom={1}
                variants={fadeInUp}
              >
                <p className="text-base text-muted leading-relaxed">
                  Vi byggede sitet op fra bunden med et system skabt til deres
                  hverdag. Koncerterne styres nu ét sted og falder automatisk på
                  plads i oversigten, så publikum hurtigt finder det næste de kan
                  opleve.
                </p>
                <p className="mt-4 text-base text-muted leading-relaxed">
                  Brugerfladen er gjort enklere hele vejen igennem, og et
                  headless CMS giver Ensemble Hermes fuldt ejerskab over
                  indholdet. De opdaterer selv, uden at skulle kæmpe med
                  systemet.
                </p>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Systemet */}
        <section
          className="bg-[#0f0f0f] text-[#f5f5f0]"
          style={{ boxShadow: "0 0 0 100vmax #0f0f0f", clipPath: "inset(0 -100vmax)" }}
        >
          <Container size="site" className="py-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={0}
              variants={fadeInUp}
              className="max-w-2xl"
            >
              <ScrambleEyebrow className="text-xs font-medium tracking-[0.3em] text-white/40 uppercase">
                Under overfladen
              </ScrambleEyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                Koncerterne samlet ét sted
              </h2>
              <p className="mt-4 text-white/60 leading-relaxed">
                Kernen er et system til koncertoversigten. Hver opførelse
                oprettes én gang og lander automatisk de rigtige steder,
                kronologisk og altid opdateret. Det der før var manuelt arbejde,
                sker nu af sig selv.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Ét sted at styre",
                  text: "Koncerter oprettes og redigeres samlet, uden dobbeltarbejde.",
                },
                {
                  title: "Altid opdateret",
                  text: "Oversigten holder sig selv aktuel, så publikum finder det næste.",
                },
                {
                  title: "Fuldt ejerskab",
                  text: "Et headless CMS Ensemble Hermes selv styrer. De ejer det hele.",
                },
              ].map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6"
                >
                  <p className="text-lg font-semibold">{pillar.title}</p>
                  <p className="mt-2 text-sm text-white/50 leading-relaxed">
                    {pillar.text}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              custom={1.2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="mt-12"
            >
              <p className="text-white/60 leading-relaxed">
                Og vi bliver ved. Løbende drift og service holder fundamentet på
                plads, længe efter lanceringen.
              </p>
              <a
                href="/kontakt"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-8 py-3.5 text-sm font-medium transition-all duration-300 hover:bg-white/90"
                style={{ color: "#0f0f0f" }}
              >
                Start et projekt
                <ArrowRightIcon className="size-4" />
              </a>
            </motion.div>
          </Container>
        </section>

        {/* Leverancer */}
        <Container as="section" size="site" className="py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
            variants={fadeInUp}
            className="mb-14 max-w-2xl"
          >
            <ScrambleEyebrow>Hvad vi leverede</ScrambleEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Fra Wix til holdbart fundament
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {project.deliverables.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeInUp}
                  className="flex gap-5 rounded-2xl border border-foreground/[0.06] bg-accent/30 p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-foreground">
                    <Icon className="h-5 w-5 text-background" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Container>

        {/* Kundecitat */}
        <Container as="section" size="site" className="py-24 border-t border-foreground/[0.06]">
          <TestimonialBody
            testimonial={getTestimonial("rebecca-hermes")}
            align="center"
          />
        </Container>

        {/* Tools & Teknologier */}
        <Container as="section" size="site" className="py-24 border-t border-foreground/[0.06]">
          <div className="grid gap-16 md:grid-cols-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={0}
              variants={fadeInUp}
            >
              <ScrambleEyebrow>Tech stack</ScrambleEyebrow>
              <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
                Bygget med
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-foreground/[0.08] bg-accent/50 px-4 py-2 text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={1}
              variants={fadeInUp}
            >
              <ScrambleEyebrow>{"Værktøjer"}</ScrambleEyebrow>
              <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
                Brugt i processen
              </h2>
              <div className="mt-6 grid grid-cols-4 gap-4">
                {project.tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.name}
                      className="group flex flex-col items-center gap-2"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-foreground/[0.06] bg-accent/30 transition-all duration-300 group-hover:border-foreground/[0.12] group-hover:bg-accent/60">
                        <Icon className="h-6 w-6 text-foreground/70 transition-colors duration-300 group-hover:text-foreground" />
                      </div>
                      <span className="text-xs text-muted text-center leading-tight">
                        {tool.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </Container>

        {/* Andre cases */}
        <Container as="section" size="site" className="py-24 border-t border-foreground/[0.06]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
            variants={fadeInUp}
            className="mb-10"
          >
            <ScrambleEyebrow>Mere arbejde</ScrambleEyebrow>
            <div className="mt-4 flex items-end justify-between">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Andre cases
              </h2>
              <Link
                href="/#cases"
                className="group flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-300 hover:text-foreground"
              >
                Se alle
                <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {project.otherCases.map((item, i) => (
              <motion.div
                key={item.href}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
              >
                <Link href={item.href} className="group block">
                  <div className="overflow-hidden rounded-2xl bg-accent aspect-[4/3]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{item.category}</p>
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

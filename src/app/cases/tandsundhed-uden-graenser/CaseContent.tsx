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

const project = {
  title: "Tandsundhed Uden Grænser",
  category: "Webdesign · UI/UX · CMS",
  year: "2025",
  client: "Tandsundhed Uden Grænser",
  image: "/cases/smilende_kvinde_fra_Mongoliet.webp",
  description:
    "Komplet redesign og ny visuel identitet for en NGO der kæmper for bedre tandsundhed globalt — fra forældet WPBakery-site til et skræddersyet CMS der sparer timer hver dag.",
  team: [
    {
      name: "Johanne",
      role: "Webdesign & Udvikling",
      avatar: "/staff/staff-Web-udvikler-designer-Johanne-horizen.avif",
    },
    {
      name: "Anne-Sofie",
      role: "Marketing & Strategi",
      avatar: "/staff/staff-Marketing-ansvarlig-Anne-Sofie.webp",
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
  stats: [
    { label: "Daglig redigering før", value: "3 timer" },
    { label: "Daglig redigering nu", value: "30 min" },
    { label: "Sider migreret", value: "45+" },
    { label: "Leveringstid", value: "6 uger" },
  ],
  otherCases: [
    {
      title: "OD Pro",
      href: "/cases/od-biler-pro",
      image: "/cases/OD-Cases-image-car.webp",
      category: "Webdesign · Udvikling",
    },
    {
      title: "Seitz",
      href: "/cases/malerfirma-seitz",
      image: "/cases/Case-image.webp",
      category: "Webdesign · Branding",
    },
    {
      title: "Never Another",
      href: "/cases/never-another",
      image: "/cases/NA_Home5_mobile.webp",
      category: "Branding · Webdesign",
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
        className="relative h-screen w-full overflow-hidden"
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
            className="absolute bottom-12 left-6 right-6 md:left-10 md:right-auto lg:left-16 max-w-2xl"
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
            className="absolute bottom-16 right-8 hidden sm:flex items-center gap-2 md:right-12 lg:right-20"
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
                  title={`${member.name} — ${member.role}`}
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
              3 timer om dagen på simpel redigering
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
            variants={fadeInUp}
          >
            <p className="text-sm text-muted leading-relaxed">
              Tandsundhed Uden Grænser stod med en hjemmeside bygget i WPBakery
              der var stærkt forældet, visuelt utiltalende og nærmest umulig at
              vedligeholde. Teamet brugte op til 3 timer dagligt på helt basale
              redigeringer — tid der burde bruges på deres kerneopgave.
            </p>
            <p className="mt-4 text-sm text-muted leading-relaxed">
              Den eksisterende løsning manglede responsivt design, havde langsom
              loadtid, og den visuelle identitet afspejlede slet ikke
              organisationens professionelle arbejde med global tandsundhed.
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
              Skræddersyet CMS & ny identitet
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
            variants={fadeInUp}
          >
            <p className="text-sm text-muted leading-relaxed">
              Vi designede en helt ny visuel identitet og byggede sitet fra bunden
              med et skræddersyet CMS der er tilpasset organisationens daglige
              behov. Redigeringstiden gik fra 3 timer til under 30 minutter om
              dagen — en reduktion på over 83%.
            </p>
            <p className="mt-4 text-sm text-muted leading-relaxed">
              Komplet UI/UX redesign med fokus på storytelling, donationer og
              frivillig-rekruttering. Mobil-først tilgang og hurtig loadtid sikrer
              at budskabet når ud til alle platforme.
            </p>
          </motion.div>
        </div>
        </Container>
      </section>

      {/* Resultater */}
      <Container as="section" size="site" className="py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <ScrambleEyebrow>Resultater</ScrambleEyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Tal der taler
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {project.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="text-center"
            >
              <p className="text-3xl font-bold tracking-tight md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>

      {/* Performance — tid sparet */}
      <section
        className="bg-[#0f0f0f] text-[#f5f5f0]"
        style={{ boxShadow: "0 0 0 100vmax #0f0f0f", clipPath: "inset(0 -100vmax)" }}
      >
        <Container size="site" className="py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
            variants={fadeInUp}
          >
            <ScrambleEyebrow className="text-xs font-medium tracking-[0.3em] text-white/40 uppercase">
              Effektivitet
            </ScrambleEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              -83% redigeringstid
            </h2>
            <p className="mt-4 text-white/60 leading-relaxed">
              Det nye CMS transformerede teamets hverdag. Opgaver der før tog
              timer klares nu på minutter — og kvaliteten af indholdet er
              steget markant med intuitive redigeringsværktøjer.
            </p>
            <div className="mt-8 flex gap-8">
              <div>
                <p className="text-2xl font-bold">-83%</p>
                <p className="text-xs text-white/40 mt-1">Redigeringstid</p>
              </div>
              <div>
                <p className="text-2xl font-bold">+187%</p>
                <p className="text-xs text-white/40 mt-1">Organisk trafik</p>
              </div>
              <div>
                <p className="text-2xl font-bold">1.2s</p>
                <p className="text-xs text-white/40 mt-1">Load time</p>
              </div>
            </div>

            <motion.div
              custom={1.2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-10"
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-8 py-3.5 text-sm font-medium transition-all duration-300 hover:bg-white/90"
                style={{ color: "#0f0f0f" }}
              >
                Start dit projekt i dag
                <ArrowRightIcon className="size-4" />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
            variants={fadeInUp}
          >
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Timer / dag</p>
                  <p className="text-xl font-bold mt-1">Daglig redigeringstid</p>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="size-4 text-emerald-400" />
                  <span className="text-xs text-white/40">-83%</span>
                </div>
              </div>

              {/* Bar chart — before/after */}
              <div className="space-y-6">
                {/* Before */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40">Før — WPBakery</span>
                    <span className="text-sm font-bold text-white/60">3 timer</span>
                  </div>
                  <div className="h-10 w-full rounded-lg bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-lg bg-white/20"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* After */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40">Efter — Custom CMS</span>
                    <span className="text-sm font-bold text-emerald-400">30 min</span>
                  </div>
                  <div className="h-10 w-full rounded-lg bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-lg bg-emerald-400"
                      initial={{ width: 0 }}
                      whileInView={{ width: "17%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Time & money saved */}
                <motion.div
                  className="pt-6 border-t border-white/[0.06] space-y-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <ClockIcon className="size-5 text-emerald-400" />
                    <p className="text-sm text-white/60">
                      <span className="font-bold text-emerald-400">2,5 timer spart</span> hver eneste dag
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-emerald-400">700 kr</p>
                      <p className="text-[10px] text-white/30 mt-1">Spart pr. dag</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-emerald-400">15.400 kr</p>
                      <p className="text-[10px] text-white/30 mt-1">Spart pr. måned</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-emerald-400">184.800 kr</p>
                      <p className="text-[10px] text-white/30 mt-1">Spart pr. år</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/20 text-center">
                    Baseret på 280 kr/time, 22 arbejdsdage/md, 1 medarbejder
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
        </Container>
      </section>

      {/* Kundecitat */}
      <Container as="section" size="site" className="py-24 border-t border-foreground/[0.06]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeInUp}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="flex justify-center gap-0.5 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex h-6 w-6 items-center justify-center bg-[#00b67a]"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            ))}
          </div>
          <blockquote className="text-2xl md:text-3xl font-light leading-relaxed tracking-tight">
            &ldquo;Horizen gav os en hjemmeside der virkelig afspejler vores mission. Det nye CMS sparer os timer hver uge.&rdquo;
          </blockquote>
          <div className="mt-8">
            <p className="font-semibold">Tandsundhed Uden Grænser</p>
            <p className="text-sm text-muted">NGO, Danmark</p>
          </div>
        </motion.div>
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

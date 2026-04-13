"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRightIcon,
  PenToolIcon,
  MousePointerClickIcon,
  GitBranchIcon,
  TriangleIcon,
  BarChart3Icon,
  BrushIcon,
  PaletteIcon,
  TargetIcon,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp, fadeUp } from "@/lib/animations";
import Container from "@/components/Container";

const project = {
  title: "Seitz",
  category: "Branding · Webdesign · Google Ads",
  year: "2024",
  client: "Seitz",
  image: "/cases/Case-image.webp",
  description:
    "En komplet digital transformation — ny visuel identitet, moderne hjemmeside og en målrettet digital strategi der har tredoblet kundeengagementet.",
  team: [
    {
      name: "José",
      role: "Digital Design & Branding",
      avatar: "/staff/staff-jose-digital-design.jpg",
    },
    {
      name: "Ludvig",
      role: "Kommunikation & Salg",
      avatar: "/staff/staff-kommunikation-og-salg-Ludvig.webp",
    },
  ],
  technologies: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Vite",
    "Supabase",
    "Vercel",
  ],
  tools: [
    { name: "Figma", icon: PenToolIcon },
    { name: "Cursor", icon: MousePointerClickIcon },
    { name: "GitHub", icon: GitBranchIcon },
    { name: "Vercel", icon: TriangleIcon },
    { name: "Google Ads", icon: TargetIcon },
    { name: "Adobe", icon: BrushIcon },
    { name: "Analytics", icon: BarChart3Icon },
    { name: "Branding", icon: PaletteIcon },
  ],
  stats: [
    { label: "Konverteringer før", value: "1-2/uge" },
    { label: "Konverteringer nu", value: "3x mere" },
    { label: "Omkostning", value: "-40%" },
    { label: "Leveringstid", value: "5 uger" },
  ],
  otherCases: [
    {
      title: "OD Pro",
      href: "/cases/od-biler-pro",
      image: "/cases/OD-Cases-image-car.webp",
      category: "Webdesign · Udvikling",
    },
    {
      title: "Tandsundhed Uden Grænser",
      href: "/cases/tandsundhed-uden-graenser",
      image: "/cases/Tand-sundhed-hero-image.webp",
      category: "Webdesign · NGO",
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
  const overlayOpacity = useTransform(scrollY, [0, 300], [0.3, 0]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const contentY = useTransform(scrollY, [0, 400], [0, 80]);

  return (
    <main>
      <Navbar alwaysVisible />

      {/* Hero */}
      <section
        ref={heroImageRef}
        className="relative h-screen w-full overflow-hidden"
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
          <Container size="site" className="relative h-full">
          <motion.div
            custom={0.4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="absolute bottom-12 left-0 right-6 md:right-auto max-w-2xl"
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
            className="absolute bottom-16 right-0 hidden sm:flex items-center gap-2"
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
          </Container>
        </motion.div>
      </section>

      <Container size="site" noPadding>
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
              Tid til en ny retning
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
            variants={fadeInUp}
          >
            <p className="text-muted leading-relaxed">
              Seitz havde i flere år været bundet til en eksisterende
              leverandør med en løsning der ikke længere matchede virksomhedens
              ambitioner. Hjemmesiden var forældet, omkostningerne høje, og den
              digitale tilstedeværelse genererede kun 1-2 henvendelser ugentligt.
            </p>
            <p className="mt-4 text-muted leading-relaxed">
              Ved skiftet blev den eksisterende hjemmeside desværre fjernet af
              den tidligere leverandør, hvilket betød at vi skulle bygge alt op
              fra bunden — en udfordring vi tog imod med åbne arme.
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
            <ScrambleEyebrow>{"Løsningen"}</ScrambleEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              En helt ny digital identitet
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
            variants={fadeInUp}
          >
            <p className="text-muted leading-relaxed">
              Vi udviklede en komplet ny visuel identitet og byggede en moderne
              hjemmeside i et system kunden selv ejer og har fuld kontrol over.
              Løsningen er hurtigere, mere fleksibel og væsentligt mere
              omkostningseffektiv end den tidligere.
            </p>
            <p className="mt-4 text-muted leading-relaxed">
              Vi tilrettelagde en målrettet Google Ads-strategi og redesignede
              brugeroplevelsen med fokus på konvertering og troværdighed.
              Målet var at give Seitz den professionelle digitale
              tilstedeværelse som kvaliteten af deres håndværk fortjener.
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

      {/* Performance */}
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
              Performance
            </ScrambleEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              3x engagement
            </h2>
            <p className="mt-4 text-white/60 leading-relaxed">
              Med en moderne hjemmeside og en velstruktureret digital
              strategi gik Seitz fra et par ugentlige
              henvendelser til et stabilt og voksende kundeflow — med
              lavere omkostninger end tidligere.
            </p>
            <div className="mt-8 flex gap-8">
              <div>
                <p className="text-2xl font-bold">3x</p>
                <p className="text-xs text-white/40 mt-1">Mere engagement</p>
              </div>
              <div>
                <p className="text-2xl font-bold">-40%</p>
                <p className="text-xs text-white/40 mt-1">Lavere omkostning</p>
              </div>
              <div>
                <p className="text-2xl font-bold">1.4s</p>
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
                  <p className="text-xs text-white/40 uppercase tracking-wider">Henvendelser / uge</p>
                  <p className="text-xl font-bold mt-1">Konverteringer</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-white/40">3x stigning</span>
                </div>
              </div>

              {/* Before/After bars */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40">{"Før — Tidligere løsning"}</span>
                    <span className="text-sm font-bold text-white/60">1-2 / uge</span>
                  </div>
                  <div className="h-10 w-full rounded-lg bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-lg bg-white/20"
                      initial={{ width: 0 }}
                      whileInView={{ width: "33%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40">{"Efter — Horizen"}</span>
                    <span className="text-sm font-bold text-emerald-400">6-8 / uge</span>
                  </div>
                  <div className="h-10 w-full rounded-lg bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-lg bg-emerald-400"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Summary */}
                <motion.div
                  className="flex items-center justify-between pt-4 border-t border-white/[0.06]"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                >
                  <p className="text-sm text-white/60">
                    <span className="font-bold text-emerald-400">3x flere henvendelser</span> med lavere omkostning
                  </p>
                  <p className="text-sm font-bold text-emerald-400">-40% pris</p>
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
            &ldquo;Vi har fået et helt nyt udtryk der matcher den kvalitet vi leverer. Kunderne bemærker det med det samme.&rdquo;
          </blockquote>
          <div className="mt-8">
            <p className="font-semibold">Seitz</p>
            <p className="text-sm text-muted">Malerfirma, København</p>
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
                    <span className="text-[11px] text-muted text-center leading-tight">
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

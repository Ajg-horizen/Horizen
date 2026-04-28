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
  CheckIcon,
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
  title: "BettrPlans",
  category: "Branding · Webdesign · Interiør",
  year: "2023",
  client: "BettrPlans",
  image: "/cases/BettrPlans-Case-Image-02.webp",
  description:
    "Et nyt brand og en platform, der gør indretning af hjemmet mere overskueligt — fra første idé til konkret beslutning.",
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
  deliverables: [
    "Brugerresearch & målgruppeanalyse",
    "Brand & visuel identitet",
    "Logo & ikonsystem",
    "Webdesign",
    "Webudvikling",
    "CMS-opsætning",
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
              Fra koncept til konkret produkt
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
              Stifteren henvendte sig med en klar ambition: at gøre
              indretning af hjemmet mere overskueligt for almindelige
              mennesker. Idéen og retningen var på plads — men hverken
              brand, visuel identitet eller platform eksisterede endnu.
            </p>
            <p className="mt-4 text-base text-muted leading-relaxed">
              Opgaven blev at oversætte konceptet til et konkret produkt
              — fra grundig brugerforståelse til en lanceret platform,
              klar til brug fra dag ét.
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
              Hele paletten i én leverance
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
              Vi indledte med at kortlægge målgruppen og kerneopgaven,
              og udviklede derfra et komplet brand: navnunivers, logo,
              visuel identitet og tone — forankret i en fælles vision om
              et roligere og mere overskueligt indretningsforløb.
            </p>
            <p className="mt-4 text-base text-muted leading-relaxed">
              Herefter byggede vi platformen — webdesign, udvikling og et
              CMS, kunden selv kunne arbejde i. End-to-end, uden eksterne
              mellemled.
            </p>
          </motion.div>
        </div>
        </Container>
      </section>

      {/* Leverancer */}
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
              Leverancer
            </ScrambleEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Fra idé til lanceret platform
            </h2>
            <p className="mt-4 text-white/60 leading-relaxed">
              Kunden bragte idéen og ambitionen. Vi leverede alt det
              øvrige — fra indledende brugerinterviews til en lanceret
              platform. End-to-end, uden eksterne mellemled.
            </p>

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
                  <p className="text-xs text-white/40 uppercase tracking-wider">Komplet leverance</p>
                  <p className="text-xl font-bold mt-1">Det vi byggede</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-white/40">End-to-end</span>
                </div>
              </div>

              <ul className="space-y-3">
                {project.deliverables.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                    className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] px-4 py-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/15">
                      <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                    </span>
                    <span className="text-sm text-white/80">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
        </Container>
      </section>

      {/* Kundecitat — single source fra testimonials.ts */}
      <Container as="section" size="site" className="py-24 border-t border-foreground/[0.06]">
        <TestimonialBody
          testimonial={getTestimonial("saxo-bettrplans")}
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

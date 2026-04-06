"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRightIcon,
  PenToolIcon,
  CodeIcon,
  GitBranchIcon,
  TriangleIcon,
  BarChart3Icon,
  ImageIcon,
  MessageSquareIcon,
  BookOpenIcon,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp, fadeUp } from "@/lib/animations";

const project = {
  title: "OD Pro",
  category: "Webdesign · Udvikling",
  year: "2025",
  client: "Oliver Dethlefsen",
  image: "/cases/OD-Cases-image-car.webp",
  description:
    "En professionel hjemmeside for OD Pro — et bilværksted i Glostrup der tilbyder service, reparation og salg af kvalitetsbiler.",
  team: [
    {
      name: "Johanne",
      role: "Webdesign & Udvikling",
      avatar: "/staff/staff-Web-udvikler-designer-Johanne-horizen.avif",
    },
    {
      name: "José",
      role: "Digital Design",
      avatar: "/staff/staff-José-digital-design.jpg",
    },
  ],
  technologies: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "Vite",
    "Vercel",
  ],
  tools: [
    { name: "Figma", icon: PenToolIcon },
    { name: "VS Code", icon: CodeIcon },
    { name: "GitHub", icon: GitBranchIcon },
    { name: "Vercel", icon: TriangleIcon },
    { name: "Analytics", icon: BarChart3Icon },
    { name: "Adobe", icon: ImageIcon },
    { name: "ClickUp", icon: MessageSquareIcon },
    { name: "Notion", icon: BookOpenIcon },
  ],
  stats: [
    { label: "Hurtigere loadtid", value: "2.1s" },
    { label: "Mobil-først design", value: "100%" },
    { label: "Sider leveret", value: "8+" },
    { label: "Leveringstid", value: "3 uger" },
  ],
  otherCases: [
    {
      title: "Seitz",
      href: "/cases/malerfirma-seitz",
      image: "/cases/Case-image.webp",
      category: "Webdesign · Branding",
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

  // Parallax — based on pixels scrolled
  const imageY = useTransform(scrollY, [0, 800], [0, 160]);
  // Image scales up as you scroll
  const imageScale = useTransform(scrollY, [0, 400], [1, 1.15]);
  // Overlay fades out
  const overlayOpacity = useTransform(scrollY, [0, 300], [0.25, 0]);
  // Content fades out completely and moves down — gone by ~50% scroll
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const contentY = useTransform(scrollY, [0, 400], [0, 80]);

  return (
    <main>
      <Navbar alwaysVisible />

      {/* Hero — full-screen image with parallax + text overlay */}
      <section
        ref={heroImageRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* Parallax background image — scales up on scroll */}
        <motion.img
          src={project.image}
          alt={project.title}
          style={{ y: imageY, scale: imageScale }}
          className="absolute inset-0 w-full h-[120%] object-cover"
        />

        {/* Subtle dark overlay — fades out on scroll */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-black"
        />

        {/* Scroll-driven wrapper — fades out all hero content on scroll */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute inset-0 z-10"
        >
          {/* Frosted glass text box — bottom left */}
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

          {/* Scroll indicator — bottom right */}
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

      {/* Metadata bar */}
      <section className="px-6 md:px-10 lg:px-16 py-12 border-y border-foreground/[0.06]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Klient
            </p>
            <p className="mt-2 text-sm font-semibold">{project.client}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
              År
            </p>
            <p className="mt-2 text-sm font-semibold">{project.year}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Kategori
            </p>
            <p className="mt-2 text-sm font-semibold">{project.category}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Team
            </p>
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
      </section>

      {/* Udfordringen */}
      <section className="px-6 md:px-10 lg:px-16 py-24">
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
              Udgangspunktet
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
              OD Pro havde brug for en professionel online tilstedeværelse der
              afspejlede kvaliteten af deres arbejde. Den eksisterende løsning var
              forældet og ikke mobilvenlig, hvilket betød tabte kunder i en branche
              hvor førsteindtrykket er alt.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Løsningen */}
      <section className="px-6 md:px-10 lg:px-16 py-24 bg-accent/50 rounded-3xl mx-4 md:mx-8">
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
              Vores tilgang
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
              Vi designede og udviklede en moderne, hurtig hjemmeside med fokus på
              mobil-først oplevelse og konvertering. Sitet blev bygget med React og
              Tailwind CSS for at sikre hurtig loadtid og en smooth brugeroplevelse.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Resultater */}
      <section className="px-6 md:px-10 lg:px-16 py-24">
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
      </section>

      {/* Performance chart */}
      <section className="px-6 md:px-10 lg:px-16 py-24 bg-[#0f0f0f] text-[#f5f5f0]">
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
              +312% trafik
            </h2>
            <p className="mt-4 text-white/60 leading-relaxed">
              Allerede i det første kvartal efter lancering oplevede OD Pro
              en markant stigning i synlighed og kundehenvendelser — langt
              over branchens gennemsnit for nye websites.
            </p>
            <div className="mt-8 flex gap-8">
              <div>
                <p className="text-2xl font-bold">+312%</p>
                <p className="text-xs text-white/40 mt-1">Organisk trafik</p>
              </div>
              <div>
                <p className="text-2xl font-bold">2.8x</p>
                <p className="text-xs text-white/40 mt-1">Flere henvendelser</p>
              </div>
              <div>
                <p className="text-2xl font-bold">0.8s</p>
                <p className="text-xs text-white/40 mt-1">Load time</p>
              </div>
            </div>

            {/* CTA */}
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
              {/* Chart header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Besøgende / måned</p>
                  <p className="text-xl font-bold mt-1">Organisk trafik</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-white/40">+312%</span>
                </div>
              </div>

              {/* SVG Chart */}
              <svg viewBox="0 0 600 200" className="w-full h-auto">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 50}
                    x2="600"
                    y2={i * 50}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1"
                  />
                ))}

                {/* Month labels */}
                {["Okt", "Nov", "Dec", "Jan", "Feb", "Mar"].map((m, i) => (
                  <text
                    key={m}
                    x={i * 110 + 30}
                    y="198"
                    fill="rgba(255,255,255,0.3)"
                    fontSize="11"
                    textAnchor="middle"
                  >
                    {m}
                  </text>
                ))}

                {/* Area gradient */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(52, 211, 153)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="rgb(52, 211, 153)" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Area fill */}
                <motion.path
                  d="M30,170 C80,168 100,165 140,158 C180,150 200,140 250,120 C300,100 320,80 360,55 C400,35 430,22 470,15 C510,10 540,8 580,5 L580,180 L30,180 Z"
                  fill="url(#chartGradient)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                />

                {/* Line */}
                <motion.path
                  d="M30,170 C80,168 100,165 140,158 C180,150 200,140 250,120 C300,100 320,80 360,55 C400,35 430,22 470,15 C510,10 540,8 580,5"
                  fill="none"
                  stroke="rgb(52, 211, 153)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                />

                {/* Dot at end */}
                <motion.circle
                  cx="580"
                  cy="5"
                  r="5"
                  fill="rgb(52, 211, 153)"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 1.8 }}
                />
                <motion.circle
                  cx="580"
                  cy="5"
                  r="10"
                  fill="rgb(52, 211, 153)"
                  opacity="0.2"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 0.2, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 1.8 }}
                />

                {/* Launch marker */}
                <line
                  x1="30"
                  y1="0"
                  x2="30"
                  y2="180"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x="30"
                  y="-8"
                  fill="rgba(255,255,255,0.4)"
                  fontSize="10"
                  textAnchor="middle"
                >
                  Launch
                </text>
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools & Teknologier */}
      <section className="px-6 md:px-10 lg:px-16 py-24 border-t border-foreground/[0.06]">
        <div className="grid gap-16 md:grid-cols-2">
          {/* Tech stack */}
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

          {/* Tools */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
            variants={fadeInUp}
          >
            <ScrambleEyebrow>Værktøjer</ScrambleEyebrow>
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
      </section>

      {/* Andre cases */}
      <section className="px-6 md:px-10 lg:px-16 py-24 border-t border-foreground/[0.06]">
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
      </section>

      <Footer />
    </main>
  );
}

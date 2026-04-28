"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import Container from "@/components/Container";

const cases = [
  {
    title: "BettrPlans",
    subtitle: "Webdesign · Branding · Visuel identitet",
    image: "/cases/BettrPlans-Case-Image-01.webp",
    href: "/cases/bettrplans",
    team: [
      { name: "José", avatar: "/staff/staff-jose-digital-design.jpg" },
      { name: "Ludvig", avatar: "/staff/staff-kommunikation-og-salg-Ludvig.webp" },
      { name: "Anne-Sofie", avatar: "/staff/staff-Marketing-ansvarlig-Anne-Sofie.webp" },
    ],
  },
  {
    title: "OD Pro",
    subtitle: "Webdesign · Udvikling",
    image: "/cases/OD-Cases-image-car.webp",
    href: "/cases/od-biler-pro",
    team: [
      { name: "José", avatar: "/staff/staff-jose-digital-design.jpg" },
      { name: "Johanne", avatar: "/staff/staff-Web-udvikler-designer-Johanne-horizen.avif" },
      { name: "Sebastian", avatar: "/staff/staff-.Sebastian-Meta-facebook.jpg" },
    ],
  },
  {
    title: "Tandsundhed Uden Grænser",
    subtitle: "Webdesign · CMS · Udvikling",
    image: "/cases/Tand-sundhed-hero-image.webp",
    href: "/cases/tandsundhed-uden-graenser",
    team: [
      { name: "José", avatar: "/staff/staff-jose-digital-design.jpg" },
      { name: "Johanne", avatar: "/staff/staff-Web-udvikler-designer-Johanne-horizen.avif" },
      { name: "Anne-Sofie", avatar: "/staff/staff-Marketing-ansvarlig-Anne-Sofie.webp" },
      { name: "Ludvig", avatar: "/staff/staff-kommunikation-og-salg-Ludvig.webp" },
    ],
  },
  {
    title: "Never Another",
    subtitle: "Branding · Webdesign",
    image: "/cases/NA_Home5_mobile.webp",
    href: "/cases/never-another",
    team: [
      { name: "José", avatar: "/staff/staff-jose-digital-design.jpg" },
      { name: "Sebastian", avatar: "/staff/staff-.Sebastian-Meta-facebook.jpg" },
    ],
  },
];

// 12-col bento "Z"-pattern: 7+5 / 5+7 — visuelt vægtskifte mellem rækkerne.
const SPANS = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  }),
};

export default function CasesSectionBento() {
  return (
    <Container as="section" size="site" className="py-32" id="cases">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
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
            href="#cases"
            className="group hidden items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-300 hover:text-foreground md:flex"
          >
            Se alle cases
            <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {cases.map((c, i) => (
          <motion.div
            key={c.href}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className={SPANS[i]}
          >
            <Link
              href={c.href}
              className="group relative block h-full min-h-[340px] overflow-hidden rounded-2xl bg-foreground/[0.04] md:min-h-[420px]"
            >
              {/* Image */}
              <img
                src={c.image}
                alt={c.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              {/* Bund-gradient for tekstlæsbarhed — diskret, kun til kontrast under tekst */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
              />

              {/* Team — diskret, top-højre */}
              <div className="absolute top-4 right-4 flex -space-x-1.5 md:top-5 md:right-5">
                {c.team.map((m) => (
                  <img
                    key={m.name}
                    src={m.avatar}
                    alt={m.name}
                    title={m.name}
                    loading="lazy"
                    className="size-6 rounded-full border border-white/40 bg-background object-cover md:size-7"
                  />
                ))}
              </div>

              {/* Bottom-row: logo + titel/subtitel — venstre · CTA — højre */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
                <div className="flex min-w-0 items-center gap-3">
                  {/* Logo placeholder — fyldes med kundens bogmærke senere */}
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">
                    <span className="text-xs font-semibold text-white/80">
                      {c.title.charAt(0)}
                    </span>
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

                {/* Hover-CTA — bund højre */}
                <div className="flex shrink-0 translate-x-2 items-center gap-1.5 text-sm font-medium text-white opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                  Se case
                  <ArrowRightIcon className="size-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}

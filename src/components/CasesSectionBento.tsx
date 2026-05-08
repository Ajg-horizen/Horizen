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
    logo: "/Bomærker/BettrPlans-Bomærke-hvid.svg",
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
    logo: "/Bomærker/Bomærke-OD-biler.svg",
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
    logo: "/Bomærker/TUG-Bomærke-hvid.svg",
    href: "/cases/tandsundhed-uden-graenser",
    team: [
      { name: "José", avatar: "/staff/staff-jose-digital-design.jpg" },
      { name: "Johanne", avatar: "/staff/staff-Web-udvikler-designer-Johanne-horizen.avif" },
      { name: "Anne-Sofie", avatar: "/staff/staff-Marketing-ansvarlig-Anne-Sofie.webp" },
      { name: "Ludvig", avatar: "/staff/staff-kommunikation-og-salg-Ludvig.webp" },
    ],
  },
  {
    title: "Ensemble Hermes",
    subtitle: "Webdesign · UI/UX · Redesign",
    image: "/cases/Case-Hermes.webp",
    href: "/cases/ensemble-hermes",
    comingSoon: true,
    team: [
      { name: "José", avatar: "/staff/staff-jose-digital-design.jpg" },
      { name: "Anne-Sofie", avatar: "/staff/staff-Marketing-ansvarlig-Anne-Sofie.webp" },
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
          {/* "Se alle cases" — skjult indtil cases-oversigtsside er klar */}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {cases.map((c, i) => {
          const cardClassName = `group relative block h-full min-h-[340px] overflow-hidden rounded-2xl bg-foreground/[0.04] md:min-h-[420px] xl:min-h-[520px] 2xl:min-h-[620px] ${c.comingSoon ? "cursor-default" : ""}`;
          const cardInner = (
            <>
              <img
                src={c.image}
                alt={c.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
              />

              {c.comingSoon && (
                <div className="absolute top-4 left-4 z-10 rounded-full bg-foreground/90 px-3 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur-sm md:top-5 md:left-5">
                  Kommer snart
                </div>
              )}

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
                        {c.title.charAt(0)}
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
              key={c.href}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className={SPANS[i]}
            >
              {c.comingSoon ? (
                <div className={cardClassName} aria-disabled="true">
                  {cardInner}
                </div>
              ) : (
                <Link href={c.href} className={cardClassName}>
                  {cardInner}
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </Container>
  );
}

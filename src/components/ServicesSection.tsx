"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { TextScramble } from "@/components/ui/text-scramble";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import Container from "@/components/Container";
import {
  LayoutIcon,
  PenToolIcon,
  PaletteIcon,
  SparklesIcon,
  CodeIcon,
  BarChartIcon,
} from "lucide-react";

type Service = {
  icon: typeof LayoutIcon;
  title: string;
  description: string;
  badge: string;
  href?: string;
};

const services: Service[] = [
  {
    icon: LayoutIcon,
    title: "Webdesign",
    description:
      "Websites der er gennemtænkte fra struktur til detalje, med fokus på konvertering og brugeroplevelse.",
    badge: "bg-[#e8f0e4] text-[#2d4a28]",
    href: "/services/webudvikling",
  },
  {
    icon: PenToolIcon,
    title: "UI/UX Design",
    description:
      "Interfaces designet med brugeren i centrum. Intuitivt, elegant og funktionelt.",
    badge: "bg-[#fce8db] text-[#6b3a1f]",
    href: "/services/ui-ux-design",
  },
  {
    icon: PaletteIcon,
    title: "Branding",
    description:
      "Fra logo til komplet visuel identitet. Et sammenhængende udtryk der styrker genkendelighed.",
    badge: "bg-[#e4e8f0] text-[#2a3550]",
    href: "/services/branding-logo",
  },
  {
    icon: SparklesIcon,
    title: "Grafisk Design",
    description:
      "Print, digital, social. Visuel kommunikation der fanger opmærksomhed.",
    badge: "bg-[#f0ece4] text-[#5a4a2d]",
    href: "/services/grafisk-design",
  },
  {
    icon: CodeIcon,
    title: "Udvikling",
    description:
      "Next.js, React, WordPress. Moderne teknologi tilpasset dit behov.",
    badge: "bg-[#2a2a2a] text-[#f5f5f0]",
    href: "/services/webudvikling",
  },
  {
    icon: BarChartIcon,
    title: "SEO & Marketing",
    description:
      "Bliv fundet online. Vi optimerer din synlighed og driver kvalificeret trafik.",
    badge: "bg-[#e0eeec] text-[#1f4a42]",
  },
];


const cardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

function ServiceCard({ service }: { service: Service }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      className="group flex flex-col rounded-2xl border border-foreground/[0.06] p-8 transition-all duration-300 hover:border-foreground/[0.12] hover:bg-foreground/[0.02]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`inline-flex size-11 items-center justify-center rounded-xl ${service.badge}`}>
        <service.icon className="size-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold">
        <TextScramble
          as="span"
          speed={0.04}
          duration={0.8}
          trigger={hovered}
          onScrambleComplete={() => setHovered(false)}
        >
          {service.title}
        </TextScramble>
      </h3>
      <p className="mt-2 text-base leading-relaxed text-muted">
        {service.description}
      </p>

      <div className="mt-6 pt-2">
        {service.href ? (
          <Link
            href={service.href}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors duration-300 hover:text-foreground"
          >
            Læs mere
            <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <span className="inline-flex items-center rounded-full border border-foreground/[0.08] bg-foreground/[0.02] px-3 py-1 text-xs font-medium text-muted">
            Kommer snart
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  return (
    <Container as="section" size="site" className="py-32" id="services">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <ScrambleEyebrow>Hvad vi gør</ScrambleEyebrow>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Services
          </h2>
          <p className="mt-4 max-w-lg text-base text-muted">
            Alt hvad du behøver for at skabe en stærk digital tilstedeværelse,
            fra design til udvikling og markedsføring.
          </p>
        </motion.div>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </motion.div>
      </div>
    </Container>
  );
}

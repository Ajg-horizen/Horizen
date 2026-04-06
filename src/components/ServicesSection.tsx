"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TextScramble } from "@/components/ui/text-scramble";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp } from "@/lib/animations";
import {
  LayoutIcon,
  PenToolIcon,
  PaletteIcon,
  SparklesIcon,
  CodeIcon,
  BarChartIcon,
} from "lucide-react";

const services = [
  {
    icon: LayoutIcon,
    title: "Webdesign",
    description:
      "Vi bygger websites der ikke bare ser godt ud — de konverterer besøgende til kunder.",
  },
  {
    icon: PenToolIcon,
    title: "UI/UX Design",
    description:
      "Interfaces designet med brugeren i centrum. Intuitivt, elegant og funktionelt.",
  },
  {
    icon: PaletteIcon,
    title: "Branding",
    description:
      "Fra logo til komplet visuel identitet. Vi skaber brands der huskes.",
  },
  {
    icon: SparklesIcon,
    title: "Grafisk Design",
    description:
      "Print, digital, social — visuel kommunikation der fanger opmærksomhed.",
  },
  {
    icon: CodeIcon,
    title: "Udvikling",
    description:
      "Next.js, React, WordPress — moderne teknologi tilpasset dit behov.",
  },
  {
    icon: BarChartIcon,
    title: "SEO & Marketing",
    description:
      "Bliv fundet online. Vi optimerer din synlighed og driver kvalificeret trafik.",
  },
];


function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="group rounded-2xl border border-foreground/[0.06] p-8 transition-all duration-300 hover:border-foreground/[0.12] hover:bg-foreground/[0.02]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <service.icon className="size-6 text-foreground/40 transition-colors duration-300 group-hover:text-foreground" />
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
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {service.description}
      </p>
    </motion.div>
  );
}

export default function ServicesSection() {
  return (
    <section className="px-6 py-32 md:px-10 lg:px-16" id="services">
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
            Alt hvad du behøver for at skabe en stærk digital tilstedeværelse —
            fra design til udvikling og markedsføring.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

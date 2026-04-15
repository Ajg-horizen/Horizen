"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import Container from "@/components/Container";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { TextScramble } from "@/components/ui/text-scramble";
import { fadeInUp } from "@/lib/animations";
import {
  stickyClasses,
  type ProcessBlock as ProcessBlockData,
  type ProcessStep,
} from "@/lib/services";

function ProcessCard({ item, index }: { item: ProcessStep; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.06]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between mb-6">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${item.accent}20` }}
        >
          <Icon className="size-5" style={{ color: item.accent }} />
        </div>
        <span className="text-5xl font-black text-white/[0.06]">{item.step}</span>
      </div>
      <h3 className="text-lg font-semibold text-white">
        <TextScramble
          as="span"
          speed={0.04}
          duration={0.8}
          trigger={hovered}
          onScrambleComplete={() => setHovered(false)}
        >
          {item.title}
        </TextScramble>
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-white/50">{item.description}</p>
      {item.link && (
        <Link
          href={item.link.href}
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide opacity-0 transition-all duration-500 group-hover:opacity-100"
          style={{ color: item.accent }}
        >
          {item.link.label}
          <ArrowRightIcon className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      )}
      <div
        className="absolute bottom-0 left-8 right-8 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)`,
        }}
      />
    </motion.div>
  );
}

export default function ProcessBlock({
  data,
  id,
  inStickyStack,
  stickyIndex = 0,
}: {
  data: ProcessBlockData;
  id?: string;
  inStickyStack?: boolean;
  stickyIndex?: number;
}) {
  const stickyClass = inStickyStack ? stickyClasses(stickyIndex) : "";

  return (
    <section
      id={id}
      className={`relative ${stickyClass} bg-[#0f0f0f] text-[#f5f5f0] scroll-mt-24`.trim()}
      style={{
        boxShadow: `0 0 0 100vmax #0f0f0f${
          inStickyStack ? ", 0 -8px 30px rgba(0,0,0,0.15)" : ""
        }`,
        clipPath: "inset(0 -100vmax)",
      }}
    >
      <Container size="site" className="py-20 md:py-28 lg:py-36">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeInUp}
          className="mb-16"
        >
          <ScrambleEyebrow className="text-white/40">{data.eyebrow}</ScrambleEyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            {data.heading}
          </h2>
          {data.body && (
            <p className="mt-4 max-w-lg text-base text-white/50">{data.body}</p>
          )}
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {data.steps.map((item, i) => (
            <ProcessCard key={item.step} item={item} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import Container from "@/components/Container";
import { fadeUp } from "@/lib/animations";
import type { HeroBlock as HeroBlockData } from "@/lib/services";

export default function HeroBlock({ data }: { data: HeroBlockData }) {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);

  const EyebrowIcon = data.eyebrow.icon;

  return (
    <section className="relative pt-32 pb-0">
      {/* Grid background — fixed to full viewport */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-[0.55] lg:opacity-[0.45]"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/graphics/bg-control.svg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 100%)",
          }}
        />
      </div>

      {/* Hero text content — constrained */}
      <Container size="site">
        <div className="max-w-3xl">
          <motion.div custom={0.2} initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/[0.08] bg-accent/50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
              <EyebrowIcon className="size-3" />
              {data.eyebrow.label}
            </span>
          </motion.div>

          <motion.h1
            custom={0.5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-6 text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl md:text-5xl"
          >
            {data.heading.lead}
            {data.heading.mutedTail && (
              <>
                {" "}
                <span className="text-muted">{data.heading.mutedTail}</span>
              </>
            )}
          </motion.h1>

          <motion.p
            custom={1.0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-4 max-w-lg text-base leading-relaxed text-muted"
          >
            {data.body}
          </motion.p>

          <motion.div
            custom={1.4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-6"
          >
            <a
              href={data.cta.href}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: "#f5f5f0" }}
            >
              {data.cta.label}
              <ArrowRightIcon className="size-3.5" />
            </a>
          </motion.div>
        </div>
      </Container>

      {/* Hero image — full width, edge to edge, OUTSIDE the max-width */}
      <motion.div
        ref={imageRef}
        custom={1.8}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="relative mt-12 w-full overflow-hidden"
      >
        <motion.img
          src={data.image.src}
          alt={data.image.alt}
          style={{ y: imageY, scale: imageScale }}
          className="w-full h-auto object-cover aspect-[21/8]"
        />
      </motion.div>
    </section>
  );
}

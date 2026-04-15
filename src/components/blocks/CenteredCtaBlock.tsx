"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import Container from "@/components/Container";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp } from "@/lib/animations";
import { stickyClasses, type CenteredCtaBlock as CenteredCtaBlockData } from "@/lib/services";

export default function CenteredCtaBlock({
  data,
  inStickyStack,
  stickyIndex = 0,
}: {
  data: CenteredCtaBlockData;
  inStickyStack?: boolean;
  stickyIndex?: number;
}) {
  const isDark = data.background === "dark";
  const bgColor = isDark ? "#0f0f0f" : "var(--background)";
  const textTone = isDark ? "text-[#f5f5f0]" : "";
  const eyebrowTone = isDark ? "text-white/40" : undefined;
  const bodyTone = isDark ? "text-white/50" : "text-muted";

  const stickyClass = inStickyStack ? stickyClasses(stickyIndex) : "";

  return (
    <section
      className={`relative ${stickyClass} ${textTone}`.trim()}
      style={{
        backgroundColor: bgColor,
        boxShadow: `0 0 0 100vmax ${bgColor}${
          inStickyStack ? ", 0 -8px 30px rgba(0,0,0,0.1)" : ""
        }`,
        clipPath: "inset(0 -100vmax)",
      }}
    >
      <Container size="site" className="py-20 md:py-36 lg:py-44">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeInUp}
          className="max-w-2xl lg:mx-auto text-left lg:text-center"
        >
          <ScrambleEyebrow className={eyebrowTone}>{data.eyebrow}</ScrambleEyebrow>
          <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
            {data.heading}
          </h2>
          <p className={`mt-4 text-base ${bodyTone} leading-relaxed max-w-lg lg:mx-auto`}>
            {data.body}
          </p>
          <motion.a
            href={data.cta.href}
            custom={0.3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
            style={{ color: "#f5f5f0" }}
          >
            {data.cta.label}
            <ArrowRightIcon className="size-4" />
          </motion.a>
        </motion.div>
      </Container>
    </section>
  );
}

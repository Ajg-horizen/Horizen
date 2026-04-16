"use client";

import { motion } from "framer-motion";
import Container from "@/components/Container";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp } from "@/lib/animations";
import { stickyClasses, type PositioningBlock as PositioningBlockData } from "@/lib/services";

export default function PositioningBlock({
  id,
  data,
  inStickyStack,
  stickyIndex = 0,
}: {
  id?: string;
  data: PositioningBlockData;
  inStickyStack?: boolean;
  stickyIndex?: number;
}) {
  const stickyClass = inStickyStack ? stickyClasses(stickyIndex) : "";

  return (
    <section
      id={id}
      className={`relative ${stickyClass} bg-background`.trim()}
      style={{
        boxShadow: `0 0 0 100vmax var(--background)${
          inStickyStack ? ", 0 -8px 30px rgba(0,0,0,0.1)" : ""
        }`,
        clipPath: "inset(0 -100vmax)",
      }}
    >
      <Container size="site" className="py-24 md:py-36 lg:py-44">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
            variants={fadeInUp}
          >
            <ScrambleEyebrow>{data.eyebrow}</ScrambleEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              {data.heading.lead}
              {data.heading.mutedTail && (
                <>
                  <br />
                  <span className="text-muted">{data.heading.mutedTail}</span>
                </>
              )}
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
            variants={fadeInUp}
            className="space-y-5"
          >
            {data.paragraphs.map((p, i) => (
              <p key={i} className="text-muted leading-relaxed">
                {p}
              </p>
            ))}
            {data.stats && data.stats.length > 0 && (
              <div className="flex gap-12 pt-4">
                {data.stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

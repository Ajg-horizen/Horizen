"use client";

/**
 * Signatur-block for webudvikling-siden.
 * Indeholder synlighedsvækst-chart (SVG) + checklist med grønne flueben.
 * Hvis denne block skal genbruges på andre services, generaliser ved at
 * tage chart-data og linje-tekster som data.
 */

import { motion } from "framer-motion";
import { CheckIcon } from "lucide-react";
import Container from "@/components/Container";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp } from "@/lib/animations";
import { stickyClasses, type TechChecklistBlock as TechChecklistBlockData } from "@/lib/services";
import dynamic from "next/dynamic";

const OrbitAnimation = dynamic(() => import("@/components/ui/orbit-animation"), {
  ssr: false,
});

export default function TechChecklistBlock({
  data,
  inStickyStack,
  stickyIndex = 0,
}: {
  data: TechChecklistBlockData;
  inStickyStack?: boolean;
  stickyIndex?: number;
}) {
  const stickyClass = inStickyStack ? stickyClasses(stickyIndex) : "";

  return (
    <section
      className={`relative ${stickyClass} bg-[#0f0f0f] text-[#f5f5f0]`.trim()}
      style={{
        boxShadow: `0 0 0 100vmax #0f0f0f${
          inStickyStack ? ", 0 -8px 30px rgba(0,0,0,0.15)" : ""
        }`,
        clipPath: "inset(0 -100vmax)",
      }}
    >
      <Container size="site" className="py-24 md:py-32 lg:py-40">
        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
            variants={fadeInUp}
          >
            <ScrambleEyebrow className="text-white/40">{data.eyebrow}</ScrambleEyebrow>
            <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
              {data.heading.lead}
              {data.heading.mutedTail && (
                <>
                  <br />
                  <span className="text-white/40">{data.heading.mutedTail}</span>
                </>
              )}
            </h2>
            <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-md">
              {data.body}
            </p>
          </motion.div>

          {/* Label pills on mobile, animated orbit on desktop */}
          <div className="flex md:hidden flex-wrap gap-2 mt-6">
            {[
              { label: "Wireframes", dot: "#4ECDC4" },
              { label: "Prototyping", dot: "#FF6B6B" },
              { label: "Journey Mapping", dot: "#2EC4B6" },
              { label: "Design Tokens", dot: "#FFD93D" },
              { label: "Atomic Design", dot: "#6BCB77" },
              { label: "Hierarki", dot: "#4D96FF" },
              { label: "Typografi", dot: "#FF8C42" },
              { label: "Scrum", dot: "#845EC2" },
              { label: "Color Theory", dot: "#F9F871" },
              { label: "WCAG 2.1", dot: "#00B67A" },
              { label: "User Research", dot: "#FF6F91" },
              { label: "Figma", dot: "#A259FF" },
              { label: "Cognitive Load", dot: "#67C6E3" },
              { label: "Micro UX", dot: "#FFC75F" },
              { label: "Responsivt", dot: "#D65DB1" },
            ].map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-white/60"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.dot }}
                />
                {item.label}
              </span>
            ))}
          </div>
          <div className="hidden md:flex items-center justify-center md:scale-[0.85] lg:scale-100 origin-center">
            <OrbitAnimation />
          </div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Container from "@/components/Container";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp } from "@/lib/animations";
import type { BrandSplitBlock as BrandSplitBlockData } from "@/lib/services";
import dynamic from "next/dynamic";

const BrandFigure = dynamic(() => import("@/components/ui/brand-figure"), {
  ssr: false,
});

export default function BrandSplitBlock({
  id,
  data,
}: {
  id?: string;
  data: BrandSplitBlockData;
}) {
  return (
    <Container as="section" id={id} size="site" className="py-24 md:py-32 lg:py-40">
      <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:gap-16 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeInUp}
        >
          <ScrambleEyebrow>{data.eyebrow}</ScrambleEyebrow>
          <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
            {data.heading.lead}
            {data.heading.mutedTail && (
              <>
                <br />
                <span className="text-muted">{data.heading.mutedTail}</span>
              </>
            )}
          </h2>
          {data.paragraphs.map((p, i) => (
            <p key={i} className="mt-4 text-sm text-muted leading-relaxed max-w-md">
              {p}
            </p>
          ))}
        </motion.div>

        <div className="flex items-center justify-center">
          <BrandFigure />
        </div>
      </div>
    </Container>
  );
}

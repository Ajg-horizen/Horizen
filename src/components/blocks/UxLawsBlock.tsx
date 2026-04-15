"use client";

/**
 * Signatur-block for UI/UX-design-siden.
 * Viser veldokumenterede UX-love og hvordan vi anvender dem i praksis.
 * Inspiration: lawsofux.com — men med konkret "sådan bruger vi det".
 */

import { motion } from "framer-motion";
import Container from "@/components/Container";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp } from "@/lib/animations";
import type { UxLawsBlock as UxLawsBlockData, UxLaw } from "@/lib/services";

function LawCard({ law, index }: { law: UxLaw; index: number }) {
  return (
    <motion.article
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="group relative flex flex-col gap-4 rounded-2xl border border-foreground/[0.08] bg-background p-6 transition-all duration-500 hover:border-foreground/[0.18] md:p-8"
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center rounded-full px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.2em]"
          style={{
            backgroundColor: `${law.accent}18`,
            color: law.accent,
          }}
        >
          {law.abbr}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          UX-lov
        </span>
      </div>

      <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
        {law.name}
      </h3>

      <p className="text-sm leading-relaxed text-muted">{law.definition}</p>

      <div className="mt-auto border-t border-foreground/[0.08] pt-4">
        <div className="flex items-start gap-3">
          <span
            className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: law.accent }}
          />
          <p className="text-sm leading-relaxed text-foreground">
            <span className="font-medium">Sådan bruger vi det: </span>
            <span className="text-muted">{law.application}</span>
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export default function UxLawsBlock({
  data,
  id,
}: {
  data: UxLawsBlockData;
  id?: string;
}) {
  return (
    <Container as="section" id={id} size="site" className="py-24 scroll-mt-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        custom={0}
        variants={fadeInUp}
        className="mb-14 max-w-2xl"
      >
        <ScrambleEyebrow>{data.eyebrow}</ScrambleEyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          {data.heading.lead}
          {data.heading.mutedTail && (
            <>
              {" "}
              <span className="text-muted">{data.heading.mutedTail}</span>
            </>
          )}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">{data.body}</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        {data.laws.map((law, i) => (
          <LawCard key={law.name} law={law} index={i} />
        ))}
      </div>

      {data.sourceNote && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-xs text-muted"
        >
          {data.sourceNote}
        </motion.p>
      )}
    </Container>
  );
}

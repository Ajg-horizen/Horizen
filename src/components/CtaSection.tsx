"use client";

import { motion } from "framer-motion";

export default function CtaSection() {
  return (
    <section className="px-4 py-16 md:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="rounded-2xl border border-white/[0.10] bg-gradient-to-b from-[#1e1e1e] via-foreground to-[#080808] px-6 py-20 text-center md:rounded-3xl md:px-10 md:py-28"
      >
        <h2 className="text-3xl font-bold tracking-tight text-background md:text-4xl lg:text-5xl">
          Klar til at tage næste skridt?
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-background/50 md:text-lg">
          Fortæl os om jeres projekt — vi vender tilbage inden for 24 timer med
          en uforpligtende vurdering.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#contact"
            className="rounded-full border border-background bg-background px-8 py-3.5 text-sm font-medium text-foreground transition-all duration-300 hover:bg-transparent hover:text-background"
          >
            Start et projekt
          </a>
          <a
            href="mailto:hej@horizen.dk"
            className="text-sm font-medium text-background/50 transition-colors duration-300 hover:text-background"
          >
            hej@horizen.dk &rarr;
          </a>
        </div>
      </motion.div>
    </section>
  );
}

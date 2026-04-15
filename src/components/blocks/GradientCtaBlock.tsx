"use client";

import { motion } from "framer-motion";
import Container from "@/components/Container";
import { InfiniteGrid } from "@/components/ui/the-infinite-grid";
import type { GradientCtaBlock as GradientCtaBlockData } from "@/lib/services";

export default function GradientCtaBlock({ data }: { data: GradientCtaBlockData }) {
  return (
    <Container as="section" size="site" noPadding className="px-4 py-16 md:px-6 lg:px-8">
      <InfiniteGrid className="rounded-2xl border border-white/[0.10] bg-gradient-to-b from-[#1e1e1e] via-foreground to-[#080808] md:rounded-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="px-6 py-14 text-center md:px-10 md:py-18"
        >
          <h2 className="text-3xl font-bold tracking-tight text-background md:text-4xl lg:text-5xl">
            {data.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-background/50 md:text-lg">
            {data.body}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4">
            <a
              href={data.primaryCta.href}
              className="rounded-full border border-background bg-background px-8 py-3.5 text-sm font-medium text-foreground transition-all duration-300 hover:bg-transparent hover:text-background"
            >
              {data.primaryCta.label}
            </a>
            {data.secondaryCta && (
              <a
                href={data.secondaryCta.href}
                className="text-sm font-medium text-background/50 transition-colors duration-300 hover:text-background"
              >
                {data.secondaryCta.label} &rarr;
              </a>
            )}
          </div>
        </motion.div>
      </InfiniteGrid>
    </Container>
  );
}

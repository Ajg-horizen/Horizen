"use client";

import { motion } from "framer-motion";
import Container from "@/components/Container";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp } from "@/lib/animations";
import type { DeliverablesBlock as DeliverablesBlockData } from "@/lib/services";

export default function DeliverablesBlock({ data }: { data: DeliverablesBlockData }) {
  const headingLines = Array.isArray(data.heading) ? data.heading : [data.heading];

  return (
    <Container as="section" size="site" className="py-24">
      <div className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeInUp}
        >
          <ScrambleEyebrow>{data.eyebrow}</ScrambleEyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            {headingLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < headingLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="mt-4 text-base text-muted leading-relaxed">{data.body}</p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {data.items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.text}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeInUp}
                className="flex items-start gap-4 overflow-hidden rounded-xl border border-foreground/[0.06] p-4 transition-all duration-300 hover:border-foreground/[0.12] hover:bg-foreground/[0.02]"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.bg}`}
                >
                  <Icon className={`size-4 ${item.fg}`} />
                </div>
                <p className="text-sm font-medium leading-snug break-words min-w-0">{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}

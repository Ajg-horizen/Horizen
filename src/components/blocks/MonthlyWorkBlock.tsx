"use client";

import { motion } from "framer-motion";
import Container from "@/components/Container";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp } from "@/lib/animations";
import type { MonthlyWorkBlock as MonthlyWorkBlockData } from "@/lib/services";

export default function MonthlyWorkBlock({ id, data }: { id?: string; data: MonthlyWorkBlockData }) {
  const headingLines = Array.isArray(data.heading) ? data.heading : [data.heading];

  return (
    <Container as="section" id={id} size="site" className="py-24">
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
          {data.note && (
            <motion.p
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              variants={fadeInUp}
              className="mt-6 text-sm font-medium text-muted"
            >
              {data.note}
            </motion.p>
          )}
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {data.items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeInUp}
                className="flex flex-col gap-3 overflow-hidden rounded-xl border border-foreground/[0.06] p-5 transition-colors duration-300 hover:border-foreground/[0.12] hover:bg-foreground/[0.02]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.bg}`}
                  >
                    <Icon className={`size-4 ${item.fg}`} />
                  </div>
                  {item.cadence && (
                    <span className="rounded-full border border-foreground/[0.08] px-2.5 py-0.5 text-[11px] font-medium text-muted">
                      {item.cadence}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug break-words">{item.title}</p>
                  <p className="mt-1 text-sm text-muted leading-relaxed break-words">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import Container from "@/components/Container";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp } from "@/lib/animations";
import type { FaqBlock as FaqBlockData, FaqItem } from "@/lib/services";

function FaqRow({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="border-b border-foreground/[0.06]"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-6 text-left transition-colors duration-300 hover:text-foreground/80"
      >
        <span className="text-base font-semibold pr-8 md:text-lg">{item.q}</span>
        <ChevronDownIcon
          className={`size-5 shrink-0 text-muted transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-base leading-relaxed text-muted max-w-2xl">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqBlock({
  data,
  id,
}: {
  data: FaqBlockData;
  id?: string;
}) {
  const headingLines = Array.isArray(data.heading) ? data.heading : [data.heading];

  return (
    <Container
      as="section"
      id={id}
      size="site"
      className="py-24 border-t border-foreground/[0.06] scroll-mt-24"
    >
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
          <p className="mt-4 text-muted leading-relaxed">
            {data.email ? (
              <>
                {data.intro}{" "}
                <a
                  href={`mailto:${data.email}`}
                  className="text-foreground underline underline-offset-4 decoration-foreground/20 hover:decoration-foreground transition-colors duration-300"
                >
                  {data.email}
                </a>
              </>
            ) : (
              data.intro
            )}
          </p>
        </motion.div>

        <div>
          {data.faqs.map((faq, i) => (
            <FaqRow key={i} item={faq} index={i} />
          ))}
        </div>
      </div>
    </Container>
  );
}

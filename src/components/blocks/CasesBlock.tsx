"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import Container from "@/components/Container";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp } from "@/lib/animations";
import type { CasesBlock as CasesBlockData } from "@/lib/services";

export default function CasesBlock({
  data,
  id,
}: {
  data: CasesBlockData;
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
        className="mb-10"
      >
        <ScrambleEyebrow>{data.eyebrow}</ScrambleEyebrow>
        <div className="mt-4 flex items-end justify-between">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {data.heading}
          </h2>
          <Link
            href={data.allCasesHref ?? "/#cases"}
            className="group flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-300 hover:text-foreground"
          >
            Alle cases
            <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3">
        {data.cases.map((item, i) => (
          <motion.div
            key={item.href}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <Link href={item.href} className="group block">
              <div className="relative overflow-hidden rounded-2xl bg-accent aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium">
                    <CheckIcon className="size-3 text-[#00b67a]" />
                    {item.result}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.category}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}

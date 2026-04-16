"use client";

import { motion } from "framer-motion";
import { CheckIcon } from "lucide-react";
import Container from "@/components/Container";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp } from "@/lib/animations";
import { stickyClasses, type TechChecklistBlock as TechChecklistBlockData } from "@/lib/services";
import dynamic from "next/dynamic";
import { orbits } from "@/components/ui/orbit-animation";

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
  const hasChecklist = !!data.checklist?.length;
  const orbitData = data.orbitItems ?? orbits;
  const orbitPills = orbitData.flat();

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
      <Container size="site" className={hasChecklist ? "py-20 md:py-28 lg:py-36" : "py-24 md:py-32 lg:py-40"}>
        <div className={`grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16 ${hasChecklist ? "items-start" : "items-center"}`}>
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

            {/* Visibility growth chart — only for checklist variant */}
            {hasChecklist && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.03] p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/30">
                    {data.chartLabel ?? "Synlighed over tid"}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[10px] text-white/40">
                      <span className="h-[2px] w-3 rounded-full bg-[#c9a227]" />
                      {data.chartLegend?.weak}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] text-[#00b67a]">
                      <span className="h-[2px] w-3 rounded-full bg-[#00b67a]" />
                      {data.chartLegend?.strong}
                    </span>
                  </div>
                </div>
                <svg viewBox="0 0 500 160" className="w-full h-auto">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={i * 40}
                      x2="500"
                      y2={i * 40}
                      stroke="rgba(255,255,255,0.04)"
                      strokeWidth="1"
                    />
                  ))}

                  {["Jan", "Feb", "Mar", "Apr", "Maj", "Jun"].map((m, i) => (
                    <text
                      key={m}
                      x={i * 90 + 30}
                      y="155"
                      fill="rgba(255,255,255,0.25)"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {m}
                    </text>
                  ))}

                  <defs>
                    <linearGradient id="visGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(0, 182, 122)" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="rgb(0, 182, 122)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="flatGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(201, 162, 39)" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="rgb(201, 162, 39)" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <motion.path
                    d="M30,130 C70,129 100,128 140,126 C180,124 210,123 250,124 C290,126 320,128 360,130 C400,132 430,134 480,136 L480,140 L30,140 Z"
                    fill="url(#flatGradient)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.4 }}
                  />

                  <motion.path
                    d="M30,130 C70,129 100,128 140,126 C180,124 210,123 250,124 C290,126 320,128 360,130 C400,132 430,134 480,136"
                    fill="none"
                    stroke="rgba(201, 162, 39, 0.6)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    pathLength={1}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                  />

                  <motion.circle
                    cx="480"
                    cy="136"
                    r="3"
                    fill="rgba(201, 162, 39, 0.6)"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 1.7 }}
                  />

                  <motion.path
                    d="M30,130 C70,128 100,125 140,118 C180,110 210,95 250,78 C290,60 320,45 360,32 C400,20 430,12 480,8 L480,140 L30,140 Z"
                    fill="url(#visGradient)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                  />

                  <motion.path
                    d="M30,130 C70,128 100,125 140,118 C180,110 210,95 250,78 C290,60 320,45 360,32 C400,20 430,12 480,8"
                    fill="none"
                    stroke="rgb(0, 182, 122)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    pathLength={1}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                  />

                  <motion.circle
                    cx="480"
                    cy="8"
                    r="4"
                    fill="rgb(0, 182, 122)"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 1.8 }}
                  />
                </svg>
              </motion.div>
            )}
          </motion.div>

          {/* Right side — checklist (webudvikling) or orbit (UI/UX) */}
          {hasChecklist ? (
            <div className="grid gap-0">
              {data.checklist?.map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-20px" }}
                  variants={fadeInUp}
                  className="flex items-center gap-3 py-3 border-b border-white/[0.06] last:border-0"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00b67a]/20">
                    <CheckIcon className="size-3 text-[#00b67a]" />
                  </div>
                  <span className="text-sm text-white/70">{item}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex md:hidden flex-wrap gap-2 mt-6">
                {orbitPills.map((item) => (
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
                <OrbitAnimation items={data.orbitItems} centerLabel={data.orbitCenterLabel} />
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}

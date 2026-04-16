"use client";

import { motion } from "framer-motion";

interface OrbitItem {
  label: string;
  dot: string;
}

const orbits: OrbitItem[][] = [
  // Inner orbit — core tools
  [
    { label: "Figma", dot: "#A259FF" },
    { label: "Wireframes", dot: "#4ECDC4" },
    { label: "Prototyping", dot: "#FF6B6B" },
    { label: "Design Tokens", dot: "#FFD93D" },
  ],
  // Middle orbit — principles
  [
    { label: "Atomic Design", dot: "#6BCB77" },
    { label: "Hierarki", dot: "#4D96FF" },
    { label: "Typografi", dot: "#FF8C42" },
    { label: "Scrum", dot: "#845EC2" },
    { label: "Color Theory", dot: "#F9F871" },
  ],
  // Outer orbit — strategy & standards
  [
    { label: "WCAG 2.1", dot: "#00B67A" },
    { label: "User Research", dot: "#FF6F91" },
    { label: "Cognitive Load", dot: "#67C6E3" },
    { label: "Micro UX", dot: "#FFC75F" },
    { label: "Responsivt", dot: "#D65DB1" },
    { label: "Journey Mapping", dot: "#2EC4B6" },
  ],
];

const orbitSizes = ["12rem", "21rem", "30rem"];
const mobileOrbitSizes = ["6rem", "11rem", "16rem"];
const orbitDurations = [30, 45, 60];

function computePositions(count: number): { x: string; y: string }[] {
  return Array.from({ length: count }, (_, i) => {
    const rad = ((i / count) * 360 * Math.PI) / 180;
    return {
      x: `${Math.round((50 + 50 * Math.cos(rad)) * 100) / 100}%`,
      y: `${Math.round((50 + 50 * Math.sin(rad)) * 100) / 100}%`,
    };
  });
}

const precomputed = orbits.map((items) => computePositions(items.length));

function Label({ item }: { item: OrbitItem }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 text-[10px] md:text-[10px] font-medium text-white/60 backdrop-blur-sm">
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: item.dot }}
      />
      {item.label}
    </span>
  );
}

export default function OrbitAnimation({ isStatic = false }: { isStatic?: boolean }) {
  const sizes = isStatic ? mobileOrbitSizes : orbitSizes;
  const containerSize = isStatic ? "17rem" : "32rem";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative flex items-center justify-center"
      style={{ width: containerSize, height: containerSize }}
    >
      {/* Center element */}
      <div className="absolute z-10 flex h-14 w-14 md:h-20 md:w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-sm">
        <span className="text-xs md:text-sm font-semibold tracking-tight text-white/90">
          UX/UI
        </span>
      </div>

      {/* Orbit rings + items */}
      {orbits.map((items, orbitIdx) => {
        const size = sizes[orbitIdx];
        const duration = orbitDurations[orbitIdx];
        const reverse = orbitIdx % 2 === 1;
        const positions = precomputed[orbitIdx];

        return (
          <div
            key={orbitIdx}
            className="absolute rounded-full border border-dashed border-white/[0.08]"
            style={{
              width: size,
              height: size,
              ...(isStatic
                ? {}
                : { animation: `orbit-spin ${duration}s linear infinite${reverse ? " reverse" : ""}` }),
            }}
          >
            {items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                className="absolute"
                style={{
                  left: positions[itemIdx].x,
                  top: positions[itemIdx].y,
                  transform: "translate(-50%, -50%)",
                  ...(isStatic
                    ? {}
                    : { animation: `orbit-spin ${duration}s linear infinite${reverse ? "" : " reverse"}` }),
                }}
              >
                <Label item={item} />
              </div>
            ))}
          </div>
        );
      })}
    </motion.div>
  );
}

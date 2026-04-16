"use client";

import { motion } from "framer-motion";

const blobs = [
  {
    label: "Kultur & værdier",
    value: "40%",
    color: "#FF8C42",
    size: "clamp(140px, 18vw, 200px)",
    x: [0, 12, -8, 5, 0],
    y: [0, -10, 8, -5, 0],
    delay: 0,
  },
  {
    label: "Strategi & positionering",
    value: "35%",
    color: "#4ECDC4",
    size: "clamp(120px, 15vw, 170px)",
    x: [0, -15, 10, -6, 0],
    y: [0, 8, -12, 6, 0],
    delay: 0.15,
  },
  {
    label: "Visuelt udtryk",
    value: "25%",
    color: "#A259FF",
    size: "clamp(90px, 12vw, 130px)",
    x: [0, 8, -12, 10, 0],
    y: [0, 12, -6, -10, 0],
    delay: 0.3,
  },
];

export default function BrandBlobs() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative flex items-center justify-center"
      style={{ width: "22rem", height: "22rem" }}
    >
      {/* SVG filter for liquid/gooey effect */}
      <svg className="absolute" width="0" height="0">
        <defs>
          <filter id="blob-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {blobs.map((blob, i) => (
        <motion.div
          key={blob.label}
          className="absolute flex flex-col items-center justify-center rounded-full"
          style={{
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle at 35% 35%, ${blob.color}dd, ${blob.color}88)`,
            boxShadow: `0 8px 32px ${blob.color}33, inset 0 -4px 12px ${blob.color}44`,
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.3 + blob.delay,
            ease: "easeOut",
          }}
          animate={{
            x: blob.x,
            y: blob.y,
          }}
          // @ts-expect-error -- framer-motion transition override for animate
          transition={{
            x: {
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
            y: {
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
            opacity: { duration: 0.6, delay: 0.3 + blob.delay },
            scale: { duration: 0.6, delay: 0.3 + blob.delay, ease: "easeOut" },
          }}
        >
          <span className="text-white font-bold text-lg md:text-xl drop-shadow-sm">
            {blob.value}
          </span>
          <span className="text-white/80 text-[9px] md:text-[10px] font-medium text-center leading-tight max-w-[80%] drop-shadow-sm">
            {blob.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

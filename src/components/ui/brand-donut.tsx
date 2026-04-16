"use client";

import { motion } from "framer-motion";

const segments = [
  { label: "Visuelt udtryk", value: 25, color: "#A259FF" },
  { label: "Strategi & positionering", value: 35, color: "#4ECDC4" },
  { label: "Kultur & værdier", value: 40, color: "#FF8C42" },
];

const radius = 80;
const strokeWidth = 24;
const circumference = 2 * Math.PI * radius;
const center = 110;

// Pre-compute segment offsets
const segmentData = segments.map((seg, i) => {
  const offset = segments.slice(0, i).reduce((sum, s) => sum + s.value, 0);
  const dashLength = (seg.value / 100) * circumference;
  const dashOffset = circumference - (offset / 100) * circumference;
  return { ...seg, dashLength, dashOffset };
});

export default function BrandDonut() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex flex-col items-center gap-6"
    >
      <svg width="220" height="220" viewBox="0 0 220 220" className="w-48 h-48 md:w-56 md:h-56">
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={strokeWidth}
        />

        {/* Animated segments */}
        {segmentData.map((seg, i) => (
          <motion.circle
            key={seg.label}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
            strokeDashoffset={seg.dashOffset}
            transform={`rotate(-90 ${center} ${center})`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }}
          />
        ))}

        {/* Center text */}
        <text
          x={center}
          y={center - 6}
          textAnchor="middle"
          className="fill-foreground text-lg font-bold"
          fontSize="18"
        >
          Brand
        </text>
        <text
          x={center}
          y={center + 14}
          textAnchor="middle"
          className="fill-muted text-[10px]"
          fontSize="10"
        >
          fordeling
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-col gap-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-xs text-muted">
              {seg.value}% — {seg.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

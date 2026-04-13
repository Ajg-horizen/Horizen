"use client";

import { motion } from "framer-motion";
import Container from "@/components/Container";

const stats = [
  { value: "150+", label: "Projekter leveret" },
  { value: "98%", label: "Tilfredse kunder" },
  { value: "12", label: "Års erfaring" },
  { value: "24t", label: "Gennemsnitlig responstid" },
];

export default function StatsSection() {
  return (
    <Container as="section" size="site" className="pt-8 pb-24">
      <div>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="text-3xl font-bold tracking-tight md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-muted">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Container>
  );
}

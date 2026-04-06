"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";

const articles = [
  {
    title: "Sådan bruger vi AI til at levere bedre webdesign",
    author: "José",
    role: "Digital Designer",
    category: "AI & Design",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop&q=80",
    href: "/blog/ai-webdesign",
  },
  {
    title: "5 SEO-fejl der koster dig kunder i 2026",
    author: "Anne-Sofie",
    role: "Marketing Lead",
    category: "SEO",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop&q=80",
    href: "/blog/seo-fejl-2026",
  },
  {
    title: "Fra Figma til kode: Vores design-til-udvikling workflow",
    author: "Johanne",
    role: "Web Developer",
    category: "Udvikling",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=500&fit=crop&q=80",
    href: "/blog/figma-til-kode",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  }),
};

export default function NewsSection() {
  return (
    <section className="px-6 py-32 md:px-10 lg:px-16">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <ScrambleEyebrow>Nyheder & Insights</ScrambleEyebrow>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Blog
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <motion.a
              key={article.href}
              href={article.href}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="group flex flex-col rounded-2xl bg-white p-4 pb-6"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Title */}
              <h3 className="mt-5 text-xl font-semibold leading-snug tracking-tight">
                {article.title}
              </h3>

              {/* Author */}
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-foreground/[0.06]">
                <div>
                  <span className="text-sm font-medium">{article.author}</span>
                  <span className="mx-2 text-foreground/10">·</span>
                  <span className="text-sm text-muted">{article.role}</span>
                </div>
              </div>

              {/* Category + Arrow */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-muted">
                    {article.category}
                  </span>
                  <div className="mt-1 h-0.5 w-8 bg-foreground/20 rounded-full" />
                </div>
                <ArrowRightIcon className="size-5 text-muted transition-all duration-300 group-hover:text-foreground group-hover:translate-x-1" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { GlassBlogCard } from "@/components/ui/glass-blog-card-shadcnui";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { motion } from "framer-motion";
import { blogPosts } from "@/lib/blog-data";
import Link from "next/link";

export default function GlassBlogSection() {
  return (
    <section className="px-6 pt-10 pb-32 md:px-10 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="mb-10"
      >
        <div className="flex items-end justify-between">
          <div>
            <ScrambleEyebrow>Indsigt & Artikler</ScrambleEyebrow>
            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Fra vores blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-sm text-muted transition-colors duration-300 hover:text-foreground"
          >
            Se alle artikler &rarr;
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.slice(0, 3).map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.15, duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            className="flex"
          >
            <GlassBlogCard
              title={post.title}
              excerpt={post.excerpt}
              image={post.image}
              author={post.author}
              date={post.date}
              readTime={post.readTime}
              tags={post.tags}
              href={post.href}
              className="max-w-none w-full"
            />
          </motion.div>
        ))}
      </div>

    </section>
  );
}

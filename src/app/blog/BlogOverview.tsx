"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock } from "lucide-react";
import { blogPosts } from "@/lib/blog-data";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fadeInUp } from "@/lib/animations";

const allTags = Array.from(new Set(blogPosts.flatMap((p) => p.tags)));

const POSTS_PER_PAGE = 12;

export default function BlogOverview() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const filtered = activeTag
    ? blogPosts.filter((p) => p.tags.includes(activeTag))
    : blogPosts;

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <>
      <Navbar alwaysVisible />
      <main className="min-h-screen bg-background pt-32">
        <div className="mx-auto max-w-[2500px] px-6 md:px-10 lg:px-16">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeInUp}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Indsigt & Artikler
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Blog
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              Tanker, tips og indsigt fra vores team om design, udvikling og
              digital strategi.
            </p>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.2}
            variants={fadeInUp}
            className="mt-8 flex flex-wrap gap-2"
          >
            <button
              onClick={() => setActiveTag(null)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                activeTag === null
                  ? "bg-foreground text-background"
                  : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.10]"
              }`}
            >
              Alle
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => { setActiveTag(activeTag === tag ? null : tag); setVisibleCount(POSTS_PER_PAGE); }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                  activeTag === tag
                    ? "bg-foreground text-background"
                    : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.10]"
                }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          {visible.length > 0 && (
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  custom={i * 0.1}
                  variants={fadeInUp}
                >
                  <Link href={post.href} className="group block">
                    <div className="overflow-hidden rounded-2xl bg-white">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/80 to-transparent opacity-60" />
                        <div className="absolute bottom-3 left-3 flex gap-2">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-[#f5f5f0]/50 text-foreground backdrop-blur-sm"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold leading-tight tracking-tight transition-colors duration-300 group-hover:text-foreground/70">
                          {post.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-muted">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7 border border-border/50">
                              <AvatarImage
                                src={post.author.avatar}
                                alt={post.author.name}
                              />
                              <AvatarFallback>
                                {post.author.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col text-xs">
                              <span className="font-medium">
                                {post.author.name}
                              </span>
                              <span className="text-muted">{post.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Load more */}
          {hasMore && (
            <div className="mt-14 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + POSTS_PER_PAGE)}
                className="rounded-full border border-foreground/[0.08] px-8 py-3 text-sm font-medium text-muted transition-all duration-300 hover:border-foreground hover:text-foreground"
              >
                Vis flere artikler
              </button>
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="mt-20 text-center">
              <p className="text-muted">
                Ingen artikler fundet med tagget &ldquo;{activeTag}&rdquo;.
              </p>
              <button
                onClick={() => { setActiveTag(null); setVisibleCount(POSTS_PER_PAGE); }}
                className="mt-4 text-sm font-medium text-foreground underline underline-offset-4"
              >
                Vis alle artikler
              </button>
            </div>
          )}
        </div>

        <div className="mt-32" />
      </main>
      <Footer />
    </>
  );
}

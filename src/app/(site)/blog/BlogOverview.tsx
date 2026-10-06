"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, Clock } from "lucide-react";
import { blogPosts } from "@/lib/blog-data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fadeInUp } from "@/lib/animations";
import Container from "@/components/Container";

/**
 * Blogoversigt (samme opbygning som Miljøkontorets /indsigter, i Horizens stil):
 * desktop = søgefelt og kategorier til venstre, artikler til højre med billede;
 * tablet og mobil = kun en kategoriknap, der folder ud.
 */

const ALL = "Alle";
const allTags = Array.from(new Set(blogPosts.flatMap((p) => p.tags)));

export default function BlogOverview() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(ALL);
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Fold-ud-vælgeren lukker ved tryk uden for den
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!pickerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogPosts.filter(
      (p) =>
        (active === ALL || p.tags.includes(active)) &&
        (!q || `${p.title} ${p.excerpt}`.toLowerCase().includes(q))
    );
  }, [query, active]);

  const options = [ALL, ...allTags];

  const choose = (tag: string) => {
    setActive(tag);
    setOpen(false);
  };

  return (
    <>
      <Navbar alwaysVisible />
      <main className="min-h-screen bg-background pt-32">
        <Container size="site">
          {/* Header */}
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeInUp}>
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

          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.2}
            variants={fadeInUp}
            className="mt-12 grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-20"
          >
            {/* Søgning + kategorier */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <label htmlFor="blog-soeg" className="sr-only">
                Søg i blogindlæg
              </label>
              <input
                id="blog-soeg"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Søg i blogindlæg..."
                className="hidden w-full rounded-xl border border-foreground/[0.10] bg-white px-4 py-3 text-base outline-none transition-shadow focus:ring-2 focus:ring-foreground/10 lg:block"
              />

              {/* Tablet og mobil: fold-ud-vælger */}
              <div ref={pickerRef} className="relative md:max-w-[360px] lg:hidden">
                <button
                  type="button"
                  onClick={() => setOpen((o) => !o)}
                  onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
                  aria-expanded={open}
                  aria-controls="blog-kategorier"
                  className="flex w-full items-center justify-between rounded-xl border border-foreground/[0.10] bg-white px-4 py-3 text-left text-base"
                >
                  <span>
                    <span className="text-muted">Kategori: </span>
                    {active}
                  </span>
                  <ChevronDown
                    className="h-4 w-4 transition-transform duration-300"
                    style={{ transform: open ? "rotate(180deg)" : undefined }}
                    aria-hidden
                  />
                </button>
                {open && (
                  <ul
                    id="blog-kategorier"
                    className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-foreground/[0.10] bg-white py-1 shadow-lg"
                  >
                    {options.map((tag) => (
                      <li key={tag}>
                        <button
                          type="button"
                          onClick={() => choose(tag)}
                          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
                          aria-pressed={active === tag}
                          className={`w-full px-4 py-3 text-left text-base ${
                            active === tag
                              ? "bg-foreground/[0.06] font-medium text-foreground"
                              : "text-muted"
                          }`}
                        >
                          {tag}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Desktop: kategorilisten i sidebaren */}
              <nav aria-label="Kategorier" className="mt-6 hidden lg:block">
                <ul className="flex flex-col gap-1">
                  {options.map((tag) => (
                    <li key={tag}>
                      <button
                        type="button"
                        onClick={() => setActive(tag)}
                        aria-pressed={active === tag}
                        className={`w-full rounded-xl px-4 py-3 text-left text-sm transition-colors duration-300 ${
                          active === tag
                            ? "bg-foreground/[0.06] font-medium text-foreground"
                            : "text-muted hover:bg-foreground/[0.03] hover:text-foreground"
                        }`}
                      >
                        {tag}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Artikler */}
            <div>
              {visible.length === 0 ? (
                <div className="py-10">
                  <p className="text-muted">Ingen artikler matcher din søgning.</p>
                  <button
                    onClick={() => {
                      setActive(ALL);
                      setQuery("");
                    }}
                    className="mt-4 text-sm font-medium text-foreground underline underline-offset-4"
                  >
                    Vis alle artikler
                  </button>
                </div>
              ) : (
                <ul>
                  {visible.map((post) => (
                    <li
                      key={post.slug}
                      className="border-b border-foreground/[0.08] py-10 first:pt-0 last:border-b-0"
                    >
                      {/* Billede til højre på desktop, øverst på mobil (teksten står først i koden) */}
                      <article className="group flex flex-col-reverse gap-6 md:flex-row md:items-start md:gap-10">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-foreground/[0.06] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/70"
                              >
                                {tag}
                              </span>
                            ))}
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.04] px-2.5 py-1 text-[11px] text-muted">
                              <Clock className="h-3 w-3" aria-hidden />
                              {post.readTime} læsning
                            </span>
                          </div>
                          <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
                            <Link
                              href={post.href}
                              className="transition-colors duration-300 hover:text-foreground/70"
                            >
                              {post.title}
                            </Link>
                          </h2>
                          <p className="mt-3 max-w-[760px] text-base leading-relaxed text-muted">
                            {post.excerpt}
                          </p>
                          <div className="mt-6 flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-border/50">
                              <AvatarImage src={post.author.avatar} alt="" />
                              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted">
                              Udgivet af{" "}
                              <strong className="font-semibold text-foreground">
                                {post.author.name}
                              </strong>{" "}
                              den {post.date}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={post.href}
                          tabIndex={-1}
                          className="block aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl md:w-[210px]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                        </Link>
                      </article>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </Container>

        <div className="mt-32" />
      </main>
      <Footer />
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PrincipleIllustration } from "@/components/principle-illustrations";
import { isPublished } from "@/components/principle-content";
import { illustrationBg } from "@/lib/principle-bg";
import { fadeInUp } from "@/lib/animations";
import {
  designPrinciples,
  type PrincipleCategory,
} from "@/lib/design-principles";

// Skjul principper uden content fra public — de findes i koden men er
// ikke publiceret endnu. Tilføj en fil i principle-content/ for at "tænde" et.
const publishedPrinciples = designPrinciples.filter((p) => isPublished(p.slug));

const CATEGORIES: PrincipleCategory[] = [
  "Perception",
  "Kognition",
  "Hukommelse",
  "Opmærksomhed",
  "Adfærd",
];

export default function DesignprincipperOverview() {
  const [activeCategory, setActiveCategory] =
    useState<PrincipleCategory | null>(null);

  const filtered = useMemo(
    () =>
      activeCategory
        ? publishedPrinciples.filter((p) => p.category === activeCategory)
        : publishedPrinciples,
    [activeCategory],
  );

  return (
    <>
      <Navbar alwaysVisible />
      <main className="min-h-screen bg-background pt-32">
        <Container size="site">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeInUp}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Ressourcer
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Designprincipper
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              Et bibliotek over de UX- og designprincipper vi arbejder ud fra
              i hverdagen. Forskningsbaserede regler omsat til konkret
              praksis — så du kan se hvad der ligger bag de valg, vi
              træffer.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
              Begreberne stammer fra Jon Yablonskis projekt{" "}
              <a
                href="https://lawsofux.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Laws of UX
              </a>
              . Vi fortolker og forklarer dem i vores egen tone med
              eksempler fra det arbejde vi laver — og linker tilbage til den
              oprindelige kilde og forskningen bag.
            </p>
          </motion.div>

          {/* Category filter */}
          <div className="mt-10 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                activeCategory === null
                  ? "bg-foreground text-background"
                  : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.10]"
              }`}
            >
              Alle
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  activeCategory === cat
                    ? "bg-foreground text-background"
                    : "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.10]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => {
              const bg = illustrationBg(p.category);
              return (
                <li key={p.slug}>
                  <Link
                    href={p.href}
                    className="group block h-full transition-transform duration-300 hover:-translate-y-1.5"
                  >
                    <Card className="relative h-full overflow-hidden rounded-3xl border-border/50 bg-white transition-[border-color,box-shadow] duration-300 hover:border-foreground/30 hover:shadow-xl hover:shadow-foreground/5">
                      {/* Illustration */}
                      <div
                        className="relative h-56 overflow-hidden"
                        style={{ backgroundColor: bg }}
                      >
                        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                          <PrincipleIllustration
                            slug={p.slug}
                            bg={bg}
                            className="h-full w-full"
                          />
                        </div>
                        <div className="absolute top-4 left-4">
                          <Badge
                            variant="secondary"
                            className="bg-white/85 border border-foreground/10 text-xs font-medium px-3 py-1"
                          >
                            {p.category}
                          </Badge>
                        </div>
                        {/* Hover overlay */}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <span className="rounded-full bg-background px-5 py-2 text-sm font-semibold text-foreground shadow-lg">
                            Læs princip
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex h-[calc(100%-14rem)] flex-col p-6">
                        <h3 className="text-lg font-bold leading-tight tracking-tight text-foreground transition-colors duration-200 group-hover:text-foreground/80">
                          {p.title}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                          {p.excerpt}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="mt-20 text-center">
              <p className="text-muted">
                Ingen principper fundet i kategorien &ldquo;{activeCategory}
                &rdquo;.
              </p>
            </div>
          )}
        </Container>

        <div className="mt-32" />
        <Footer />
      </main>
    </>
  );
}

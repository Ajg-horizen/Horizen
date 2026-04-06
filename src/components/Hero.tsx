"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import TextRoll from "@/components/ui/text-roll";
import { fadeUp } from "@/lib/animations";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        opacity: 0,
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="sticky top-0 z-0 flex min-h-screen flex-col items-center justify-center px-6 pt-20 overflow-hidden md:px-10 lg:px-16"
    >
      <div ref={contentRef}>
        {/* Headline */}
        <motion.h1
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="max-w-4xl text-left text-4xl font-black uppercase leading-[1.1] tracking-tight sm:text-center sm:text-5xl md:text-6xl lg:text-7xl"
        >
          SOLUTIONS CRAFTED{" "}
          WITH REAL <TextRoll className="cursor-pointer">EXPERIENCE</TextRoll>
        </motion.h1>

        {/* Body copy */}
        <motion.p
          custom={1.0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-8 max-w-2xl sm:mx-auto text-left sm:text-center text-lg leading-relaxed text-muted sm:text-xl"
        >
          Andre bruger AI til at arbejde mindre. Vi bruger det til at
          levere mere. Samme timer, samme dedikation — bare med endnu
          mere værdi for din forretning. Drevet af erfaring. Forstærket
          af AI.
        </motion.p>

        {/* Team avatars */}
        <motion.div
          custom={1.4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-10 flex justify-center"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex -space-x-3">
              {[
                { src: "/staff/staff-José-digital-design.jpg", name: "José" },
                { src: "/staff/staff-Marketing-ansvarlig-Anne-Sofie.webp", name: "Anne-Sofie" },
                { src: "/staff/staff-Web-udvikler-designer-Johanne-horizen.avif", name: "Johanne" },
                { src: "/staff/staff-kommunikation-og-salg-Ludvig.webp", name: "Ludvig" },
                { src: "/staff/staff-.Sebastian-Meta-facebook.jpg", name: "Sebastian" },
                { src: "/staff/Kontor-Hund-Gurli-Web-udvikler.webp", name: "Gurli" },
              ].map((member, i) => (
                <img
                  key={i}
                  src={member.src}
                  alt={member.name}
                  loading="lazy"
                  className="h-10 w-10 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <span className="text-xs text-muted">Teamet bag Horizen</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          custom={2.0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-8 flex justify-center items-center gap-6"
        >
          <a
            href="#contact"
            className="rounded-full border border-foreground bg-transparent px-8 py-3.5 text-sm font-medium text-foreground transition-all duration-300 hover:bg-[#0f0f0f] hover:text-[#f5f5f0] hover:border-[#0f0f0f]"
          >
            Start et projekt
          </a>
          <a
            href="#cases"
            className="text-sm font-medium text-muted underline underline-offset-4 decoration-border transition-colors duration-300 hover:text-foreground hover:decoration-foreground"
          >
            Se vores arbejde →
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator — bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
        className="absolute bottom-16 right-8 hidden sm:flex items-center gap-2 md:right-12 lg:right-20"
      >
        <span
          className="text-xs font-bold tracking-[0.2em] uppercase"
          style={{
            background:
              "linear-gradient(90deg, #0f0f0f 40%, #888 50%, #0f0f0f 60%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer-slow 6s linear infinite",
          }}
        >
          Scroll
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="animate-[bounce_2s_ease-in-out_infinite]"
        >
          <path
            d="M8 3v10m0 0l-3-3m3 3l3-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted"
          />
        </svg>
      </motion.div>
    </section>
  );
}

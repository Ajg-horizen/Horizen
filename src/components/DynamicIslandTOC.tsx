"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TOCItem {
  id: string;
  text: string;
}

function CircularProgress({ progress }: { progress: number }) {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width="28" height="28" viewBox="0 0 28 28" className="shrink-0 -rotate-90">
      <circle
        cx="14"
        cy="14"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="2.5"
      />
      <circle
        cx="14"
        cy="14"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.15s ease" }}
      />
    </svg>
  );
}

export default function DynamicIslandTOC() {
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const islandRef = useRef<HTMLDivElement>(null);
  const scrollTargetRef = useRef<string | null>(null);

  // Extract h2 headings from article
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const h2s = article.querySelectorAll("h2");
    const items: TOCItem[] = [];

    h2s.forEach((h2, i) => {
      if (!h2.id) {
        h2.id = `section-${i}`;
      }
      items.push({ id: h2.id, text: h2.textContent || "" });
    });

    setHeadings(items);
  }, []);

  // Track scroll progress + active heading + visibility
  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector("article");
      if (!article) return;

      const rect = article.getBoundingClientRect();
      // Progress: 0% when article top hits viewport top, 100% when article bottom hits viewport bottom
      const viewportH = window.innerHeight;
      const scrollableDistance = rect.height - viewportH;
      const scrolled = -rect.top; // how far past the top of the article
      const pct = scrollableDistance > 0
        ? Math.min(100, Math.max(0, (scrolled / scrollableDistance) * 100))
        : 0;
      setProgress(Math.round(pct));

      // Show once user starts scrolling into the article area
      setIsVisible(rect.top < viewportH * 0.6);

      const h2s = document.querySelectorAll("article h2");
      let currentId = "";
      h2s.forEach((h2) => {
        const hRect = h2.getBoundingClientRect();
        if (hRect.top < 150) {
          currentId = h2.id;
        }
      });
      setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Process pending scroll after menu closes
  useEffect(() => {
    if (!isOpen && scrollTargetRef.current) {
      const id = scrollTargetRef.current;
      scrollTargetRef.current = null;

      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          const y = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 100);
      }
    }
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleItemClick = useCallback((id: string) => {
    scrollTargetRef.current = id;
    setIsOpen(false);
  }, []);

  if (headings.length === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={islandRef}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        >
          <motion.div
            layout
            transition={{
              layout: {
                type: "spring",
                stiffness: 400,
                damping: 28,
                mass: 0.8,
              },
            }}
            className="overflow-hidden rounded-[22px] bg-[#1a1a1a] shadow-2xl shadow-black/25"
          >
            {/* Compact pill */}
            <motion.button
              layout="position"
              onClick={handleToggle}
              className="flex w-full items-center gap-3 pl-3 pr-5 py-2.5"
            >
              <CircularProgress progress={progress} />

              <span className="text-[14px] font-medium text-white/90 whitespace-nowrap">
                Indholdsfortegnelse
              </span>

              <span className="ml-6 text-[14px] font-medium tabular-nums text-white/40">
                {progress}%
              </span>
            </motion.button>

            {/* Expanded TOC */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: {
                      height: {
                        type: "spring",
                        stiffness: 350,
                        damping: 25,
                        mass: 0.9,
                      },
                      opacity: { duration: 0.2, delay: 0.05 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: {
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                        mass: 0.8,
                      },
                      opacity: { duration: 0.15 },
                    },
                  }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/[0.06] px-5 pb-4 pt-1 space-y-0.5">
                    {headings.map((heading, i) => (
                      <motion.button
                        key={heading.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: {
                            delay: i * 0.04,
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          },
                        }}
                        exit={{ opacity: 0, x: -4, transition: { duration: 0.1 } }}
                        onClick={() => handleItemClick(heading.id)}
                        className={`block w-full text-left py-2 text-[15px] transition-colors cursor-pointer ${
                          activeId === heading.id
                            ? "text-white font-medium"
                            : "text-white/40 hover:text-white/70"
                        }`}
                      >
                        {heading.text}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

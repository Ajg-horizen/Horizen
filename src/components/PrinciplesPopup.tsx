"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";
import { PixelHeart, PixelDiamond } from "@/components/pixel-glyphs";

const SESSION_KEY = "principles-popup-dismissed";
const ROTATION_KEY = "principles-popup-rotation";
const DELAY_MS = 3500;
const VISIBLE_COUNT = 2;
// true = vis ved hvert genindlæs (til test). false = kun én gang pr. session.
const SHOW_EVERY_LOAD = false;
// Kun tablet og op. På mobil skal vores CTA-knap være i fokus, ikke popup'en.
const TABLET_UP = "(min-width: 768px)";

type Campaign = {
  id: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  action: string;
  href: string;
};

/** Roterende pulje af notifikationer. Tilføj flere (fx cases, blog) senere. */
const POOL: Campaign[] = [
  {
    id: "principper",
    icon: <PixelDiamond />,
    title: "Designprincipper",
    subtitle: "Kender du de 30 bag godt design?",
    action: "Læs",
    href: "/ressourcer/designprincipper",
  },
  {
    id: "godt-formaal",
    icon: <PixelHeart />,
    title: "Frivillig organisation eller NGO?",
    subtitle: "Vi støtter ét projekt om året",
    action: "Se mere",
    href: "/godt-formaal",
  },
];

/** Fortæl FloatingContact at stakken åbner/lukker, så knappen kan gemme sig. */
function emit(open: boolean) {
  window.dispatchEvent(
    new CustomEvent("principles-popup", { detail: { open } }),
  );
}

export default function PrinciplesPopup() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Campaign[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Kun tablet og op: aktivér slet ikke på mobil (ingen visning, ingen emit).
    if (!window.matchMedia(TABLET_UP).matches) return;
    if (!SHOW_EVERY_LOAD) {
      try {
        if (sessionStorage.getItem(SESSION_KEY)) return;
      } catch {
        // sessionStorage utilgængelig, vis alligevel
      }
    }

    // Rotation: vis et vindue på VISIBLE_COUNT fra puljen, som glider ét hak
    // pr. besøg. Med kun to kampagner vises begge, i skiftende rækkefølge.
    let idx = 0;
    try {
      idx = parseInt(localStorage.getItem(ROTATION_KEY) || "0", 10) || 0;
    } catch {
      // localStorage utilgængelig, brug 0
    }
    const count = Math.min(VISIBLE_COUNT, POOL.length);
    const window_ = Array.from(
      { length: count },
      (_, k) => POOL[(idx + k) % POOL.length],
    );
    setItems(window_);
    try {
      localStorage.setItem(ROTATION_KEY, String((idx + 1) % 1000000));
    } catch {
      // ignorér
    }

    const t = setTimeout(() => {
      setOpen(true);
      emit(true);
    }, DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const closeAll = () => {
    setOpen(false);
    emit(false);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignorér
    }
  };

  const dismissOne = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((n) => n.id !== id);
      if (next.length === 0) closeAll();
      return next;
    });
  };

  return (
    <AnimatePresence>
      {open && items.length > 0 && (
        <motion.div
          className="fixed bottom-5 right-4 z-50 hidden w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2.5 md:flex sm:bottom-8 sm:right-8"
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
        >
          <AnimatePresence>
            {items.map((n, i) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: 140 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: i * 0.09,
                    duration: 0.45,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                }}
                exit={{ opacity: 0, x: 140, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <Link
                  href={n.href}
                  onClick={closeAll}
                  className="flex items-center gap-3 rounded-2xl border border-foreground/[0.06] bg-white/70 px-3.5 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-2xl transition-colors hover:bg-white/90"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-[11px] bg-foreground text-background">
                    {n.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[15px] font-semibold leading-tight text-foreground">
                      {n.title}
                    </p>
                    <p className="line-clamp-2 text-[13px] leading-tight text-muted">
                      {n.subtitle}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-foreground/[0.07] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground/55">
                    {n.action}
                  </span>
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dismissOne(n.id);
                  }}
                  aria-label="Skjul"
                  className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full border border-foreground/10 bg-white text-muted opacity-0 shadow transition-opacity duration-200 hover:text-foreground group-hover:opacity-100"
                >
                  <XIcon className="size-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

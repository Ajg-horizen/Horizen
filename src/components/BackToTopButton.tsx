"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpIcon } from "lucide-react";

/**
 * Fixed "tilbage til toppen"-knap nede til højre.
 * Fader ind efter 600px scroll, smooth scroll til top ved klik.
 * Mountes globalt i root layout — fungerer på alle sider.
 */
export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label="Tilbage til toppen"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/40 text-foreground backdrop-blur-xl shadow-lg shadow-black/5 transition-all duration-300 hover:bg-white/60 hover:border-white/50 hover:shadow-black/10 md:bottom-8 md:right-8"
          style={{
            paddingBottom: "env(safe-area-inset-bottom, 0)",
          }}
        >
          <ArrowUpIcon className="size-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

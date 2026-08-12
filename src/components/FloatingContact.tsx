"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContactButton } from "@/components/ContactButton";

export default function FloatingContact() {
  const [visible, setVisible] = useState(false);
  // Gem knappen, mens notifikations-stakken er åben, så de ikke støder sammen.
  const [suppressed, setSuppressed] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onPopup = (e: Event) => {
      const detail = (e as CustomEvent<{ open: boolean }>).detail;
      setSuppressed(Boolean(detail?.open));
    };
    window.addEventListener("principles-popup", onPopup);
    return () => window.removeEventListener("principles-popup", onPopup);
  }, []);

  return (
    <AnimatePresence>
      {visible && !suppressed && (
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 80 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-5 right-4 z-50 sm:bottom-8 sm:right-8 lg:hidden"
        >
          <ContactButton />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

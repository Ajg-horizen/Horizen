"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Nulstiller scroll til toppen instant ved sideskift.
 * Forhindrer at scroll-behavior: smooth animerer navigations-scroll.
 */
export default function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = "";
    });
  }, [pathname]);

  return null;
}

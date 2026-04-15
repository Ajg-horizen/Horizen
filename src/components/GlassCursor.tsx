"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function GlassCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Skip on touch devices — no custom cursor needed
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const inner = innerRef.current;
    if (!cursor || !inner) return;

    let currentlyHovering = false;

    // Move cursor + check what's underneath on every move
    const moveCursor = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest("a, button, [role='button'], input, textarea, select") ||
        target.closest("[data-slot='navigation-menu-trigger']") ||
        target.closest("[data-slot='navigation-menu-link']");

      if (isInteractive && !currentlyHovering) {
        currentlyHovering = true;
        gsap.to(cursor, {
          width: 48,
          height: 48,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else if (!isInteractive && currentlyHovering) {
        currentlyHovering = false;
        gsap.to(cursor, {
          width: 29,
          height: 29,
          opacity: 0.6,
          duration: 0.15,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    // GSAP ticker for smooth following
    const tick = () => {
      gsap.to(cursor, {
        x: mouse.current.x,
        y: mouse.current.y,
        duration: 0.15,
        ease: "power2.out",
        overwrite: false,
      });
    };

    const handleMouseDown = () => {
      gsap.to(cursor, {
        scale: 0.85,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: "elastic.out(1, 0.4)",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, {
        opacity: 0,
        duration: 0.3,
      });
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, {
        opacity: 1,
        duration: 0.3,
      });
    };

    const handleMagnifierEnter = () => { cursor.style.display = "none"; };
    const handleMagnifierLeave = () => { cursor.style.display = "block"; };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("magnifier:enter", handleMagnifierEnter);
    window.addEventListener("magnifier:leave", handleMagnifierLeave);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("magnifier:enter", handleMagnifierEnter);
      window.removeEventListener("magnifier:leave", handleMagnifierLeave);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2"
      style={{
        width: 29,
        height: 29,
        opacity: 0.6,
        top: 0,
        left: 0,
        willChange: "transform",
      }}
    >
      {/* Glass circle — Apple-style */}
      <div
        ref={innerRef}
        className="h-full w-full rounded-full overflow-hidden"
        style={{
          backdropFilter: "blur(6px) saturate(140%)",
          WebkitBackdropFilter: "blur(6px) saturate(140%)",
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,255,255,0.45)",
          boxShadow:
            "inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.03), 0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* Inner highlight — refraction shine */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 135deg, rgba(255,255,255,0.3) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.15) 100%)",
          }}
        />
        {/* Center lens dot */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "30%",
            height: "30%",
            background: "radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}

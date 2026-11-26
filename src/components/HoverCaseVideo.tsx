"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Video oven på et case-billede, der afspiller, når man holder musen over
 * kortet (forælder-elementet). Filen hentes først ved første hover, og videoen
 * toner først ind, når den faktisk spiller, så man aldrig ser en sort flade.
 * Enheder uden mus (telefoner) og "reducér bevægelse" får kun billedet.
 *
 * Videoen vises i sin helhed (object-contain) og centreret, så skærmen i
 * videoen ikke beskæres i siderne. Felterne over og under udfyldes af et lille
 * lærred, der løbende tegner videoens eget billede i meget lav opløsning og
 * strækkes op (= sløret). Baggrunden følger derfor videoen, uden at filen
 * hentes to gange. `backdrop` er en sløret still, der vises, indtil lærredet
 * har tegnet første gang.
 */
export default function HoverCaseVideo({
  src,
  label,
  backdrop,
}: {
  src: string;
  label: string;
  backdrop?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const host = wrapRef.current?.parentElement;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!host || !video || !canvas) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    let hovering = false;
    let frame = 0;

    // Tegn videoens billede i 32x20 px. CSS strækker det op til hele kortet.
    const draw = () => {
      if (ctx && video.readyState >= 2)
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      if (hovering) frame = requestAnimationFrame(draw);
    };

    const start = () => {
      hovering = true;
      if (!video.getAttribute("src")) video.src = src;
      video.play().catch(() => {});
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      hovering = false;
      cancelAnimationFrame(frame);
      setVisible(false);
      video.pause();
    };
    // Vis først, når der er billeder at vise, og kun hvis musen stadig er over.
    const onPlaying = () => {
      if (hovering) setVisible(true);
    };

    host.addEventListener("mouseenter", start);
    host.addEventListener("mouseleave", stop);
    host.addEventListener("focus", start);
    host.addEventListener("blur", stop);
    video.addEventListener("playing", onPlaying);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("mouseenter", start);
      host.removeEventListener("mouseleave", stop);
      host.removeEventListener("focus", start);
      host.removeEventListener("blur", stop);
      video.removeEventListener("playing", onPlaying);
    };
  }, [src]);

  return (
    <div
      ref={wrapRef}
      aria-hidden={!visible}
      className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-500 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={
        backdrop
          ? {
              backgroundImage: `url(${backdrop})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { backgroundColor: "#000" }
      }
    >
      <canvas
        ref={canvasRef}
        width={32}
        height={20}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 blur-xl"
      />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        className="absolute inset-0 h-full w-full object-contain"
      />
    </div>
  );
}

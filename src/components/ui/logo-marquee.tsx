"use client";

type Logo = { src: string; alt: string };

type LogoMarqueeProps = {
  logos: Logo[];
  speed?: number; // sekunder for én fuld loop
};

export function LogoMarquee({ logos, speed = 40 }: LogoMarqueeProps) {
  // Dupliker rækken så loopet er sømløst
  const items = [...logos, ...logos];

  return (
    <div
      className="group relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        className="flex w-max items-center gap-12 md:gap-16"
        style={{
          animation: `logo-marquee ${speed}s linear infinite`,
        }}
      >
        {items.map((logo, i) => (
          <img
            key={`${logo.src}-${i}`}
            src={logo.src}
            alt={logo.alt}
            loading="lazy"
            className="h-8 w-auto shrink-0 object-contain opacity-70 brightness-0 transition-all duration-300 hover:opacity-100 md:h-10"
          />
        ))}
      </div>

      <style>{`
        @keyframes logo-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .group:hover > div { animation-play-state: paused; }
      `}</style>
    </div>
  );
}

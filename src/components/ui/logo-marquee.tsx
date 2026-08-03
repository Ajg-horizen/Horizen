"use client";

type Logo = {
  src: string;
  alt: string;
  wordmark?: string;
  boxed?: boolean;
  serif?: boolean;
};

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
        {items.map((logo, i) =>
          logo.wordmark ? (
            // Lockup (mærke + ordmærke) — spejler kundens eget logo.
            // Group-opacity holder det i reolens dæmpede tone. `boxed` pakker et
            // hvidt bookmark i en mørk boks (bevarer knockout-kontrasten); uden
            // `boxed` vises et selvstændigt mærke monokromt som de øvrige logoer.
            <div
              key={`${logo.src}-${i}`}
              className="flex shrink-0 items-center gap-2.5 opacity-30 transition-opacity duration-300 hover:opacity-70"
            >
              {logo.boxed ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-foreground md:h-7 md:w-7">
                  <img
                    src={logo.src}
                    alt=""
                    loading="lazy"
                    className="h-3.5 w-3.5 md:h-4 md:w-4"
                  />
                </span>
              ) : (
                <img
                  src={logo.src}
                  alt=""
                  loading="lazy"
                  className="h-6 w-6 shrink-0 object-contain brightness-0 md:h-7 md:w-7"
                />
              )}
              {logo.serif ? (
                <span
                  className="text-sm leading-none text-foreground md:text-base"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {logo.wordmark}
                </span>
              ) : (
                <span className="text-base font-semibold tracking-tight text-foreground md:text-lg">
                  {logo.wordmark}
                </span>
              )}
            </div>
          ) : (
            <div
              key={`${logo.src}-${i}`}
              className="flex w-32 shrink-0 items-center justify-center md:w-40"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                className="max-h-6 w-auto max-w-full object-contain opacity-25 brightness-0 transition-all duration-300 hover:opacity-70 md:max-h-7"
              />
            </div>
          )
        )}
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

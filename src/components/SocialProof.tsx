"use client";

import { Sparkles } from "@/components/ui/sparkles";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";

const clientLogos = [
  { name: "Novo Nordisk", src: "/logo/Horizen_Branding_Novo_Nordisk.svg" },
  { name: "Arena Randers", src: "/logo/Horizen_Branding_ArenaRanders.svg" },
  { name: "Never Another", src: "/logo/Logo-NeverAnother-White-RGB.svg" },
  { name: "Nordic", src: "/logo/Horizen_Branding_Nordic.svg" },
  { name: "Jesper Lundgaard", src: "/logo/Horizen_Branding_Jesper_Lundgaard-08.svg" },
  { name: "Komunikado", src: "/logo/Horizen_Branding_Komunikado.svg" },
  { name: "AAEL", src: "/logo/Horizen_Branding_AAEL.svg" },
  { name: "BettrPlans", src: "/logo/BettrPlans-logo-01.svg" },
  { name: "WereMe", src: "/logo/Horizen_Branding_WereMe.svg" },
];

export default function SocialProof() {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:px-10 lg:px-16">
      <div>
        {/* Heading */}
        <div>
          <ScrambleEyebrow>Social proof</ScrambleEyebrow>
          <h3 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
            Virksomheder der stoler på os
          </h3>
        </div>

        {/* Logo slider */}
        <div className="relative mt-12 h-[60px] w-full">
          <InfiniteSlider
            className="flex h-full w-full items-center"
            duration={30}
            gap={64}
          >
            {clientLogos.map((client) => (
              <div
                key={client.name}
                className="flex h-full shrink-0 items-center"
              >
                <img
                  src={client.src}
                  alt={client.name}
                  loading="lazy"
                  className="h-10 w-36 object-contain invert opacity-25 grayscale transition-opacity duration-300 hover:opacity-40 md:h-12 md:w-40"
                />
              </div>
            ))}
          </InfiniteSlider>

          {/* Edge blur */}
          <ProgressiveBlur
            className="pointer-events-none absolute top-0 left-0 h-full w-[120px]"
            direction="left"
            blurIntensity={1}
          />
          <ProgressiveBlur
            className="pointer-events-none absolute top-0 right-0 h-full w-[120px]"
            direction="right"
            blurIntensity={1}
          />
        </div>
      </div>

      {/* Sparkle effect */}
      <div className="relative -mt-24 h-64 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]">
        <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,rgba(15,15,15,0.06),transparent_70%)]" />
        <div className="absolute -left-1/2 top-1/2 z-10 aspect-[1/0.7] w-[200%] rounded-[100%] border-t border-foreground/[0.06] bg-background" />
        <Sparkles
          density={800}
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
          color="#0f0f0f"
          size={0.8}
          speed={0.4}
          opacity={0.3}
        />
      </div>
    </section>
  );
}

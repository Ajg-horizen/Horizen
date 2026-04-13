"use client";

import { motion } from "framer-motion";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { fadeInUp } from "@/lib/animations";

const reviews = [
  {
    stars: 5,
    text: "Horizen leverede langt over forventning. Vores nye site konverterer markant bedre end det gamle.",
    author: "Mikkel A.",
    location: "DK",
  },
  {
    stars: 5,
    text: "Professionelt, hurtigt og med en ægte forståelse for vores brand. Vi er mere end tilfredse.",
    author: "Line K.",
    location: "DK",
  },
  {
    stars: 5,
    text: "De forstår at kombinere design med teknisk kvalitet. Vores loadtid blev halveret efter relanceringen.",
    author: "Thomas B.",
    location: "DK",
  },
  {
    stars: 5,
    text: "Et bureau der faktisk lytter og eksekverer. Samarbejdet har været fantastisk fra start til slut.",
    author: "Sofie H.",
    location: "DK",
  },
  {
    stars: 5,
    text: "Vi havde forsøgt os med en AI-løsning. Den så okay ud, men vi fik ingen henvendelser. Horizen lavede en audit og fandt flere kritiske fejl. Vi valgte at få bygget en ny side fra bunden — og nu har vi rent faktisk fået en side med aktivitet.",
    author: "Jonas M.",
    location: "DK",
  },
  {
    stars: 5,
    text: "Responsivt, gennemtænkt og smukt. Vores kunder kommenterer konstant på hvor godt sitet ser ud.",
    author: "Camilla R.",
    location: "DK",
  },
];

function TrustpilotStars({ count, bare = false }: { count: number; bare?: boolean }) {
  if (bare) {
    return (
      <div className="flex gap-1">
        {Array.from({ length: count }).map((_, i) => (
          <svg key={i} viewBox="0 0 24 24" className="h-5 w-5 fill-[#00b67a]">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  }
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex h-6 w-6 items-center justify-center bg-[#00b67a]"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

export default function TrustpilotSection() {
  return (
    <section className="py-24 overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        custom={0}
        variants={fadeInUp}
        className="mb-10 flex flex-col items-center justify-center gap-2"
      >
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#00b67a]">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-base font-semibold tracking-wide">Trustpilot</span>
        </div>
      </motion.div>

      <InfiniteSlider gap={24} duration={65} durationOnHover={130}>
        {reviews.map((review, i) => (
          <div
            key={i}
            className="w-[340px] shrink-0 rounded-2xl border border-foreground/[0.06] bg-background p-8 flex flex-col justify-between"
          >
            <div>
              <TrustpilotStars count={review.stars} />
              <p className="mt-5 text-sm leading-relaxed text-foreground/80">
                &ldquo;{review.text}&rdquo;
              </p>
            </div>
            <div className="mt-8">
              <p className="text-sm font-semibold">{review.author}</p>
              <p className="text-xs text-muted">{review.location}</p>
            </div>
          </div>
        ))}
      </InfiniteSlider>
    </section>
  );
}

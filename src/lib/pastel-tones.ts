/**
 * Horizens pastelfarver, de samme som på services-kortene på forsiden
 * (ServicesSection). Bruges til kasser, så siderne ikke bliver sort-hvide
 * hele vejen igennem. `bg` er fladen, `ink` er tekst og ikoner på fladen.
 */
export const PASTEL = {
  sage: { bg: "bg-[#e8f0e4]", ink: "text-[#2d4a28]", bar: "bg-[#2d4a28]" },
  peach: { bg: "bg-[#fce8db]", ink: "text-[#6b3a1f]", bar: "bg-[#6b3a1f]" },
  blue: { bg: "bg-[#e4e8f0]", ink: "text-[#2a3550]", bar: "bg-[#2a3550]" },
  sand: { bg: "bg-[#f0ece4]", ink: "text-[#5a4a2d]", bar: "bg-[#5a4a2d]" },
  teal: { bg: "bg-[#e0eeec]", ink: "text-[#1f4a42]", bar: "bg-[#1f4a42]" },
} as const;

export type PastelTone = keyof typeof PASTEL;

/** Fast rækkefølge, når flere kasser står ved siden af hinanden. */
export const PASTEL_ORDER: PastelTone[] = [
  "sage",
  "peach",
  "blue",
  "teal",
  "sand",
];

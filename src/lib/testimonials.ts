/**
 * Single source of truth for alle kunde-testimonials på tværs af siten.
 *
 * Tilføj ny testimonial: push til arrayet med et unikt `id`.
 * Marker featured: sæt `featured: true` — bruges som hero-testimonial
 * på webudvikling-siden (og andre steder der kalder getFeatured).
 *
 * Struktur er CMS-klar: en import kan senere udskiftes med fetch fra
 * fx Sanity, Payload eller Directus uden ændringer i konsumerende
 * komponenter.
 */

export type TestimonialSource = "trustpilot" | "direct" | "interview";

export type Testimonial = {
  id: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  author: {
    name: string;
    role?: string;
    company?: string;
    location?: string;
    photo?: string;
  };
  source: TestimonialSource;
  featured?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    id: "oliver-od-biler-ai-fundament",
    quote:
      "Vi havde forsøgt os med en AI-løsning. Den så okay ud, men vi fik ingen henvendelser. Horizen lavede en audit og fandt flere kritiske fejl. Vi valgte at få bygget en ny side fra bunden — og nu har vi rent faktisk fået en side med aktivitet.",
    rating: 5,
    author: {
      name: "Oliver Dethlefsen",
      role: "Indehaver",
      company: "OD Pro",
      location: "Aabenraa",
      photo: "/Clients/oliver-profile.png",
    },
    source: "trustpilot",
    featured: true,
  },
  {
    id: "mikkel-a",
    quote:
      "Horizen leverede langt over forventning. Vores nye site konverterer markant bedre end det gamle.",
    rating: 5,
    author: { name: "Mikkel A.", location: "DK" },
    source: "trustpilot",
  },
  {
    id: "line-k",
    quote:
      "Professionelt, hurtigt og med en ægte forståelse for vores brand. Vi er mere end tilfredse.",
    rating: 5,
    author: { name: "Line K.", location: "DK" },
    source: "trustpilot",
  },
  {
    id: "thomas-b",
    quote:
      "De forstår at kombinere design med teknisk kvalitet. Vores loadtid blev halveret efter relanceringen.",
    rating: 5,
    author: { name: "Thomas B.", location: "DK" },
    source: "trustpilot",
  },
  {
    id: "sofie-h",
    quote:
      "Et bureau der faktisk lytter og eksekverer. Samarbejdet har været fantastisk fra start til slut.",
    rating: 5,
    author: { name: "Sofie H.", location: "DK" },
    source: "trustpilot",
  },
  {
    id: "camilla-r",
    quote:
      "Responsivt, gennemtænkt og smukt. Vores kunder kommenterer konstant på hvor godt sitet ser ud.",
    rating: 5,
    author: { name: "Camilla R.", location: "DK" },
    source: "trustpilot",
  },
];

/** Hent testimonial efter id — throw hvis ikke fundet, så build-time catches det. */
export function getTestimonial(id: string): Testimonial {
  const t = testimonials.find((x) => x.id === id);
  if (!t) throw new Error(`Testimonial not found: ${id}`);
  return t;
}

/** Hent det (første) featured testimonial. Bruges som hero-testimonial. */
export function getFeaturedTestimonial(): Testimonial {
  const t = testimonials.find((x) => x.featured);
  if (!t) throw new Error("No featured testimonial found");
  return t;
}

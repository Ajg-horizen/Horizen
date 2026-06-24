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
    id: "saxo-bettrplans",
    quote:
      "Jeg har haft en fantastisk oplevelse med teamet hos Horizen! Dette var min første hjemmeside, men de formåede at guide mig trygt gennem hele processen. Resultatet blev en flot og velfungerende hjemmeside.",
    rating: 5,
    author: {
      name: "Saxo",
      role: "Stifter",
      company: "BettrPlans",
    },
    source: "trustpilot",
    featured: true,
  },
  {
    id: "michael-seitz-malerfirma",
    quote:
      "Jeg er mega tilfreds med den hjemmeside, jeg har fået lavet af Horizen. Den er blevet super god, jeg har fået designet et unikt logo, og samarbejdet og kommunikationen har været en enestående oplevelse. Vil 100% anbefale Horizen videre.",
    rating: 5,
    author: {
      name: "Michael Seitz",
      role: "Malermester",
      company: "Malerfirma Seitz",
      photo: "/Clients/seitz-profil.webp",
    },
    source: "trustpilot",
  },
  {
    id: "ana-fajardo",
    quote:
      "Som en der går op i detaljer og kvalitet, har jeg sat stor pris på samarbejdet med Horizen. De kombinerer faglighed med en afslappet tilgang, hvor tingene bliver gjort ordentligt, uden unødvendig hast. Kan varmt anbefale Horizen til dem, der værdsætter ægte kvalitet.",
    rating: 5,
    author: { name: "Ana Fajardo" },
    source: "trustpilot",
  },
  {
    id: "anne-sofie-nordic-influence",
    quote:
      "Komplet visuel identitet til min virksomhed hos Horizen. Fra første kontakt til færdigt resultat var oplevelsen i top. Ærlig rådgivning, fleksibel og lydhør, professionelt håndværk og fair prissætning. Jeg kommer helt sikkert tilbage med næste projekt.",
    rating: 5,
    author: {
      name: "Anne Sofie Pedersen",
      company: "Nordic Influence",
    },
    source: "trustpilot",
  },
  {
    id: "ditte-never-another",
    quote:
      "Horizen har hjulpet os i NEVER ANOTHER med at skabe vores visuelle udtryk og logo. Engagementet har været tydeligt, og vi har altid kunnet regne med god sparring og vejledning. Hvis du ønsker et bureau, der brænder for det de laver, så anbefaler jeg klart Horizen.",
    rating: 5,
    author: {
      name: "Ditte Gade Jakobsen",
      company: "NEVER ANOTHER",
      photo: "/Clients/Ditte-never-another.webp",
    },
    source: "trustpilot",
  },
  {
    id: "tatiana-tandsundhed",
    quote:
      "José var lydhør og hurtig til at forstå vores behov som NGO, og hele forløbet var trygt og effektivt. Der var aldrig noget, der føltes umuligt. Vores arbejde er nu meget bedre formidlet og synligt, og det gør en reel forskel. Vi kan varmt anbefale Horizen.",
    rating: 5,
    author: {
      name: "Tatiana",
      role: "Projektleder",
      company: "Tandsundhed Uden Grænser",
      photo: "/Clients/Tatiana-TUG.webp",
    },
    source: "trustpilot",
  },
  {
    id: "nikolaj-lippert",
    quote:
      "Rigtig god service! Igennem hele forløbet var José både åben og transparent og havde et rigtig højt niveau af kommunikation. Stor anbefaling herfra!",
    rating: 5,
    author: {
      name: "Nikolaj Dybdal Lippert",
      location: "DK",
      photo: "/Clients/Nikolaj-LipsMusic.webp",
    },
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

/**
 * Pluk en testimonial deterministisk ud fra en nøgle (typisk side-slug).
 * Samme nøgle giver altid samme testimonial — så hver service-side viser
 * konsekvent én bestemt anmeldelse, men forskellig på tværs af siderne.
 */
export function pickTestimonialByKey(key: string): Testimonial {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(h) % testimonials.length;
  return testimonials[idx];
}

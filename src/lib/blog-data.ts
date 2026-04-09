/**
 * Central blog data — single source of truth.
 * Word counts are based on actual article content.
 * When connecting to a CMS, replace this with API calls.
 */

const WORDS_PER_MINUTE = 200;

function calcReadTime(wordCount: number): string {
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  return `${minutes} min`;
}

// Word counts measured from actual article content components
const AI_WEBDESIGN_WORDS = 320;
const SEO_FEJL_WORDS = 420;
const FIGMA_TIL_KODE_WORDS = 380;

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: {
    name: string;
    title?: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  tags: string[];
  href: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "ai-webdesign",
    title: "Sådan bruger vi AI til at levere bedre webdesign",
    excerpt:
      "Vi dykker ned i hvordan kunstig intelligens ændrer vores designproces — og hvad det betyder for dig som kunde.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop&q=80",
    author: {
      name: "José",
      title: "CEO & Designer",
      role: "10+ års erfaring",
      avatar: "/staff/staff-jose-digital-design.jpg",
    },
    date: "15. marts 2026",
    readTime: calcReadTime(AI_WEBDESIGN_WORDS),
    tags: ["AI", "Design"],
    href: "/blog/ai-webdesign",
  },
  {
    slug: "seo-fejl-2026",
    title: "5 SEO-fejl der koster dig kunder i 2026",
    excerpt:
      "De fleste virksomheder begår stadig grundlæggende SEO-fejl. Her er de fem mest kritiske — og hvordan du fikser dem.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop&q=80",
    author: {
      name: "Anne-Sofie",
      title: "Marketing Lead",
      role: "SEO & Digital Strategi",
      avatar: "/staff/staff-Marketing-ansvarlig-Anne-Sofie.webp",
    },
    date: "28. februar 2026",
    readTime: calcReadTime(SEO_FEJL_WORDS),
    tags: ["SEO", "Marketing"],
    href: "/blog/seo-fejl-2026",
  },
  {
    slug: "figma-til-kode",
    title: "Fra Figma til kode: Vores workflow",
    excerpt:
      "Et kig bag kulisserne på hvordan vi omsætter designs til pixel-perfekt kode med moderne værktøjer.",
    image:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=500&fit=crop&q=80",
    author: {
      name: "Johanne",
      title: "Web Developer",
      role: "React & Next.js",
      avatar: "/staff/staff-Web-udvikler-designer-Johanne-horizen.avif",
    },
    date: "10. januar 2026",
    readTime: calcReadTime(FIGMA_TIL_KODE_WORDS),
    tags: ["Dev", "Workflow"],
    href: "/blog/figma-til-kode",
  },
];

/** Get related articles (all except the current one) */
export function getRelatedArticles(currentSlug: string) {
  return blogPosts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({
      title: p.title,
      href: p.href,
      image: p.image,
      tag: p.tags.join(" · "),
    }));
}

/** Get a single post by slug */
export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

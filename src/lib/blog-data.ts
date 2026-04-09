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
  {
    slug: "branding-smaa-virksomheder",
    title: "Branding for små virksomheder: Hvor starter man?",
    excerpt:
      "En stærk visuel identitet behøver ikke koste en formue. Her er de vigtigste skridt til at opbygge et brand der holder.",
    image:
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=500&fit=crop&q=80",
    author: {
      name: "José",
      title: "CEO & Designer",
      role: "10+ års erfaring",
      avatar: "/staff/staff-jose-digital-design.jpg",
    },
    date: "2. december 2025",
    readTime: calcReadTime(350),
    tags: ["Branding", "Design"],
    href: "/blog/branding-smaa-virksomheder",
  },
  {
    slug: "google-ads-budget",
    title: "Sådan får du mest ud af dit Google Ads budget",
    excerpt:
      "Vi gennemgår de mest almindelige fejl ved Google Ads og viser hvordan du kan sænke din CPA markant.",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=500&fit=crop&q=80",
    author: {
      name: "Anne-Sofie",
      title: "Marketing Lead",
      role: "SEO & Digital Strategi",
      avatar: "/staff/staff-Marketing-ansvarlig-Anne-Sofie.webp",
    },
    date: "18. november 2025",
    readTime: calcReadTime(480),
    tags: ["Marketing", "Google Ads"],
    href: "/blog/google-ads-budget",
  },
  {
    slug: "next-js-performance",
    title: "Next.js performance: 7 tips til hurtigere sider",
    excerpt:
      "Loadtid er afgørende for konvertering. Her er de syv vigtigste optimeringer vi implementerer på alle projekter.",
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=500&fit=crop&q=80",
    author: {
      name: "Johanne",
      title: "Web Developer",
      role: "React & Next.js",
      avatar: "/staff/staff-Web-udvikler-designer-Johanne-horizen.avif",
    },
    date: "5. november 2025",
    readTime: calcReadTime(520),
    tags: ["Dev", "SEO"],
    href: "/blog/next-js-performance",
  },
  {
    slug: "farver-konvertering",
    title: "Farvevalg der konverterer: Psykologien bag UI-design",
    excerpt:
      "Farver påvirker brugeradfærd mere end du tror. Lær hvordan strategisk farvevalg kan øge din konverteringsrate.",
    image:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=500&fit=crop&q=80",
    author: {
      name: "José",
      title: "CEO & Designer",
      role: "10+ års erfaring",
      avatar: "/staff/staff-jose-digital-design.jpg",
    },
    date: "22. oktober 2025",
    readTime: calcReadTime(380),
    tags: ["Design", "Marketing"],
    href: "/blog/farver-konvertering",
  },
  {
    slug: "lokal-seo-guide",
    title: "Lokal SEO: Den komplette guide for danske virksomheder",
    excerpt:
      "Bliv fundet af kunder i dit nærområde. Vi gennemgår Google Business Profile, lokale søgeord og citation building.",
    image:
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=500&fit=crop&q=80",
    author: {
      name: "Anne-Sofie",
      title: "Marketing Lead",
      role: "SEO & Digital Strategi",
      avatar: "/staff/staff-Marketing-ansvarlig-Anne-Sofie.webp",
    },
    date: "8. oktober 2025",
    readTime: calcReadTime(600),
    tags: ["SEO", "Marketing"],
    href: "/blog/lokal-seo-guide",
  },
  {
    slug: "cms-valg-2026",
    title: "WordPress vs. headless CMS: Hvad skal du vælge i 2026?",
    excerpt:
      "Vi sammenligner de mest populære CMS-løsninger og hjælper dig med at finde den rigtige til dit projekt.",
    image:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=500&fit=crop&q=80",
    author: {
      name: "Johanne",
      title: "Web Developer",
      role: "React & Next.js",
      avatar: "/staff/staff-Web-udvikler-designer-Johanne-horizen.avif",
    },
    date: "25. september 2025",
    readTime: calcReadTime(450),
    tags: ["Dev", "Workflow"],
    href: "/blog/cms-valg-2026",
  },
  {
    slug: "social-media-strategi",
    title: "Social media strategi der faktisk virker",
    excerpt:
      "Glem forfængelighedsmetrics. Her er hvordan du bygger en social media-strategi der skaber reel forretningsværdi.",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop&q=80",
    author: {
      name: "Anne-Sofie",
      title: "Marketing Lead",
      role: "SEO & Digital Strategi",
      avatar: "/staff/staff-Marketing-ansvarlig-Anne-Sofie.webp",
    },
    date: "12. september 2025",
    readTime: calcReadTime(400),
    tags: ["Marketing", "Branding"],
    href: "/blog/social-media-strategi",
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

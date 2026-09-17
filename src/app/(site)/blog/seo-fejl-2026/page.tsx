import type { Metadata } from "next";
import ArticleContent from "./ArticleContent";

const title = "5 SEO-fejl der koster dig kunder i 2026 | Horizen";
const description =
  "De fleste virksomheder begår stadig grundlæggende SEO-fejl. Her er de fem mest kritiske, og hvordan du fikser dem.";
const ogImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop&q=80";
const datePublished = "2026-02-28";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/blog/seo-fejl-2026",
  },
  openGraph: {
    title,
    description,
    url: "/blog/seo-fejl-2026",
    siteName: "Horizen",
    locale: "da_DK",
    type: "article",
    publishedTime: datePublished,
    authors: ["Andreas José Glarbjerg"],
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "5 SEO-fejl der koster dig kunder i 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "5 SEO-fejl der koster dig kunder i 2026",
  description,
  image: ogImage,
  datePublished,
  author: { "@type": "Person", name: "Andreas José Glarbjerg" },
  publisher: {
    "@type": "Organization",
    name: "Horizen",
    logo: {
      "@type": "ImageObject",
      url: "https://horizen.dk/logo/Horizen-LogoType-Black.svg",
    },
  },
};

export default function Page() {
  return (
    <>
      <script
        id="schema-article-seo-fejl-2026"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ArticleContent />
    </>
  );
}

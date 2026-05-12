import type { Metadata } from "next";
import ArticleContent from "./ArticleContent";

const title = "Fra Figma til kode: Vores design-til-udvikling workflow | Horizen";
const description =
  "Et kig bag kulisserne på hvordan vi omsætter designs til pixel-perfekt kode med moderne værktøjer.";
const ogImage = "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&h=630&fit=crop&q=80";
const datePublished = "2026-01-10";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/blog/figma-til-kode",
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
        alt: "Fra Figma til kode",
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
  headline: "Fra Figma til kode: Vores design-til-udvikling workflow",
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
        id="schema-article-figma-til-kode"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ArticleContent />
    </>
  );
}

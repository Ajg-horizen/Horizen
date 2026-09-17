import type { Metadata } from "next";
import ArticleContent from "./ArticleContent";

const title = "Sådan bruger vi AI til at levere bedre webdesign | Horizen";
const description =
  "Vi dykker ned i hvordan kunstig intelligens ændrer vores designproces, og hvad det betyder for dig som kunde.";
const ogImage = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop&q=80";
const datePublished = "2026-03-15";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/blog/ai-webdesign",
  },
  openGraph: {
    title,
    description,
    url: "/blog/ai-webdesign",
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
        alt: "Sådan bruger vi AI til at levere bedre webdesign",
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
  headline: "Sådan bruger vi AI til at levere bedre webdesign",
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
        id="schema-article-ai-webdesign"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ArticleContent />
    </>
  );
}

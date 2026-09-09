import type { Metadata } from "next";
import ArticleContent from "./ArticleContent";

const title = "Hvad er SEO? Byg fundamentet i den rigtige rækkefølge | Horizen";
const description =
  "Hvad er SEO, og i hvilken rækkefølge bygger man det? En begyndervenlig guide til fundament, on-page, indhold og links, og hvornår du kan forvente resultater.";
const ogImage = "https://horizen.dk/blog/hvad-er-seo.webp";
const datePublished = "2026-09-09";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/blog/hvad-er-seo",
  },
  openGraph: {
    title,
    description,
    url: "/blog/hvad-er-seo",
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
        alt: "Hvad er SEO? Byg fundamentet i den rigtige rækkefølge",
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
  headline: "Hvad er SEO? Sådan bygger du fundamentet i den rigtige rækkefølge",
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
        id="schema-article-hvad-er-seo"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ArticleContent />
    </>
  );
}

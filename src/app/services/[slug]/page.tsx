import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, getAllServiceSlugs } from "@/lib/services";
import { getServiceContent } from "@/sanity/service-content";
import ServicePage from "./ServicePage";

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

/**
 * Indhold kommer fra Sanity når siden findes der, ellers fra den lokale datafil.
 * `content` er null ved fallback, og så slår client-komponenten selv op på slug.
 */
async function resolveService(slug: string) {
  const content = await getServiceContent(slug);
  const source = content ?? getService(slug);
  if (!source) return null;
  return { content, metadata: source.metadata, heroImage: getHeroImage(source.blocks) };
}

function getHeroImage(blocks: readonly { type: string }[]): string | undefined {
  const heroBlock = blocks.find((b) => b.type === "hero") as
    | { type: "hero"; image?: { src?: string } }
    | undefined;
  return heroBlock?.image?.src;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await resolveService(slug);
  if (!service) return {};
  const heroImage =
    service.heroImage ?? "/graphics/Hero-image-branding-services.webp";
  const { title, description } = service.metadata;
  return {
    title,
    description,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/services/${slug}`,
      siteName: "Horizen",
      locale: "da_DK",
      type: "website",
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [heroImage],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await resolveService(slug);
  if (!service) notFound();

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.metadata.title,
    description: service.metadata.description,
    provider: {
      "@type": "Organization",
      name: "Horizen",
      url: "https://horizen.dk",
    },
  };

  return (
    <>
      <script
        id={`schema-service-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <ServicePage slug={slug} content={service.content} />
    </>
  );
}

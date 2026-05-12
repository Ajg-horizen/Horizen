import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, getAllServiceSlugs } from "@/lib/services";
import ServicePage from "./ServicePage";

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

function getHeroImage(slug: string): string | undefined {
  const service = getService(slug);
  if (!service) return undefined;
  const heroBlock = service.blocks.find((b) => b.type === "hero") as
    | { type: "hero"; image: { src: string; alt: string } }
    | undefined;
  return heroBlock?.image?.src;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const heroImage =
    getHeroImage(slug) ?? "/graphics/Hero-image-branding-services.webp";
  const { title, description } = service.metadata;
  return {
    title,
    description,
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
  const service = getService(slug);
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
      <ServicePage slug={slug} />
    </>
  );
}

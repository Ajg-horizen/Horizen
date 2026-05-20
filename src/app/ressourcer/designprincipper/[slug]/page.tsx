import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { designPrinciples, getPrincipleBySlug } from "@/lib/design-principles";
import {
  getPrincipleContent,
  isPublished,
} from "@/components/principle-content";
import PrincipleDetail from "./PrincipleDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generér kun statiske ruter for udgivne principper. Skjulte principper
// returnerer 404 ved direkte tilgang, de findes i koden men er ikke live.
export function generateStaticParams() {
  return designPrinciples
    .filter((p) => isPublished(p.slug))
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const principle = getPrincipleBySlug(slug);
  if (!principle) return {};

  const title = `${principle.title} | Designprincipper | Horizen`;
  const description = principle.excerpt;
  const url = `/ressourcer/designprincipper/${principle.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Horizen",
      locale: "da_DK",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const principle = getPrincipleBySlug(slug);
  if (!principle) notFound();
  // Skjulte principper (uden content-fil) returnerer 404 ved direkte tilgang
  if (!isPublished(slug)) notFound();

  const content = getPrincipleContent(slug);
  return <PrincipleDetail principle={principle} content={content} />;
}

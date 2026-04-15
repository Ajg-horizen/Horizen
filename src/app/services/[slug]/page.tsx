import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, getAllServiceSlugs } from "@/lib/services";
import ServicePage from "./ServicePage";

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return service.metadata;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getService(slug)) notFound();
  return <ServicePage slug={slug} />;
}

"use client";

/**
 * Client-component der renderer en service-side.
 *
 * LucideIcon-komponenter kan ikke sendes over server/client-grænsen. Derfor
 * kommer CMS-indhold som ren JSON (`content`, ikoner som navne) og hydreres her.
 * Uden `content` slås siden op i den lokale datafil via slug.
 */

import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBuilder from "@/components/blocks/PageBuilder";
import { getService } from "@/lib/services";
import { hydrateService, type SerializedServicePage } from "@/lib/service-serialize";

export default function ServicePage({
  slug,
  content,
}: {
  slug: string;
  content?: SerializedServicePage | null;
}) {
  const service = useMemo(
    () => (content ? hydrateService(content) : getService(slug)),
    [content, slug],
  );
  if (!service) return null;

  // Konvention: første block er hero og lever uden for bg-background-wrapperen
  // (så det fixed grid-baggrunden kan ses gennem hero-sektionen).
  const [first, ...rest] = service.blocks;
  const hasHero = first?.type === "hero";
  const heroBlocks = hasHero ? [first] : [];
  const restBlocks = hasHero ? rest : service.blocks;

  return (
    <main>
      <Navbar alwaysVisible />

      {hasHero && <PageBuilder blocks={heroBlocks} pageKey={slug} />}

      <div className="relative z-10 bg-background">
        <PageBuilder blocks={restBlocks} pageKey={slug} />
        <Footer />
      </div>
    </main>
  );
}

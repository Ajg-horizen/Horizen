"use client";

/**
 * Client-component der renderer en service-side.
 * Modtager kun slug fra server, slår data op selv — så vi undgår at sende
 * ikke-serialiserbare LucideIcon-komponenter over server/client-grænsen.
 */

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBuilder from "@/components/blocks/PageBuilder";
import { getService } from "@/lib/services";

export default function ServicePage({ slug }: { slug: string }) {
  const service = getService(slug);
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

      {hasHero && <PageBuilder blocks={heroBlocks} />}

      <div className="relative z-10 bg-background">
        <PageBuilder blocks={restBlocks} />
        <Footer />
      </div>
    </main>
  );
}

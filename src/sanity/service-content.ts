/**
 * Server-side hentning af service-sider fra Sanity.
 *
 * Kontrakt: returnerer null ved ENHVER tvivl (ikke konfigureret, intet dokument,
 * ufuldstændigt dokument, netværksfejl). Kalderen falder så tilbage til den
 * lokale datafil, så sitet aldrig kan gå ned af CMS'et.
 */

import { cache } from "react";
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId, sanityConfigured } from "@/sanity/env";
import { fromSanityDoc, type SerializedServicePage } from "@/lib/service-serialize";

const SERVICE_PAGE_QUERY = `*[_type == "servicePage" && slug.current == $slug][0]{
  slug,
  metadata,
  blocks
}`;

// Datasettet er offentligt, så udgivet indhold læses anonymt (intet token).
const readClient = sanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: "published" })
  : null;

// cache(): generateMetadata og selve siden deler ét opslag pr. request.
export const getServiceContent = cache(async function getServiceContent(
  slug: string,
): Promise<SerializedServicePage | null> {
  // CONTENT_SOURCE=local tvinger datafilerne (bruges til før/efter-sammenligning).
  if (!readClient || process.env.CONTENT_SOURCE === "local") return null;

  try {
    const doc = await readClient.fetch(
      SERVICE_PAGE_QUERY,
      { slug },
      // Dev: altid frisk, så rettelser i Studio ses med det samme.
      // Prod: cachet i 60 sek. og tagget. Rettelser ses altså inden for ca. et minut.
      // Når revaliderings-webhooket findes, kan tiden hæves og tagget tage over.
      process.env.NODE_ENV === "development"
        ? { cache: "no-store" }
        : { next: { revalidate: 60, tags: [`servicePage:${slug}`] } },
    );
    return fromSanityDoc(doc);
  } catch (error) {
    console.warn(`[sanity] Kunne ikke hente service-siden "${slug}". Bruger lokal datafil.`, error);
    return null;
  }
});

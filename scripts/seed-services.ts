/**
 * Skubber service-sidernes datafiler ind i Sanity.
 *
 *   npx tsx --env-file=.env.local scripts/seed-services.ts ai-search
 *   npx tsx --env-file=.env.local scripts/seed-services.ts --all
 *
 * En side findes via sin slug. Findes den allerede, springes den over, fordi den
 * så ejes af Studio. --force overskriver den fra datafilen (rettelser i Studio tabes).
 * Skriver til det dataset, NEXT_PUBLIC_SANITY_DATASET peger på. Nægter at røre
 * "production", medmindre --production er givet med vilje.
 */

import { createClient } from "@sanity/client";
import { services } from "@/lib/services";
import { serializeService, toSanityDoc } from "@/lib/service-serialize";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const wanted = args.filter((a) => !a.startsWith("--"));

async function main() {
  if (!projectId || !dataset || !token) {
    throw new Error("Mangler NEXT_PUBLIC_SANITY_PROJECT_ID, _DATASET eller SANITY_API_WRITE_TOKEN.");
  }
  if (dataset === "production" && !flags.has("--production")) {
    throw new Error('Dataset er "production". Kør med --production hvis det er med vilje.');
  }

  const pages = flags.has("--all") ? services : services.filter((s) => wanted.includes(s.slug));
  if (!pages.length) {
    throw new Error(`Ingen sider valgt. Kendte slugs: ${services.map((s) => s.slug).join(", ")}`);
  }

  const client = createClient({ projectId, dataset, token, apiVersion: "2025-02-19", useCdn: false });
  console.log(`Seeder ${pages.length} side(r) til ${projectId}/${dataset}`);

  for (const page of pages) {
    const doc = toSanityDoc(serializeService(page));
    const existingId = await client.fetch<string | null>(
      `*[_type == "servicePage" && slug.current == $slug][0]._id`,
      { slug: page.slug },
    );
    // Findes siden allerede, ejes den af Studio. Datafilen må ikke vælte redaktørens arbejde.
    if (existingId && !flags.has("--force")) {
      console.log(`  sprunget over  ${page.slug}  (findes i Sanity. Brug --force for at overskrive fra datafilen)`);
      continue;
    }
    const saved = existingId
      ? await client.createOrReplace({ ...doc, _id: existingId })
      : await client.create(doc);
    console.log(`  ${existingId ? "overskrevet" : "oprettet   "}  ${page.slug}  (${saved._id}, ${doc.blocks.length} blokke)`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

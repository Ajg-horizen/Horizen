/**
 * Vagt: beviser at hver service-side overlever turen
 *   kode → JSON → Sanity-dokument → JSON → kode
 * uden tab. Fejler hvis et ikon eller en farve mangler i service-registry.ts.
 *
 *   npx tsx scripts/check-service-roundtrip.ts
 */

import assert from "node:assert/strict";
import { services } from "@/lib/services";
import {
  fromSanityDoc,
  hydrateService,
  serializeService,
  toSanityDoc,
} from "@/lib/service-serialize";

let failed = 0;

for (const page of services) {
  try {
    const serialized = serializeService(page);
    const back = fromSanityDoc(JSON.parse(JSON.stringify(toSanityDoc(serialized))));
    assert.deepEqual(back, serialized, "Sanity-turen ændrede indholdet");

    // Hydreret side skal serialisere til præcis det samme igen (ikoner + farver intakte).
    assert.deepEqual(serializeService(hydrateService(serialized)), serialized, "hydrering tabte data");

    console.log(`  ok    ${page.slug.padEnd(16)} ${page.blocks.length} blokke`);
  } catch (error) {
    failed++;
    console.log(`  FEJL  ${page.slug.padEnd(16)} ${error instanceof Error ? error.message : error}`);
  }
}

if (failed) {
  console.error(`\n${failed} side(r) fejlede.`);
  process.exit(1);
}
console.log("\nAlle sider overlever turen uden tab.");

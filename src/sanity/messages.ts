import { createClient } from "@sanity/client";
import { apiVersion, projectId, snapshotDataset } from "@/sanity/env";

/**
 * Klient til beskeder fra Horizen (seoClientMessage). Ligger altid i production
 * (som SEO-snapshots), også lokalt, så historikken og tjek-siden er de samme
 * overalt. Private id'er, så læsning kræver token.
 */
export function messagesClient(write = false) {
  return createClient({
    projectId,
    dataset: snapshotDataset,
    apiVersion,
    useCdn: false,
    token: write
      ? process.env.SANITY_API_WRITE_TOKEN
      : process.env.SANITY_API_READ_TOKEN,
  });
}

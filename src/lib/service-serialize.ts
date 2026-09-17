/**
 * Bro mellem kodens ServicePage (med React-ikoner og Tailwind-klasser) og den
 * rene JSON-form, der kan ligge i Sanity og sendes fra server til client.
 *
 *   ServicePage  --serializeService-->  SerializedServicePage  --toSanityDoc-->  Sanity
 *   Sanity  --fromSanityDoc-->  SerializedServicePage  --hydrateService-->  ServicePage
 *
 * Komponenterne kender kun ServicePage. De ved ikke, hvor indholdet kom fra.
 */

import type { ServicePage } from "@/lib/services";
import { iconByName, nameOfIcon, nameOfTone, toneByName } from "@/lib/service-registry";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type JsonObject = { [key: string]: Json };

export type SerializedBlock = JsonObject & { type: string };

export type SerializedServicePage = {
  slug: string;
  metadata: { title: string; description: string };
  blocks: SerializedBlock[];
};

/** Blok-typer hvis heading i CMS'et altid er en liste af linjer. */
const LINES_HEADING = new Set(["monthlyWork", "faq", "deliverables"]);
/** Blok-typer hvis heading i CMS'et altid er { lead, mutedTail }. */
const SPLIT_HEADING = new Set(["aiCitation", "designTokens", "uxVsUi"]);

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/* ─── Kode → JSON ─────────────────────────────────────────── */

function serializeValue(value: unknown, key?: string): Json {
  // Ikoner er React-komponenter (objekter), så de skal fanges før objekt-grenen.
  if (key === "icon") return nameOfIcon(value);
  if (Array.isArray(value)) return value.map((v) => serializeValue(v));
  if (isPlainObject(value)) {
    const out: JsonObject = {};
    const { bg, fg, ...rest } = value;
    for (const [k, v] of Object.entries(rest)) {
      if (v !== undefined) out[k] = serializeValue(v, k);
    }
    if (typeof bg === "string" && typeof fg === "string") out.tone = nameOfTone(bg, fg);
    return out;
  }
  if (value === undefined) return null;
  return value as Json;
}

export function serializeService(page: ServicePage): SerializedServicePage {
  const blocks = page.blocks.map((block) => {
    const out = serializeValue(block) as SerializedBlock;
    // CMS-felter kan ikke være "tekst ELLER objekt". Normalisér til én form.
    if (LINES_HEADING.has(out.type) && typeof out.heading === "string") {
      out.heading = [out.heading];
    }
    if (SPLIT_HEADING.has(out.type) && typeof out.heading === "string") {
      out.heading = { lead: out.heading };
    }
    return out;
  });
  return { slug: page.slug, metadata: { ...page.metadata }, blocks };
}

/* ─── JSON → kode ─────────────────────────────────────────── */

function hydrateValue(value: Json, key?: string): unknown {
  if (key === "icon" && typeof value === "string") return iconByName(value);
  if (Array.isArray(value)) return value.map((v) => hydrateValue(v));
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    const { tone, ...rest } = value as JsonObject;
    for (const [k, v] of Object.entries(rest)) out[k] = hydrateValue(v, k);
    if (typeof tone === "string") Object.assign(out, toneByName(tone));
    return out;
  }
  return value;
}

export function hydrateService(page: SerializedServicePage): ServicePage {
  return {
    slug: page.slug,
    metadata: page.metadata,
    blocks: page.blocks.map((b) => hydrateValue(b)) as ServicePage["blocks"],
  };
}

/* ─── JSON ↔ Sanity-dokument ──────────────────────────────── */

const BLOCK_PREFIX = "block.";

function withKeys(value: Json): Json {
  if (Array.isArray(value)) {
    return value.map((v, i) =>
      isPlainObject(v) ? ({ _key: `k${i}`, ...(withKeys(v) as JsonObject) } as Json) : withKeys(v),
    );
  }
  if (isPlainObject(value)) {
    const out: JsonObject = {};
    for (const [k, v] of Object.entries(value as JsonObject)) out[k] = withKeys(v);
    return out;
  }
  return value;
}

export function toSanityDoc(page: SerializedServicePage) {
  return {
    _type: "servicePage" as const,
    name: page.slug,
    slug: { _type: "slug" as const, current: page.slug },
    metadata: page.metadata,
    blocks: page.blocks.map((block, i) => {
      const { type, ...rest } = block;
      return {
        ...(withKeys(rest) as JsonObject),
        _type: `${BLOCK_PREFIX}${type}`,
        _key: `${type}-${i}`,
      };
    }),
  };
}

function stripSystemFields(value: Json): Json {
  if (Array.isArray(value)) return value.map(stripSystemFields);
  if (isPlainObject(value)) {
    const out: JsonObject = {};
    for (const [k, v] of Object.entries(value as JsonObject)) {
      if (k === "_key" || k === "_type") continue;
      if (v === null) continue;
      out[k] = stripSystemFields(v);
    }
    return out;
  }
  return value;
}

type SanityServiceDoc = {
  slug?: { current?: string };
  metadata?: { title?: string; description?: string };
  blocks?: (JsonObject & { _type?: string })[];
};

/** Returnerer null hvis dokumentet ikke er komplet nok til at erstatte datafilen. */
export function fromSanityDoc(doc: SanityServiceDoc | null): SerializedServicePage | null {
  const slug = doc?.slug?.current;
  const title = doc?.metadata?.title;
  const description = doc?.metadata?.description;
  if (!doc || !slug || !title || !description || !doc.blocks?.length) return null;

  const blocks = doc.blocks.map((raw) => {
    const type = String(raw._type ?? "").replace(BLOCK_PREFIX, "");
    return { ...(stripSystemFields(raw) as JsonObject), type } as SerializedBlock;
  });
  return { slug, metadata: { title, description }, blocks };
}

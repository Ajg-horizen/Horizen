/**
 * Valglister der deles mellem sitet og Sanity Studio.
 *
 * Ren data uden afhængigheder, så Studio kan importere filen uden at trække
 * sitets React-kode med. `service-registry.ts` SKAL dække præcis disse navne
 * (TypeScript fejler ellers), så Studio aldrig kan tilbyde et valg, sitet ikke
 * kan tegne.
 */

export const ICON_NAMES = [
  "AlertTriangleIcon",
  "BadgeCheckIcon",
  "BrushIcon",
  "CodeIcon",
  "ComponentIcon",
  "ContrastIcon",
  "DatabaseIcon",
  "EyeIcon",
  "FileTextIcon",
  "GaugeIcon",
  "GitBranchIcon",
  "GridIcon",
  "ImageIcon",
  "LayersIcon",
  "LayoutIcon",
  "LinkIcon",
  "MegaphoneIcon",
  "MessageSquareIcon",
  "MousePointerClickIcon",
  "PaletteIcon",
  "PenToolIcon",
  "PrinterIcon",
  "QuoteIcon",
  "RefreshCwIcon",
  "RocketIcon",
  "SearchCheckIcon",
  "SearchIcon",
  "ShieldCheckIcon",
  "ShieldIcon",
  "SmartphoneIcon",
  "SparklesIcon",
  "TargetIcon",
  "TrendingUpIcon",
  "TypeIcon",
  "UsersIcon",
  "WrenchIcon",
  "ZapIcon",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

/** Farvetoner til ikon-felter på kort. `swatch` bruges kun til visning i Studio. */
export const TONE_OPTIONS = [
  { value: "blue", title: "Blå", swatch: "#e4e8f0" },
  { value: "peach", title: "Fersken", swatch: "#fce8db" },
  { value: "sand", title: "Sand", swatch: "#f0ece4" },
  { value: "lilac", title: "Lilla", swatch: "#ebe4f0" },
  { value: "green", title: "Grøn", swatch: "#e8f0e4" },
  { value: "teal", title: "Petrol", swatch: "#e0eeec" },
  { value: "dark", title: "Mørk", swatch: "#2a2a2a" },
] as const;

export type ToneName = (typeof TONE_OPTIONS)[number]["value"];

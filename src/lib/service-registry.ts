/**
 * Register der oversætter mellem CMS-venlige navne og det koden tegner med.
 *
 * Sanity kan ikke gemme React-komponenter eller Tailwind-klasser. Derfor gemmer
 * CMS'et et NAVN (ikon) og en TONE (farve), og her slås de op. Klasserne står
 * som hele strenge, så Tailwind stadig finder dem ved build.
 *
 * Nyt ikon eller ny tone = tilføj det her (og i Studio-schemaets valgliste).
 */

import {
  AlertTriangleIcon,
  BadgeCheckIcon,
  BrushIcon,
  CodeIcon,
  ComponentIcon,
  ContrastIcon,
  DatabaseIcon,
  EyeIcon,
  FileTextIcon,
  GaugeIcon,
  GitBranchIcon,
  GridIcon,
  ImageIcon,
  LayersIcon,
  LayoutIcon,
  LinkIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  MousePointerClickIcon,
  PaletteIcon,
  PenToolIcon,
  PrinterIcon,
  QuoteIcon,
  RefreshCwIcon,
  RocketIcon,
  SearchCheckIcon,
  SearchIcon,
  ShieldCheckIcon,
  ShieldIcon,
  SmartphoneIcon,
  SparklesIcon,
  TargetIcon,
  TrendingUpIcon,
  TypeIcon,
  UsersIcon,
  WrenchIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";
import type { IconName, ToneName } from "@/lib/service-options";

export type { IconName, ToneName };

// `satisfies Record<IconName, …>`: mangler et navn fra service-options.ts, eller
// står der et for meget her, fejler type-tjekket.
export const ICONS = {
  AlertTriangleIcon,
  BadgeCheckIcon,
  BrushIcon,
  CodeIcon,
  ComponentIcon,
  ContrastIcon,
  DatabaseIcon,
  EyeIcon,
  FileTextIcon,
  GaugeIcon,
  GitBranchIcon,
  GridIcon,
  ImageIcon,
  LayersIcon,
  LayoutIcon,
  LinkIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  MousePointerClickIcon,
  PaletteIcon,
  PenToolIcon,
  PrinterIcon,
  QuoteIcon,
  RefreshCwIcon,
  RocketIcon,
  SearchCheckIcon,
  SearchIcon,
  ShieldCheckIcon,
  ShieldIcon,
  SmartphoneIcon,
  SparklesIcon,
  TargetIcon,
  TrendingUpIcon,
  TypeIcon,
  UsersIcon,
  WrenchIcon,
  ZapIcon,
} satisfies Record<IconName, LucideIcon>;

/** De syv farvepar der bruges på kort-ikoner på tværs af service-siderne. */
export const TONES = {
  blue: { bg: "bg-[#e4e8f0]", fg: "text-[#2a3550]" },
  peach: { bg: "bg-[#fce8db]", fg: "text-[#6b3a1f]" },
  sand: { bg: "bg-[#f0ece4]", fg: "text-[#5a4a2d]" },
  lilac: { bg: "bg-[#ebe4f0]", fg: "text-[#3d2a50]" },
  green: { bg: "bg-[#e8f0e4]", fg: "text-[#2d4a28]" },
  teal: { bg: "bg-[#e0eeec]", fg: "text-[#1f4a42]" },
  dark: { bg: "bg-[#2a2a2a]", fg: "text-[#f5f5f0]" },
} as const satisfies Record<ToneName, { bg: string; fg: string }>;

export function iconByName(name: string): LucideIcon {
  const icon = (ICONS as Record<string, LucideIcon>)[name];
  if (!icon) throw new Error(`Ukendt ikon "${name}". Tilføj det i service-registry.ts.`);
  return icon;
}

export function nameOfIcon(icon: unknown): IconName {
  const hit = (Object.entries(ICONS) as [IconName, LucideIcon][]).find(([, c]) => c === icon);
  if (!hit) throw new Error("Ikon mangler i service-registry.ts (kan ikke serialiseres).");
  return hit[0];
}

export function toneByName(name: string): { bg: string; fg: string } {
  const tone = (TONES as Record<string, { bg: string; fg: string }>)[name];
  if (!tone) throw new Error(`Ukendt tone "${name}". Tilføj den i service-registry.ts.`);
  return tone;
}

export function nameOfTone(bg: string, fg: string): ToneName {
  const hit = (Object.entries(TONES) as [ToneName, { bg: string; fg: string }][]).find(
    ([, t]) => t.bg === bg && t.fg === fg,
  );
  if (!hit) throw new Error(`Farveparret ${bg} / ${fg} mangler i service-registry.ts.`);
  return hit[0];
}

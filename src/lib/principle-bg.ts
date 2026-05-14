/**
 * Pastel-baggrunde fra Horizens forside (ServicesSection), mappet pr.
 * kategori. Lever som server-safe modul så både server- og
 * klient-komponenter kan slå farven op.
 */

import type { PrincipleCategory } from "./design-principles";

const CATEGORY_BG: Record<PrincipleCategory, string> = {
  Perception: "#e4e8f0",
  Kognition: "#fce8db",
  Hukommelse: "#e0eeec",
  Opmærksomhed: "#f0ece4",
  Adfærd: "#e8f0e4",
};

export function illustrationBg(category: PrincipleCategory): string {
  return CATEGORY_BG[category] ?? "#f5f5f0";
}

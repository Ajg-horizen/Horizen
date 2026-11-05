"use client";

import type { LayoutProps } from "sanity";
import { useDashboardReturn } from "./DashboardReturn";

/**
 * Studio-layout: kom man fra SEO-dashboardets "Log ind med Sanity", sendes man
 * tilbage til dashboardet efter login (se DashboardReturn). Registreres på
 * `studio.components.layout` i sanity.config.
 */
export function StudioLayout(props: LayoutProps) {
  useDashboardReturn();
  return props.renderDefault(props);
}

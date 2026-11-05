/**
 * Sanity-indstillinger til SEO-dashboardet og dets tællere (samme stier som i
 * SanityPress-templaten, så dashboardets filer kan kopieres uændret).
 *
 * Dashboardets data (Search Console-snapshots, henvendelser, AI-besøg, beskeder,
 * opgaver) ligger altid i production, også når sitet lokalt læser development
 * (se src/sanity/env.ts). SEO_DASHBOARD_DATASET kan overstyre til test.
 */
import { apiVersion as siteApiVersion, projectId as siteProjectId } from "@/sanity/env";

export const projectId = siteProjectId;
export const dataset = process.env.SEO_DASHBOARD_DATASET || "production";
export const apiVersion = siteApiVersion;

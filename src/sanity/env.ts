/**
 * Projekt-id og dataset er ikke hemmelige (Studio har dem også i klartekst), så
 * de har standardværdier her og kræver ingen opsætning i Vercel.
 *
 *  - Live og preview:  production
 *  - Lokalt:           .env.local sætter NEXT_PUBLIC_SANITY_DATASET=development
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "h8zzgfds";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2025-02-19";

/** CONTENT_SOURCE=local slår CMS'et helt fra, så sitet kører på datafilerne. */
export const sanityConfigured = Boolean(projectId && dataset);

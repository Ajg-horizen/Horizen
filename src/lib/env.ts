/** Fælles flag til SEO-dashboardet (samme navne som i SanityPress-templaten). */
export const dev = process.env.NODE_ENV === "development";
export const vercelPreview = process.env.VERCEL_ENV === "preview";

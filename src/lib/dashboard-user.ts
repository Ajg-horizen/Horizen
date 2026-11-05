/**
 * Header, som proxy.ts sætter med brugernavnet på den, der er logget ind på
 * /dashboard, og som SEO-dashboardet læser (Horizen ser mere end kunden).
 * Sættes altid af proxy'en selv, så den kan ikke forfalskes udefra.
 */
export const DASHBOARD_USER_HEADER = 'x-dashboard-user'

/** Navnet på den, der er logget ind med Sanity (URI-kodet); tom ved kode-login */
export const DASHBOARD_NAME_HEADER = 'x-dashboard-name'

/** Mailen på den, der er logget ind (fx til afsender i fanen Beskeder) */
export const DASHBOARD_EMAIL_HEADER = 'x-dashboard-email'

/**
 * sessionStorage-nøgle: dashboard-adressen, man var på vej til, da man trykkede
 * "Log ind med Sanity". Studio læser den efter login og sender én tilbage, så
 * man lander direkte i dashboardet (se useDashboardReturn i Studio-layoutet).
 */
export const DASHBOARD_RETURN_KEY = 'dashboard-return'

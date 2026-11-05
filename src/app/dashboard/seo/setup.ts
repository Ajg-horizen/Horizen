/**
 * Opsætningsgennemgang til fanen "Opsætning" på SEO-dashboardet. Gennemgås ved
 * hver ny kunde, før launch og igen efter 30 dage, så data løber fra dag ét:
 * Search Console, GA4, Google Ads, SEO-dashboardet og den anonyme måling.
 *
 * Denne fil er den ENESTE kilde til tjeklisten (INSTALLATION-TJEKLISTE.md
 * peger hertil). Tilføj nye punkter her, når templaten får nye funktioner.
 *
 * Punkter med `auto` tjekkes automatisk af dashboardet (miljøvariabler, data i
 * Sanity). Resten krydses af pr. projekt i data.ts → `setupChecked`.
 */

/** Automatiske tjek. Beregnes i page.tsx (getSetupAuto); værdier vises aldrig. */
export type SetupAutoKey =
	| 'baseUrl'
	| 'sanity'
	| 'readToken'
	| 'writeToken'
	| 'dashboardLogin'
	| 'gaId'
	| 'googleOauth'
	| 'searchConsoleSite'
	| 'pagespeedKey'
	| 'cronSecret'
	| 'horizenMail'
	| 'snapshotDatasets'
	| 'snapshots'
	| 'leadEvents'
	| 'seoCheck'
	| 'pages'
	| 'retainer'

export type SetupItem = {
	/** Fast id, bruges som nøgle i data.ts → setupChecked */
	id: string
	title: string
	/** Hvordan det sættes op */
	how: string
	/** Hvad der beviser, at det virker */
	check: string
	auto?: SetupAutoKey
	/** Kun relevant for nogle kunder (fx Google Ads) */
	optional?: boolean
}

export type SetupSection = { title: string; intro?: string; items: SetupItem[] }

export const setupIntro =
	'Gennemgås ved hver ny kunde, før launch og igen efter 30 dage. Målet er, at data løber korrekt fra første dag: et design, der virker, er ikke nok, hvis vi ikke kan følge op og dokumentere resultater. Grønne punkter er tjekket automatisk eller krydset af. Automatiske tjek gælder det miljø, du kigger i, så se fanen på det live domæne for den rigtige status.'

export const setupSections: SetupSection[] = [
	{
		title: 'Sanity',
		items: [
			{
				id: 'sanity-projekt',
				title: 'Projekt og datasets',
				how: 'Projekt oprettet i den rigtige organisation med datasets "production" (live) og "development" (lokalt og preview).',
				check: 'Projekt-id og dataset er sat i miljøet.',
				auto: 'sanity',
			},
			{
				id: 'sanity-cors',
				title: 'CORS-domæner',
				how: 'Sanity → API → CORS: localhost-porten, Vercel-preview-domænet og det endelige domæne (med og uden www).',
				check: 'Studio på /admin åbner uden fejl på live-domænet.',
			},
			{
				id: 'sanity-read-token',
				title: 'Læse-token (Viewer)',
				how: 'Sanity → API → Tokens: opret et Viewer-token og sæt det som SANITY_API_READ_TOKEN.',
				check: 'Dashboardet kan hente tal og tællinger.',
				auto: 'readToken',
			},
			{
				id: 'sanity-write-token',
				title: 'Skrive-token (Editor), kun Production',
				how: 'Opret et Editor-token og sæt det som SANITY_API_WRITE_TOKEN, KUN i Vercel Production, så previews ikke tæller med.',
				check:
					'Bruges af Search Console-hentningen, Ad hoc-opgaver og tællingen af henvendelser og AI-besøg.',
				auto: 'writeToken',
			},
			{
				id: 'horizen-mail',
				title: 'Mails fra Horizen (Beskeder og spørgsmål)',
				how: 'Sæt HORIZEN_RESEND_API_KEY (Horizens egen Resend-nøgle, hvor horizen.dk er verificeret) i Vercel Production. Kører med node scripts/setup-dashboard-env.mjs. Udfyld clientMessageDefaults i data.ts (kundens navn, mail, anmeldelseslink og SMS-hilsen).',
				check: 'En besked fra fanen Beskeder lander hos modtageren fra din horizen.dk-adresse, og du får en kopi.',
				auto: 'horizenMail',
			},
			{
				id: 'sanity-studio-build',
				title: 'Studio bygger i produktion',
				how: 'Kør npm run build lokalt; /admin skal prerendres. Dev-tilstand er ikke nok (window-fejl giver 500 i produktion).',
				check: '<domæne>/admin svarer og kan logges ind på.',
			},
		],
	},
	{
		title: 'Vercel og domæne',
		intro:
			'Sæt miljøvariabler under Project → Settings → Environment Variables, og udrul igen efter hver ændring.',
		items: [
			{
				id: 'vercel-base-url',
				title: 'NEXT_PUBLIC_BASE_URL = det endelige domæne',
				how: 'Production: https://kunde.dk. Styrer canonical, sitemap og delebilleder.',
				check:
					'Sat til et https-domæne, ikke localhost eller en preview-adresse.',
				auto: 'baseUrl',
			},
			{
				id: 'vercel-dataset',
				title: 'Dataset pr. miljø',
				how: 'NEXT_PUBLIC_SANITY_DATASET: production i Production, development i Preview.',
				check: 'Live viser udgivet live-indhold; preview viser development.',
			},
			{
				id: 'vercel-dashboard-login',
				title: 'Login til dashboardet (Sanity)',
				how: 'Hurtigst: kør node scripts/setup-dashboard-env.mjs i kundens mappe (sætter også PAGESPEED_API_KEY og SANITY_API_WRITE_TOKEN og udruller igen). Ellers: sæt DASHBOARD_SESSION_SECRET (lang tilfældig streng, fx openssl rand -base64 32). Kunden skal have en bruger i Sanity-projektet; @horizen.dk-adresser ser Horizen-udgaven. Der er intet kode-login. Uden DASHBOARD_SESSION_SECRET er dashboardet låst i produktion.',
				check: 'Log ind med Sanity virker på det live domæne for både Horizen og kunden.',
				auto: 'dashboardLogin',
			},
			{
				id: 'vercel-domaene',
				title: 'Domæne og omdirigeringer',
				how: 'Domænet peger på Vercel med https; www og uden www ender samme sted.',
				check:
					'Forsiden svarer på det rigtige domæne, og den anden variant omdirigerer.',
			},
		],
	},
	{
		title: 'Google Search Console',
		items: [
			{
				id: 'gsc-property',
				title: 'Domæne-property verificeret',
				how: 'Opret sc-domain:kunde.dk og verificér via DNS. Den dækker http/https og www.',
				check: 'Propertyen står som verificeret i Search Console.',
			},
			{
				id: 'gsc-oauth',
				title: 'Adgang til data (OAuth)',
				how: 'Kør node scripts/get-refresh-token.mjs med Google-kontoen, der ejer propertyen, og sæt GOOGLE_OAUTH_CLIENT_ID, _CLIENT_SECRET og _REFRESH_TOKEN.',
				check: 'Alle tre værdier er sat.',
				auto: 'googleOauth',
			},
			{
				id: 'gsc-site',
				title: 'SEARCH_CONSOLE_SITE',
				how: 'Sæt til propertyen, fx sc-domain:kunde.dk.',
				check: 'Værdien er sat.',
				auto: 'searchConsoleSite',
			},
			{
				id: 'gsc-cron',
				title: 'Månedlig hentning (cron)',
				how: 'Sæt CRON_SECRET. Vercel henter forrige måneds tal den 3. (vercel.json). Sæt evt. SEO_SNAPSHOT_DATASETS=production,development.',
				check: 'CRON_SECRET er sat.',
				auto: 'cronSecret',
			},
			{
				id: 'gsc-datasets',
				title: 'Tal både live og lokalt',
				how: 'SEO_SNAPSHOT_DATASETS=production,development, så dashboardet viser de samme tal lokalt.',
				check: 'Værdien er sat.',
				auto: 'snapshotDatasets',
				optional: true,
			},
			{
				id: 'gsc-sitemap',
				title: 'Sitemap indsendt',
				how: 'Search Console → Sitemaps: indsend https://kunde.dk/sitemap.xml.',
				check: 'Status "Gennemført".',
			},
			{
				id: 'gsc-data',
				title: 'Første tal er kommet',
				how: 'Kommer automatisk den 3. i måneden, typisk ca. 30 dage efter launch. Kan testes med /api/cron/seo-snapshot?month=ÅÅÅÅ-MM og Bearer-headeren.',
				check: 'Der ligger mindst én måned med Search Console-tal.',
				auto: 'snapshots',
			},
			{
				id: 'pagespeed-key',
				title: 'PAGESPEED_API_KEY (Sidens helbred)',
				how: 'Google Cloud (samme projekt som Search Console): aktivér PageSpeed Insights API, opret en API-nøgle under Credentials, og begræns den til netop det API. Sæt den i Vercel. Forsiden måles så automatisk den 3. i hver måned (vercel.json, kræver CRON_SECRET).',
				check: 'Performance → Sidens helbred → Mål nu (Horizen) giver en måling på det live domæne.',
				auto: 'pagespeedKey',
			},
		],
	},
	{
		title: 'Google Analytics 4',
		items: [
			{
				id: 'ga4-property',
				title: 'GA4-property og NEXT_PUBLIC_GA_ID',
				how: 'Opret property og web-datastrøm, og sæt måle-id’et (G-…) som NEXT_PUBLIC_GA_ID i Vercel Production. Udrul igen bagefter. Tom værdi = intet GA og intet cookie-banner.',
				check:
					'NEXT_PUBLIC_GA_ID er sat, og du ser dig selv i GA4 → Realtid efter accept.',
				auto: 'gaId',
			},
			{
				id: 'ga4-samtykke',
				title: 'Cookie-samtykke (Consent Mode v2)',
				how: 'Indbygget: cookie-banneret vises, GA indlæses først efter accept af statistik, og "Cookie-indstillinger" står i footeren. Tilpas evt. bannerets tekst i src/ui/CookieBanner.tsx.',
				check:
					'Ingen kald til googletagmanager.com før accept (se netværksfanen), og footer-linket åbner banneret igen.',
			},
			{
				id: 'ga4-haendelser',
				title: 'Nøglehændelser',
				how: 'click_to_call, click_email og ai_referral sendes automatisk (src/ui/SiteTracking.tsx). Formularer kalder gaEvent("generate_lead") fra src/lib/analytics.ts. Admin → Hændelser: markér generate_lead, click_to_call og click_email som nøglehændelser.',
				check: 'Et klik på telefonnummeret giver click_to_call i Realtid.',
			},
			{
				id: 'ga4-lagring',
				title: 'Datalagring 14 måneder',
				how: 'Admin → Dataindsamling → Datalagring.',
				check: 'Står på 14 måneder.',
			},
			{
				id: 'ga4-gsc-link',
				title: 'GA4 ↔ Search Console',
				how: 'Admin → Produktlinks → Search Console.',
				check: 'Linket står som aktivt.',
			},
		],
	},
	{
		title: 'Google Ads',
		intro: 'Kun hvis kunden annoncerer.',
		items: [
			{
				id: 'ads-ga4',
				title: 'Google Ads ↔ GA4',
				how: 'GA4: Admin → Produktlinks → Google Ads. Slå automatisk tagging til i Ads.',
				check: 'Linket står som aktivt.',
				optional: true,
			},
			{
				id: 'ads-konverteringer',
				title: 'Konverteringer importeret',
				how: 'Importér generate_lead og click_to_call fra GA4 til Ads, og vælg den primære konvertering.',
				check: 'Status "Registrerer konverteringer" inden for et par dage.',
				optional: true,
			},
			{
				id: 'ads-gsc',
				title: 'Google Ads ↔ Search Console',
				how: 'Ads: Værktøjer → Linkede konti → Search Console. Giver rapporten "Betalt og organisk".',
				check: 'Linket står som aktivt.',
				optional: true,
			},
		],
	},
	{
		title: 'Måling på sitet (indbygget)',
		items: [
			{
				id: 'maaling-formular',
				title: 'Formularer tælles',
				how: 'Kald recordLead("form", sti, kilde) fra src/lib/siteEvents.ts i projektets formular-API, når mailen er sendt, og gaEvent("generate_lead", { form: "<navn>" }) i formularen, så GA4 også får den. Kilden: send source: landingSource() (src/lib/trafficSource.ts) med i formularens POST og tjek den med isTrafficSource.',
				check: 'En testformular giver et leadEvent i Sanity.',
			},
			{
				id: 'maaling-test',
				title: 'Første registrering',
				how: 'Klik på telefonnummeret på mobil på det live site (kræver skrive-token i Production).',
				check: 'Der er registreret mindst én henvendelse.',
				auto: 'leadEvents',
			},
			{
				id: 'maaling-ai',
				title: 'AI-besøg tælles',
				how: 'Åbn https://kunde.dk/?utm_source=chatgpt.com på det live site.',
				check:
					'Et aiVisit vises under Performance → AI-søgning.',
			},
			{
				id: 'maaling-gbp-utm',
				title: 'Google My Business-linket har utm_source=gbp',
				how: 'Google Business Profile → Rediger profil → Websted: sæt adressen til https://kunde.dk/?utm_source=gbp&utm_medium=organic. Ellers tæller klik fra profilen som organisk søgning under Henvendelser → Hvor kom de fra?',
				check: 'Linket på profilen åbner sitet med ?utm_source=gbp.',
			},
		],
	},
	{
		title: 'Bing og AI-søgning',
		items: [
			{
				id: 'bing',
				title: 'Bing Webmaster Tools',
				how: 'Importér sitet fra Search Console og indsend sitemap. ChatGPT-søgning og Copilot bygger i høj grad på Bings indeks.',
				check: 'Sitet står som verificeret i Bing.',
			},
			{
				id: 'ai-crawlere',
				title: 'AI-crawlere har adgang',
				how: 'robots.txt må ikke blokere GPTBot, OAI-SearchBot, ClaudeBot eller PerplexityBot. Templaten tillader alle som standard.',
				check: 'curl -A "GPTBot" https://kunde.dk/ giver 200 og hele siden.',
			},
		],
	},
	{
		title: 'Google Business og lokal SEO',
		intro:
			'For lokale virksomheder. Profilen og LocalBusiness-dataene på sitet skal fortælle Google præcis det samme: navn, adresse og telefon. Begge dele skal være på plads før launch.',
		items: [
			{
				id: 'gbp-gruppe',
				title: 'Profilen ligger i Horizens virksomhedsgruppe',
				how: 'business.google.com med Horizen-kontoen → virksomhedsgruppen "Horizen kunder". Kunden er PRIMÆR EJER (egen Google-konto, fx info@kunde.dk), Horizen er ejer eller administrator. Opretter vi profilen, overføres det primære ejerskab til kunden bagefter.',
				check:
					'Profilen står i gruppen, kunden er primær ejer, og Horizen kan redigere.',
				optional: true,
			},
			{
				id: 'gbp-verificeret',
				title: 'Profilen er oprettet og verificeret',
				how: 'Firmaets rigtige navn (ingen ekstra søgeord), korrekt hovedkategori, telefon og hjemmeside. Verificering sker sammen med kunden (typisk video af skilt, bil eller udstyr og bevis på driften). Kører firmaet ud til kunderne (håndværk, rengøring): opret som servicevirksomhed, skjul adressen og angiv serviceområdet.',
				check: 'Profilen står som verificeret og kan findes på Google Maps.',
				optional: true,
			},
			{
				id: 'gbp',
				title: 'Profil linker til sitet',
				how: 'Navn, adresse og telefon er identiske med sitet, og profilen linker til det rigtige domæne.',
				check: 'Profilen viser det rigtige domæne.',
				optional: true,
			},
			{
				id: 'localbusiness-sitewide',
				title: 'LocalBusiness-data (JSON-LD) på ALLE sider',
				how: 'Strukturerede data i layoutet, så de kommer med på forside og undersider (ikke kun forsiden). Oplysningerne hentes fra Sanity (Site settings), så de følger med, når kontaktdata rettes. Færdig løsning i ACP-projektet: src/ui/LocalBusinessJsonLd.tsx + Site settings → "Virksomhed (lokal SEO)".',
				check:
					'Kildekoden på forsiden og to undersider har en script type="application/ld+json" med LocalBusiness.',
				optional: true,
			},
			{
				id: 'localbusiness-felter',
				title: 'LocalBusiness-dataene er komplette',
				how: 'Mest specifikke type (fx HousePainter, ellers LocalBusiness), name, url, telephone (+45), address som PostalAddress, areaServed (byer som City, regioner som AdministrativeArea), openingHoursSpecification og sameAs med linket til Google Business-profilen. geo kun med sikre koordinater. Navn, adresse og telefon præcis som på profilen.',
				check:
					'Ingen fejl i Googles test af strukturerede data (Rich Results Test eller validator.schema.org) på forsiden og en underside.',
				optional: true,
			},
		],
	},
	{
		title: 'SEO før launch',
		items: [
			{
				id: 'seo-noindex',
				title: 'Ingen noindex tilbage',
				how: 'Fjern coming-soon og noindex på sider, der skal findes.',
				check: 'URL-inspektion af forsiden siger, at den kan indekseres.',
			},
			{
				id: 'seo-sider',
				title: 'Sider og søgeord på dashboardet',
				how: 'Udfyld pages i data.ts med sider og målsøgeord.',
				check: 'Mindst én side med søgeord.',
				auto: 'pages',
			},
			{
				id: 'seo-tjek',
				title: 'SEO-tjek kørt mod live',
				how: 'Udfyld productionUrl og report i seo-check.config.mjs, og kør npm run seo:check:report.',
				check: 'Seneste kørsel har 0 fejl.',
				auto: 'seoCheck',
			},
			{
				id: 'seo-redirects',
				title: 'Redirects fra gamle URL’er',
				how: 'Studio → Redirects: kundens gamle adresser peger på de nye sider.',
				check: 'Gamle adresser fra Search Console eller Google giver ikke 404.',
			},
			{
				id: 'seo-deling',
				title: 'Delebillede, favicon og 404',
				how: 'OG-billede, favicon og brandet 404-side virker.',
				check: 'Del forsiden i en chat og se billede og titel.',
			},
		],
	},
	{
		title: 'SEO-dashboardet',
		items: [
			{
				id: 'dashboard-timer',
				title: 'Aftale og timer',
				how: 'Sæt retainerHours i data.ts og første indslag i aktivitetsloggen. Ingen data fra andre kunder.',
				check: 'Timebjælken viser kundens aftale.',
				auto: 'retainer',
			},
			{
				id: 'dashboard-kunde',
				title: 'Kunden har fået adgang',
				how: 'Send kunden adressen /dashboard/seo, brugernavn og kode.',
				check: 'Kunden har logget ind og set fanerne.',
			},
		],
	},
]

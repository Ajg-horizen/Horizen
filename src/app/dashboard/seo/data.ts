/**
 * SEO-overblik, data (internt) — TEMPLATE-DEFAULT.
 *
 * Statisk øjebliksbillede af SEO-arbejdet for et site. Værdierne er typede
 * konstanter, så siden er selvstændig og ikke afhænger af eksterne filer ved
 * runtime. Opdatér denne fil manuelt når SEO-status ændrer sig.
 *
 * Dette er KUNDE-TOMT udgangspunkt: typerne er fulde, men indholdet er nulstillet
 * til neutrale placeholders + en generisk launch-/SEO-tjekliste, der fungerer som
 * "husk-det-hele ved launch"-default for et nyt site. Udfyld pr. kunde:
 *   - pages, recentActivity, pastAdhocActivity, siteMetrics, monthlyUsage/Extra
 *   - technicalItems (kryds af / tilføj efterhånden som fundamentet kommer på plads)
 *   - buildPages (hvilke sider der skal bygges)
 *   - keywordNotes, analyticsNote, retainerHours, lastUpdated, siteLaunchDate
 */

export type SeoStatus = 'done' | 'partial' | 'missing'
export type SeoPriority = 'high' | 'medium' | 'low'

export type TechnicalItem = {
	category: string
	title: string
	status: SeoStatus
	priority: SeoPriority
	finding: string
	action: string
	/**
	 * Mangler, der først er relevante senere (fx blog-sitemap før bloggen findes,
	 * sprogversioner før sprogmodulet). Tælles som "Senere" i stedet for "Mangler",
	 * så et rødt tal ikke ligner et problem.
	 */
	later?: boolean
	/** ISO-dato ('ÅÅÅÅ-MM-DD') for hvornår punktet kom på listen. Åbne punkter over 3 mdr. får et alders-mærke. */
	addedAt?: string
}

export type PageDetail = {
	name: string
	slug: string
	status: SeoStatus
	keywords: {
		primary: string
		secondary: string[]
	}
	/**
	 * Sat (ISO-dato 'ÅÅÅÅ-MM-DD') når sidens søgeord er tjekket med rigtige data
	 * (fx Ubersuggest). Undefined = stadig en hypotese. Styrer mærket ved "Søgeord".
	 */
	keywordsVerified?: string
	nextStep: string
	completedTasks: string[]
	pendingTasks: string[]
	/**
	 * Målgruppe, fx 'Privat' eller 'Erhverv'. Valgfri. Filterknapperne på "Sider &
	 * søgeord" dannes ud fra de værdier, der findes; sider uden målgruppe vises som
	 * 'Øvrige'. Har ingen sider en målgruppe, skjules filteret og kolonnen.
	 */
	segment?: string
	/** Ny side, der endnu ikke er fuldt gennemgået. Giver et "Ny side"-mærke. */
	isNew?: boolean
	/**
	 * 'noindex' = bevidst holdt ude af Google (fx en landingsside til annoncer, der
	 * ellers ville konkurrere med en anden side om samme søgeord). Giver et
	 * "Ikke indekseret"-mærke, og SEO-tjekket forventer noindex på siden.
	 */
	indexing?: 'index' | 'noindex'
}

/**
 * Søgevolumen og sværhedsgrad pr. søgeord til tabellen på "Sider & søgeord".
 * Nøglen er søgeordet præcis som i pages[].keywords (parentes-suffikser som
 * "(lavt volumen)" renses fra ved opslag). SD = SEO-sværhedsgrad 0-100, lavere er
 * lettere. Tom = kolonnerne Vol./md og SD skjules.
 */
export type KeywordMetric = { volume: number; sd: number; cpc?: number }

export const keywordMetrics: Record<string, KeywordMetric> = {}

type RoadmapPhase = {
	title: string
	subtitle: string
	items: string[]
}

export type ActionItem = {
	title: string
	description: string
	priority: SeoPriority
	/** ISO-dato for hvornår opgaven kom på listen. */
	addedAt?: string
	/** Løst. Løste opgaver foldes væk bag en knap på Plan-fanen. */
	done?: boolean
}

/**
 * "Fokus nu" øverst i Arbejdsrum: de få ting, der skal gøres snarest, med hvem
 * og hvornår. Hold listen kort (3-5 punkter). Sæt `done: true`, når et punkt er
 * klaret; så forsvinder det, og står der ingen åbne punkter, skjules sektionen.
 */
export type FocusItem = {
	title: string
	/** Én sætning: hvorfor det er vigtigt nu, eller hvad det giver. */
	why: string
	/** Hvornår i klar tekst, fx "Snarest", "Ca. 30/10", "Når siden er live". */
	when: string
	/** true = haster (fremhæves og står først). */
	urgent?: boolean
	/** Hvem gør det, fx "Horizen" eller kundens navn. */
	who: string
	addedAt: string
	done?: boolean
}

export const focusItems: FocusItem[] = []

export type BuildPriority = 1 | 2 | 3 | 4
export type ImpactLevel = 'high' | 'medium' | 'low'

export type BuildPage = {
	name: string
	priority: BuildPriority
	/** SEO-potentiale: hvor meget trafik/synlighed siden kan give. */
	impact: ImpactLevel
	/** Hvor svært det er at rangere: low = let, high = hård konkurrence. */
	competition: ImpactLevel
	note: string
}

export type ActivityEntry = {
	date: string
	title: string
	description: string
	/** Valgfri opgavetid (timer) — vises som markør på ad hoc-poster. */
	hours?: number
	/**
	 * Mærket på posten: "SEO" (direkte SEO-indsats) eller "Udvikling" (alt andet
	 * arbejde på sitet). Udelades = listen bestemmer: recentActivity er SEO,
	 * pastAdhocActivity og løste opgaver er udvikling. Sæt det kun for at
	 * overstyre, fx en ad hoc-opgave, der reelt var SEO.
	 */
	kind?: ActivityKind
	/** _id på den løste opgave i Studio, som posten beskriver (så den ikke står to gange). */
	taskId?: string
}

export type ActivityKind = 'seo' | 'udvikling'

/* ─── Ad hoc-opgaver (SEO-inbox) ──────────────────────────────
 *
 * Kunden opretter opgaver via formularen på "Ad hoc"-fanen → gemmes som
 * `seoInboxItem` i Sanity (status "sendt") + notifikations-mail til bureauet.
 * Bureauet triagerer status i Studio. Løste opgaver flyder over i Aktivitet.
 * Typerne matcher schemaet i src/sanity/schemaTypes/documents/seoInboxItem.ts.
 */

export type InboxStatus = 'sendt' | 'godkendt' | 'igang' | 'loest' | 'blokeret'
export type InboxPriority = 'hoej' | 'middel' | 'lav'
export type InboxHandling = 'timer5' | 'timer10' | 'estimat'

export type InboxItem = {
	_id: string
	subject: string
	message: string
	priority: InboxPriority
	handling?: InboxHandling
	status: InboxStatus
	estimateHours?: number
	fromName?: string
	fromEmail?: string
	receivedAt?: string
}

/** Fast placeholder-dato. Bump denne (og opdatér indholdet) ved hver SEO-ændring;
 *  værdien driver også "nyt siden sidst"-prikken på Studio-værktøjet. */
export const lastUpdated = '2026-11-05'

/* ─── Timetæller (retainer) ───────────────────────────────────
 *
 * Månedligt timeforbrug vises mod en fast retainer-ramme. Opdatér manuelt:
 * `monthlyUsage` = brugte retainer-timer pr. måned, `monthlyExtra` = ekstra/
 * goodwill-timer ud over rammen (vises som "uden beregning"). Nøgle: 'ÅÅÅÅ-MM'.
 */
export const retainerHours = 0 // Horizens eget site: ingen timeaftale
export const monthlyUsage: Record<string, number> = {}
export const monthlyExtra: Record<string, number> = {}

/**
 * Hvor mange af månedens timer (monthlyUsage) der gik til udvikling af sitet
 * (nye funktioner, Studio, rettelser). Resten tæller som SEO. Vises som kortet
 * "Hvad timerne er gået til" øverst i Aktivitet → Samlet oversigt. Nøgle:
 * 'ÅÅÅÅ-MM'. Tom = kortet skjules; en måned med ren SEO skrives som 0.
 */
export const monthlyDevelopment: Record<string, number> = {}

/* ─── Sidens helbred (Performance) ───────────────────────────────
 *
 * Forsiden måles automatisk den 3. i hver måned. Kunden kan også selv trykke
 * "Mål nu" (giver en følelse af kontrol og en grund til at komme tilbage);
 * der står, hvornår der sidst blev målt og af hvem. Sæt til false, hvis kun
 * Horizen skal have knappen. Udviklingen regnes stadig måned for måned.
 */
export const healthCheckCustomerCanRun = true

/**
 * "Anmod om optimering" under Sidens helbred: timeskønnet, kunden ser
 * ("ca. 1 times arbejde"). Anmodningen bliver en opgave under Opgaver.
 * 0 = knappen vises ikke.
 */
export const healthOptimizeHours = 1

/**
 * GENERISK launch-/SEO-tjekliste — templatens default. Dækker et nyt site fra
 * teknisk fundament (før launch) over indeksering (ved launch) til løbende
 * optimering (efter launch). Statusserne er sat konservativt for et frisk site:
 * "partial" = templaten scaffolder det, men det skal verificeres/tilpasses pr.
 * kunde; "missing" = skal sættes op pr. kunde. Kryds af til "done" når det er
 * verificeret på det konkrete site.
 */
export const technicalItems: TechnicalItem[] = [
	{
		category: 'Sitemap',
		title: 'Dynamisk sitemap (sitemap.xml)',
		status: 'partial',
		priority: 'high',
		finding:
			'Sitet har et dynamisk src/app/sitemap.ts, der dækker sider og blogindlæg fra Sanity.',
		action:
			'Verificér at alle vigtige sider er med, og indsend sitemap.xml i Search Console (se Plan → Action items).',
	},
	{
		category: 'Robots',
		title: 'robots.txt',
		status: 'partial',
		priority: 'high',
		finding:
			'src/app/robots.ts er på plads: allow /, disallow /dashboard + /admin + /api, og peger på sitemap.',
		action:
			'Sæt NEXT_PUBLIC_BASE_URL, så sitemap- og host-URL i robots peger på det rigtige domæne.',
	},
	{
		category: 'Metadata',
		title: 'metadataBase + canonical',
		status: 'missing',
		priority: 'high',
		finding:
			'Uden metadataBase kan Open Graph-/canonical-URL’er med relative stier ikke resolve korrekt.',
		action:
			'Sæt metadataBase: new URL(BASE_URL) i root-metadata, og sørg for en self-canonical pr. side.',
	},
	{
		category: 'Metadata',
		title: 'Per-side title + meta description',
		status: 'missing',
		priority: 'high',
		finding:
			'Nye sider mangler ofte unikke, søgeordsbærende titler og beskrivelser.',
		action:
			'Skriv unikke title + meta description pr. side (Metadata-feltet i Studio). Overvej en title.template.',
	},
	{
		category: 'Metadata',
		title: 'OG-delebillede',
		status: 'missing',
		priority: 'medium',
		finding:
			'Uden et Open Graph-billede ser links tomme/kedelige ud når de deles på sociale medier.',
		action:
			'Kobl et OG-billede på delings-metadata (fx en /api/og-route eller et statisk billede). Kræver metadataBase.',
	},
	{
		category: 'Strukturerede data (JSON-LD)',
		title: 'Organization / relevant JSON-LD',
		status: 'missing',
		priority: 'medium',
		finding:
			'Ingen strukturerede data endnu. Organization/WebSite-schema hjælper Google med at forstå brandet.',
		action:
			'Tilføj Organization + WebSite JSON-LD på forsiden, og udbyg med sidetype-relevant schema (Article, Product, Event m.fl.).',
	},
	{
		category: 'Billeder',
		title: 'Alt-tekster',
		status: 'missing',
		priority: 'medium',
		finding:
			'Informative billeder uden beskrivende alt-tekst svækker både tilgængelighed og billed-SEO.',
		action:
			'Gennemgå billederne: dekorative kan beholde alt="", informative får beskrivende alt-tekst.',
	},
	{
		category: 'Overskrifter',
		title: 'Unik H1 + semantisk hierarki',
		status: 'partial',
		priority: 'medium',
		finding:
			'Én tydelig H1 pr. side og et logisk h2/h3-hierarki er afgørende for både SEO og tilgængelighed.',
		action:
			'Verificér pr. side at der er præcis én H1, og at underoverskrifter følger et logisk niveau.',
	},
	{
		category: 'Fejlsider',
		title: '404-side',
		status: 'partial',
		priority: 'low',
		finding:
			'Sitet har en not-found.tsx. En god 404 fastholder besøgende der rammer en død URL.',
		action:
			'Tilpas 404-sidens indhold og links (fx til forside og de vigtigste sektioner).',
	},
	{
		category: 'Rendering',
		title: 'SSG/ISR-prerendering',
		status: 'partial',
		priority: 'high',
		finding:
			'Statisk prerendering (SSG) med ISR giver hurtige, indekserbare sider. Dynamiske ruter kræver generateStaticParams.',
		action:
			'Verificér at [slug]-ruter har generateStaticParams, og at revalidate/ISR er sat. Undgå unødig force-dynamic på offentlige sider.',
	},
	{
		category: 'Måling',
		title: 'Google Search Console',
		status: 'missing',
		priority: 'high',
		finding:
			'Uden Search Console er der intet nulpunkt, og man kan ikke se hvad der virker.',
		action:
			'Opret en Domæne-property (DNS TXT-verificering) og indsend sitemap.xml. Fundamentet for al måling.',
	},
	{
		category: 'Måling',
		title: 'Google Analytics 4 + cookie-samtykke',
		status: 'missing',
		priority: 'medium',
		finding:
			'GA4 viser adfærd PÅ sitet (klik, henvendelser). Kræver en samtykkeløsning for at være lovlig i EU.',
		action:
			'Opsæt GA4 og et cookie-samtykke (Consent Mode v2), så måling først sker efter samtykke.',
	},
	{
		category: 'Performance',
		title: 'Core Web Vitals',
		status: 'partial',
		priority: 'low',
		finding:
			'LCP, INP og CLS påvirker både brugeroplevelse og ranking. next/image og next/font giver et godt udgangspunkt.',
		action:
			'Kør en Lighthouse/CWV-måling efter de første rigtige besøg og ret de største flaskehalse.',
	},
	{
		category: 'Indhold',
		title: 'Intern linking',
		status: 'missing',
		priority: 'medium',
		finding:
			'Intern linking spreder autoritet mellem sider og hjælper Google med at finde og forstå indholdet.',
		action:
			'Byg naturlige interne links mellem relaterede sider (fx fra blog til service-/produktsider).',
	},
]

export const keywordNotes =
	'Tilføj sidernes søgeord her. Behandl dem som hypoteser indtil de er bekræftet i Google Search Console (når sitet har trafik) og et søgeordsværktøj. Behandl indtil da listen som et udgangspunkt, ikke en facitliste.'

export const pages: PageDetail[] = [
	{
		"name": "Forsiden",
		"slug": "/",
		"status": "done",
		"keywords": {
			"primary": "digital design bureau",
			"secondary": [
				"digitalt design bureau",
				"digitalt bureau ux"
			]
		},
		"nextStep": "Domæne skiftet til horizen.dk + canonical live (22. juli). Afventer at Google flytter indeksering til non-www + næste måling (20. aug). Primary keyword ligger pos 9,14 — skub mod top 5.",
		"completedTasks": [
			"Title-tag opdateret med primary keyword",
			"Meta description med 8+ års erfaring + service-paletten",
			"Semantisk h1 (eyebrow) med 'digital design bureau'",
			"Visuelt brand bevaret (SOLUTIONS CRAFTED som <p>)",
			"Schema.org udvidet til ProfessionalService + PostalAddress (Aarhus)",
			"hasOfferCatalog med alle 5 service-sider",
			"Alt-tekster på hero staff-billeder + cases",
			"Aria-labels på service-links",
			"ServicesSection subtitle med primary keyword",
			"Footer-beskrivelse opdateret",
			"Layout default metadata opdateret",
			"PageSpeed / Core Web Vitals audit kørt (desktop 🟡, mobile 🔴)",
			"Google Tag Manager + GA4 lazy-loaded (245 kb flyttet væk fra critical path)",
			"Trustpilot review-schema: AggregateRating + 7 Review-objekter på ProfessionalService"
		],
		"pendingTasks": [
			"Re-kør PageSpeed audit efter de 2 fix er deployed",
			"Yderligere internal linking fra service-sider tilbage til forsiden"
		]
	},
	{
		"name": "Webudvikling",
		"slug": "/services/webudvikling",
		"status": "done",
		"keywords": {
			"primary": "ny hjemmeside",
			"secondary": [
				"professionel hjemmeside",
				"webudvikling"
			]
		},
		"nextStep": "Sidens snit er 6,57, men det er på lav-volumen queries — på target-keywordet 'ny hjemmeside' (590 vol) ranker vi ikke i top endnu (derfor Aktuel = —). Mål <30 = realistisk første milepæl på et svært keyword; strammes når vi er inde på side 1-3. Re-indeksering anmodet (22. juli).",
		"completedTasks": [
			"Search Console-research kørt",
			"Ubersuggest keyword-research (15+ kandidater testet)",
			"SERP-analyse på top 3 kandidater",
			"Anti-kannibaliserings-tjek mod forsiden — ingen overlap",
			"Strategi-dokument skrevet",
			"Title-tag opdateret med primary keyword",
			"Meta description opdateret med Next.js + React + teknisk fundament",
			"Schema.org Service auto-opdateret via metadata",
			"Hero-body: 'enhver hjemmeside' → 'enhver ny hjemmeside'",
			"H1 og visuel copy bevaret 1:1",
			"Deployed til main",
			"Anmodet om re-indeksering i Search Console"
		],
		"pendingTasks": []
	},
	{
		"name": "UI/UX Design",
		"slug": "/services/ui-ux-design",
		"status": "missing",
		"keywords": {
			"primary": "",
			"secondary": []
		},
		"nextStep": "Ligger pos 7,12 (34 visn/3 mdr) — arver redirect-trafik fra /digital-design/. SEO-cyklus skal køres snarest for at fange volumen-keywords.",
		"completedTasks": [],
		"pendingTasks": [
			"Search Console-research: hvad rangerer siden allerede på?",
			"Ubersuggest-research: find primary + secondaries",
			"Anti-kannibaliserings-tjek (forsiden targeter 'digital design bureau' og 'digitalt bureau ux' — vi må ikke kannibalisere)",
			"Skriv strategi-dokument",
			"Optimér copy",
			"Deploy + test"
		]
	},
	{
		"name": "Branding",
		"slug": "/services/branding",
		"status": "missing",
		"keywords": {
			"primary": "",
			"secondary": []
		},
		"nextStep": "Pos 1,54 men kun 35 visn/3 mdr — det er brand-søgninger ('horizen branding'), ikke volumen-keywords. SEO-cyklus klar til at starte.",
		"completedTasks": [
			"Slug omdøbt fra 'branding-logo' til 'branding'"
		],
		"pendingTasks": [
			"Search Console-research",
			"Ubersuggest-research",
			"Anti-kannibaliserings-tjek",
			"Skriv strategi",
			"Optimér copy",
			"Deploy + test"
		]
	},
	{
		"name": "Grafisk Design",
		"slug": "/services/grafisk-design",
		"status": "missing",
		"keywords": {
			"primary": "",
			"secondary": []
		},
		"nextStep": "Pos 3,1 men kun 29 visn/3 mdr (niche/brand). Skal bygges fra bunden.",
		"completedTasks": [],
		"pendingTasks": [
			"Search Console-research (begrænset data, ny side)",
			"Ubersuggest-research",
			"Skriv strategi",
			"Optimér copy",
			"Deploy + test"
		]
	},
	{
		"name": "WordPress",
		"slug": "/services/wordpress",
		"status": "missing",
		"keywords": {
			"primary": "",
			"secondary": []
		},
		"nextStep": "Pos 17,67 (6 visn/3 mdr). Skal bygges fra bunden.",
		"completedTasks": [],
		"pendingTasks": [
			"Search Console-research (begrænset data, ny side)",
			"Ubersuggest-research",
			"Skriv strategi",
			"Optimér copy",
			"Deploy + test"
		]
	},
	{
		"name": "Blog (oversigt)",
		"slug": "/blog",
		"status": "missing",
		"keywords": {
			"primary": "",
			"secondary": []
		},
		"nextStep": "Pos 1,37 (35 visn/3 mdr, mest brand). Blog-oversigt, lavere prioritet end service-sider.",
		"completedTasks": [],
		"pendingTasks": [
			"Vurder om der er volume nok til at SEO'e blog-oversigten",
			"Eventuelt optimér meta + h1"
		]
	},
	{
		"name": "Kontakt",
		"slug": "/kontakt",
		"status": "done",
		"keywords": {
			"primary": "",
			"secondary": []
		},
		"nextStep": "Pos 1,86 (88 visn/3 mdr) — stærk på brand-søgninger som forventet. Lav prioritet.",
		"completedTasks": [],
		"pendingTasks": []
	}
]

/**
 * Roadmap: tre faser — teknisk fundament nu, indhold, og løbende vækst.
 */
export const roadmap: RoadmapPhase[] = [
	{
		title: 'Fundament (nu)',
		subtitle: 'Tekniske fixes der får SEO-grundlaget på plads',
		items: [
			'Sæt metadataBase + self-canonical i root layout.',
			'Tilføj Open Graph/Twitter-metadata og et delebillede.',
			'Tilføj Organization/WebSite JSON-LD på forsiden.',
			'Verificér robots.txt + sitemap.xml mod det rigtige domæne.',
			'Gennemgå alt-tekster på informative billeder.',
		],
	},
	{
		title: 'Indhold',
		subtitle: 'On-page søgeoptimering pr. side',
		items: [
			'Skriv unikke titler, beskrivelser og indhold pr. side.',
			'Bekræft søgeord pr. side med rigtige data, når der er trafik.',
			'Byg intern linking mellem relaterede sider.',
			'Tilføj sidetype-relevant JSON-LD (Article, Product, Event m.fl.).',
		],
	},
	{
		title: 'Vækst',
		subtitle: 'Løbende arbejde der bygger synlighed over tid',
		items: [
			'Blog/journal med long-tail-emner der støtter de vigtige sider.',
			'Nye landingssider til de stærkeste søgeintentioner.',
			'Linkbuilding, omtaler og evt. Google Business Profile.',
			'Månedlig måling og rapportering på placeringer og trafik.',
		],
	},
]

/* ─── Kom i gang: skridtvis launch-plan ──────────────────────
 *
 * Best practice når et nyt site lanceres, i rækkefølge (før → ved → efter launch).
 */

export type LaunchStep = {
	title: string
	detail: string
	done?: boolean
}

export type LaunchPhase = {
	title: string
	when: string
	intro: string
	steps: LaunchStep[]
}

export const launchIntro =
	'Sådan får vi et nyt site godt fra start i Google — i rækkefølge. Tag én fase ad gangen oppefra og ned. De første to faser er det vigtigste: et færdigt teknisk fundament, og at Google overhovedet ved sitet findes. Det egentlige optimerings-arbejde giver først mening når der er data.'

export const launchPlan: LaunchPhase[] = [
	{
		title: 'Fase 1 — Teknisk fundament',
		when: 'Før launch, i koden',
		intro:
			'Google skal møde et færdigt hus, ikke et med stilladser. Disse fixes bør være på plads INDEN vi beder Google indeksere, så siderne ikke skal crawles om igen.',
		steps: [
			{
				title: 'robots.txt + sitemap.xml',
				detail:
					'Verificér at robots peger på sitemap og holder /admin + /dashboard ude, og at sitemap dækker alle vigtige sider.',
			},
			{
				title: 'metadataBase + Open Graph/Twitter',
				detail:
					'Så links ser rigtige ud når de deles, og canonical/OG-billeder kan resolve.',
			},
			{
				title: 'Organization/relevant JSON-LD',
				detail:
					'Fortæller Google hvad brandet/siden er. Udbyg med sidetype-relevant schema.',
			},
			{
				title: 'Titler, beskrivelser + alt-tekster',
				detail:
					'Unikke titler og meta-beskrivelser pr. side, og beskrivende alt-tekster på informative billeder.',
			},
			{
				title: 'SSG/ISR verificeret',
				detail:
					'Sider prerenderes statisk (generateStaticParams på [slug]-ruter, revalidate/ISR sat).',
			},
		],
	},
	{
		title: 'Fase 2 — Search Console & måling',
		when: 'Ved/efter launch',
		intro:
			'Fundamentet for AL måling. Uden det er der intet nulpunkt. Det er kundens opgaver — de tager tilsammen under en time. Se huskerådene under planen.',
		steps: [
			{
				title: 'Bekræft det endelige domæne er live',
				detail:
					'Sitet skal køre på det endelige domæne (ikke en *.vercel.app-adresse) FØR du indsender sitemap.',
			},
			{
				title: 'Opret Search Console + verificér (Domæne-property)',
				detail:
					'Vælg "Domæne" (ikke "URL-præfiks") og verificér med en DNS TXT-record. Dækker www, non-www, http og https i ét.',
			},
			{
				title: 'Indsend sitemap.xml',
				detail:
					'Search Console → Sitemaps → skriv "sitemap.xml" → Indsend. Sitemap er allerede dynamisk og klar.',
			},
			{
				title: 'Opsæt GA4 + cookie-samtykke',
				detail:
					'Hvis I vil måle adfærd PÅ sitet. Kræver en samtykkeløsning (Consent Mode) for at være lovlig i EU.',
			},
			{
				title: 'Anmod om indeksering af nøgle-URL’er',
				detail:
					'URL-inspektion på de vigtigste sider → "Anmod om indeksering". Fremskynder at Google ser dem.',
			},
		],
	},
	{
		title: 'Fase 3 — Efter lancering',
		when: 'Når der er data (~30 dage)',
		intro:
			'Nu kan vi skabe resultater på rigtige tal i stedet for gæt. Det er her den løbende SEO (typisk tilkøb) for alvor begynder.',
		steps: [
			{
				title: 'Læs Search Console',
				detail:
					'Hvilke søgninger vises sitet allerede på? Hvor ligger I? Det styrer prioriteringen.',
			},
			{
				title: 'Verificér søgeord mod rigtige tal',
				detail:
					'Erstat hypoteserne i "Sider & søgeord" med bekræftede søgeord ud fra data.',
			},
			{
				title: 'On-page-optimering pr. side',
				detail:
					'Skærp title, beskrivelse og indhold pr. side, prioriteret efter hurtigst gevinst.',
			},
			{
				title: 'Byg de første sider fra "Sider der skal bygges"',
				detail: 'Start med spor 1. Se Plan-fanen.',
			},
		],
	},
]

export const searchConsoleTips: string[] = [
	'Vælg "Domæne"-property (DNS-verificering) frem for "URL-præfiks" — så dækker den www, non-www, http og https i ét, og du undgår blinde vinkler.',
	'Sørg for at det endelige domæne (ikke en *.vercel.app-adresse) er sat i produktion FØR du indsender sitemap.',
	'Indsend sitemap som "sitemap.xml" — ikke hele URL-listen manuelt. Det dynamiske sitemap holder sig selv opdateret.',
	'Forvent ikke data med det samme. Der går typisk dage til et par uger før Google har crawlet og viser tal.',
	'Brug URL-inspektion → "Anmod om indeksering" på de vigtigste sider for at skubbe på.',
]

/**
 * Action items: ting kunden selv skal gøre uden for koden.
 */
/* ─── Mål og resultater pr. måned (Performance) ─────────────────
 *
 * Hver måned: de mål, vi arbejdede hen imod, og hvad målingen viste. Supplerer
 * aktivitetsloggen (hvad vi lavede) med effekten (hvad det flyttede). Tallene
 * skrives ind manuelt ved månedens måling i Search Console. Kunden kan se fanen,
 * så en måned skrives først ind, når målene er aftalt med kunden. Fanen vises
 * for kunden, så snart der står mindst én måned her.
 */

export type GoalStatus = 'naaet' | 'paa-vej' | 'ikke-naaet' | 'maales'

export type MonthlyGoal = {
	title: string
	/** Hvad der måles, fx "Snitplads på miljøscreening-søgninger". */
	metric: string
	page?: string
	before: string
	goal: string
	/** Udfyldes ved målingen. */
	result?: string
	status: GoalStatus
	/** ++dobbelte plusser++ markerer et godt tal (vises grønt). */
	note?: string
}

export type GoalMonth = {
	/** 'ÅÅÅÅ-MM' */
	month: string
	measuredAt?: string
	/**
	 * Andre målte fremskridt, der ikke var sat som mål på forhånd. Vises for sig, så
	 * "mål nået" kun tæller de aftalte mål.
	 */
	progress?: { title: string; before: string; now: string; badge?: string; detail?: string }[]
	/** Sitets samlede tal for måneden mod perioden før (Search Console, 28 dage). */
	keyNumbers?: { label: string; before: string; now: string }[]
	goals: MonthlyGoal[]
}

export const goalMonths: GoalMonth[] = []

export const actionItems: ActionItem[] = [
	{
		"title": "Afindeksér 5 gamle spøgelses-subdomæner",
		"description": "webinsight., estimator., hjemmeside., seo. og mysite.horizen.dk hænger stadig i Googles indeks fra det gamle WordPress-site. FUND 22. juli: der er INGEN DNS-records at slette — en wildcard (* ALIAS → Vercel, låst/auto) fanger alle subdomæner og 404'er dem (bekræftet: selv tilfældige subdomæner 404'er). 216.150.x.x = Vercel, ikke gammel host. Rør IKKE wildcarden. HANDLING: kun Search Console → Removals → indsend de 5 subdomæner (præfiks-fjern) for hurtig af-indeksering; 404 rydder resten over tid.",
		"priority": "high",
		"addedAt": "2026-08-12"
	},
	{
		"title": "Gamle WordPress-URL'er — verificeret, minimal handling",
		"description": "FUND 22. juli: de gamle service-URL'er redirecter korrekt (/digital-design→ui-ux-design, /branding, /hjemmeside→webudvikling, /paid-ads→forsiden). Junk-URL'erne /wereme/, /hyundai/, /arena-randers/, /cookie-policy/ 404'er allerede — Google af-indekserer dem selv, ingen handling nødvendig. Kun /digital-design/ (399 visn) bar reel trafik, og den er redirectet.",
		"priority": "low",
		"addedAt": "2026-08-12"
	},
	{
		"title": "Bekræft www-dublet forsvinder efter kanonisering",
		"description": "www.horizen.dk/ havde 1.586 visninger på pos 26 uden klik (dublet af forsiden). Efter dagens 308-redirect + canonical skal den gradvist forsvinde fra Pages-rapporten. Tjek ved næste måling (20. aug).",
		"priority": "medium",
		"addedAt": "2026-08-12"
	},
	{
		"title": "Byg blog/guides-spor (long-tail → autoritet)",
		"description": "PÅ SIGT, ingen fast plan endnu. Ram long-tail-søgeord med dedikerede guides ('Hvad koster en ny hjemmeside i Aarhus?', 'WordPress eller custom?') der linker ind til service-siderne. Hver guide bygger autoritet til pengesiden uden at røre dens design (hub-and-spoke). Rolig rytme, 1-2 guides/md. Hvorfor: en lille virksomhed vinder på long-tail først og klatrer op ad SD-trappen. Se fanen 'Teknikker & tips'.",
		"priority": "low",
		"addedAt": "2026-08-12"
	},
	{
		"title": "Opret Google Business Profile",
		"description": "Kritisk for lokal pack-visning på Aarhus-søgninger.",
		"priority": "medium",
		"addedAt": "2026-08-12"
	},
	{
		"title": "Outreach til nicolaisoerensen.dk",
		"description": "Komme på 12-bedste-webbureauer-listen. Ranker pos 2 for relaterede keywords.",
		"priority": "medium",
		"addedAt": "2026-08-12"
	},
	{
		"title": "Liste Horizen på webbureauer.dk",
		"description": "Directory der ranker pos 1 for 'webbureau' i Danmark.",
		"priority": "low",
		"addedAt": "2026-08-12"
	},
	{
		"title": "Skift <img> til next/image (avatar + logo-marquee)",
		"description": "Perf/Core Web Vitals: et par billeder (team-avatars, partner-logoer) bruger stadig <img> i stedet for next/image, så de ikke auto-optimeres (webp, sizing, lazy). Ikke kritisk, det er små billeder og næppe LCP-elementet, men en let hastigheds-gevinst der hjælper CWV. Kirurgisk skift der kræver width/height plus test af layout. Fundet under kode-oprydningen 12. aug.",
		"priority": "low",
		"addedAt": "2026-08-12"
	}
]

/* ─── Efter lancering: betalt tilkøb ─────────────────────────── */

export type AddonDiscipline = 'indhold' | 'sider' | 'drift'
export type AddonScope = 'engang' | 'pr-styk' | 'lobende'

export type AddonService = {
	category: string
	title: string
	description: string
	scope: AddonScope
	discipline: AddonDiscipline
}

export const addonIntro =
	'De tekniske fundament-fixes hører til leverancen af sitet. Selve den løbende søgemaskineoptimering — at skrive blogindlæg, bygge nye sider og optimere indhold måned efter måned — er ydelser der kan tilkøbes efter launch. Nedenfor er hvad et tilkøb kan indeholde.'

export const addonServices: AddonService[] = [
	{
		category: 'Indhold',
		title: 'Blog / journal',
		description:
			'Artikler der fanger long-tail-søgninger og bygger autoritet. Hver artikel støtter en konkret sides synlighed via intern linking.',
		scope: 'pr-styk',
		discipline: 'indhold',
	},
	{
		category: 'Indhold',
		title: 'On-page søgeoptimering pr. side',
		description:
			'Skærpede titler, meta-beskrivelser og indhold pr. side ud fra rigtige søgedata, plus sidetype-relevant JSON-LD.',
		scope: 'pr-styk',
		discipline: 'indhold',
	},
	{
		category: 'Nye sider',
		title: 'Landingssider',
		description:
			'Egne sider til de stærkeste søgeintentioner, der både uddyber fortællingen og fanger søgninger.',
		scope: 'engang',
		discipline: 'sider',
	},
	{
		category: 'Løbende',
		title: 'Linkbuilding & omtale',
		description:
			'Branche-relevante links og omtaler der opbygger domænets troværdighed over for Google. Tålmodigt arbejde der betaler sig over tid.',
		scope: 'lobende',
		discipline: 'drift',
	},
	{
		category: 'Løbende',
		title: 'Måling & månedsrapport',
		description:
			'Gennemgang af placeringer, klik og trafik i Search Console, quick wins og en månedlig rapport på udviklingen.',
		scope: 'lobende',
		discipline: 'drift',
	},
]

/**
 * Sider der skal bygges — prioriteret efter SEO-impact og konkurrence, grupperet
 * i fire spor. Tomt som default; udfyld buildPages pr. kunde.
 */
export const upcomingPagesNote =
	'Sider/indhold der kan bygges, prioriteret efter SEO-impact (mest værdi først) og konkurrence (hvor svært det er at rangere). Alle nye sider er typisk betalt tilkøb (se "Efter lancering"). Udfyld listen når noget besluttes.'

export const buildTiers: {
	priority: BuildPriority
	title: string
	subtitle: string
}[] = [
	{
		priority: 1,
		title: 'Spor 1 — Kerneindhold',
		subtitle: 'Byg først: høj værdi, lav konkurrence, tæt på kernefortællingen.',
	},
	{
		priority: 2,
		title: 'Spor 2 — Blog & long-tail',
		subtitle:
			'Indhold der fanger informationelle søgninger og støtter de øvrige sider.',
	},
	{
		priority: 3,
		title: 'Spor 3 — Kommercielt',
		subtitle: 'Sider der konverterer henvendelser: services, priser, kontakt.',
	},
	{
		priority: 4,
		title: 'Spor 4 — Bredere indhold',
		subtitle: 'Nice-to-have der runder oplevelsen af, lavere SEO-prioritet.',
	},
]

export const buildPages: BuildPage[] = [
	{
		"name": "AI automatisering",
		"priority": 1,
		"impact": "high",
		"competition": "low",
		"note": ""
	},
	{
		"name": "AI integration",
		"priority": 1,
		"impact": "high",
		"competition": "low",
		"note": ""
	},
	{
		"name": "AI assistenter",
		"priority": 1,
		"impact": "high",
		"competition": "medium",
		"note": ""
	},
	{
		"name": "AI Search (GEO)",
		"priority": 1,
		"impact": "high",
		"competition": "low",
		"note": ""
	},
	{
		"name": "Email marketing",
		"priority": 2,
		"impact": "medium",
		"competition": "medium",
		"note": ""
	},
	{
		"name": "Analytics tracking",
		"priority": 2,
		"impact": "medium",
		"competition": "low",
		"note": ""
	},
	{
		"name": "Kursus og workshops",
		"priority": 2,
		"impact": "medium",
		"competition": "medium",
		"note": ""
	},
	{
		"name": "Webshop",
		"priority": 2,
		"impact": "medium",
		"competition": "high",
		"note": ""
	},
	{
		"name": "Google Ads",
		"priority": 3,
		"impact": "low",
		"competition": "high",
		"note": ""
	},
	{
		"name": "SEO",
		"priority": 3,
		"impact": "low",
		"competition": "high",
		"note": ""
	},
	{
		"name": "Social media",
		"priority": 3,
		"impact": "low",
		"competition": "high",
		"note": ""
	},
	{
		"name": "Tips og tricks",
		"priority": 4,
		"impact": "low",
		"competition": "low",
		"note": ""
	},
	{
		"name": "Videos and tutorials",
		"priority": 4,
		"impact": "low",
		"competition": "low",
		"note": ""
	}
]

/**
 * SEO-aktivitet: kun arbejde, der direkte handler om at blive fundet i Google
 * (teknisk SEO, måling, søgeord, indhold). Får mærket "SEO". Nyeste øverst.
 * Udvikling af sitet (nye funktioner, Studio, rettelser) hører til i
 * pastAdhocActivity herunder.
 */
export const recentActivity: ActivityEntry[] = [
	{
		"date": "2026-08-12",
		"title": "Forside: notifikations-popup live (designprincipper + gratis hjemmeside)",
		"description": "Roterende popup nederst til højre (tablet og op, 1×/session): to notifikationer der veksler — Designprincipper → /ressourcer/designprincipper og 'Gratis hjemmeside?' → /godt-formaal. Baseline for at måle om den driver trafik til designprincipperne, øger returbesøg og spreder gratis-hjemmeside-tilbuddet. NB: alle 30 designprincipper gik også live dagen før (11/8), så et udslag kan skyldes begge."
	},
	{
		"date": "2026-07-22",
		"title": "Dashboard opdateret med friske GSC- + GA4-tal + bloat-analyse",
		"description": "Performance-kort skiftet til 3-mdr GSC-data (68 klik, 3.129 visn, pos 20,2) med forklaring på at faldet er impression bloat fra www-dublet + gammelt indhold, ikke reel forringelse. GA4 efter-relancering fyldt (517 brugere, Facebook-gruppe-trafik dominerer, København > Aarhus). Kommende-datoer ryddet op."
	},
	{
		"date": "2026-07-22",
		"title": "Gamle subdomæner + WordPress-URL'er kortlagt, Removals kørt",
		"description": "5 spøgelses-subdomæner (webinsight/estimator/hjemmeside/seo/mysite) + 4 døde WordPress-URL'er identificeret som kilde til bloat. Fund: subdomænerne 404'er via Vercel-wildcard (intet DNS at slette), gamle service-URL'er redirecter korrekt. GSC Removals indsendt på alle 9."
	},
	{
		"date": "2026-07-22",
		"title": "Domæne-kanonisering: horizen.dk (non-www) gjort primær",
		"description": "Vercel production domain skiftet fra www til horizen.dk. www.horizen.dk laver nu 308 permanent redirect ind til horizen.dk. Fjerner den modstridende situation hvor koden pegede på non-www mens sitet blev serveret på www."
	},
	{
		"date": "2026-07-22",
		"title": "Canonical-tags tilføjet på alle 14 sider",
		"description": "Self-referencing alternates.canonical (non-www) på forside, kontakt, godt-formaal, blog + artikler, cases, designprincipper og de dynamiske service- og principper-routes. Canonical var før helt fraværende. Live i prod."
	},
	{
		"date": "2026-07-22",
		"title": "Search Console: re-indeksering anmodet + sitemap bekræftet",
		"description": "Sitemap allerede indsendt (Success, 22 sider, sidst læst 20. juli). Re-indeksering anmodet for forside + webudvikling + ui-ux-design + branding + kontakt, så Google opdager domæne-skift + canonical hurtigere."
	},
	{
		"date": "2026-05-14",
		"title": "Forside: Trustpilot review-schema tilføjet (gratis rich snippets)",
		"description": "AggregateRating 5.0 fra 7 reviews + alle review-objekter i ProfessionalService schema. Genereres dynamisk fra testimonials.ts. Google kan nu vise stjerner i søgeresultater."
	},
	{
		"date": "2026-05-14",
		"title": "Footer: synlig 'Aarhus, Danmark' geo-signal",
		"description": "Lokal SEO-forstærkning. Adressen var allerede i Schema.org, nu også synlig i footer."
	},
	{
		"date": "2026-05-13",
		"title": "Forside: PageSpeed audit + lazy-load af Google-scripts",
		"description": "Mobile LCP 15,2s (rødt). Lazy-load deployed for 245 kb GTM/GA-JS. Venter på Vercel domain-fix (skift primary til horizen.dk) for at lukke loopet."
	},
	{
		"date": "2026-05-13",
		"title": "Webudvikling: SEO deployed",
		"description": "Title, meta, schema og hero-body opdateret. Targeter 'ny hjemmeside' (590 vol) + 'professionel hjemmeside' (480) + 'webudvikling' (210). H1 urørt."
	},
	{
		"date": "2026-05-13",
		"title": "Webudvikling: keyword-strategi besluttet",
		"description": "Primary 'ny hjemmeside' (590 vol) + 'professionel hjemmeside' (480) + 'webudvikling' (210). Total ~1.300 vol/md."
	},
	{
		"date": "2026-05-13",
		"title": "Forside SEO komplet færdig",
		"description": "Schema.org udvidet, alt-tekster, subtekster, aria-labels, footer-tekst"
	},
	{
		"date": "2026-05-13",
		"title": "Semantisk h1 + title/meta deployed",
		"description": "'Digital design bureau' som lille eyebrow + brand-tekst bevaret"
	},
	{
		"date": "2026-05-13",
		"title": "Reviderede forside-keywords efter 28-dages data",
		"description": "'digitalt bureau aarhus' droppet → 'digital design bureau' nu primary"
	},
	{
		"date": "2026-05-12",
		"title": "Redirects deployed",
		"description": "/digital-design/, /hjemmeside/, /branding/ + slug-ændring branding-logo → branding"
	},
	{
		"date": "2026-05-12",
		"title": "Baseline trukket fra Search Console",
		"description": "Maj 2026: 110 klik, 1.338 visninger (3-måneders data)"
	}
]

/**
 * Opsætningsgennemgang (fanen "Opsætning", punkterne står i setup.ts):
 * manuelt afkrydsede punkter, id → dato ('ÅÅÅÅ-MM-DD'). Udfyldes pr. projekt,
 * når punktet er tjekket. Punkter med automatisk tjek behøver ikke stå her.
 * Eksempel: { 'gsc-property': '2026-10-14' }
 */
export const setupChecked: Record<string, string> = {}

/**
 * Udvikling af sitet (ad hoc): nye funktioner, Studio og rettelser, der IKKE
 * kom ind via dashboardets formular. Får mærket "Udvikling" og står i "Ad hoc
 * aktivitetslog". Løste opgaver fra Sanity flettes automatisk ind; beskriver en
 * post her en løst opgave, sættes `taskId` til opgavens _id, så den ikke står
 * to gange. Tom som default.
 */
export const pastAdhocActivity: ActivityEntry[] = []

/* ─── Analytics (Search Console-performance) ──────────────────
 *
 * Analytics-fanen (Performance → SEO) viser tomme felter ("Afventer data")
 * indtil sitet har Search Console-data. Når cron-motoren er koblet på (se
 * src/app/api/cron/seo-snapshot), hentes tallene automatisk den 3. i hver
 * måned og gemmes som `seoSnapshot`-dokumenter i Sanity — så viser fanen
 * rigtige nøgletal, udvikling måned for måned og top-søgninger uden manuel
 * indtastning. siteMetrics bruges som fallback-labels indtil første snapshot.
 */

type SiteMetric = {
	key: string
	label: string
	hint: string
}

/** Ét søgeord fra Search Console med dets tal for måneden. */
export type SearchQuery = {
	query: string
	clicks: number
	impressions: number
	ctr: number
	position: number
}

/** Ét månedligt datapunkt fra Search Console — matcher seoSnapshot-schemaet. */
export type SeoSnapshot = {
	month: string // 'ÅÅÅÅ-MM'
	clicks?: number
	impressions?: number
	ctr?: number
	avgPosition?: number
	capturedAt?: string
	topQueries?: SearchQuery[]
}

/**
 * Dagen det nye site gik live ('ÅÅÅÅ-MM-DD'). Markeres som "Nyt site" i grafen
 * på SEO-fanen, så tallene før og efter lanceringen ikke sammenlignes ukritisk.
 * Udfyld pr. kunde; null = ingen markering.
 */
export const siteLaunchDate: string | null = '2026-05-08'

export const analyticsNote =
	'Tallene hentes automatisk den 3. i hver måned fra Google Search Console (første gang typisk ~30 dage efter launch, når der er data). Indtil da står felterne tomme med vilje, så der ikke vises opdigtede tal.'

/** Fallback-labels: vises som tomme "Afventer data"-kort før første snapshot. */
export const siteMetrics: SiteMetric[] = [
	{ key: 'clicks', label: 'Klik', hint: 'Samlede klik fra Google-søgning' },
	{
		key: 'impressions',
		label: 'Visninger',
		hint: 'Hvor ofte sitet er vist i søgeresultaterne',
	},
	{ key: 'ctr', label: 'CTR', hint: 'Klikrate: klik delt med visninger' },
	{
		key: 'avgPosition',
		label: 'Snit-position',
		hint: 'Gennemsnitlig placering på tværs af alle søgninger',
	},
]

/* ─── Løbende drift (den månedlige SEO-motor) ─────────────────
 *
 * Audit-backloggen under Teknisk SEO er engangsarbejde der tømmes.
 * recurringTasks er den tilbagevendende motor: de opgaver der skal gås
 * igennem hver måned, når sitet er live. Grupperet efter disciplin
 * (on-page, off-page, måling). Vis kadence og retning, ikke timer.
 * GENERISK default — tilpas pr. kunde hvis noget er branchespecifikt.
 */

export type DriftCadence = 'monthly' | 'ongoing' | 'quarterly'
export type DriftDiscipline = 'onpage' | 'offpage' | 'analysis'

export type RecurringTask = {
	category: string
	title: string
	description: string
	cadence: DriftCadence
	discipline: DriftDiscipline
}

export const driftIntro =
	'Audit-backloggen under Teknisk SEO er engangsarbejde, der bliver løst og forsvinder. Det her er den tilbagevendende motor: SEO skal plejes hver måned, fordi Google, konkurrenterne og sidernes egen ydeevne hele tiden bevæger sig. Opgaverne er delt i on-page, off-page og måling, så listen kan gås igennem hver måned. Der vises kadence og retning, ikke per-opgave-timer.'

export const recurringTasks: RecurringTask[] = [
	{
		category: 'On-page',
		title: 'On-page-iteration',
		description:
			'Vælg 1 til 2 sider og forfin dem ud fra data: title, meta description og H1, udvid tyndt indhold, tilføj FAQ og styrk den interne linking ud fra hvad Search Console viser siden rangerer på.',
		cadence: 'monthly',
		discipline: 'onpage',
	},
	{
		category: 'Indhold',
		title: 'Indholdsproduktion',
		description:
			'Én gennemarbejdet side eller artikel om måneden, der støtter en konkret sides autoritet. Fx en guide til et af sitets kerneemner eller en long-tail-artikel, der fanger en specifik søgning. Typisk den største enkeltpost.',
		cadence: 'monthly',
		discipline: 'onpage',
	},
	{
		category: 'Teknik',
		title: 'Teknisk sundhedstjek',
		description:
			'Kør et crawl af sitet: brudte links, Core Web Vitals, sidehastighed, schema-validering, sitemap-friskhed og mobil-brugervenlighed.',
		cadence: 'monthly',
		discipline: 'onpage',
	},
	{
		category: 'Lokal synlighed',
		title: 'Google Business Profile',
		description:
			'Hold virksomhedens Google-profil levende med opslag og billeder, svar på anmeldelser, og hold navn, adresse og telefonnummer ensartet på tværs af nettet. Vigtigt for lokale søgninger.',
		cadence: 'ongoing',
		discipline: 'offpage',
	},
	{
		category: 'Autoritet',
		title: 'Linkbuilding og omtale',
		description:
			'Opbyg links og omtaler fra branche-relevante sites, medier, kataloger og samarbejdspartnere. Naturlige signaler der styrker domænets troværdighed over for Google. Tålmodigt, løbende arbejde der betaler sig over tid.',
		cadence: 'ongoing',
		discipline: 'offpage',
	},
	{
		category: 'Måling',
		title: 'Search Console-gennemgang',
		description:
			'Gennemgå klik, visninger, CTR og snit-position under Performance → SEO. Find søgninger der stiger eller falder, sider der glider i ranking, og fang nye crawl-fejl og 404-sider tidligt.',
		cadence: 'monthly',
		discipline: 'analysis',
	},
	{
		category: 'Måling',
		title: 'Ranking-tracking og nyprioritering',
		description:
			'Følg de vigtigste søgeords placeringer og find quick wins: søgninger der ligger på plads 5 til 15 og kan skubbes højere med små on-page-justeringer. Dashboardet markerer dem grønt under "Google-søgning".',
		cadence: 'monthly',
		discipline: 'analysis',
	},
	{
		category: 'Analyse',
		title: 'Konkurrentovervågning',
		description:
			'Hold øje med konkurrenterne i samme branche og område: hvad rangerer de på, hvor er der huller i deres dækning, og hvilke emner bør sitet tage før dem.',
		cadence: 'quarterly',
		discipline: 'analysis',
	},
	{
		category: 'Rapportering',
		title: 'Månedsrapport',
		description:
			'Saml månedens udvikling i rankings, trafik og publiceret indhold, og sæt fokus for næste måned. Det er reelt det, dette dashboard dokumenterer.',
		cadence: 'monthly',
		discipline: 'analysis',
	},
]

/**
 * SEO-teknikker & modeller — en intern opslagsbog.
 * Gradvist udvidbar: tilføj en ny post når vi lærer eller bruger en teknik.
 * Formålet er at Andreas kan læse op på HVORFOR vi gør som vi gør.
 */
export type SeoTechnique = {
  title: string;
  category: "Søgeord" | "Indhold" | "Teknisk" | "Lokal" | "Off-page";
  /** Én linje: hvad er det. */
  summary: string;
  /** Hvornår / hvorfor bruger vi det. */
  whenToUse: string;
  /** Forklaring i afsnit (menneskeligt sprog, ingen jargon uden forklaring). */
  body: string[];
  /** Valgfrit kode-eksempel til at gøre teknikken håndgribelig. */
  codeExample?: { label: string; code: string };
  /** Valgfri fordele/ulemper. */
  pros?: string[];
  cons?: string[];
};

export const seoTechniques: SeoTechnique[] = [
  {
    title: "Long-tail-strategien",
    category: "Søgeord",
    summary:
      "En lille virksomhed vinder nedefra: start på lange, specifikke søgeord med lav konkurrence og klatr op efterhånden som autoriteten vokser.",
    whenToUse:
      "Når vi vælger keywords til en ny eller lille side. Aldrig gå frontalt efter de brede, høj-konkurrence-ord fra dag ét.",
    body: [
      "Brede søgeord som 'hjemmeside' eller 'webbureau' (SEO-sværhedsgrad 70-100) er ejet af sites med årtiers autoritet og tusindvis af links. En ny virksomhed slår dem ikke frontalt. Det er som at åbne en café og forvente at slå Starbucks på ordet 'kaffe'.",
      "Long-tail betyder lange, specifikke søgninger: 'hvad koster en ny hjemmeside i Aarhus' har måske 20 søgninger/md, men sværhedsgrad tæt på 0. De store gider ikke optimere efter det, så et nyt site kan blive nr. 1 på uger.",
      "To fordele udover at man kan vinde: (1) høj intent, folk der søger så specifikt ved hvad de vil have og er tæt på at købe; (2) hver gang du rangerer på et lille ord, stiger dit domænes troværdighed, og det er DEN autoritet der på sigt låser de brede ord op.",
      "Trappen: long-tail (SD 0-15) → lokale/niche (SD 15-30) → mellemsvære (SD 30-50) → brede (SD 50+). Man klatrer, man springer ikke.",
    ],
  },
  {
    title: "Hub-and-spoke (indholdsklynger)",
    category: "Indhold",
    summary:
      "Hold service-siden (pengesiden) ren og bred, og ram long-tail-søgeord med separate guides der linker ind til den og bygger dens autoritet.",
    whenToUse:
      "Når vi vil rangere en service-side på et bredt keyword uden at fylde siden med long-tail-tekst der ødelægger designet.",
    body: [
      "Pengesiden (hub) er f.eks. /services/webudvikling. Den targeter det brede 'ny hjemmeside', er visuel og bygget til at konvertere. Vi rører ikke dens design. Kun title/meta/schema optimeres, og det er usynligt for besøgende.",
      "Guides (spokes) er blogindlæg, ét pr. spørgsmål: 'Hvad koster en ny hjemmeside i Aarhus?', 'Hvor lang tid tager det at bygge en hjemmeside?', 'WordPress eller custom?'. De lever i bloggen, som er bygget til lang tekst, så de ser ikke smadrede ud.",
      "Broen er intern linking: hver guide linker tilbage til pengesiden. Google ser en klynge af indhold om samme tema, der alle peger på service-siden, og konkluderer at den side er autoritativ på temaet. Over måneder kan den så klatre op på det brede keyword, uden at vi har rørt dens design.",
      "Rytmen er rolig og separat: service-siderne bygges i deres eget tempo, guides lægges oveni med f.eks. 1-2 om måneden. Autoritet bygges af små, konsistente tiltag over tid.",
    ],
  },
  {
    title: "Structured data & rich snippets (Schema.org)",
    category: "Teknisk",
    summary:
      "En blok JSON-kode i sidens kode der forklarer Google hvad siden handler om. Driver de forbedrede søgeresultater (stjerner, FAQ, priser) og hjælper Google forstå din virksomhed.",
    whenToUse:
      "På alle vigtige sider. Særligt nyttigt for nye sider hvor Google er i tvivl om emnet, og for sider hvor vi vil have rich snippets (anmeldelser, FAQ).",
    body: [
      "Structured data skrives som JSON-LD (et lille stykke kode i sidens <head>). Det er usynligt for besøgende, men Google læser det og bruger det til at forstå indholdet og vise 'rich snippets': stjerner, FAQ-dropdowns, priser, brødkrummer i søgeresultatet.",
      "Entity-disambiguering: Google har en intern database (Knowledge Graph) over ting i verden. Med egenskaben 'sameAs' kan man linke sin virksomhed til autoritative kilder som LinkedIn, Wikipedia eller Wikidata, og dermed sige 'denne virksomhed er den samme som den kendte reference'. Det hjælper Google placere dig hurtigere.",
      "Ærlig nuance: 'sameAs' til Wikipedia for EMNER (ikke virksomheden selv) har typisk beskeden effekt for små sites. Det der virkelig rykker er schema for virksomheden (ProfessionalService, adresse, LinkedIn) og for anmeldelser (AggregateRating + Review), som giver synlige stjerner i Google.",
      "Horizen bruger allerede dette: forsiden har ProfessionalService + PostalAddress + hasOfferCatalog + Trustpilot-anmeldelser (AggregateRating + 7 reviews). Det er derfor vi kan få stjerner i søgeresultater gratis.",
    ],
    codeExample: {
      label: "JSON-LD i sidens <head> (forenklet, tæt på Horizens forside)",
      code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Horizen",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Aarhus"
  },
  "sameAs": [
    "https://www.linkedin.com/company/horizen",
    "https://www.instagram.com/horizen"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "7"
  }
}
</script>`,
    },
    pros: [
      "Rich snippets (stjerner, FAQ, priser) får dig til at skille dig ud i søgeresultatet → højere klikrate",
      "Hjælper Google forstå siden hurtigere → bedre indeksering, især for nye sider",
      "Kan give plads i Knowledge Graph (info-panelet til højre i Google)",
      "Gratis, det er bare kode",
      "Fremtidssikrer: AI-søgning (Google AI Overviews, ChatGPT) bruger structured data til at forstå hvem I er",
    ],
    cons: [
      "Ingen garanti — Google beslutter selv om rich snippets vises",
      "Ingen direkte ranking-boost — det forbedrer hvordan du VISES (klikrate), ikke din placering",
      "Skal holdes ægte og opdateret — pyntet eller falsk markup (fx uægte anmeldelser) kan give manuel straf",
      "Nogle dele har beskeden effekt (fx sameAs til Wikipedia for emner)",
    ],
  },
  {
    title: "Static Site Generation (SSG)",
    category: "Teknisk",
    summary:
      "Siderne bygges til færdige HTML-filer på forhånd (ved deploy), så de serveres lynhurtigt. Et af de stærkeste tekniske fundamenter for SEO.",
    whenToUse:
      "På alt indhold der ikke ændrer sig ved hvert besøg: forsider, service-sider, blog, cases. Standarden for SEO-sider. Horizen kører allerede fuld SSG.",
    body: [
      "Der er tre måder en side kan bygges på. SSG (statisk): siderne laves til færdige HTML-filer på forhånd, når sitet deployes. Når Google eller en besøgende kommer, serveres den færdige side med det samme. SSR (server-rendered): siden bygges på serveren ved hvert besøg, frisk men lidt langsommere. CSR (client-rendered): siden bygges i browseren med JavaScript, dårligst for SEO.",
      "Hvorfor SSG er bedst for SEO: (1) Hastighed, færdig HTML serveres øjeblikkeligt, hvilket giver bedre Core Web Vitals, og Google belønner hurtige sider. (2) Google ser indholdet med det samme, uden at skulle køre JavaScript først, så indekseringen er pålidelig. (3) Stabilitet, færdige filer betyder ingen server-fejl ved besøg.",
      "I Next.js aktiveres SSG for dynamiske sider (fx /services/[slug]) med funktionen generateStaticParams, der fortæller build-processen hvilke sider der skal genereres på forhånd. Almindelige sider er statiske af sig selv, medmindre man aktivt slår det fra.",
      "Horizen bruger det allerede fuldt ud: begge dynamiske ruter (service-sider + designprincipper) har generateStaticParams, og der er ingen force-dynamic nogen steder. Alle sider er statiske.",
    ],
    codeExample: {
      label: "Sådan aktiveres SSG i Next.js (fra /services/[slug])",
      code: `// Fortæller build-processen hvilke sider der skal
// genereres til færdig HTML på forhånd.
export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}`,
    },
    pros: [
      "Lynhurtig levering (færdig HTML) → bedre Core Web Vitals → Google belønner hastighed",
      "Google ser indholdet uden at køre JavaScript → pålidelig indeksering",
      "Stabilt og sikkert — ingen server der kan fejle ved besøg",
      "Billig, skalerbar hosting (statiske filer kan ligge på et CDN)",
    ],
    cons: [
      "Indholdet er 'frosset' ved build — ændringer (fx i Sanity) kræver et nyt build eller revalidering for at slå igennem",
      "Ikke egnet til stærkt personaliseret eller live-data (fx et bruger-dashboard) — det hører til SSR",
      "Mange sider kan give lange build-tider",
    ],
  },
  {
    title: "Parasite SEO (og den sunde udgave: platform-SEO)",
    category: "Off-page",
    summary:
      "At lægge indhold på et stærkt, fremmed domæne (YouTube, Reddit, LinkedIn, Medium m.fl.) for at komme op i Google hurtigere, end ens eget domæne kan. Det kan være klogt eller være spam, alt efter hvordan det gøres.",
    whenToUse:
      "Når eget domæne er nyt og svagt, når Google allerede viser videoer, forumtråde eller opslag i top 10 for søgningen, og når søgeresultatet for firmanavnet skal fyldes ud. Aldrig som erstatning for egen hjemmeside.",
    body: [
      'Hvad det er: et stærkt domæne har autoritet, et nyt har ikke. Indhold på det stærke domæne kan derfor ranke på dage i stedet for måneder. Navnet kommer af, at man "låner" værtens styrke.',
      'Der findes to slags. Den sunde (kaldes også barnacle SEO eller platform-SEO) er rigtigt indhold i eget navn på platforme med et rigtigt publikum, hvor platformen selv er det, folk leder efter: en YouTube-video i Googles videofelt, et svar i en Reddit-tråd i feltet med diskussioner og fora, en LinkedIn-artikel eller en profil på Trustpilot eller Krak. Den grå/sorte slags er tynde sider, der kun findes for at ranke: lejet plads på nyhedssites, engangssider på Google Sites, Blogger, gratis Wix eller myshopify. Google kalder det "site reputation abuse" og har straffet det siden marts 2024 (skærpet i november 2024).',
      "Hvor i processen: (1) I søgeordsanalysen: se på søgeresultatet. Ligger Reddit, YouTube eller LinkedIn i top 10, belønner Google den type indhold på søgningen, og platform-SEO er en genvej. (2) Ved lanceringen: de første 3-12 måneder, hvor eget domæne endnu ikke ranker, kan platformindhold give synlighed, trafik og omtale. (3) Brand: fyld første side for firmanavnet med egne profiler og opslag, så man selv styrer, hvad folk ser. (4) Test: afprøv et emne på en platform, før man bygger en side til det.",
      "Tier-listen fra oktober 2026, vurderet: S (YouTube, Reddit): ja, hvis indholdet er rigtigt og passer til publikum; Reddit kræver ægte deltagelse, og salgstekster bliver fjernet. A (LinkedIn- og Facebook-opslag): stærke til B2B og brand, men opslag ranker sjældent på andet end navnet. Google Sites står også i A, men hører til den grå slags og er en risiko. B (Medium, Substack, Ghost): fint til faglige artikler med et publikum, svagt som rene rankingsider; Spotify kun, hvis der er en podcast. C (Wix, Blogger, myshopify): engangssider med lav værdi og høj risiko.",
    ],
    pros: [
      "Hurtig synlighed, mens eget domæne bygges op.",
      "Rammer folk på de platforme, de allerede bruger.",
      "Kan give omtale og links, der styrker eget domæne.",
      "Fylder søgeresultatet for firmanavnet.",
    ],
    cons: [
      "Man ejer ikke platformen: indhold kan fjernes, og reglerne kan ændre sig.",
      "Trafikken bliver ofte på platformen og når ikke hjemmesiden.",
      "Links fra platformene er som regel nofollow og giver lidt direkte værdi.",
      "Den grå udgave kan straffes af Google og skade firmanavnet.",
    ],
  },
];

/**
 * Værktøjskasse — de redskaber vi bruger i SEO-arbejdet.
 * Gradvist udvidbar. Adskilt fra teknikker (metoder) med vilje.
 */
export type ToolCategory =
  | "maaling"
  | "teknisk"
  | "soegeord"
  | "lokal"
  | "links";

/** Grupperne på fanen Værktøjer, i den rækkefølge de vises. */
export const toolCategories: {
  id: ToolCategory;
  /** Kort navn på fanen. */
  tab: string;
  title: string;
  intro: string;
}[] = [
  {
    id: "maaling",
    tab: "Måling",
    title: "Måling og rapportering",
    intro: "Hvordan I klarer jer i Google, og hvad besøgende gør på siden.",
  },
  {
    id: "teknisk",
    tab: "Teknisk",
    title: "Teknisk SEO og hastighed",
    intro: "Fejl, der kan holde siderne nede, og hvor hurtigt de indlæser.",
  },
  {
    id: "soegeord",
    tab: "Søgeord",
    title: "Søgeord og indhold",
    intro: "Hvad folk søger efter, og hvor svært det er at komme op.",
  },
  {
    id: "lokal",
    tab: "Lokal SEO",
    title: "Google Business Profile og lokal SEO",
    intro:
      'Synlighed på Google Maps og i de lokale resultater, fx "elektriker Horsens".',
  },
  {
    id: "links",
    tab: "Links",
    title: "Linkbuilding og outreach",
    intro: "Links fra andre sider, og hvem man skal kontakte for at få dem.",
  },
];

export type SeoTool = {
  name: string;
  category: ToolCategory;
  /** Kort rolle-label til badge. */
  role: string;
  /** Én linje: hvad er det. */
  summary: string;
  /** Uddybning i afsnit. */
  body: string[];
  /** Hvornår bruger vi det. */
  whenToUse: string;
  /** Pris-note. */
  pricing: string;
  url: string;
};

/**
 * Bevidst IKKE med (vurderet 27/10-2026): GoHighLevel (stor og dyr bureauplatform;
 * automatiske svar på anmeldelser bliver generiske) og browser-automatisering af
 * Google Business Profile (fx Playwright), som kan få profilen suspenderet.
 */
export const seoTools: SeoTool[] = [
  {
    name: "Google Search Console",
    category: "maaling",
    role: "Måling",
    summary:
      "Googles eget værktøj, der viser, hvordan I klarer jer i søgningen: klik, visninger, position og fejl i indekseringen.",
    body: [
      "Ægte data direkte fra Google, ikke estimater. Viser, hvilke søgeord I faktisk ligger på, hvilke sider der er indekseret, og tekniske fejl.",
      "Her henter vi de månedlige målinger, indsender sitemap og fjerner gamle adresser fra Google, hvis det bliver nødvendigt.",
    ],
    whenToUse:
      "Altid først. Til de månedlige målinger, til at tjekke indeksering og til at se, hvad I reelt ligger på.",
    pricing: "Gratis",
    url: "https://search.google.com/search-console",
  },
  {
    name: "Google Analytics 4 (GA4)",
    category: "maaling",
    role: "Adfærd",
    summary:
      "Måler, hvad folk gør på siden: hvor de kommer fra, hvor længe de bliver, og om de tager kontakt.",
    body: [
      "Search Console viser, hvordan folk finder jer i Google. GA4 viser, hvad de gør, når de er inde: trafikkilder, engagement, sidevisninger og henvendelser.",
      "Sættes op ved lanceringen sammen med cookie-banneret, så klik på telefon og udfyldte formularer måles fra første dag.",
    ],
    whenToUse:
      "Til at forstå trafikkilder og adfærd, og om trafikken bliver til henvendelser.",
    pricing: "Gratis",
    url: "https://analytics.google.com",
  },
  {
    name: "Looker Studio",
    category: "maaling",
    role: "Rapportering",
    summary:
      "Bygger visuelle rapporter af data fra Search Console og GA4, som kan deles.",
    body: [
      "Trækker data fra Search Console og GA4 og viser dem i grafer, der kan deles med andre.",
      "Til det løbende overblik bruger vi dette dashboard, så Looker Studio er kun til særlige rapporter.",
    ],
    whenToUse:
      "Når resultaterne skal deles visuelt med flere. Ikke nødvendigt til det daglige.",
    pricing: "Gratis",
    url: "https://lookerstudio.google.com",
  },
  {
    name: "Screaming Frog SEO Spider",
    category: "teknisk",
    role: "Teknisk audit",
    summary:
      "Gennemgår hele sitet, som Google gør, og samler de tekniske SEO-problemer i én liste.",
    body: [
      "Finder 300+ mulige problemer: brudte links (404), kæder af omdirigeringer, manglende eller dobbelte titler og meta-beskrivelser, manglende canonical og alt-tekster. Tjekker også robots.txt og sitemap.",
      "Særligt vigtigt ved lancering af et nyt site: her tjekker vi, at alle gamle adresser sender videre til den rigtige nye side.",
    ],
    whenToUse:
      "Til teknisk sundhedstjek, fx før og efter lanceringen og et par gange om året.",
    pricing:
      "Gratis op til 500 URL'er (rigeligt til de fleste mindre sites). €245/år for ubegrænset + JavaScript-rendering.",
    url: "https://www.screamingfrog.co.uk/seo-spider/",
  },
  {
    name: "PageSpeed Insights",
    category: "teknisk",
    role: "Hastighed",
    summary:
      "Måler sidernes hastighed og Core Web Vitals og giver konkrete forslag til forbedringer.",
    body: [
      "Tester en sides indlæsning på mobil og desktop og giver en score plus Core Web Vitals (LCP, INP, CLS). Hurtige sider belønnes af Google.",
      'Samme måling ligger bag "Sidens helbred" her i dashboardet, som tjekker siderne automatisk.',
    ],
    whenToUse:
      "Til at tjekke og forbedre hastighed, især efter store ændringer på en side.",
    pricing: "Gratis",
    url: "https://pagespeed.web.dev",
  },
  {
    name: "Ubersuggest",
    category: "soegeord",
    role: "Søgeord",
    summary:
      "Søgeordsresearch: finder varianter, søgevolumen og sværhedsgrad (SD) for et søgeord.",
    body: [
      "Bruges til at finde og vurdere søgeord, før vi skriver tekster: hvor mange søger på det, og hvor svært er det at komme op.",
      "Vigtig regel: Search Console (egne data) går ALTID først. Ubersuggest fylder hullerne med varianter og estimater, især til at finde nye, smalle søgninger. Kan også vise konkurrenters links.",
    ],
    whenToUse:
      "Før vi vælger søgeord til en side, og når vi leder efter nye muligheder.",
    pricing:
      "Gratis udgave med daglig grænse for opslag; betalt abonnement for mere.",
    url: "https://neilpatel.com/ubersuggest/",
  },
  {
    name: "Google Business Profile",
    category: "lokal",
    role: "Profil",
    summary:
      "Jeres profil på Google Maps og i de lokale resultater. Det vigtigste enkeltstående sted for lokal synlighed.",
    body: [
      "Det, der rykker mest: den rigtige primære kategori, anmeldelser (antal, hvor nye de er, og svar på dem), ens navn, adresse og telefon overalt, ydelser, serviceområde og jævnligt nye, rigtige billeder fra opgaver.",
      "Afstanden mellem den, der søger, og virksomheden er den største faktor og kan ikke optimeres væk. Derfor er det lettest at blive synlig tæt på adressen og sværere i byer længere væk.",
    ],
    whenToUse:
      "Løbende: svar på anmeldelser, nye billeder og opdaterede ydelser. Serviceområdet udvides, når virksomheden vil dække flere byer.",
    pricing: "Gratis",
    url: "https://business.google.com",
  },
  {
    name: "GMB Everywhere",
    category: "lokal",
    role: "Konkurrenter",
    summary:
      "Udvidelse til Chrome, der viser konkurrenters kategorier, anmeldelser og opsætning direkte i Google Maps.",
    body: [
      "Viser de skjulte sekundære kategorier og en gennemgang af profilen for de firmaer, der ligger øverst. Så kan vi se, hvad de stærkeste konkurrenter i området gør, og hvor jeres profil kan blive stærkere.",
    ],
    whenToUse:
      "Når profilen sættes op, og et par gange om året for at sammenligne med konkurrenterne.",
    pricing: "Gratis udgave; betalt abonnement for flere funktioner.",
    url: "https://www.gmbeverywhere.com",
  },
  {
    name: "Local Falcon",
    category: "lokal",
    role: "Placering på kortet",
    summary:
      'Måler jeres placering på Google Maps i et net af punkter rundt om byen, fx for "elektriker Horsens".',
    body: [
      "En almindelig rangering viser kun én placering. Local Falcon viser, hvor I ligger i hver del af byen, så man kan se, hvor langt jeres synlighed rækker, og om den vokser.",
      "Virker også for servicevirksomheder, der kører ud til kunderne og har skjult adresse.",
    ],
    whenToUse:
      "Efter lanceringen, fx én scanning om måneden for de vigtigste lokale søgninger.",
    pricing: "Betalt efter forbrug (kreditter pr. scanning).",
    url: "https://www.localfalcon.com",
  },
  {
    name: "Ahrefs Webmaster Tools",
    category: "links",
    role: "Jeres links",
    summary:
      "Gratis udgave af Ahrefs til jeres eget site: viser, hvem der linker til jer, og finder tekniske fejl.",
    body: [
      "Ahrefs har et af de største indekser over links. Den gratis udgave dækker kun sites, man selv ejer, og viser nye og tabte links, hvilke sider der får links, og hvilke tekster der linkes med.",
      "Til at se konkurrenternes links bruger vi Ubersuggest.",
    ],
    whenToUse: "Efter lanceringen: et månedligt tjek af nye og tabte links.",
    pricing: "Gratis for jeres eget, verificerede site.",
    url: "https://ahrefs.com/webmaster-tools",
  },
  {
    name: "Hunter",
    category: "links",
    role: "Outreach",
    summary:
      "Finder den rigtige e-mailadresse hos en virksomhed eller forening, man vil kontakte om et link.",
    body: [
      "For lokale virksomheder er lokale links ofte de mest værdifulde: samarbejdspartnere, kunder, lokale foreninger, erhvervsnetværk og sponsorater. Hunter finder kontaktpersonen, så henvendelsen når frem til den, der kan sige ja.",
      "Henvendelserne skrives personligt. Masseudsendelser giver dårlige svar og kan skade jeres navn.",
    ],
    whenToUse:
      "Når vi laver en liste over lokale steder, der kunne linke til jer.",
    pricing: "Gratis udgave med et antal søgninger pr. måned; betalt for mere.",
    url: "https://hunter.io",
  },
];

/* ─── SEO-oversigt ─────────────────────────────────────────────
 * Hele SEO-faget delt op i discipliner (generel drejebog, ikke kundespecifik).
 * Vises under Værktøjer → SEO-oversigt. `see` henviser til et værktøj eller en
 * teknik, der allerede står i dashboardet. Bygget på en oversigt Andreas fandt
 * 27/10-2026; "SEO Wins" (hacks) er udeladt, og Lokal SEO er tilføjet.
 */
export type SeoMapItem = {
  name: string;
  /** Én sætning: hvad det er. */
  text: string;
  /** Henvisning til noget i dashboardet, fx "Teknikker: Long-tail-strategien". */
  see?: string;
};

export type SeoMapArea = {
  title: string;
  /** Det engelske navn, man møder i artikler og værktøjer. */
  en: string;
  summary: string;
  items: SeoMapItem[];
};

export const seoMapIntro =
  "Hele SEO-faget på én side: de discipliner, det består af, og hvad hvert punkt dækker. Brug den som tjekliste, når en ny kunde eller opgave skal vurderes. Henvisningerne peger på værktøjer og teknikker, der allerede er beskrevet her i dashboardet.";

export const seoMap: SeoMapArea[] = [
  {
    title: "Søgeordsanalyse",
    en: "Keyword Research",
    summary:
      "Find ud af, hvad målgruppen søger efter, og hvad der er realistisk at vinde.",
    items: [
      {
        name: "Find søgeord",
        text: "Saml de ord og spørgsmål, kunderne bruger, fra Search Console, Googles forslag, konkurrenter og kundernes egne formuleringer.",
        see: "Værktøjer: Ubersuggest",
      },
      {
        name: "Long-tail-søgeord",
        text: "Lange, specifikke søgninger med få søgninger, men høj købsintention og lav konkurrence.",
        see: "Teknikker: Long-tail-strategien",
      },
      {
        name: "Søgeord med lav konkurrence",
        text: "Ord, hvor de øverste resultater er svage, så et nyt eller lille site kan komme op.",
      },
      {
        name: "Søgevolumen",
        text: "Hvor mange der søger pr. måned. Et estimat fra værktøjerne; Search Console viser de rigtige tal, når siden er live.",
      },
      {
        name: "Analyse af søgeresultatet",
        text: "Se, hvad Google faktisk viser: hvilken type sider, kort, videoer, forumtråde. Det afgør, hvilken side der skal laves.",
      },
    ],
  },
  {
    title: "On-page SEO",
    en: "On-page SEO",
    summary: "Det, der står på selve siden og i dens kode.",
    items: [
      {
        name: "Sidetitel",
        text: "Den blå overskrift i Google. Det vigtigste enkeltstående signal på siden og det, der får folk til at klikke.",
      },
      {
        name: "Overskrifter",
        text: "Én H1, der siger, hvad siden handler om, og H2/H3, der deler indholdet logisk op.",
      },
      {
        name: "URL",
        text: "Kort, læsbar og stabil adresse med emnet i. Ændres helst aldrig efter lancering.",
      },
      {
        name: "Billed-SEO",
        text: "Alt-tekst, beskrivende filnavne, rigtige mål og moderne formater, så billederne hjælper og ikke sinker.",
      },
      {
        name: "Intern linking",
        text: "Links mellem egne sider, så Google finder dem og forstår, hvilke sider der er vigtigst.",
        see: "Teknikker: Hub-and-spoke",
      },
      {
        name: "Strukturerede data",
        text: "Kode (JSON-LD), der fortæller Google, hvad siden er: virksomhed, FAQ, artikel, anmeldelser.",
        see: "Teknikker: Structured data",
      },
      {
        name: "Klikrate (CTR)",
        text: "Titler og beskrivelser, der får flere til at vælge jeres resultat frem for nabolinjen.",
      },
    ],
  },
  {
    title: "Indholdsoptimering",
    en: "Content Optimization",
    summary: "Indhold, der svarer bedre på spørgsmålet end konkurrenternes.",
    items: [
      {
        name: "Gap-analyse",
        text: "Find emner og spørgsmål, konkurrenterne dækker, og som I mangler.",
      },
      {
        name: "NLP-optimering",
        text: "Dæk de begreber og spørgsmål, der naturligt hører til emnet, så Googles sprogmodeller forstår siden.",
      },
      {
        name: "Entiteter",
        text: "Nævn de ting, personer, steder og begreber, emnet består af, og forbind dem tydeligt.",
      },
      {
        name: "Opdatering af indhold",
        text: "Gennemgå og opdatér gamle sider og artikler, så de forbliver korrekte og konkurrencedygtige.",
      },
      {
        name: "Læsbarhed",
        text: "Korte afsnit, klare mellemrubrikker og et sprog, målgruppen forstår.",
      },
    ],
  },
  {
    title: "Teknisk SEO",
    en: "Technical SEO",
    summary:
      "At Google kan finde, læse og indeksere siderne hurtigt og uden fejl.",
    items: [
      {
        name: "Crawling",
        text: "Googles robot skal kunne nå alle vigtige sider via links og sitemap.",
        see: "Værktøjer: Screaming Frog",
      },
      {
        name: "Indeksering",
        text: "De rigtige sider skal med i Google, og test-, dublet- og tynde sider skal holdes ude.",
        see: "Værktøjer: Google Search Console",
      },
      {
        name: "XML-sitemap",
        text: "En liste over alle sider, som indsendes i Search Console.",
      },
      {
        name: "robots.txt",
        text: "Fortæller robotterne, hvad de må og ikke må gennemgå.",
      },
      {
        name: "Omdirigeringer",
        text: "301-omdirigeringer fra gamle adresser til nye, så placeringer og links ikke går tabt ved et nyt site.",
      },
      {
        name: "Hastighed",
        text: "Hurtige sider og gode Core Web Vitals, især på mobil.",
        see: "Værktøjer: PageSpeed Insights",
      },
      {
        name: "Analyse af logfiler",
        text: "Serverens logfiler viser, hvordan Googles robot faktisk gennemgår sitet. Mest relevant for store sites.",
      },
      {
        name: "Rendering",
        text: "Siderne skal kunne læses uden at vente på JavaScript; statisk genererede sider er bedst.",
        see: "Teknikker: Static Site Generation",
      },
    ],
  },
  {
    title: "Lokal SEO",
    en: "Local SEO",
    summary:
      'Synlighed for søgninger med et bynavn eller "i nærheden", på kortet og i de almindelige resultater.',
    items: [
      {
        name: "Google Business Profile",
        text: "Profilen på Google Maps: kategori, ydelser, serviceområde, billeder og opslag.",
        see: "Værktøjer: Google Business Profile",
      },
      {
        name: "Anmeldelser",
        text: "Antal, hvor nye de er, og svar på dem. Et af de stærkeste lokale signaler.",
      },
      {
        name: "Ens navn, adresse og telefon (NAP)",
        text: "Præcis de samme oplysninger på hjemmesiden, i profilen, i CVR og i opslagsværker.",
      },
      {
        name: "Lokale opslag",
        text: "Profiler på Krak, De Gule Sider, Proff, Trustpilot og branchesider.",
      },
      {
        name: "Bysider",
        text: "Én side pr. by med rigtigt lokalt indhold. Aldrig sider, hvor kun bynavnet er skiftet ud.",
      },
      {
        name: "Måling på kortet",
        text: "Placeringen på Google Maps i forskellige dele af byen.",
        see: "Værktøjer: Local Falcon",
      },
    ],
  },
  {
    title: "Linkbuilding og off-page",
    en: "Link Building",
    summary:
      "Links og omtale fra andre sider, der giver jeres domæne autoritet.",
    items: [
      {
        name: "Digital PR",
        text: "Historier, data eller udtalelser, som medier vil skrive om og linke til.",
      },
      {
        name: "Gæsteindlæg",
        text: "Faglige artikler på andres relevante sites med et link tilbage. Kvalitet frem for mængde.",
      },
      {
        name: "Brudte links",
        text: "Find døde links på andre sites, og tilbyd jeres side som erstatning.",
      },
      {
        name: "Omtaler uden link",
        text: "Find steder, der nævner firmanavnet uden at linke, og bed om linket.",
      },
      {
        name: "Linkværdigt indhold",
        text: "Guides, værktøjer, prisoversigter eller undersøgelser, som andre naturligt henviser til.",
      },
      {
        name: "Journalistforespørgsler",
        text: "Svar på journalisters efterlysninger af kilder (fx HARO, Qwoted, Featured) og få omtale med link.",
        see: "Værktøjer: Hunter",
      },
      {
        name: "Platform-SEO",
        text: "Indhold i eget navn på stærke platforme som YouTube, Reddit og LinkedIn.",
        see: "Teknikker: Parasite SEO",
      },
    ],
  },
  {
    title: "AI-søgning",
    en: "AI SEO",
    summary:
      "At blive nævnt og citeret, når folk spørger ChatGPT, Perplexity eller Googles AI-svar.",
    items: [
      {
        name: "Synlighed i AI-søgning",
        text: 'Om jeres firma og sider dukker op i AI-svar. Dashboardets fane "AI-søgning" måler besøg fra AI-tjenester.',
      },
      {
        name: "Entitetsoptimering",
        text: "Gør det entydigt, hvem virksomheden er: ens navn overalt, strukturerede data og sameAs-links til profiler.",
      },
      {
        name: "AI-citater",
        text: "Klare, faktuelle svar og tal, som AI-tjenesterne kan citere og linke til.",
      },
      {
        name: "Omtale på Reddit",
        text: "AI-tjenesterne læser fora. Ægte omtale og svar dér kan påvirke, hvad de anbefaler.",
      },
      {
        name: "Omtale hos andre",
        text: "Anmeldelser, artikler, lister og branchesider, der nævner jer. AI vægter, hvad andre siger.",
      },
    ],
  },
  {
    title: "International SEO",
    en: "International SEO",
    summary: "Sites på flere sprog eller til flere lande.",
    items: [
      {
        name: "hreflang",
        text: "Kode, der fortæller Google, hvilken sprogversion der passer til hvilket land.",
      },
      {
        name: "Flersproget SEO",
        text: "Struktur (fx /en/ og /de/), egne titler og søgeord pr. sprog.",
      },
      {
        name: "Oversættelse",
        text: "Søgeordene findes pr. sprog, ikke ved at oversætte de danske ord direkte.",
      },
    ],
  },
  {
    title: "Måling og analyse",
    en: "Analytics",
    summary: "Hvad virker, og hvad skal ændres.",
    items: [
      {
        name: "Google Search Console",
        text: "Klik, visninger og placeringer direkte fra Google.",
        see: "Værktøjer: Google Search Console",
      },
      {
        name: "Bing Webmaster Tools",
        text: "Bings udgave af Search Console. Bings indeks bruges også af flere AI-tjenester.",
      },
      {
        name: "Google Analytics",
        text: "Hvad besøgende gør på siden, og om de tager kontakt.",
        see: "Værktøjer: GA4",
      },
      {
        name: "Rapportering",
        text: "Faste månedlige tal, der viser udviklingen. Dette dashboard er Horizens udgave.",
      },
    ],
  },
  {
    title: "Værktøjer",
    en: "SEO Tools",
    summary:
      "De store betalte suiter og de små hjælpere. Dem, vi bruger, står under Værktøjer.",
    items: [
      {
        name: "Ahrefs",
        text: "Stor suite med et af de bedste indekser over links. Den gratis Webmaster Tools dækker eget site.",
        see: "Værktøjer: Ahrefs Webmaster Tools",
      },
      {
        name: "Semrush",
        text: "Stor suite til søgeord, konkurrenter, links og teknisk audit.",
      },
      {
        name: "Keywords Everywhere",
        text: "Udvidelse til browseren, der viser søgevolumen direkte i Google.",
      },
      {
        name: "Screaming Frog",
        text: "Gennemgår hele sitet og finder tekniske fejl.",
        see: "Værktøjer: Screaming Frog",
      },
    ],
  },
  {
    title: "Vækst",
    en: "Growth",
    summary: "Det, SEO i sidste ende skal give.",
    items: [
      {
        name: "Organisk trafik",
        text: "Besøg fra Google, som ikke er betalte.",
      },
      {
        name: "Henvendelser",
        text: "Opkald, mails og formularer fra den trafik. Det vigtigste tal for de fleste kunder.",
      },
      {
        name: "Konverteringsoptimering",
        text: "Flere henvendelser fra de samme besøg: tydelige knapper, tillid, hurtige sider.",
      },
      {
        name: "Omsætning",
        text: "Hvad henvendelserne bliver til. Kræver, at kunden fortæller, hvilke der blev til opgaver.",
      },
      {
        name: "Skalering",
        text: "Flere sider, byer eller ydelser, når fundamentet virker.",
      },
    ],
  },
];

/* ─── Spørgsmål til kunden ──────────────────────────────────────
 * Åbne beslutninger, som kun kunden kan afgøre (hensigt, prioritering, fakta).
 * Vises på fanen "Spørgsmål til <clientName>" med en prik, når der er kommet
 * nye spørgsmål eller svar siden sidst. Skriv svaret ind som `answer`, når
 * spørgsmålet er afklaret; det vises som note under spørgsmålet. */

/** Kundens fornavn eller firmanavn, bruges i fanens titel. */
export const clientName = 'Horizen'

/**
 * Udfyldes på forhånd i fanen "Beskeder" (kun Horizen), så hver besked ikke
 * skal skrives fra bunden. reviewLink: Google-profilen → "Anmod om anmeldelser"
 * (g.page/r/…/review). smsSign: hilsenen i SMS'en til kundens egne kunder.
 */
export const clientMessageDefaults = {
	name: '',
	to: '',
	reviewLink: '',
	smsSign: '',
}

export type ClientQuestion = {
	/** Fast nøgle til svaret, kunden gemmer i dashboardet (seoQuestionAnswer).
	 * Uden id bruges en nøgle ud fra spørgsmålets tekst. Ret ikke id, når der er svaret. */
	id?: string
	/** Hvornår spørgsmålet blev stillet ('ÅÅÅÅ-MM-DD'); vises som "Spurgt [dato]". */
	askedAt?: string
	area: string
	question: string
	context: string
	/** Svar/beslutning, når spørgsmålet er afklaret (dato som 'ÅÅÅÅ-MM-DD'). */
	answer?: { date: string; text: string }
}

/** Nøglen, et svar gemmes under (bogstaver, tal og bindestreg) */
export function questionKey(q: ClientQuestion) {
	return (
		q.id ??
		q.question
			.toLowerCase()
			.replace(/æ/g, 'ae')
			.replace(/ø/g, 'oe')
			.replace(/å/g, 'aa')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')
			.slice(0, 80)
	)
}

// EKSEMPLER: erstat med projektets egne spørgsmål (tom liste = "Ingen åbne spørgsmål").
export const clientQuestions: ClientQuestion[] = []

/* ─── Katalog over mulige nye sider (tilkøb) ────────────────────
 * Sider, kunden selv har ønsket eller vi har foreslået, som ligger uden for den
 * løbende aftale. Grupperet i kategorier, foldbare, med bølge, impact, timeskøn
 * og evt. lovkrav pr. underside. Tom liste = sektionen skjules på Plan-fanen.
 * Bølge og impact er kvalificerede hypoteser, ikke verificerede søgetal. */
export type CatalogImpact = 'high' | 'medium' | 'low'

export type CatalogSubpage = {
	title: string
	slug: string
	/** Med i første bølge. */
	firstWave?: boolean
	/** Bundet juridisk krav eller kontrolpunkt, der SKAL med i teksten. */
	legalNote?: string
}

export type CatalogCategory = {
	number: number
	name: string
	/** Anbefalet bygge-bølge: 1 = først, 3 = sidst. */
	priority: 1 | 2 | 3
	impact: CatalogImpact
	/** Groft planlægnings-/salgsskøn i timer for hele kategorien. */
	estimateHours: number
	/** URL-base for kategoriens undersider. */
	base: string
	/** Slug, hvis kategorien allerede har en hovedside i dag. */
	existingMainPage?: string
	note: string
	subpages: CatalogSubpage[]
}

export const serviceCatalogNote =
	'Eksempel: kundens ønskede undersider, grupperet i kategorier. Det ligger uden for den løbende SEO-aftale og kan tilkøbes som et samlet forløb eller løbende via retaineren. Bølge og impact er kvalificerede hypoteser, ikke verificerede søgetal. Timerne er grove skøn.'

/** Engangs-fundament (skabelon, route, kategori-kort), før undersiderne kan fyldes på. 0 = vises ikke. */
export const serviceCatalogFoundationHours = 10

// EKSEMPLER: erstat med projektets eget katalog (tom liste = sektionen skjules).
export const serviceCatalog: CatalogCategory[] = []

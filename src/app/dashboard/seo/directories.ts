/**
 * Profiler og kataloger (Andreas 23/11-2026): den faste rute, når vi opretter
 * og vedligeholder kundens profiler på Google, Bing, Apple, Krak og de øvrige
 * gratis kataloger. Gennemgås ved opstart af en ny kunde, derefter én gang
 * om året (Andreas 23/11-2026) og med det samme, når kunden ændrer navn,
 * adresse, telefon eller åbningstider. Google-profilen tjekkes desuden hver
 * måned i månedens tjekliste. Én gang om året researcher Horizen også listen
 * igen og retter den her, så nye steder kommer med hos alle kunder. Researchet og tjekket 23/11-2026 (kun steder, der findes, er
 * gratis og viser navn, adresse og telefon). Fravalgte steder står i
 * Claude Workflows/02-Horizen/Vidensbank/lokale-kataloger-tjekliste.md.
 *
 * Fluebenene gemmes i Sanity (seoDirectoryChecklist, privat id
 * "seo-directories.status") via POST /api/seo-directories. Et flueben gælder
 * i DIRECTORY_INTERVAL_MONTHS måneder; derefter står punktet som "Skal
 * tjekkes igen". "Ikke relevant" gælder, til det fjernes igen.
 *
 * `id` må ikke ændres (fluebenene peger på det). Ingen kundedata her: listen
 * er ens for alle kunder, og det enkelte projekt fravælger bare punkter.
 */

export const DIRECTORY_INTERVAL_MONTHS = 12

export type DirectoryStep = {
	id: string
	title: string
	description: string
	/** Tilmelding eller selvbetjening (vises kun for Horizen) */
	url?: string
	/** Kun relevant for nogle kunder, fx "B2B" eller "Restauranter" */
	forWhom?: string
	/**
	 * Hvem gør det (Andreas 23/11-2026: "det her løser vi, men det her er I
	 * nødt til at gøre selv"). horizen = vi klarer det alene, adgang = vi
	 * klarer det, når kunden har givet os adgang til en konto, de ejer,
	 * verificer = vi klarer det, men kunden skal bekræfte for os (en kode på
	 * telefonen, en mail eller et ja, se clientPart), kunde = kun kunden kan
	 * (fx MitID).
	 */
	who: DirectoryWho
	/** Det, kunden skal gøre (ved adgang, verificer og kunde) */
	clientPart?: string
	/**
	 * Kontoen oprettes med Horizens profil-mail og kundens navn efter et plustegn
	 * (Andreas 23/11-2026, profiler+ fra 25/11-2026), fx profiler+kunde@horizen.dk. Alt lander i samme
	 * indbakke, men stedet ser en ny adresse pr. kunde. Vises kun for Horizen.
	 */
	plusMail?: boolean
}

export const PLUS_MAIL_HINT =
	'Oprettes med vores profil-mail og kundens navn efter et plustegn, fx profiler+kunde@horizen.dk. Kunden skal ikke oprette en mail.'

export type DirectoryWho = 'horizen' | 'adgang' | 'verificer' | 'kunde'

export const DIRECTORY_WHO: Record<DirectoryWho, { label: string; short: string }> = {
	horizen: { label: 'Vi klarer det', short: 'Horizen' },
	adgang: { label: 'Vi klarer det, I giver adgang', short: 'Adgang' },
	verificer: { label: 'Vi klarer det, I skal verificere', short: 'Verificér' },
	kunde: { label: 'I skal selv', short: 'Jer' },
}

export type DirectoryPhase = { title: string; intro?: string; steps: DirectoryStep[] }

export const directoryIntro =
	'Google, Bing og AI-tjenester stoler mere på en virksomhed, når de samme oplysninger står mange troværdige steder. Første gang opretter eller overtager vi profilerne. Én gang om året tjekker vi, at de stadig findes, og at navn, adresse, telefon og hjemmeside er de samme overalt. Det er ikke antallet af profiler, der tæller, men at oplysningerne er ens.'

export const directoryChangeNote =
	'Flytter I, eller skifter I telefon, navn eller åbningstider, så sig til, så retter vi det alle steder med det samme.'

export const directoryChecklist: DirectoryPhase[] = [
	{
		title: 'Før vi starter',
		steps: [
			{
				id: 'facit',
				who: 'verificer',
				clientPart: 'I tjekker, at oplysningerne er rigtige',
				title: 'Jeres oplysninger samlet ét sted',
				description:
					'Navn (præcis stavning), adresse, telefon, hjemmeside, e-mail, åbningstider, kategori, en kort beskrivelse på mindst 140 tegn, logo og 3-5 billeder. Det er facit for alle profilerne, så der står det samme overalt.',
			},
			{
				id: 'moede',
				who: 'kunde',
				clientPart: 'I sætter 20 minutter af med MitID og telefon ved hånden',
				title: 'Et kort møde med jer er aftalt',
				description:
					'20 minutter online eller hos jer, hvor vi klarer alt det, der kræver jer, på én gang: CVR og Krak med MitID, adgang til Google-profil, Facebook og LinkedIn og de koder, der kommer på jeres telefon. Så venter ingen af os på mails frem og tilbage. Dagsordenen er knappen "Her har vi brug for jeres hjælp" øverst på listen.',
			},
			{
				id: 'cvr',
				who: 'kunde',
				clientPart: 'Kræver jeres MitID Erhverv',
				title: 'CVR er korrekt på virk.dk',
				description:
					'Krak, De Gule Sider, Proff og Infobel henter oplysninger fra CVR, så fejl her spreder sig. Tjek navn eller binavn, adresse, telefon, hjemmeside og branchekode. Kræver MitID Erhverv. Pas på mails fra "Dansk Virksomhedsregister" og lignende, der kræver betaling for at stå i et register: det er svindel, og CVR er gratis.',
				url: 'https://virk.dk',
			},
		],
	},
	{
		title: 'Kort og søgemaskiner',
		steps: [
			{
				id: 'google-profil',
				who: 'adgang',
				clientPart: 'I ejer profilen og giver Horizen adgang som administrator',
				title: 'Google Business Profile',
				description:
					'Det vigtigste punkt: jeres kort på Google og Google Maps. Alle felter udfyldt, rigtig kategori, billeder og åbningstider.',
				url: 'https://business.google.com',
			},
			{
				id: 'bing-places',
				who: 'horizen',
				title: 'Bing Places',
				description:
					'Kan hentes direkte fra Google-profilen på få minutter. Bings data bruges også af ChatGPT-søgning og Copilot.',
				url: 'https://www.bing.com/forbusiness',
			},
			{
				id: 'apple',
				who: 'verificer',
				clientPart: 'I sender os den kode, Apple sender til jer',
				title: 'Apple Business (Apple Kort)',
				description: 'Styrer, hvordan I vises i Apple Kort og Siri på iPhone. Afløste Apple Business Connect i april 2026.',
				url: 'https://business.apple.com',
			},
		],
	},
	{
		title: 'Danske kataloger',
		steps: [
			{
				id: 'krak',
				who: 'kunde',
				clientPart: 'Kræver jeres MitID',
				title: 'Krak og De Gule Sider',
				description:
					'Samme ejer (Eniro), så én opdatering via Krak dækker normalt begge. Kræver MitID. Grundprofilen er gratis; vi siger nej tak til de betalte pakker.',
				url: 'https://opdater.krak.dk',
			},
			{
				id: 'proff',
				who: 'horizen',
				title: 'Proff',
				description:
					'Profilen dannes automatisk ud fra CVR. Rettes via CVR, og ellers med en mail til Proffs kundeservice. Logo og beskrivelse er betalt.',
				url: 'https://www.proff.dk/info/kundeservice/',
			},
			{
				id: 'infobel',
				plusMail: true,
				who: 'horizen',
				title: 'Infobel',
				description: 'Gør krav på virksomheden og vælg den gratis BASIC-pakke.',
				url: 'https://www.infobel.com/da/denmark',
			},
			{
				id: 'hotfrog',
				plusMail: true,
				who: 'horizen',
				title: 'Hotfrog',
				description: 'Søg først efter en eksisterende profil og overtag den, så der ikke opstår dubletter.',
				url: 'https://www.hotfrog.dk',
			},
			{
				id: 'opendi',
				plusMail: true,
				who: 'horizen',
				title: 'Opendi',
				description: 'Gratis profil med link til hjemmesiden. Beskrivelsen skal være mindst 140 tegn.',
				url: 'https://service.opendi.dk/listings',
			},
			{
				id: 'cylex',
				plusMail: true,
				who: 'horizen',
				title: 'Cylex',
				description: 'Gratis profil. Dækker formentlig også find-aaben.dk, som har samme ejer.',
				url: 'https://www.cylex.dk',
			},
		],
	},
	{
		title: 'Anmeldelser og sociale medier',
		steps: [
			{
				id: 'trustpilot',
				who: 'verificer',
				clientPart: 'Kræver en mail på jeres eget domæne',
				title: 'Trustpilot',
				description:
					'Overtag profilen gratis, så vi kan svare på anmeldelser. Kræver en e-mail på jeres eget domæne. Ingen betalt plan.',
				url: 'https://business.trustpilot.com',
			},
			{
				id: 'facebook',
				who: 'adgang',
				clientPart: 'I giver Horizen adgang via Meta Business Suite',
				title: 'Facebook-side',
				description: 'Adresse, telefon og hjemmeside udfyldt, så de matcher facit.',
				url: 'https://www.facebook.com/pages/create',
			},
			{
				id: 'linkedin',
				who: 'adgang',
				clientPart: 'I giver Horizen adgang som administrator',
				title: 'LinkedIn-virksomhedsside',
				description: 'Vigtigst for virksomheder, der sælger til andre virksomheder.',
				url: 'https://www.linkedin.com/company/setup/new/',
			},
			{
				id: 'instagram',
				who: 'adgang',
				clientPart: 'I giver Horizen adgang via Meta Business Suite',
				title: 'Instagram (professionel konto)',
				description: 'Skiftes til professionel konto i appen og kobles til Facebook-siden.',
				forWhom: 'Private kunder og visuelle brancher',
			},
			{
				id: 'pinterest',
				plusMail: true,
				who: 'horizen',
				title: 'Pinterest Business',
				description: 'Kun hvis jeres arbejde egner sig til billeder, fx maling, indretning eller mad.',
				url: 'https://business.pinterest.com',
				forWhom: 'Visuelle brancher',
			},
			{
				id: 'youtube',
				who: 'adgang',
				clientPart: 'I giver Horizen adgang til kanalen',
				title: 'YouTube-kanal',
				description: 'Kun hvis der kommer video. Links til hjemmesiden i kanalens "Om".',
				url: 'https://www.youtube.com',
				forWhom: 'Kun med video',
			},
			{
				id: 'yelp',
				plusMail: true,
				who: 'verificer',
				clientPart: 'I sender os den kode, Yelp sender til jeres telefon',
				title: 'Yelp',
				description: 'Lille i Danmark og mest brugt til restauranter og service i de store byer.',
				url: 'https://biz.yelp.dk',
				forWhom: 'Restauranter og service',
			},
		],
	},
	{
		title: 'Branche og erhverv',
		intro: 'Kun de punkter, der passer til jeres branche. Resten markeres "Ikke relevant".',
		steps: [
			{
				id: 'europages',
				plusMail: true,
				who: 'horizen',
				title: 'Europages',
				description: 'Gratis leverandørprofil med link til hjemmesiden.',
				url: 'https://www.europages.co.uk/en/supplier-registration',
				forWhom: 'B2B',
			},
			{
				id: 'kompass',
				plusMail: true,
				who: 'horizen',
				title: 'Kompass',
				description: 'Gratis B2B-registrering med manuel kontrol. Virksomheder, der sælger til private, bliver typisk afvist.',
				url: 'https://dk.kompass.com',
				forWhom: 'B2B',
			},
			{
				id: 'tripadvisor',
				plusMail: true,
				who: 'verificer',
				clientPart: 'I sender os den kode, Tripadvisor sender til jeres telefon',
				title: 'Tripadvisor',
				description: 'Overtag profilen, så I kan rette oplysninger og svare på anmeldelser.',
				url: 'https://www.tripadvisor.com/Owners',
				forWhom: 'Restauranter, caféer og oplevelser',
			},
			{
				id: 'visitdenmark',
				who: 'verificer',
				clientPart: 'I giver jeres lokale turistorganisation grønt lys',
				title: 'VisitDenmark og den lokale destination',
				description: 'Profilen oprettes via den lokale turistorganisation og vises på VisitDenmark og de lokale visit-sider.',
				forWhom: 'Turisme, restauranter og caféer',
			},
			{
				id: 'sundhed',
				who: 'kunde',
				clientPart: 'Kun klinikken har adgang via sit ydernummer',
				title: 'sundhed.dk (praksisdeklaration)',
				description: 'Klinikken holder selv navn, adresse, telefon og åbningstider opdateret. Officiel og lovpligtig ved offentligt tilskud.',
				url: 'https://www.sundhed.dk',
				forWhom: 'Tandklinikker og sundhed',
			},
			{
				id: 'clutch',
				plusMail: true,
				who: 'horizen',
				title: 'Clutch',
				description: 'Gratis profil og anmeldelser. Den gratis profil har intet link til hjemmesiden.',
				url: 'https://clutch.co/get-listed',
				forWhom: 'Bureauer',
			},
			{
				id: 'sortlist',
				plusMail: true,
				who: 'horizen',
				title: 'Sortlist',
				description: 'Gratis profil. Link til hjemmesiden kræver en betalt plan.',
				url: 'https://www.sortlist.com/providers',
				forWhom: 'Bureauer',
			},
			{
				id: 'goodfirms',
				plusMail: true,
				who: 'horizen',
				title: 'GoodFirms',
				description: 'Gratis profil og anmeldelser for bureauer.',
				url: 'https://www.goodfirms.co',
				forWhom: 'Bureauer',
			},
			{
				id: 'crunchbase',
				plusMail: true,
				who: 'horizen',
				title: 'Crunchbase',
				description: 'Gratis profil med hjemmeside. Mest relevant for tech- og digitale virksomheder.',
				url: 'https://www.crunchbase.com',
				forWhom: 'Bureauer og tech',
			},
			{
				id: 'glassdoor',
				who: 'verificer',
				clientPart: 'I bekræfter, at Horizen må oprette profilen',
				title: 'Glassdoor',
				description: 'Gratis arbejdsgiverprofil. Godkendes manuelt.',
				url: 'https://www.glassdoor.com/employers/sign-up/',
				forWhom: 'Virksomheder, der rekrutterer',
			},
			{
				id: 'indeed',
				who: 'verificer',
				clientPart: 'I bekræfter, at Horizen må oprette profilen',
				title: 'Indeed virksomhedsside',
				description: 'Gratis virksomhedsside via en arbejdsgiverkonto.',
				url: 'https://dk.indeed.com/hire',
				forWhom: 'Virksomheder, der rekrutterer',
			},
		],
	},
	{
		title: 'Kortdata og ekstra',
		intro: 'Lav værdi hver for sig, men gratis. Tages, når de vigtige punkter er på plads.',
		steps: [
			{
				id: 'openstreetmap',
				who: 'horizen',
				title: 'OpenStreetMap',
				description: 'Kortdata, som mange apps bruger. Man tilføjer selv stedet med adresse, telefon og hjemmeside.',
				url: 'https://www.openstreetmap.org',
				forWhom: 'Fysisk adresse',
			},
			{
				id: 'here',
				who: 'horizen',
				title: 'HERE Map Creator',
				description: 'Kortdata til mange bilers navigation. Bliver gennemgået og kan tage nogle uger.',
				url: 'https://mapcreator.here.com',
				forWhom: 'Fysisk adresse',
			},
			{
				id: 'tomtom',
				who: 'horizen',
				title: 'TomTom MapShare',
				description: 'Kortdata til TomTom. En indsendelse kan ikke rettes bagefter, så tjek facit først.',
				url: 'https://www.tomtom.com/mapshare/tools/',
				forWhom: 'Fysisk adresse',
			},
			{
				id: 'waze',
				who: 'horizen',
				title: 'Waze',
				description: 'Stedet tilføjes via Waze Map Editor. Kun relevant, hvis kunderne kører hen til jer.',
				url: 'https://www.waze.com/editor',
				forWhom: 'Fysisk adresse',
			},
			{
				id: 'cybo',
				plusMail: true,
				who: 'horizen',
				title: 'Cybo',
				description: 'Automatisk katalog. Ekstra omtale, lav prioritet.',
				url: 'https://www.cybo.com/add-business/',
			},
			{
				id: 'brownbook',
				plusMail: true,
				who: 'horizen',
				title: 'Brownbook',
				description: 'Brugerdrevet katalog. Ekstra omtale, lav prioritet.',
				url: 'https://www.brownbook.net/add-business',
			},
			{
				id: 'wikidata',
				who: 'horizen',
				title: 'Wikidata',
				description: 'Kun hvis virksomheden har været omtalt i uafhængige medier. Uden omtale bliver opslaget slettet.',
				url: 'https://www.wikidata.org',
				forWhom: 'Kun med presseomtale',
			},
		],
	},
	{
		title: 'Bagefter',
		steps: [
			{
				id: 'sameas',
				who: 'horizen',
				title: 'Profilerne er koblet til hjemmesiden',
				description:
					'Links til de vigtigste profiler lægges ind i hjemmesidens strukturerede data (sameAs), så Google kan se, at profilerne og siden hører sammen.',
			},
			{
				id: 'kontrol',
				who: 'horizen',
				title: 'Rettelserne er slået igennem',
				description:
					'4-6 uger efter: Krak, De Gule Sider og Proff viser de rettede oplysninger, og en søgning på jeres navn viser de samme oplysninger overalt.',
			},
		],
	},
]

export const DIRECTORY_STEP_IDS = new Set(directoryChecklist.flatMap((p) => p.steps.map((s) => s.id)))

/**
 * get-refresh-token.mjs — ENGANGS. Henter et OAuth "refresh token" (den
 * nøglefri, fornybare billet) og skriver de færdige Vercel-værdier til en fil,
 * du kan importere direkte i Vercel. Ren Node + fetch, INGEN npm-pakker (så den
 * virker i ethvert kunde-repo uden install). Cron'en kører i skyen bagefter,
 * se src/lib/search-console.ts.
 *
 * Forudsætning: en OAuth-klient (type "Web application") med redirect-URI
 * http://localhost:4321. Google giver dig en JSON-fil med id + secret.
 *
 * Nemmest, når projektet allerede er koblet til Vercel (klienten findes dér):
 *   node scripts/get-refresh-token.mjs --vercel
 * Så hentes klienten fra Vercel, og det nye token gemmes direkte i Vercel.
 *
 * Kør (peg på JSON-filen):
 *   node scripts/get-refresh-token.mjs ~/Desktop/client_secret_xxx.json
 *
 * (Uden argument falder den tilbage til GOOGLE_OAUTH_CLIENT_ID /
 *  GOOGLE_OAUTH_CLIENT_SECRET fra env.)
 *
 * Et browser-vindue åbner → log ind med den Google-konto, der ejer Search
 * Console-propertierne → Tillad. Værdierne skrives til ~/Desktop/seo-vercel-env.txt.
 * Udfyld de sidste to linjer (SEARCH_CONSOLE_SITE + SANITY_API_WRITE_TOKEN),
 * importér filen i Vercel, og SLET så filen (den indeholder hemmeligheder).
 */
import http from 'node:http'
import { exec, spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { homedir, tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

// ── --vercel: hent klienten fra Vercel og gem det nye token direkte dér ──
// node scripts/get-refresh-token.mjs --vercel   (kør i projektmappen, koblet til Vercel)
// Klient-id/-hemmelighed læses fra Production, og GOOGLE_OAUTH_REFRESH_TOKEN
// overskrives i Production. Intet skrives til skrivebordet.
const VIA_VERCEL = process.argv.includes('--vercel')
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))

function vercelCli(argv, input) {
	const r = spawnSync('vercel', argv, { input, encoding: 'utf8' })
	if (r.status !== 0) throw new Error((r.stderr || r.stdout || '').trim().split('\n').slice(-3).join(' '))
	return r.stdout
}

// ── Credentials: fra JSON-fil (argument), Vercel (--vercel) eller env ──
let CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID
let CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET
if (VIA_VERCEL && (!CLIENT_ID || !CLIENT_SECRET)) {
	// Midlertidig fil med Production-værdierne; slettes med det samme
	const tmp = join(mkdtempSync(join(tmpdir(), 'oauth-')), 'env')
	try {
		vercelCli(['env', 'pull', '--environment=production', '--yes', tmp])
		const vars = Object.fromEntries(
			readFileSync(tmp, 'utf8')
				.split('\n')
				.map((l) => l.match(/^([A-Z0-9_]+)="?(.*?)"?$/))
				.filter(Boolean)
				.map((m) => [m[1], m[2]]),
		)
		CLIENT_ID = vars.GOOGLE_OAUTH_CLIENT_ID
		CLIENT_SECRET = vars.GOOGLE_OAUTH_CLIENT_SECRET
	} catch (err) {
		console.error(`Kunne ikke hente klienten fra Vercel: ${err.message}`)
		process.exit(1)
	} finally {
		rmSync(dirname(tmp), { recursive: true, force: true })
	}
}
const jsonPath = args[0]
if (jsonPath) {
	try {
		const parsed = JSON.parse(readFileSync(jsonPath, 'utf8'))
		const creds = parsed.web || parsed.installed || parsed
		CLIENT_ID = creds.client_id
		CLIENT_SECRET = creds.client_secret
	} catch (err) {
		console.error(`Kunne ikke læse JSON-filen (${jsonPath}): ${err.message}`)
		process.exit(1)
	}
}
if (!CLIENT_ID || !CLIENT_SECRET) {
	console.error('Mangler client id/secret. Peg på JSON-filen, eller sæt env-vars.')
	process.exit(1)
}

const PORT = 4321
const REDIRECT_URI = `http://localhost:${PORT}`
// Search Console + GA4 (fanen Performance → Besøg). Begge kun læseadgang.
const SCOPE = [
	'https://www.googleapis.com/auth/webmasters.readonly',
	'https://www.googleapis.com/auth/analytics.readonly',
].join(' ')
const OUT_FILE = join(homedir(), 'Desktop', 'seo-vercel-env.txt')

const authUrl =
	'https://accounts.google.com/o/oauth2/v2/auth?' +
	new URLSearchParams({
		client_id: CLIENT_ID,
		redirect_uri: REDIRECT_URI,
		response_type: 'code',
		scope: SCOPE,
		access_type: 'offline',
		prompt: 'consent',
	}).toString()

const server = http.createServer(async (req, res) => {
	const code = new URL(req.url, REDIRECT_URI).searchParams.get('code')
	if (!code) {
		res.end('Ingen code modtaget — prøv igen.')
		return
	}
	try {
		const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				code,
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				redirect_uri: REDIRECT_URI,
				grant_type: 'authorization_code',
			}),
		})
		const tokens = await tokenRes.json()
		if (!tokens.refresh_token) {
			res.end('Intet refresh token kom retur. Luk vinduet og kør scriptet igen.')
			console.error(
				'\n⚠ Intet refresh token. Fjern evt. appens adgang på',
				'https://myaccount.google.com/permissions og kør igen.\n',
				tokens,
			)
			server.close()
			return
		}
		if (VIA_VERCEL) {
			try {
				vercelCli(
					['env', 'add', 'GOOGLE_OAUTH_REFRESH_TOKEN', 'production', '--sensitive', '--yes', '--force'],
					tokens.refresh_token,
				)
				res.end('Færdig! Luk dette vindue og gå tilbage til terminalen.')
				console.log('\n✓ Det nye GOOGLE_OAUTH_REFRESH_TOKEN er gemt i Vercel (Production).')
				console.log('  Udrul production igen, så det kommer i brug.\n')
			} catch (err) {
				res.end('Fejl: kunne ikke gemme i Vercel. Se terminalen.')
				console.error(`\n✗ Kunne ikke gemme i Vercel: ${err.message}\n`)
			}
			return
		}
		const cronSecret = randomBytes(24).toString('hex')
		const env = [
			`GOOGLE_OAUTH_CLIENT_ID=${CLIENT_ID}`,
			`GOOGLE_OAUTH_CLIENT_SECRET=${CLIENT_SECRET}`,
			`GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`,
			`CRON_SECRET=${cronSecret}`,
			'# Udfyld de to nedenfor: property fra Search Console + en Sanity Editor-token',
			'SEARCH_CONSOLE_SITE=sc-domain:DIT-DOMÆNE.dk',
			'SANITY_API_WRITE_TOKEN=',
			'',
		].join('\n')
		writeFileSync(OUT_FILE, env, { mode: 0o600 })
		res.end('Færdig! Luk dette vindue og gå tilbage til terminalen.')
		console.log(`\n✓ Vercel-værdierne er skrevet til:\n  ${OUT_FILE}\n`)
		console.log('  Udfyld SEARCH_CONSOLE_SITE (fx sc-domain:kunde.dk) + SANITY_API_WRITE_TOKEN,')
		console.log('  importér filen som env-vars i Vercel, og SLET så filen bagefter.\n')
	} catch (err) {
		res.end('Fejl: ' + err.message)
		console.error(err)
	} finally {
		server.close()
	}
})

server.listen(PORT, () => {
	console.log('Åbner browser for Google-login...')
	console.log('Åbner den ikke selv, så gå til:\n' + authUrl + '\n')
	exec(`open "${authUrl}"`)
})

/**
 * setup-dashboard-env.mjs — sætter SEO-dashboardets Vercel-variabler for en
 * ny kunde i ét hug. Ren Node + Vercel CLI, INGEN npm-pakker.
 *
 *   DASHBOARD_SESSION_SECRET  laves automatisk (ny for hver kunde)
 *   PAGESPEED_API_KEY         den fælles Google-nøgle (Google Cloud →
 *                             APIs & Services → Credentials → Show key)
 *   SANITY_API_READ_TOKEN     Viewer-token fra kundens Sanity-projekt. Uden det
 *                             kan dashboardet ikke læse Henvendelser og AI-besøg
 *                             (private id'er). SanityPress kræver det i forvejen,
 *                             men sites uden for templaten har det ofte ikke
 *   SANITY_API_WRITE_TOKEN    Editor-token fra kundens Sanity-projekt
 *                             (sanity.io/manage → API → Tokens), kun Production
 *   HORIZEN_RESEND_API_KEY    Horizens egen Resend-nøgle (horizen.dk er
 *                             verificeret dér), til fanen Beskeder og mailen om
 *                             spørgsmål. Samme nøgle for alle kunder
 *
 * Variabler, der allerede findes, springes over (brug --force for at
 * overskrive). Nøglerne tastes skjult og sendes til Vercel via stdin, så de
 * hverken står i terminalens historik eller i en fil. Til sidst kan
 * produktionen udrulles igen, så værdierne kommer med.
 *
 * Kør i kundens projektmappe (Vercel CLI skal være logget ind):
 *   node scripts/setup-dashboard-env.mjs            sæt det, der mangler
 *   node scripts/setup-dashboard-env.mjs --dry-run  vis kun, hvad der ville ske
 *   node scripts/setup-dashboard-env.mjs --force    overskriv eksisterende
 */
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import readline from 'node:readline'

const args = new Set(process.argv.slice(2))
const DRY = args.has('--dry-run')
const FORCE = args.has('--force')

const VARS = [
	{
		key: 'DASHBOARD_SESSION_SECRET',
		targets: ['production', 'preview'],
		value: () => randomBytes(32).toString('base64'),
		note: 'laves automatisk',
	},
	{
		key: 'PAGESPEED_API_KEY',
		targets: ['production', 'preview'],
		prompt:
			'PAGESPEED_API_KEY (Google Cloud → Credentials → Show key), tom = spring over: ',
	},
	{
		key: 'SANITY_API_READ_TOKEN',
		targets: ['production', 'preview'],
		prompt:
			'SANITY_API_READ_TOKEN (Viewer-token fra kundens Sanity), tom = spring over: ',
	},
	{
		key: 'SANITY_API_WRITE_TOKEN',
		targets: ['production'],
		prompt:
			'SANITY_API_WRITE_TOKEN (Editor-token fra kundens Sanity), tom = spring over: ',
	},
	{
		key: 'HORIZEN_RESEND_API_KEY',
		targets: ['production'],
		prompt:
			'HORIZEN_RESEND_API_KEY (Horizens Resend-nøgle, samme som horizen.dk), tom = spring over: ',
	},
]

function vercel(argv, { input, inherit } = {}) {
	return spawnSync('vercel', argv, {
		input,
		encoding: 'utf8',
		stdio: inherit ? 'inherit' : ['pipe', 'pipe', 'pipe'],
	})
}

/** Skjult input (vises ikke i terminalen) */
function askHidden(question) {
	return new Promise((resolve) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
			terminal: true,
		})
		process.stdout.write(question)
		rl._writeToOutput = () => {}
		rl.question('', (answer) => {
			rl.close()
			process.stdout.write('\n')
			resolve(answer.trim())
		})
	})
}

function ask(question) {
	return new Promise((resolve) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		})
		rl.question(question, (answer) => {
			rl.close()
			resolve(answer.trim())
		})
	})
}

/** Eksisterende variabler som "NAVN:target" (kun navne, ingen værdier) */
function existingVars() {
	const r = vercel(['env', 'ls', '--format', 'json'])
	if (r.status !== 0) {
		console.error(r.stderr || r.stdout)
		process.exit(1)
	}
	const json = JSON.parse(r.stdout.slice(r.stdout.indexOf('{')))
	const list = json.envs ?? json.env ?? []
	const set = new Set()
	for (const e of list)
		for (const t of [e.target ?? []].flat()) set.add(`${e.key}:${t}`)
	return set
}

if (vercel(['--version']).status !== 0) {
	console.error('Vercel CLI mangler. Installér med: npm i -g vercel')
	process.exit(1)
}

if (!existsSync('.vercel/project.json')) {
	console.log(
		'Mappen er ikke koblet til et Vercel-projekt. Vælg kundens projekt:',
	)
	if (vercel(['link'], { inherit: true }).status !== 0) process.exit(1)
}

const existing = existingVars()
let changed = false

for (const v of VARS) {
	const missing = v.targets.filter(
		(t) => FORCE || !existing.has(`${v.key}:${t}`),
	)
	if (!missing.length) {
		console.log(`✓ ${v.key} findes allerede (${v.targets.join(', ')})`)
		continue
	}
	if (DRY) {
		console.log(`→ ${v.key} ville blive sat for ${missing.join(', ')}`)
		continue
	}
	const value = v.value ? v.value() : await askHidden(v.prompt)
	if (!value) {
		console.log(`– ${v.key} sprunget over`)
		continue
	}
	for (const target of missing) {
		// Preview kræver en git-branch, når der ikke spørges: tom = alle branches
		const argv = ['env', 'add', v.key, target]
		if (target === 'preview') argv.push('')
		argv.push('--sensitive', '--yes')
		if (FORCE) argv.push('--force')
		const r = vercel(argv, { input: value })
		if (r.status !== 0) {
			console.error(`✗ ${v.key} (${target}): ${(r.stderr || r.stdout).trim()}`)
			process.exit(1)
		}
		console.log(`✓ ${v.key} sat for ${target}${v.note ? ` (${v.note})` : ''}`)
		changed = true
	}
}

if (changed) {
	const answer = await ask(
		'\nUdrul produktionen igen nu, så værdierne kommer med? (j/N) ',
	)
	if (answer.toLowerCase().startsWith('j')) {
		const r = vercel([
			'list',
			'--environment',
			'production',
			'--format',
			'json',
		])
		const json = JSON.parse(r.stdout.slice(r.stdout.indexOf('{')))
		const latest = json.deployments?.[0]?.url
		if (!latest) {
			console.error(
				'Fandt ingen produktions-deployment. Udrul fra Vercel i stedet.',
			)
			process.exit(1)
		}
		vercel(['redeploy', latest, '--target', 'production'], { inherit: true })
	} else {
		console.log('Husk: Vercel → Deployments → øverste Production → Redeploy.')
	}
}

console.log(`
Tilbage pr. kunde (står også under Opsætning i dashboardet):
  • Invitér kunden som bruger i Sanity-projektet (Members). Det er kundens login.
  • Tjek at CRON_SECRET er sat (månedlige tal og målinger).
  • Test på kundens rigtige domæne, ikke på et preview-link.`)

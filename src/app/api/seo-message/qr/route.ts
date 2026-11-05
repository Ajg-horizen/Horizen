import QRCode from 'qrcode'

export const runtime = 'nodejs'

/**
 * QR-kode som PNG til beskeder fra Horizen (src/app/dashboard/seo/messageText.ts),
 * fx kundens link til Google-anmeldelser. Offentlig, så mailprogrammer kan hente
 * billedet, men kun til Googles egne adresser, så ruten ikke kan bruges til
 * vilkårlige links. ?download=1 gemmer filen i stedet for at vise den.
 */

const ALLOWED_HOSTS = [
	'g.page',
	'search.google.com',
	'maps.google.com',
	'www.google.com',
	'google.com',
	'maps.app.goo.gl',
]

export async function GET(request: Request) {
	const params = new URL(request.url).searchParams
	const data = params.get('d') ?? ''
	let ok = false
	try {
		const url = new URL(data)
		ok =
			url.protocol === 'https:' &&
			data.length <= 300 &&
			ALLOWED_HOSTS.includes(url.hostname)
	} catch {}
	if (!ok) return new Response('Ugyldigt link', { status: 400 })

	const png = await QRCode.toBuffer(data, { width: 480, margin: 1 })
	return new Response(new Uint8Array(png), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
			...(params.get('download') === '1' && {
				'Content-Disposition': 'attachment; filename="qr-anmeldelser.png"',
			}),
		},
	})
}

import { messagesClient } from "@/sanity/messages";
import {
  HORIZEN_PHONE,
  normalizeCode,
} from "@/app/(site)/dashboard/beskeder/messageText";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Tjek af en mail fra Horizen (Andreas 5/11-2026). Hver besked fra siden
 * /dashboard/beskeder har en ægthedskode (fx H-7F3K-92QD) i mærket nederst. Her slår
 * kunden koden op: findes den, står afsender, dato og emne; findes den ikke,
 * er mailen ikke sendt af Horizen. Modtagerens mail vises kun delvist.
 *
 * Egen lille side (ikke en del af sitets menu), aldrig indekseret.
 */

type Found = {
  sentAt: string;
  sentTo: string;
  sentBy?: string;
  subject: string;
};

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** seitz8000@gmail.com → s•••••••@gmail.com */
const mask = (emails: string) =>
  emails
    .split(/,\s*/)
    .map((e) => {
      const [user, domain] = e.split("@");
      return domain
        ? `${user[0]}${"•".repeat(Math.max(user.length - 1, 3))}@${domain}`
        : e;
    })
    .join(", ");

export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("kode") ?? "";
  const code = normalizeCode(raw);

  let found: Found | null = null;
  if (code) {
    try {
      found = await messagesClient().fetch<Found | null>(
        `*[_type == "seoClientMessage" && code == $code][0]{ sentAt, sentTo, sentBy, subject }`,
        { code },
        { cache: "no-store" },
      );
    } catch (err) {
      console.error("[tjek-mail] Kunne ikke slå koden op:", err);
    }
  }

  const date = (iso: string) =>
    new Date(iso).toLocaleString("da-DK", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Copenhagen",
    });
  const phone = `<a href="tel:${HORIZEN_PHONE.replace(/\s/g, "")}">${HORIZEN_PHONE}</a>`;

  const result = !raw
    ? ""
    : found
      ? `<div class="result ok"><img src="/email/horizen-maerke.gif" width="44" height="44" alt="">
<div><p class="t">Verificeret af Horizen</p>
<p>Sendt af <strong>${escapeHtml(found.sentBy || "Horizen")}</strong> ${escapeHtml(date(found.sentAt))}<br>
til ${escapeHtml(mask(found.sentTo))}<br>Emne: ${escapeHtml(found.subject)}</p></div></div>`
      : `<div class="result bad"><div><p class="t">Koden findes ikke</p>
<p>Mailen er ikke sendt af Horizen, eller koden er skrevet forkert. Klik ikke på noget i mailen, og ring til ${phone}, hvis du er i tvivl.</p></div></div>`;

  const html = `<!doctype html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Verificér en mail fra Horizen</title>
<style>
	* { box-sizing: border-box }
	body { margin: 0; min-height: 100vh; background: #141414; color: #0f0f0f; font: 15px/1.6 Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; padding: 32px 16px }
	main { width: 100%; max-width: 560px; background: #fff; border-radius: 16px; padding: 44px 40px }
	h1 { margin: 0; font-size: 26px; line-height: 1.25 }
	p { margin: 8px 0 0 }
	.muted { color: #6b6b6b }
	form { display: flex; gap: 8px; margin-top: 24px }
	input { flex: 1; min-width: 0; border: 1px solid #d9d9d4; border-radius: 10px; padding: 12px 14px; font: 600 15px 'SF Mono', Menlo, Consolas, monospace; letter-spacing: .04em; text-transform: uppercase }
	button { border: 0; border-radius: 10px; background: #0f0f0f; color: #fff; padding: 12px 20px; font: inherit;
		font-weight: 600; cursor: pointer }
	.result { display: flex; gap: 14px; align-items: flex-start; margin-top: 24px; border-radius: 12px; padding: 16px 18px }
	.result p { margin: 2px 0 0; font-size: 14px }
	.result .t { margin: 0; font-weight: 700; font-size: 15px }
	.ok { background: #eef6f1; border: 1px solid #bfe5d2 }
	.bad { background: #fdf0ef; border: 1px solid #f2c7c2 }
	a { color: #0f0f0f; font-weight: 600 }
	.logo { display: block; margin: 36px auto 0; width: 120px; height: auto; border-top: 1px solid #e6e6e1; padding-top: 28px; box-sizing: content-box }
</style>
</head>
<body>
<main>
<h1>Verificér en mail fra Horizen</h1>
<p class="muted">Alle beskeder fra Horizen har en kontrolkode nederst i mailen. Skriv den her for at se, om mailen er ægte.</p>
<form method="get" action="/tjek-mail">
<input name="kode" value="${escapeHtml(code || raw)}" placeholder="H-XXXX-XXXX" maxlength="20" autocomplete="off" aria-label="Kontrolkode">
<button type="submit">Verificér</button>
</form>
${result}
<p class="muted" style="margin-top:24px;font-size:13px">Er du i tvivl, så ring til Horizen på ${phone}, før du svarer eller klikker.</p>
<img class="logo" src="/email/horizen-logo.png" alt="Horizen">
</main>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}

import { NextResponse } from "next/server";
import { randomBytes, randomUUID } from "node:crypto";
import { Resend } from "resend";
import { messagesClient } from "@/sanity/messages";
import {
  cleanFields,
  clientMessage,
  isMessageTemplate,
  messageCode,
  senderProfile,
  type MessageTemplate,
} from "../messageText";

export const runtime = "nodejs";

/**
 * Sender en besked fra Horizen (siden /dashboard/beskeder). Ligger under
 * /dashboard, så middleware'ens login beskytter den.
 *
 * Samme opbygning som i kundernes SEO-dashboard (/api/seo-message): én mail pr.
 * modtager med egen ægthedskode, gemt som seoClientMessage, så modtageren kan
 * slå koden op på horizen.dk/tjek-mail. Alle links og billeder peger på
 * horizen.dk.
 *
 * Afsender: HORIZEN_SENDER_EMAIL (standard ajg@horizen.dk), som også får
 * svar og en kopi. Nøgle: HORIZEN_RESEND_API_KEY, ellers RESEND_API_KEY.
 */

const MAX_RECIPIENTS = 20;
const EMAIL = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;
// Skabeloner, der giver mening fra horizen.dk (ikke kundens anmeldelser)
const TEMPLATES: MessageTemplate[] = ["sikkerhed", "fri"];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Ugyldig anmodning" }, { status: 400 });
  }
  if (!isMessageTemplate(body.template) || !TEMPLATES.includes(body.template)) {
    return NextResponse.json({ error: "Ukendt skabelon" }, { status: 400 });
  }
  const template = body.template;

  const to = (typeof body.to === "string" ? body.to : "")
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (
    !to.length ||
    to.length > MAX_RECIPIENTS ||
    !to.every((e) => EMAIL.test(e))
  ) {
    return NextResponse.json(
      {
        error: `Modtager skal være 1-${MAX_RECIPIENTS} gyldige e-mailadresser`,
      },
      { status: 400 },
    );
  }

  const fields = cleanFields(body.fields);
  if (!fields.intro) {
    return NextResponse.json({ error: "Skriv en tekst" }, { status: 400 });
  }

  const from = (process.env.HORIZEN_SENDER_EMAIL || "ajg@horizen.dk").trim();
  const profile = senderProfile(from, "", process.env.SEO_SENDER_PHOTO);
  const origin = new URL(request.url).origin;
  const build = (code?: string) =>
    clientMessage({
      template,
      fields,
      sender: profile.name,
      senderPhoto: profile.photo,
      origin,
      dashboardLink: "",
      code,
    });

  if (body.dryRun === true) {
    return NextResponse.json({ ok: true, dryRun: true, to, ...build() });
  }

  const key =
    process.env.HORIZEN_RESEND_API_KEY?.trim() ||
    process.env.RESEND_API_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      { error: "Mail er ikke sat op (RESEND_API_KEY mangler)" },
      { status: 500 },
    );
  }
  const resend = new Resend(key);
  const writer = messagesClient(true);

  // Én mail pr. modtager: hver får sin egen kontrolkode, og ingen kan se de
  // andre modtagere. Kopien til afsenderen følger kun med den første.
  const sent: string[] = [];
  const failed: string[] = [];
  for (const [i, recipient] of to.entries()) {
    const code = messageCode(randomBytes(8));
    const mail = build(code);
    const { data, error } = await resend.emails.send({
      from: `${profile.name || "Horizen"} · Horizen <${from}>`,
      to: [recipient],
      replyTo: from,
      ...(i === 0 && { bcc: from }),
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
    if (error) {
      console.error(`[beskeder] Resend fejlede for ${recipient}:`, error);
      failed.push(`${recipient} (${error.message})`);
      continue;
    }
    sent.push(recipient);
    try {
      await writer.create({
        _id: `seo-message.${randomUUID()}`,
        _type: "seoClientMessage",
        sentAt: new Date().toISOString(),
        sentTo: recipient,
        sentToName: fields.name,
        sentBy: profile.name || "Horizen",
        template,
        code,
        resendId: data?.id,
        subject: mail.subject,
        html: mail.html,
      });
    } catch (err) {
      // mailen er sendt; uden kopi står den bare ikke i historikken, og koden kan ikke slås op
      console.error("[beskeder] Kunne ikke gemme beskeden:", err);
    }
  }

  if (!sent.length) {
    return NextResponse.json(
      { error: `Mailen blev ikke sendt: ${failed.join(", ")}` },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true, sent, failed });
}

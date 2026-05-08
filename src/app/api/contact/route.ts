import { NextResponse } from "next/server";
import { Resend } from "resend";

const FROM = "Horizen Kontakt <noreply@horizen.dk>";
const TO = "ajg@horizen.dk";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "RESEND_API_KEY mangler" },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { name, email, company, topic, message } = body as {
      name?: string;
      email?: string;
      company?: string;
      topic?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Navn, e-mail og besked er påkrævet" },
        { status: 400 },
      );
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Ny besked fra ${name}${topic ? ` — ${topic}` : ""}`,
      text: [
        `Navn: ${name}`,
        `E-mail: ${email}`,
        company ? `Virksomhed: ${company}` : null,
        topic ? `Emne: ${topic}` : null,
        "",
        "Besked:",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Kunne ikke sende mail" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Server-fejl" }, { status: 500 });
  }
}

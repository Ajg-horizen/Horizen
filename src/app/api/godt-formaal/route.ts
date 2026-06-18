import { NextResponse } from "next/server";
import { Resend } from "resend";

const FROM = "Horizen Godt formål <noreply@horizen.dk>";
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
    const {
      organisation,
      cvr,
      type,
      contact,
      role,
      email,
      phone,
      website,
      cause,
      need,
      why,
      consent,
    } = body as {
      organisation?: string;
      cvr?: string;
      type?: string;
      contact?: string;
      role?: string;
      email?: string;
      phone?: string;
      website?: string;
      cause?: string;
      need?: string;
      why?: string;
      consent?: boolean;
    };

    if (!organisation || !cvr || !contact || !email || !cause || !need) {
      return NextResponse.json(
        { error: "Udfyld venligst alle påkrævede felter" },
        { status: 400 },
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: "Samtykke er påkrævet" },
        { status: 400 },
      );
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Ansøgning: gratis projekt — ${organisation}`,
      text: [
        `Organisation: ${organisation}`,
        `CVR-nr.: ${cvr}`,
        type ? `Type: ${type}` : null,
        "",
        `Kontaktperson: ${contact}${role ? ` (${role})` : ""}`,
        `E-mail: ${email}`,
        phone ? `Telefon: ${phone}` : null,
        website ? `Nuværende website: ${website}` : null,
        "",
        "Hvad arbejder de for:",
        cause,
        "",
        "Udfordringer med nuværende hjemmeside:",
        need,
        why ? "" : null,
        why ? "Hvorfor dem:" : null,
        why ? why : null,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Kunne ikke sende ansøgning" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Godt formål route error:", err);
    return NextResponse.json({ error: "Server-fejl" }, { status: 500 });
  }
}

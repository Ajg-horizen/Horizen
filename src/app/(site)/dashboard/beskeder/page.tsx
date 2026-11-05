import type { Metadata } from "next";
import Container from "@/components/Container";
import { messagesClient } from "@/sanity/messages";
import MessagesTab, { type SentMessage } from "./MessagesTab";
import { senderProfile } from "./messageText";

/**
 * Beskeder fra Horizen til kunder og samarbejdspartnere, fx mailen om sikker
 * kommunikation. Samme funktion som fanen "Beskeder" i kundernes SEO-dashboard,
 * men sendt fra horizen.dk, så tjek-linket og billederne peger på horizen.dk.
 * Bag dashboardets login (middleware).
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Beskeder, Horizen (privat)",
  robots: { index: false, follow: false },
};

async function getSent(): Promise<SentMessage[]> {
  try {
    const rows = await messagesClient().fetch<SentMessage[]>(
      `*[_type == "seoClientMessage" && defined(sentAt)] | order(sentAt desc)[0...100]{
        "kind": "besked", sentAt, sentTo, sentToName, sentBy, subject, html, resendId
      }`,
      {},
      { cache: "no-store" },
    );
    return rows ?? [];
  } catch (err) {
    console.error("[beskeder] Kunne ikke hente sendte beskeder:", err);
    return [];
  }
}

export default async function BeskederPage() {
  const sender = senderProfile(
    process.env.HORIZEN_SENDER_EMAIL || "ajg@horizen.dk",
    "",
    process.env.SEO_SENDER_PHOTO,
  );
  const sent = await getSent();
  return (
    <Container as="section" size="site" className="py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-foreground/50 text-xs font-medium tracking-[0.14em] uppercase">
          Horizen · intern
        </p>
        <h1 className="text-foreground mt-2 text-3xl font-semibold tracking-tight">
          Beskeder
        </h1>
        <p className="text-foreground/60 mt-2 max-w-2xl text-sm">
          Mails fra Horizen med verificeringsmærke og kontrolkode. Modtageren
          kan tjekke koden på horizen.dk/tjek-mail. Åbninger ses i Resend under
          Emails.
        </p>
        <div className="mt-8">
          <MessagesTab
            sender={sender.name}
            senderPhoto={sender.photo}
            defaults={{ name: "", to: "", reviewLink: "", smsSign: "" }}
            sent={sent}
            templates={["sikkerhed", "fri"]}
            endpoint="/dashboard/beskeder/send"
            dashboardLink=""
          />
        </div>
      </div>
    </Container>
  );
}

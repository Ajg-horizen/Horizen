import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";

/**
 * En besked fra Horizen (dashboardets side Beskeder, /dashboard/beskeder), fx
 * mailen om sikker kommunikation til kunder og samarbejdspartnere. Oprettes, når
 * mailen er sendt, med hele mailen (`html`) og ægthedskoden (`code`), som
 * modtageren kan slå op på /tjek-mail. Privat id ("seo-message.…").
 *
 * Samme opbygning som i kundernes SEO-dashboard (seoClientMessage).
 */
export const seoClientMessage = defineType({
  name: "seoClientMessage",
  title: "Besked fra Horizen",
  type: "document",
  icon: EnvelopeIcon,
  readOnly: true,
  fields: [
    defineField({ name: "sentAt", title: "Sendt", type: "datetime" }),
    defineField({ name: "sentTo", title: "Til", type: "string" }),
    defineField({
      name: "sentToName",
      title: "Modtagerens navn",
      type: "string",
    }),
    defineField({ name: "sentBy", title: "Sendt af", type: "string" }),
    defineField({ name: "template", title: "Skabelon", type: "string" }),
    defineField({
      name: "code",
      title: "Ægthedskode",
      type: "string",
      description: "Modtageren kan slå koden op på horizen.dk/tjek-mail",
    }),
    defineField({ name: "subject", title: "Emne", type: "string" }),
    defineField({ name: "resendId", title: "Resend-id", type: "string" }),
    defineField({ name: "html", title: "Mailen (HTML)", type: "text" }),
  ],
  orderings: [
    {
      title: "Nyeste først",
      name: "sentDesc",
      by: [{ field: "sentAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "subject", to: "sentTo", at: "sentAt" },
    prepare({ title, to, at }) {
      return {
        title,
        subtitle: [to, at && new Date(at).toLocaleString("da-DK")]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});

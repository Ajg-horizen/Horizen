import { defineArrayMember, defineField, defineType } from "sanity";
import { TrendUpwardIcon } from "@sanity/icons";

/**
 * Et fast månedligt datapunkt fra Google Search Console, så SEO-dashboardet kan
 * vise udviklingen måned for måned.
 *
 * Oprettes automatisk af cron-jobbet /api/cron/seo-snapshot den 3. i hver måned.
 * Id'et er fast pr. måned ("seoSnapshot.ÅÅÅÅ-MM"), så en ny kørsel opdaterer
 * måneden i stedet for at lave en dublet. Punktummet gør dokumentet privat.
 */
export const seoSnapshot = defineType({
  name: "seoSnapshot",
  title: "SEO-snapshot (måned)",
  type: "document",
  icon: TrendUpwardIcon,
  fieldsets: [{ name: "searchConsole", title: "Google Search Console", options: { columns: 2 } }],
  fields: [
    defineField({
      name: "month",
      title: "Måned (ÅÅÅÅ-MM)",
      type: "string",
      validation: (rule) => rule.required().regex(/^\d{4}-(0[1-9]|1[0-2])$/, { name: "ÅÅÅÅ-MM" }),
    }),
    defineField({ name: "capturedAt", title: "Hentet", type: "datetime", readOnly: true }),
    defineField({
      name: "source",
      title: "Kilde",
      type: "string",
      initialValue: "search-console",
      options: {
        list: [
          { title: "Google Search Console", value: "search-console" },
          { title: "Manuelt indtastet", value: "manual" },
        ],
        layout: "radio",
      },
    }),
    defineField({ name: "clicks", title: "Klik", type: "number", fieldset: "searchConsole" }),
    defineField({ name: "impressions", title: "Visninger", type: "number", fieldset: "searchConsole" }),
    defineField({ name: "ctr", title: "CTR (%)", type: "number", fieldset: "searchConsole" }),
    defineField({ name: "avgPosition", title: "Snit-position", type: "number", fieldset: "searchConsole" }),
    defineField({
      name: "topQueries",
      title: "Top-søgninger",
      description: "De søgninger sitet fik flest klik på i måneden. Hentes sammen med totalerne.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "query", title: "Søgning", type: "string" }),
            defineField({ name: "clicks", title: "Klik", type: "number" }),
            defineField({ name: "impressions", title: "Visninger", type: "number" }),
            defineField({ name: "ctr", title: "CTR (%)", type: "number" }),
            defineField({ name: "position", title: "Position", type: "number" }),
          ],
          preview: {
            select: { title: "query", clicks: "clicks", position: "position" },
            prepare: ({ title, clicks, position }) => ({
              title: title || "(uden søgning)",
              subtitle: `${clicks ?? 0} klik · position ${position ?? "?"}`,
            }),
          },
        }),
      ],
    }),
  ],
  orderings: [{ title: "Måned, nyeste først", name: "monthDesc", by: [{ field: "month", direction: "desc" }] }],
  preview: {
    select: { month: "month", clicks: "clicks", impressions: "impressions" },
    prepare: ({ month, clicks, impressions }) => ({
      title: month || "(uden måned)",
      subtitle: `${clicks ?? 0} klik · ${impressions ?? 0} visninger`,
    }),
  },
});

import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { houseStyle } from "../shared/fields";

/** Blok-typer en service-side kan indeholde. Udvides fase for fase. */
const BLOCK_TYPES = [
  "block.hero",
  "block.sectionTOC",
  "block.aiCitation",
  "block.monthlyWork",
  "block.centeredCta",
  "block.process",
  "block.positioning",
  "block.gradientCta",
  "block.faq",
] as const;

export const servicePage = defineType({
  name: "servicePage",
  title: "Service-side",
  type: "document",
  icon: DocumentIcon,
  groups: [
    { name: "content", title: "Indhold", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Internt navn",
      description: "Kun til overblik her i Studio. Vises ikke på sitet.",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Adresse",
      description: "horizen.dk/services/… Skift den ikke på en side, der er live: Google kender adressen.",
      type: "slug",
      group: "seo",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "metadata",
      title: "Søgeresultat",
      description: "Det Google viser. Sidens søgeord hører hjemme HER, ikke i overskrifterne på siden.",
      type: "object",
      group: "seo",
      fields: [
        defineField({
          name: "title",
          title: "Titel",
          type: "string",
          validation: (rule) => [
            rule.required(),
            rule.custom(houseStyle),
            rule.max(65).warning("Google klipper typisk titler over ca. 60 tegn."),
          ],
        }),
        defineField({
          name: "description",
          title: "Beskrivelse",
          type: "text",
          rows: 3,
          validation: (rule) => [
            rule.required(),
            rule.custom(houseStyle),
            rule.max(160).warning("Google klipper typisk beskrivelser over ca. 160 tegn."),
          ],
        }),
      ],
    }),
    defineField({
      name: "blocks",
      title: "Sidens sektioner",
      description: "Rækkefølgen her er rækkefølgen på siden. Første blok skal være Hero.",
      type: "array",
      group: "content",
      of: BLOCK_TYPES.map((type) => defineArrayMember({ type })),
      validation: (rule) =>
        rule.required().custom((blocks: { _type?: string }[] | undefined) =>
          blocks?.[0]?._type === "block.hero" ? true : "Første sektion skal være en Hero.",
        ),
    }),
  ],
  preview: {
    select: { title: "name", slug: "slug.current" },
    prepare: ({ title, slug }) => ({ title: title || "Uden navn", subtitle: slug ? `/services/${slug}` : "Ingen adresse" }),
  },
});

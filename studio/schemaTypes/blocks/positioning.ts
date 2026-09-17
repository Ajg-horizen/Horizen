import { defineArrayMember, defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons";
import { houseStyle, layoutFields, layoutFieldset, maxWords, splitHeadingField, textField } from "../shared/fields";

export const positioning = defineType({
  name: "block.positioning",
  title: "Det vi tror på",
  type: "object",
  icon: StarIcon,
  fieldsets: [layoutFieldset],
  fields: [
    textField("eyebrow", "Mærkat", { required: true }),
    splitHeadingField,
    defineField({
      name: "paragraphs",
      title: "Afsnit",
      description: "Ét afsnit pr. punkt. Højst 50 ord pr. afsnit.",
      type: "array",
      of: [
        defineArrayMember({
          type: "text",
          rows: 4,
          validation: (rule) => [rule.custom(houseStyle), rule.custom(maxWords(50)).warning()],
        }),
      ],
      validation: (rule) => rule.required().min(1).max(3),
    }),
    defineField({
      name: "stats",
      title: "Nøgletal",
      description: "Kun tal vi kan stå på mål for.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          options: { columns: 2 },
          fields: [
            textField("value", "Tal", { required: true, description: 'Fx "150+"' }),
            textField("label", "Betegnelse", { required: true }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "reviews",
      title: "Anmeldelser (valgfrit)",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "count", title: "Antal", type: "number" }),
        defineField({
          name: "avatars",
          title: "Avatarer",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "src", title: "Sti", type: "string" }),
                defineField({ name: "alt", title: "Alt-tekst", type: "string" }),
              ],
            }),
          ],
        }),
      ],
    }),
    ...layoutFields,
  ],
  preview: {
    select: { title: "heading.lead" },
    prepare: ({ title }) => ({ title: title || "Uden overskrift", subtitle: "Det vi tror på", media: StarIcon }),
  },
});

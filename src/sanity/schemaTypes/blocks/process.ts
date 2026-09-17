import { defineArrayMember, defineField, defineType } from "sanity";
import { ArrowRightIcon } from "@sanity/icons";
import { iconField, layoutFields, layoutFieldset, textField } from "../shared/fields";

export const process = defineType({
  name: "block.process",
  title: "Proces",
  type: "object",
  icon: ArrowRightIcon,
  fieldsets: [layoutFieldset],
  fields: [
    textField("eyebrow", "Mærkat", { required: true }),
    textField("heading", "Overskrift", { required: true }),
    textField("body", "Brødtekst", { rows: 3, words: 50 }),
    defineField({
      name: "steps",
      title: "Trin",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "step",
              title: "Nummer",
              description: 'To cifre, fx "01".',
              type: "string",
              validation: (rule) => rule.required().regex(/^\d{2}$/, { name: "to cifre" }),
            }),
            textField("title", "Titel", { required: true }),
            textField("description", "Beskrivelse", { required: true, rows: 3 }),
            iconField(),
            defineField({
              name: "accent",
              title: "Accentfarve",
              type: "string",
              options: {
                list: [
                  { title: "Grøn", value: "#00b67a" },
                  { title: "Blå", value: "#6b8aed" },
                  { title: "Orange", value: "#e8915a" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "link",
              title: "Link til anden ydelse (valgfrit)",
              type: "object",
              options: { columns: 2 },
              fields: [
                defineField({ name: "label", title: "Tekst", type: "string" }),
                defineField({ name: "href", title: "Link", type: "string" }),
              ],
            }),
          ],
          preview: { select: { title: "title", subtitle: "step" } },
        }),
      ],
      validation: (rule) => rule.required().min(3).max(5),
    }),
    ...layoutFields,
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Uden overskrift", subtitle: "Proces", media: ArrowRightIcon }),
  },
});

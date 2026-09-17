import { defineArrayMember, defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons";
import { iconField, layoutFields, layoutFieldset, linesHeadingField, textField, toneField } from "../shared/fields";

export const monthlyWork = defineType({
  name: "block.monthlyWork",
  title: "Løbende arbejde",
  type: "object",
  icon: CalendarIcon,
  fieldsets: [layoutFieldset],
  fields: [
    textField("eyebrow", "Mærkat", { required: true }),
    linesHeadingField,
    textField("body", "Brødtekst", { required: true, rows: 4, words: 50 }),
    defineField({
      name: "items",
      title: "Arbejdsområder",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            textField("title", "Titel", { required: true }),
            textField("description", "Beskrivelse", { required: true, rows: 3 }),
            defineField({
              name: "cadence",
              title: "Kadence",
              type: "string",
              options: { list: ["Hver måned", "Løbende", "Kvartalsvis"], layout: "radio", direction: "horizontal" },
            }),
            iconField(),
            toneField,
          ],
          preview: { select: { title: "title", subtitle: "cadence" } },
        }),
      ],
      validation: (rule) => rule.required().min(2).max(8),
    }),
    textField("note", "Fodnote (valgfri)", { description: 'Fx "Ingen binding. Du kan stoppe når som helst."' }),
    ...layoutFields,
  ],
  preview: {
    select: { heading: "heading" },
    prepare: ({ heading }) => ({
      title: (heading ?? []).join(" ") || "Uden overskrift",
      subtitle: "Løbende arbejde",
      media: CalendarIcon,
    }),
  },
});

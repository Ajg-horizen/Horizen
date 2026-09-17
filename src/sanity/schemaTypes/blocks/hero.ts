import { defineField, defineType } from "sanity";
import { RocketIcon } from "@sanity/icons";
import { ctaField, iconField, layoutFields, layoutFieldset, splitHeadingField, textField } from "../shared/fields";

export const hero = defineType({
  name: "block.hero",
  title: "Hero",
  type: "object",
  icon: RocketIcon,
  fieldsets: [layoutFieldset],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Mærkat over overskriften",
      type: "object",
      options: { columns: 2 },
      fields: [textField("label", "Tekst", { required: true }), iconField()],
    }),
    splitHeadingField,
    textField("body", "Brødtekst", { required: true, rows: 4, words: 40 }),
    ctaField("cta", "Knap"),
    defineField({
      name: "image",
      title: "Hero-billede",
      description: "Sti til en fil i sitets /public-mappe. Flyttes til Sanitys mediebibliotek i en senere fase.",
      type: "object",
      fields: [
        defineField({ name: "src", title: "Sti", type: "string", validation: (rule) => rule.required() }),
        textField("alt", "Alt-tekst", { required: true, description: "Beskriv billedet for skærmlæsere og Google." }),
      ],
    }),
    ...layoutFields,
  ],
  preview: {
    select: { title: "heading.lead" },
    prepare: ({ title }) => ({ title: title || "Uden overskrift", subtitle: "Hero", media: RocketIcon }),
  },
});

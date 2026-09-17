import { defineArrayMember, defineField, defineType } from "sanity";
import { ThListIcon } from "@sanity/icons";
import { layoutFields, layoutFieldset, textField } from "../shared/fields";

export const sectionTOC = defineType({
  name: "block.sectionTOC",
  title: "Sidens menu",
  type: "object",
  icon: ThListIcon,
  fieldsets: [layoutFieldset],
  fields: [
    defineField({
      name: "items",
      title: "Punkter",
      description: "Hvert punkt hopper til en sektion med tilsvarende anker-id.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            textField("label", "Tekst", { required: true }),
            defineField({
              name: "href",
              title: "Anker",
              description: "Fx #proces",
              type: "string",
              validation: (rule) =>
                rule.required().custom((v: string | undefined) => (!v || v.startsWith("#") ? true : "Skal starte med #")),
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
      validation: (rule) => rule.required().min(2).max(6),
    }),
    ...layoutFields,
  ],
  preview: {
    select: { items: "items" },
    prepare: ({ items }) => ({
      title: (items ?? []).map((i: { label?: string }) => i.label).join(" · ") || "Tom menu",
      subtitle: "Sidens menu",
      media: ThListIcon,
    }),
  },
});

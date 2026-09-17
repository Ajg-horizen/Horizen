import { defineField, defineType } from "sanity";
import { BulbOutlineIcon } from "@sanity/icons";
import { ctaField, layoutFields, layoutFieldset, textField } from "../shared/fields";

export const centeredCta = defineType({
  name: "block.centeredCta",
  title: "Centreret opfordring",
  type: "object",
  icon: BulbOutlineIcon,
  fieldsets: [layoutFieldset],
  fields: [
    textField("eyebrow", "Mærkat", { required: true }),
    textField("heading", "Overskrift", { required: true, description: "Gerne et spørgsmål, der lander." }),
    textField("body", "Brødtekst", { required: true, rows: 5, words: 50 }),
    ctaField("cta", "Knap"),
    defineField({
      name: "background",
      title: "Baggrund",
      type: "string",
      fieldset: "layout",
      options: {
        list: [
          { title: "Lys (standard)", value: "background" },
          { title: "Mørk", value: "dark" },
        ],
        layout: "radio",
      },
    }),
    ...layoutFields,
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Uden overskrift", subtitle: "Centreret opfordring", media: BulbOutlineIcon }),
  },
});

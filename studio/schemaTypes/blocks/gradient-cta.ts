import { defineType } from "sanity";
import { ComposeIcon } from "@sanity/icons";
import { ctaField, layoutFields, layoutFieldset, textField } from "../shared/fields";

export const gradientCta = defineType({
  name: "block.gradientCta",
  title: "Afsluttende opfordring",
  description: 'Fast formel i bunden af hver side: "Det hele kunne starte her."',
  type: "object",
  icon: ComposeIcon,
  fieldsets: [layoutFieldset],
  fields: [
    textField("heading", "Overskrift", { required: true }),
    textField("body", "Brødtekst", { required: true, rows: 3 }),
    ctaField("primaryCta", "Primær knap"),
    ctaField("secondaryCta", "Sekundær knap"),
    ...layoutFields,
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Uden overskrift", subtitle: "Afsluttende opfordring", media: ComposeIcon }),
  },
});

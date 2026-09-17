import { defineArrayMember, defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons";
import { layoutFields, layoutFieldset, linesHeadingField, textField } from "../shared/fields";

export const faq = defineType({
  name: "block.faq",
  title: "Ofte stillede spørgsmål",
  type: "object",
  icon: HelpCircleIcon,
  fieldsets: [layoutFieldset],
  fields: [
    textField("eyebrow", "Mærkat", { required: true }),
    linesHeadingField,
    textField("intro", "Intro", { required: true, description: "Står før mailadressen." }),
    defineField({ name: "email", title: "Mailadresse", type: "string", validation: (rule) => rule.email() }),
    defineField({
      name: "faqs",
      title: "Spørgsmål",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            textField("q", "Spørgsmål", { required: true, description: "Kort og konkret. Det kunden faktisk spørger om." }),
            textField("a", "Svar", {
              required: true,
              rows: 4,
              description: "Start med Ja eller Nej, når spørgsmålet lægger op til det. Derefter nuancen. 2-4 sætninger.",
            }),
          ],
          preview: { select: { title: "q", subtitle: "a" } },
        }),
      ],
      validation: (rule) => rule.required().min(3).max(8),
    }),
    ...layoutFields,
  ],
  preview: {
    select: { faqs: "faqs" },
    prepare: ({ faqs }) => ({
      title: `${(faqs ?? []).length} spørgsmål`,
      subtitle: "Ofte stillede spørgsmål",
      media: HelpCircleIcon,
    }),
  },
});

import { defineArrayMember, defineField, defineType } from "sanity";
import { SparklesIcon } from "@sanity/icons";
import { iconField, layoutFields, layoutFieldset, splitHeadingField, textField } from "../shared/fields";

export const aiCitation = defineType({
  name: "block.aiCitation",
  title: "AI-svar (chat-demo)",
  type: "object",
  icon: SparklesIcon,
  fieldsets: [
    { name: "demo", title: "Chat-demoen", options: { collapsible: true } },
    layoutFieldset,
  ],
  fields: [
    textField("eyebrow", "Mærkat", { required: true }),
    splitHeadingField,
    textField("body", "Brødtekst", { required: true, rows: 5, words: 50 }),
    textField("question", "Spørgsmålet der skrives", { required: true, description: "Skrives tegn for tegn i chat-vinduet." }),
    defineField({ ...textField("answerLead", "Svar: før navnet", { required: true }), fieldset: "demo" }),
    defineField({
      ...textField("answerCitation", "Svar: det fremhævede navn", { required: true, description: "Vises som grøn mærkat." }),
      fieldset: "demo",
    }),
    defineField({ ...textField("answerTrail", "Svar: efter navnet", { rows: 3 }), fieldset: "demo" }),
    defineField({
      name: "credentials",
      title: "Mærkater under svaret",
      description: "Kun ægte tal og certificeringer. En AI tjekker dem.",
      type: "object",
      fieldset: "demo",
      fields: [
        textField("trustpilotScore", "Trustpilot-score", { required: true, description: 'Den aktuelle score, fx "4,4".' }),
        textField("trustpilotReviews", "Antal anmeldelser (valgfrit)", { description: "Lad stå tomt for kun at vise scoren." }),
        defineField({ name: "trustpilotUrl", title: "Link til Trustpilot", type: "url" }),
        defineField({ name: "bMaerket", title: "Vis B-mærket", type: "boolean", initialValue: true }),
        defineField({
          name: "bMaerketUrl",
          title: "Link til B-mærket",
          type: "url",
          hidden: ({ parent }) => !parent?.bMaerket,
        }),
      ],
    }),
    textField("signalsLabel", "Overskrift over signalerne", { required: true }),
    defineField({
      name: "signals",
      title: "Signaler",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [iconField(), textField("label", "Tekst", { required: true })],
          preview: { select: { title: "label", subtitle: "icon" } },
        }),
      ],
      validation: (rule) => rule.required().min(2).max(6),
    }),
    ...layoutFields,
  ],
  preview: {
    select: { title: "heading.lead" },
    prepare: ({ title }) => ({ title: title || "Uden overskrift", subtitle: "AI-svar (chat-demo)", media: SparklesIcon }),
  },
});

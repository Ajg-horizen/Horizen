import { defineArrayMember, defineField, type CustomValidator } from "sanity";
import { ICON_NAMES, TONE_OPTIONS } from "@/lib/service-options";

/** Advarer (blokerer ikke) når en tekst overstiger tone of voice-grænsen. */
export const maxWords =
  (limit: number): CustomValidator<string | undefined> =>
  (text) => {
    const words = (text ?? "").trim().split(/\s+/).filter(Boolean).length;
    return words > limit ? `${words} ord. Tone of voice anbefaler højst ${limit}.` : true;
  };

/** Horizens faste ordregler. Fejl, ikke advarsel: de må aldrig udgives. */
export const houseStyle: CustomValidator<string | undefined> = (text) => {
  if (!text) return true;
  if (/[—–]/.test(text)) return "Ingen tankestreger (— eller –). Brug punktum, komma eller kolon.";
  if (/skræddersy/i.test(text)) return 'Ordet "skræddersyet" bruges ikke hos Horizen.';
  if (/b[\s-]?corp/i.test(text)) return 'Det hedder "B-mærket", ikke B Corp.';
  return true;
};

export const textField = (
  name: string,
  title: string,
  opts: { required?: boolean; rows?: number; words?: number; description?: string } = {},
) =>
  defineField({
    name,
    title,
    description: opts.description,
    type: opts.rows ? "text" : "string",
    ...(opts.rows ? { rows: opts.rows } : {}),
    validation: (rule) => {
      const rules = [rule.custom(houseStyle)];
      if (opts.required) rules.push(rule.required());
      if (opts.words) rules.push(rule.custom(maxWords(opts.words)).warning());
      return rules;
    },
  });

export const iconField = (title = "Ikon") =>
  defineField({
    name: "icon",
    title,
    type: "string",
    options: { list: ICON_NAMES.map((value) => ({ title: value.replace(/Icon$/, ""), value })) },
    validation: (rule) => rule.required(),
  });

export const toneField = defineField({
  name: "tone",
  title: "Farvetone",
  description: "Baggrundsfarve bag ikonet. Faste toner fra designsystemet.",
  type: "string",
  options: { list: TONE_OPTIONS.map(({ title, value }) => ({ title, value })), layout: "radio", direction: "horizontal" },
  validation: (rule) => rule.required(),
});

/** Todelt overskrift: sort første del + grå anden del (Horizens signatur). */
export const splitHeadingField = defineField({
  name: "heading",
  title: "Overskrift",
  type: "object",
  options: { columns: 1 },
  fields: [
    textField("lead", "Første del (sort)", { required: true }),
    textField("mutedTail", "Anden del (grå)"),
  ],
});

/** Overskrift som linjer: hver linje står for sig på siden. */
export const linesHeadingField = defineField({
  name: "heading",
  title: "Overskrift",
  description: "Én linje pr. punkt. Hver linje brydes på siden.",
  type: "array",
  of: [defineArrayMember({ type: "string" })],
  validation: (rule) => rule.required().min(1).max(3),
});

export const ctaField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    options: { columns: 2 },
    fields: [
      textField("label", "Knaptekst", { required: true }),
      defineField({
        name: "href",
        title: "Link",
        description: "Fx /kontakt eller mailto:…",
        type: "string",
        validation: (rule) => rule.required(),
      }),
    ],
  });

/** Felter alle blokke kan have. Bruges af sidens menu og af stablings-effekten. */
export const layoutFields = [
  defineField({
    name: "id",
    title: "Anker-id",
    description: 'Gør sektionen linkbar, fx "proces" giver #proces. Små bogstaver uden mellemrum.',
    type: "string",
    fieldset: "layout",
    validation: (rule) =>
      rule.custom((v: string | undefined) =>
        !v || /^[a-z0-9-]+$/.test(v) ? true : "Kun små bogstaver, tal og bindestreg.",
      ),
  }),
  defineField({
    name: "stickyGroup",
    title: "Stablingsgruppe",
    description: "Blokke i træk med samme gruppenavn stables oven på hinanden ved scroll.",
    type: "string",
    fieldset: "layout",
  }),
];

/** Sammenklappet som standard, så indholdsfelterne står forrest. */
export const layoutFieldset = {
  name: "layout",
  title: "Layout (avanceret)",
  options: { collapsible: true, collapsed: true },
};

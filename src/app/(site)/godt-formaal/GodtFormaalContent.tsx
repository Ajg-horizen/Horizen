"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  HeartHandshakeIcon,
} from "lucide-react";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import Container from "@/components/Container";
import { TestimonialBody } from "@/components/FeaturedTestimonial";
import { getTestimonial } from "@/lib/testimonials";

type Status = "idle" | "sending" | "sent" | "error";

// Gratis-hjemmeside-tilbud: én plads om året. Opdatér `year` når året skifter,
// og sæt `slotsOpen: 0`, når årets plads er givet væk.
const OFFER = { year: 2026, slotsOpen: 1 };

export default function GodtFormaalContent() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const payload = {
      organisation: formData.get("organisation"),
      cvr: formData.get("cvr"),
      type: formData.get("type"),
      size: formData.get("size"),
      contact: formData.get("contact"),
      role: formData.get("role"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      website: formData.get("website"),
      cause: formData.get("cause"),
      need: formData.get("need"),
      why: formData.get("why"),
      consent: formData.get("consent") === "on",
    };

    try {
      const res = await fetch("/api/godt-formaal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Send fejlede");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Container as="section" size="site" className="pt-32 pb-12 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <ScrambleEyebrow>Godt formål</ScrambleEyebrow>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Ansøg om en gratis hjemmeside.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Hvert år støtter vi ét frivilligt projekt med en gratis hjemmeside.
            Fortæl os om jeres sag, så vender vi tilbage.
          </p>
          <div className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-foreground/10 bg-foreground/[0.03] px-4 py-2 text-sm font-medium">
            <span className="relative flex size-2.5">
              {OFFER.slotsOpen > 0 && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
              )}
              <span
                className={`relative inline-flex size-2.5 rounded-full ${
                  OFFER.slotsOpen > 0 ? "bg-emerald-500" : "bg-foreground/30"
                }`}
              />
            </span>
            <span>
              {OFFER.slotsOpen > 0
                ? `${OFFER.slotsOpen} plads åben i ${OFFER.year}`
                : `Fuldt booket i ${OFFER.year}`}
            </span>
          </div>
        </motion.div>
      </Container>

      <Container as="section" size="site" className="pb-32">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-8 md:p-10"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Organisationens navn"
                  name="organisation"
                  type="text"
                  required
                  placeholder="Jeres forening eller NGO"
                />
                <Field
                  label="CVR-nr."
                  name="cvr"
                  type="text"
                  required
                  placeholder="8 cifre"
                  inputMode="numeric"
                />
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <SelectField
                  label="Type organisation"
                  name="type"
                  required
                  placeholder="Vælg type"
                  options={[
                    "Forening",
                    "Fond",
                    "NGO",
                    "Almennyttig organisation",
                    "Andet",
                  ]}
                />
                <SelectField
                  label="Hvor mange er I i organisationen?"
                  name="size"
                  required
                  placeholder="Vælg antal"
                  options={[
                    "1-2 personer",
                    "3-10 personer",
                    "11-30 personer",
                    "31-100 personer",
                    "Mere end 100",
                  ]}
                />
              </div>

              <div className="mt-5">
                <Field
                  label="Nuværende website"
                  name="website"
                  type="text"
                  placeholder="(valgfrit) hvis I allerede har en"
                />
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Field
                  label="Kontaktperson"
                  name="contact"
                  type="text"
                  required
                  placeholder="Dit navn"
                />
                <Field
                  label="Rolle"
                  name="role"
                  type="text"
                  required
                  placeholder="Din rolle"
                />
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Field
                  label="E-mail"
                  name="email"
                  type="email"
                  required
                  placeholder="dig@organisation.dk"
                />
                <Field
                  label="Telefon"
                  name="phone"
                  type="tel"
                  required
                  placeholder="Dit telefonnummer"
                />
              </div>

              <div className="mt-5">
                <TextareaField
                  label="Hvad arbejder I for?"
                  name="cause"
                  required
                  placeholder="Fortæl kort om jeres sag og hvem I er til for."
                />
              </div>

              <div className="mt-5">
                <TextareaField
                  label="Hvad er udfordringerne med jeres nuværende hjemmeside?"
                  name="need"
                  required
                  placeholder="Hvad fungerer ikke i dag? Har I ingen hjemmeside, så skriv det."
                />
              </div>

              <div className="mt-5">
                <TextareaField
                  label="Hvorfor jer?"
                  name="why"
                  required
                  placeholder="Hvad ville det betyde for jeres arbejde?"
                  rows={4}
                />
              </div>

              <label className="mt-6 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="mt-0.5 size-4 shrink-0 rounded border-foreground/30 accent-foreground"
                />
                <span className="text-sm text-muted-foreground">
                  Jeg accepterer, at Horizen må kontakte os om ansøgningen, og at
                  et eventuelt samarbejde må vises som case.
                </span>
              </label>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "sending" || status === "sent"}
                  style={{ color: "#ffffff" }}
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "sent" ? (
                    <>
                      <CheckIcon className="size-4" />
                      Tak, vi vender tilbage
                    </>
                  ) : status === "sending" ? (
                    "Sender..."
                  ) : (
                    <>
                      Send ansøgning
                      <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
                <p className="text-xs text-muted-foreground">
                  Vi gemmer kun jeres ansøgning til vi har svaret. Ingen
                  nyhedsbrev.
                </p>
              </div>
              {status === "error" && (
                <p className="mt-4 text-sm text-red-600">
                  Noget gik galt. Prøv igen eller skriv direkte til
                  ajg@horizen.dk.
                </p>
              )}
            </form>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-8 md:p-10">
              <div className="mb-8 flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <HeartHandshakeIcon className="size-6" />
              </div>

              <h2 className="text-xl font-semibold">Kriterier</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Vi vurderer hver ansøgning personligt. For at komme i
                betragtning skal det her være på plads:
              </p>

              <ul className="mt-6 space-y-4">
                <Reason text="I er en frivillig forening eller NGO uden kommercielt formål." />
                <Reason text="Jeres arbejde gavner et alment eller velgørende formål." />
                <Reason text="Hjemmesiden bygges og hostes på vores egne systemer." />
                <Reason text="I betaler for hosting og drift: 399 kr./md." />
                <Reason text="I kan levere indholdet til siden, fx tekst og billeder." />
              </ul>

              <div className="mt-8 border-t border-foreground/10 pt-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Selve hjemmesiden er gratis. I får en løsning til en værdi af
                  ca. 80.000 kr., bygget på det fundament vi bruger til alle
                  vores kunder.
                </p>
              </div>

              <div className="mt-6 border-t border-foreground/10 pt-6">
                <p className="text-sm text-muted-foreground">
                  Spørgsmål inden I søger? Skriv til{" "}
                  <a
                    href="mailto:ajg@horizen.dk"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    ajg@horizen.dk
                  </a>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      <section className="border-t border-foreground/[0.06]">
        <Container size="site" className="py-24">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <ScrambleEyebrow>Case</ScrambleEyebrow>
            <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
              Vores seneste projekt.
            </h2>
          </div>
          <TestimonialBody
            testimonial={getTestimonial("tatiana-tandsundhed")}
            align="center"
          />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/cases/tandsundhed-uden-graenser"
              style={{ color: "#ffffff" }}
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5"
            >
              Se case
              <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="https://dhwb.dk/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium transition-colors hover:border-foreground/40"
            >
              Besøg hjemmeside
              <ArrowUpRightIcon className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  required,
  inputMode,
}: {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  inputMode?: "numeric" | "text" | "tel" | "email";
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
        {required && <span className="text-foreground/40"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground/40"
      />
    </div>
  );
}

function TextareaField({
  label,
  name,
  placeholder,
  required,
  rows = 5,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
        {required && <span className="text-foreground/40"> *</span>}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-none rounded-xl border border-foreground/15 bg-background px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground/40"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  required,
  placeholder = "Vælg",
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
        {required && <span className="text-foreground/40"> *</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-base outline-none transition-colors focus:border-foreground/40"
        defaultValue=""
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Reason({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-600" />
      <span className="text-sm leading-relaxed text-foreground/80">{text}</span>
    </li>
  );
}

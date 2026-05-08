"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  CheckIcon,
} from "lucide-react";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import Container from "@/components/Container";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactPageContent() {
  const [status, setStatus] = useState<Status>("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    // TODO: wire op til Resend / formspree / API-rute. Indtil videre simulerer vi flow.
    setTimeout(() => setStatus("sent"), 700);
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
          <ScrambleEyebrow>Kontakt</ScrambleEyebrow>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Lad os tage en snak.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Har du et projekt, en idé, eller bare brug for sparring? Skriv et
            par linjer, så vender vi tilbage inden for én arbejdsdag.
          </p>
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
                  label="Navn"
                  name="name"
                  type="text"
                  required
                  placeholder="Dit navn"
                />
                <Field
                  label="E-mail"
                  name="email"
                  type="email"
                  required
                  placeholder="dig@firma.dk"
                />
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Field
                  label="Virksomhed"
                  name="company"
                  type="text"
                  placeholder="(valgfrit)"
                />
                <SelectField
                  label="Hvad drejer det sig om?"
                  name="topic"
                  options={[
                    "Webudvikling",
                    "Branding & logo",
                    "UI/UX design",
                    "Sparring eller andet",
                  ]}
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium"
                >
                  Besked
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Fortæl kort om projektet eller hvad du gerne vil snakke om."
                  className="w-full resize-none rounded-xl border border-foreground/15 bg-background px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground/40"
                />
              </div>

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
                      Tak — vi vender tilbage
                    </>
                  ) : status === "sending" ? (
                    "Sender..."
                  ) : (
                    <>
                      Send besked
                      <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
                <p className="text-xs text-muted-foreground">
                  Vi gemmer kun din besked til vi har svaret. Ingen nyhedsbrev,
                  ingen tracking.
                </p>
              </div>
            </form>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-8 md:p-10">
              <div className="mb-8 flex flex-col items-start gap-2">
                <div className="flex -space-x-3">
                  {[
                    { src: "/staff/staff-jose-digital-design.jpg", name: "José" },
                    { src: "/staff/staff-Marketing-ansvarlig-Anne-Sofie.webp", name: "Anne-Sofie" },
                    { src: "/staff/staff-Web-udvikler-designer-Johanne-horizen.avif", name: "Johanne" },
                    { src: "/staff/staff-kommunikation-og-salg-Ludvig.webp", name: "Ludvig" },
                    { src: "/staff/staff-.Sebastian-Meta-facebook.jpg", name: "Sebastian" },
                    { src: "/staff/Kontor-Hund-Gurli-Web-udvikler.webp", name: "Gurli" },
                  ].map((member) => (
                    <img
                      key={member.name}
                      src={member.src}
                      alt={member.name}
                      loading="lazy"
                      className="h-10 w-10 rounded-full border-2 border-background object-cover"
                    />
                  ))}
                </div>
                <span className="text-xs text-muted">Teamet bag Horizen</span>
              </div>

              <h2 className="text-xl font-semibold">Eller skriv direkte</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Ingen formular nødvendig — du kan også fange os her.
              </p>

              <ul className="mt-8 space-y-6">
                <InfoRow
                  icon={<MailIcon className="size-5" />}
                  label="E-mail"
                  value="hej@horizen.dk"
                  href="mailto:hej@horizen.dk"
                />
                <InfoRow
                  icon={<PhoneIcon className="size-5" />}
                  label="Telefon"
                  value="+45 28 60 32 13"
                  href="tel:+4528603213"
                />
                <InfoRow
                  icon={<MapPinIcon className="size-5" />}
                  label="Beliggenhed"
                  value="Aarhus N, Danmark"
                />
                <InfoRow
                  icon={<ClockIcon className="size-5" />}
                  label="Svartid"
                  value="Inden for én arbejdsdag"
                />
              </ul>
            </div>
          </motion.div>
        </div>
      </Container>
    </>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
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
        className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground/40"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-base outline-none transition-colors focus:border-foreground/40"
        defaultValue=""
      >
        <option value="" disabled>
          Vælg et område
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

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.05] text-foreground">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 truncate text-base font-medium">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <li>
        <a
          href={href}
          className="block rounded-xl transition-colors hover:bg-foreground/[0.03]"
        >
          {content}
        </a>
      </li>
    );
  }

  return <li>{content}</li>;
}

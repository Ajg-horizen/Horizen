"use client";

import { LayoutIcon, TargetIcon, BarChartIcon, MailIcon, WrenchIcon, ServerIcon } from "lucide-react";
import CaseStudyPage, { type CaseDetail } from "@/components/CaseStudyPage";
import { cases } from "@/lib/cases";
import { getCase } from "@/lib/case-page";
import { getTestimonial } from "@/lib/testimonials";

const detail: CaseDetail = {
  base: getCase(cases, "malerfirma-seitz"),
  year: "2026",
  hero: { image: "/cases/Seitz-Case-Image-1600w.webp" },
  intro:
    "En enkel, troværdig hjemmeside til et malerfirma, der ikke havde en i forvejen. Bygget til at skaffe opgaver, sammen med Google Ads.",
  challenge: {
    eyebrow: "Udfordringen",
    heading: "Intet sted på nettet",
    paragraphs: [
      "Malerfirma Seitz havde ikke nogen hjemmeside i forvejen. Firmaet manglede et sted på nettet, der kunne bære det og skaffe opgaver.",
      "For en håndværker skal der ikke et stort system til. Der skal en enkel, troværdig side, der virker, og en synlighed, der giver henvendelser.",
    ],
  },
  solution: {
    eyebrow: "Løsningen",
    heading: "Enkelt og jordnært",
    paragraphs: [
      "Vi byggede en fokuseret landing page fra bunden med tydelig kontakt og en formular, der gør det let at få fat i firmaet. Ingen tung page-builder og ingen overflødige lag, kun det der skal til.",
      "Vi rådgav om det, der giver mening for en håndværker med et begrænset annoncebudget, og holdt det jordnært frem for at overkomplicere.",
    ],
  },
  highlight: {
    eyebrow: "Under overfladen",
    heading: "Annoncer der kan måles",
    paragraphs: [
      "Oven på siden satte vi Google Ads op med konverteringssporing på telefon, e-mail og formular. Så kan vi se, hvad der virker, og flytte kronerne derhen.",
    ],
    pillars: [
      { title: "Konverteringssporing", text: "Opkald, mails og formularer måles hver for sig." },
      { title: "Fokuseret landing page", text: "Tydelig kontakt, så det er let at tage det næste skridt." },
      { title: "Løbende justering", text: "Vi holder siden ved lige og justerer annoncerne løbende." },
    ],
  },
  deliverables: [
    { icon: LayoutIcon, title: "Landing page fra bunden", text: "Enkel og hurtig, bygget til at skaffe opgaver." },
    { icon: TargetIcon, title: "Google Ads", text: "Opsætning og løbende annoncering inden for et beskedent budget." },
    { icon: BarChartIcon, title: "Konverteringssporing", text: "Telefon, e-mail og formular måles, så vi ved, hvad der virker." },
    { icon: MailIcon, title: "Kontaktformular", text: "Henvendelser lander direkte i firmaets indbakke." },
    { icon: WrenchIcon, title: "Support og vedligehold", text: "Vi holder siden ved lige og er i løbende kontakt om justeringer." },
    { icon: ServerIcon, title: "Drift og hosting hos Horizen", text: "Firmaet skal ikke tænke på teknikken." },
  ],
  testimonial: getTestimonial("michael-seitz-malerfirma"),
  technologies: ["React", "Vite", "Tailwind CSS", "Google Ads", "Serverless hosting"],
};

export default function CaseContent() {
  return <CaseStudyPage detail={detail} />;
}

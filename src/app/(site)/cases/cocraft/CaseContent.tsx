"use client";

import { PenToolIcon, CodeIcon, ImageUpIcon, DatabaseIcon, ShieldCheckIcon, ServerIcon } from "lucide-react";
import CaseStudyPage, { type CaseDetail } from "@/components/CaseStudyPage";
import { cases } from "@/lib/cases";
import { getCase } from "@/lib/case-page";

const detail: CaseDetail = {
  base: getCase(cases, "cocraft"),
  year: "2026",
  hero: {
    image: "/cases/CoCraft-Hero-Model-2400w.webp",
    srcSet:
      "/cases/CoCraft-Hero-Model-800w.webp 800w, /cases/CoCraft-Hero-Model-1600w.webp 1600w, /cases/CoCraft-Hero-Model-2400w.webp 2400w",
    position: "60% 30%",
    alt: "Smilende kvinde i en håndhæklet stribet trøje strikker ved havet, fotograferet til CoCraft",
    photographer: {
      name: "Katrine Gøth Celebrini",
      url: "https://katrinecelebrini.com/",
    },
  },
  intro:
    "En platform hvor kunder beskriver deres idé og får den lavet af en kunsthåndværker. Bygget fra idé til live platform på en måned.",
  challenge: {
    eyebrow: "Udfordringen",
    heading: "En god idé uden digitalt fundament",
    paragraphs: [
      "CoCraft startede som en idé: et sted hvor folk kan få strik, smykker og boligting lavet af dygtige kunsthåndværkere i stedet for at købe masseproduceret. Men idéen havde intet digitalt fundament at stå på.",
      "Der var brug for en platform, hvor kunder kan beskrive deres idé, vedhæfte billeder og sende en bestilling afsted. Og stifteren skulle selv kunne redigere alt indhold uden at være afhængig af et bureau til hver rettelse.",
    ],
  },
  solution: {
    eyebrow: "Løsningen",
    heading: "Research først, kode bagefter",
    paragraphs: [
      "Før en eneste linje kode blev skrevet, startede vi i Figma med wireframes og en gennemarbejdet designproces. Hensigten var klar: kunder skal trygt kunne bestille noget håndlavet ud fra deres egen idé. Den analyse formede bestillingsflowet, informationsarkitekturen og hierarkiet.",
      "Derfra byggede vi hele platformen fra bunden med et CMS, hvor stifteren selv redigerer tekster, billeder, cases og sektioner med visuel forhåndsvisning. Undervejs rådgav vi om valgene, men beslutningen lå altid hos kunden.",
    ],
  },
  highlight: {
    eyebrow: "Under overfladen",
    heading: "Bestillingsflowet er kernen",
    paragraphs: [
      "En kunde beskriver sin idé, vælger kategori og vedhæfter billeder. Billederne komprimeres i browseren, før de sendes, så en bestilling ikke fejler på grund af store filer.",
    ],
    pillars: [
      { title: "Fra idé til bestilling", text: "Beskrivelse, kategori og billeder samlet i ét flow." },
      { title: "Selvredigerbart", text: "Stifteren styrer selv alt indhold med visuel forhåndsvisning." },
      { title: "Klar til drift", text: "Cookie-samtykke, Analytics og mail på plads fra dag ét." },
    ],
  },
  stats: [{ value: "1 måned", label: "fra idé til live platform" }],
  deliverables: [
    { icon: PenToolIcon, title: "Wireframes og designproces", text: "Figma først, så UI og UX hviler på research frem for holdninger." },
    { icon: CodeIcon, title: "Platform bygget fra bunden", text: "Design og udvikling af hele platformen, uden skabeloner." },
    { icon: ImageUpIcon, title: "Bestillingsflow med billedupload", text: "Billeder komprimeres i browseren, så bestillingen kommer igennem." },
    { icon: DatabaseIcon, title: "CMS med visuel redigering", text: "Tekster, billeder, cases og sektioner redigeres direkte af stifteren." },
    { icon: ShieldCheckIcon, title: "Cookie-samtykke og Analytics", text: "Google Analytics med Consent Mode v2 og en side om persondata." },
    { icon: ServerIcon, title: "Drift og hosting hos Horizen", text: "Mail, DNS og Search Console sat op, og en løbende aftale om videreudvikling." },
  ],
  testimonial: {
    id: "iben-cocraft",
    quote:
      "José har hjulpet mig med UI/UX og har altid været tilgængelig på telefonen og på mail. Derudover har José udvist stor tålmodighed og forståelse for mine ønsker og krav undervejs, hvilket har været særdeles værdsat af en perfektionist som mig. Samarbejdet har været både effektivt og behageligt, og jeg kan derfor varmt anbefale José og Horizen.",
    rating: 5,
    author: { name: "Iben Tvilsted", role: "Stifter", company: "CoCraft", website: "https://cocraft.dk" },
    source: "direct",
  },
  technologies: ["Next.js", "React", "Tailwind CSS", "Headless CMS", "Serverless hosting", "Google Analytics 4"],
};

export default function CaseContent() {
  return <CaseStudyPage detail={detail} />;
}

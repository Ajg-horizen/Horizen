"use client";

import {
  PenToolIcon,
  PaletteIcon,
  LayoutIcon,
  MousePointerClickIcon,
  SearchIcon,
  ServerIcon,
} from "lucide-react";
import CaseStudyPage, { type CaseDetail } from "@/components/CaseStudyPage";
import { cases } from "@/lib/cases";
import { getCase } from "@/lib/case-page";

const detail: CaseDetail = {
  base: getCase(cases, "miljoekontoret"),
  year: "2026",
  hero: {
    image: "/cases/Miljoekontoret-Hero-Raadgivning-2-1600w.webp",
    srcSet:
      "/cases/Miljoekontoret-Hero-Raadgivning-2-800w.webp 800w, /cases/Miljoekontoret-Hero-Raadgivning-2-1600w.webp 1600w",
    alt: "Rådgiver gennemgår byggetegninger med en kunde ved et møde om miljø og arbejdsmiljø",
    shiftUp: 10,
  },

  intro:
    "Et nyt site med eget designsystem til en rådgivningsvirksomhed inden for miljø og arbejdsmiljø, bygget til at bære samtaler med store bygherrer.",
  highlight: {
    eyebrow: "Under overfladen",
    heading: "Tolv sektioner, ét tydeligt hierarki",
    paragraphs: [
      "Forsiden består af tolv sektioner: ydelser i bento-grid, referencer, arbejdsproces og et gennemtænkt CTA-hierarki. SEO-fundamentet med metadata, sitemap og robots var på plads fra dag ét.",
    ],
    pillars: [
      {
        title: "Designsystem med tokens",
        text: "Farver, afstande og typografi defineret ét sted.",
      },
      {
        title: "CTA-hierarki",
        text: "Den besøgende ved altid, hvad det næste skridt er.",
      },
      {
        title: "SEO fra dag ét",
        text: "Metadata, sitemap og robots på plads før lancering.",
      },
    ],
  },
  deliverables: [
    {
      icon: PenToolIcon,
      title: "Wireframes og designproces",
      text: "Struktur og hierarki lagt i Figma, før vi byggede.",
    },
    {
      icon: PaletteIcon,
      title: "Selvstændigt designsystem",
      text: "Tokens og en intern regelbog, der holder udtrykket ensartet.",
    },
    {
      icon: LayoutIcon,
      title: "Forside med tolv sektioner",
      text: "Designet og udviklet fra bunden, uden skabeloner.",
    },
    {
      icon: MousePointerClickIcon,
      title: "CTA-hierarki og mobilnavigation",
      text: "Tydelige næste skridt, også på telefonen.",
    },
    {
      icon: SearchIcon,
      title: "SEO-grundopsætning",
      text: "Metadata, sitemap og robots fra første dag.",
    },
    {
      icon: ServerIcon,
      title: "Drift og hosting hos Horizen",
      text: "Vi holder fundamentet på plads efter lanceringen.",
    },
  ],
  story: {
    eyebrow: "Udgangspunktet",
    heading: "Fagligheden var der.",
    headingTail: "Den blev bare ikke fundet.",
    paragraphs: [
      "Miljøkontoret rådgiver bygherrer inden for pharma, biotek og offentligt byggeri, hvor troværdighed afgør alt. Michael kom til os for at få hjælp til SEO, så flere kunne finde dem i Google.",
      "Da vi gik siden igennem, blev det tydeligt, at den gamle løsning var svær at bygge videre på. Vores anbefaling var et nyt fundament. Michael var klar: Var det den bedste vej for virksomheden, så var det den, de skulle gå.",
      "Sammen byggede vi en ny hjemmeside fra bunden i Next.js og React med eget designsystem. Den blev fundamentet for det SEO-arbejde, der i dag løfter synligheden måned for måned. AI er et værktøj i vores proces, ikke en genvej.",
    ],
    facts: [
      { value: "28/28", label: "sider med i Googles indeks" },
      { value: "0", label: "fejl i SEO-tjekket af alle sider" },
      { value: "95", label: "på mobil i Googles hastighedsmåling" },
      { value: "100", label: "i SEO og tilgængelighed" },
    ],
  },
  visibility: {
    eyebrow: "Synlighed i Google",
    heading: "Bygget til at blive fundet.",
    intro:
      "Det nye fundament og det løbende SEO-arbejde sammen. Oktober, første hele måned med den nye løsning, sammenlignet med august, måneden før lanceringen.",
    chips: [
      { label: "Visninger i Google", value: "+5.302 %" },
      { label: "Klik fra Google", value: "+467 %" },
      { label: "Søgeord på side 2", value: "+418 %" },
    ],
    // Vækst i procent i forhold til august 2026, måneden før lanceringen 12/9.
    months: [
      { label: "August", growth: 0, note: "Måneden før lanceringen" },
      { label: "September", growth: 1393, note: "Ny løsning live 12/9" },
      { label: "Oktober", growth: 5302, note: "Første hele måned" },
    ],
    launchAfter: 0,
    launchLabel: "Ny løsning live 12/9",
    note: "Kilde: Google Search Console. Visninger er, hvor ofte siden er vist i Googles søgeresultater. Udgangspunktet er august, måneden før lanceringen. Søgeord på side 2 er målt fra september til november.",
  },
  disciplines: {
    eyebrow: "Det arbejder vi på nu",
    heading: "Vores indsatser for Miljøkontoret.",
    headingTail: "Efter lanceringen, måned for måned.",
    intro:
      "Siden gik live i september 2026. Siden da har vi en fast SEO-aftale med Miljøkontoret, og det her er de indsatser, vi arbejder med lige nu.",
    items: [
      {
        title: "Teknisk SEO",
        link: { href: "/services/webudvikling", label: "Læs om webudvikling" },
        visual: {
          kind: "cwv",
          rows: [
            { label: "LCP", value: "God", pct: 88 },
            { label: "INP", value: "God", pct: 92 },
            { label: "CLS", value: "God", pct: 96 },
          ],
          stats: [
            { label: "SEO-score", value: "100" },
            { label: "Mobil", value: "95" },
          ],
        },
        text: "Hastighed, indeksering og strukturerede data holdes i orden, så Google kan læse og forstå hver side.",
        tags: [
          "Core Web Vitals",
          "Crawl og indeksering",
          "Schema.org",
          "Sitemap",
        ],
      },
      {
        title: "Søgeord og søgeintent",
        visual: {
          kind: "code",
          file: "søgeord.json",
          lines: [
            [["["]],
            [
              ["  { "],
              ['"q"', "key"],
              [": "],
              ['"miljøscreening pris"', "str"],
              [","],
            ],
            [["    "], ['"intent"', "key"], [": "], ['"køb"', "str"], [" },"]],
            [
              ["  { "],
              ['"q"', "key"],
              [": "],
              ['"mrk betydning"', "str"],
              [","],
            ],
            [["    "], ['"intent"', "key"], [": "], ['"info"', "str"], [" }"]],
            [["]"]],
          ],
        },
        text: "Vi finder de søgninger, der giver kunder, og ser på, hvad Google belønner i resultaterne lige nu.",
        tags: [
          "Keyword research",
          "Søgeintent",
          "SERP-analyse",
          "Konkurrenter",
        ],
      },
      {
        title: "On-page og indhold",
        visual: {
          kind: "serp",
          query: "indeklima måling privat pris",
          url: "miljoekontoret.dk › indeklimamaaling",
          title: "Måling af indeklima, fra 4.800 kr.",
          description:
            "Fra 4.800 kr. inkl. moms: måling af indeklimaet i din bolig …",
          badge: "Side 1",
        },
        text: "Hver side løftes mod et tydeligt søgeord, og guides skrives ud fra kundens egen faglighed.",
        tags: [
          "Title og meta",
          "H-struktur",
          "Interne links",
          "FAQ",
          "E-E-A-T",
        ],
      },
      {
        title: "Lokal SEO",
        visual: {
          kind: "code",
          file: "schema.json",
          lines: [
            [["{"]],
            [
              ["  "],
              ['"@type"', "key"],
              [": "],
              ['"LocalBusiness"', "str"],
              [","],
            ],
            [
              ["  "],
              ['"name"', "key"],
              [": "],
              ['"Miljøkontoret"', "str"],
              [","],
            ],
            [
              ["  "],
              ['"addressLocality"', "key"],
              [": "],
              ['"Værløse"', "str"],
              [","],
            ],
            [["  "], ['"areaServed"', "key"], [": "], ['"Sjælland"', "str"]],
            [["}"]],
          ],
        },
        text: "Synlighed, når nogen søger i det område, Miljøkontoret dækker, også på kortet i Google.",
        tags: [
          "Google Business Profile",
          "NAP",
          "LocalBusiness",
          "Lokale sider",
        ],
      },
      {
        title: "GEO og AI-søgning",
        link: { href: "/services/ai-search", label: "Læs om AI-søgning" },
        visual: {
          kind: "ai",
          question: "Hvem laver miljøscreening på Sjælland?",
          answer:
            "Miljøkontoret i Værløse rådgiver om miljø og arbejdsmiljø i byggeriet og laver miljøscreeninger …",
          source: "miljoekontoret.dk",
          footer: "robots.txt · GPTBot: Allow /",
        },
        text: "Indhold struktureret, så AI-tjenester som ChatGPT kan forstå og citere det. Besøgene derfra bliver målt.",
        tags: ["GEO", "AI-crawlere", "Strukturerede svar", "AI-trafik"],
      },
      {
        title: "SEO-dashboard",
        text: "Miljøkontoret har sit eget dashboard med personligt login. Her får de indsigt i tallene fra Google, månedens mål og de indsatser, vi laver dagligt og hver måned.",
        tags: [
          "Personligt login",
          "Tal fra Google",
          "Mål og resultater",
          "Månedlige indsatser",
        ],
        visual: {
          kind: "dashboard",
          nav: ["Overblik", "Performance", "Opgaver", "Indbakke", "Strategi"],
          chartLabel: "Google-søgning",
          stats: [
            { label: "mål nået i oktober", value: "3 af 3" },
            { label: "punkter på månedens tjekliste", value: "14/14" },
          ],
        },
      },
    ],
  },
  technologies: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Headless CMS",
    "Serverless hosting",
    "Figma",
  ],
};

export default function CaseContent() {
  return <CaseStudyPage detail={detail} />;
}

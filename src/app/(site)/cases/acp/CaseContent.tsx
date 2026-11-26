"use client";

import {
  LayoutIcon,
  ArrowRightLeftIcon,
  DatabaseIcon,
  MapPinIcon,
  ShieldCheckIcon,
  BarChartIcon,
} from "lucide-react";
import CaseStudyPage, { type CaseDetail } from "@/components/CaseStudyPage";
import { cases } from "@/lib/cases";
import { getCase } from "@/lib/case-page";
import { getTestimonial } from "@/lib/testimonials";

const detail: CaseDetail = {
  base: getCase(cases, "acp"),
  year: "2026",
  hero: {
    image: "/cases/ACP-Case-Image-1600w.webp",
    srcSet:
      "/cases/ACP-Case-Image-800w.webp 800w, /cases/ACP-Case-Image-1600w.webp 1600w",
    alt: "Rengøringsmidler, svamp og børste i en kurv på et køkkenbord, klar til rengøring",
  },
  intro:
    "Ny hjemmeside og fast SEO-aftale til ACP, et rengøringsfirma i Horsens. Bygget til at blive fundet af virksomheder i lokalområdet.",
  story: {
    eyebrow: "Udgangspunktet",
    heading: "Kunderne var i Horsens.",
    headingTail: "Siden blev bare ikke vist dér.",
    paragraphs: [
      "ACP gør rent for kontorer, butikker, restauranter og byggepladser i Horsens og omegn. Ramin ville have, at flere virksomheder i området fandt ACP i Google. Den gamle side blev sjældent vist i søgeresultaterne, og forsiden var langsom på mobilen.",
      "Vores forslag var et nyt fundament og en fast SEO-aftale, så hjemmesiden og arbejdet med Google hang sammen fra første dag. Ramin valgte en klar retning: Horsens først, Aarhus som næste skridt.",
      "Den nye side gik live 4. november 2026. Alle gamle adresser sender videre til de nye sider, så intet gik tabt ved flytningen, og ACP retter selv tekster og billeder. Siden er bygget, så nye bysider kan lægges til, når ACP vil længere ud.",
    ],
    facts: [
      { value: "1,3 sek.", label: "forsidens indlæsning på mobil" },
      { value: "32", label: "gamle adresser sendt videre" },
      { value: "0", label: "fejl i teknisk gennemgang af alle 21 sider" },
      { value: "24", label: "sider med eget søgeord og søgetal" },
    ],
  },
  highlight: {
    eyebrow: "Under overfladen",
    heading: "12 af 12 krav bestået",
    paragraphs: [
      "Vi målte de samme 12 krav til en erhvervshjemmeside før og efter (Googles PageSpeed på mobil, 1. november 2026). Forsiden indlæses nu på 1,3 sekunder, ingen af de målte sider hopper under indlæsning, og tilgængeligheden scorer 100 ud af 100.",
    ],
    pillars: [
      { title: "Hurtig på mobil", text: "1,3 sekunder mod kravet på 2,5." },
      { title: "Tilgængelig", text: "100 ud af 100 på alle 10 målte sider." },
      {
        title: "Lokal SEO",
        text: "Strukturerede data fortæller Google, hvem ACP er, og hvor de arbejder.",
      },
    ],
  },
  disciplines: {
    eyebrow: "Det arbejder vi på nu",
    heading: "Vores indsatser for ACP.",
    headingTail: "Efter lanceringen, måned for måned.",
    intro:
      "Siden gik live i november 2026 sammen med en fast SEO-aftale. Det her er de indsatser, vi arbejder med lige nu.",
    items: [
      {
        title: "Teknisk SEO",
        link: { href: "/services/webudvikling", label: "Læs om webudvikling" },
        visual: {
          kind: "cwv",
          rows: [
            { label: "LCP", value: "1,3 s", pct: 94 },
            { label: "INP", value: "God", pct: 90 },
            { label: "CLS", value: "God", pct: 96 },
          ],
          stats: [
            { label: "Tilgængelighed", value: "100" },
            { label: "Krav bestået", value: "12/12" },
          ],
        },
        text: "Hastighed, indeksering og omdirigeringer holdes i orden, så Google kan læse hver side, og intet fra den gamle side går tabt.",
        tags: ["Core Web Vitals", "Omdirigeringer", "Sitemap", "Indeksering"],
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
              ['"rengøringsfirma horsens"', "str"],
              [","],
            ],
            [["    "], ['"intent"', "key"], [": "], ['"lokal"', "str"], [" },"]],
            [
              ["  { "],
              ['"q"', "key"],
              [": "],
              ['"håndværkerrengøring"', "str"],
              [","],
            ],
            [["    "], ['"intent"', "key"], [": "], ['"køb"', "str"], [" }"]],
            [["]"]],
          ],
        },
        text: "Hver side har sit eget søgeord. Vi vælger de søgninger, der giver kunder og kan vindes nu, frem for de største og sværeste.",
        tags: ["Keyword research", "Søgeintent", "Sværhedsgrad", "Search Console"],
      },
      {
        title: "On-page og indhold",
        visual: {
          kind: "serp",
          query: "rengøringsfirma horsens",
          url: "ac-p.dk",
          title: "Rengøringsfirma i Horsens · Erhvervsrengøring | ACP",
          description:
            "Erhvervsrengøring for kontorer, butikker og byggepladser i Horsens og omegn …",
          badge: "Ny titel",
        },
        text: "Titler, overskrifter og prisafsnit skrives mod de søgninger, kunderne faktisk bruger, side for side.",
        tags: ["Title og meta", "H-struktur", "Prisafsnit", "Interne links", "FAQ"],
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
            [["  "], ['"name"', "key"], [": "], ['"ACP"', "str"], [","]],
            [
              ["  "],
              ['"areaServed"', "key"],
              [": ["],
              ['"Horsens"', "str"],
              [", "],
              ['"Hedensted"', "str"],
              [","],
            ],
            [["    "], ['"Vejle"', "str"], [", "], ['"Skanderborg"', "str"], ["]"]],
            [["}"]],
          ],
        },
        text: "Horsens er base, og nabobyerne står som serviceområde på siden og i Googles data. Den gamle side blev allerede vist i flere af dem.",
        tags: ["Serviceområde", "LocalBusiness", "Nabobyer", "areaServed"],
      },
      {
        title: "Google-profil og Bing",
        visual: {
          kind: "links",
          label: "Gjort i november",
          stat: { label: "Byer og områder i Google-profilen", value: "13" },
          items: [
            "Google-profil som serviceområde-virksomhed",
            "Hovedkategori og ydelser ryddet op",
            "Nye billeder på profilen",
            "Bing Places og sitemap til Bing",
          ],
        },
        text: "Profilen i Google Maps er sat op til en virksomhed, der kører ud til kunderne, og ACP er nu også til stede i Bing.",
        tags: ["Google Business Profile", "Serviceområde", "Bing Places", "NAP"],
      },
      {
        title: "SEO-dashboard",
        text: "ACP har sit eget dashboard med personligt login. Her får Ramin indsigt i tallene fra Google, månedens mål og de indsatser, vi laver dagligt og hver måned.",
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
            { label: "mål sat for november", value: "4" },
            { label: "hurtige gevinster i planen", value: "6" },
          ],
        },
      },
    ],
  },
  deliverables: [
    {
      icon: LayoutIcon,
      title: "Ny hjemmeside",
      text: "Forside og alle undersider fra den gamle side, mobile-first.",
    },
    {
      icon: ArrowRightLeftIcon,
      title: "Omdirigeringer",
      text: "32 gamle adresser peger nu på de rigtige nye sider.",
    },
    {
      icon: DatabaseIcon,
      title: "CMS og oplæring",
      text: "ACP retter selv tekster og billeder.",
    },
    {
      icon: MapPinIcon,
      title: "Teknisk og lokal SEO",
      text: "Titler, overskrifter, sitemap og strukturerede data for Horsens og omegn.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Analytics og cookie-samtykke",
      text: "Google Analytics 4 og Search Console sat op ved lanceringen.",
    },
    {
      icon: BarChartIcon,
      title: "SEO-dashboard og fast SEO-aftale",
      text: "Søgeord, plan og indsatser samlet ét sted.",
    },
  ],
  testimonial: getTestimonial("ramin-acp"),
  testimonialAfter: "story",
  technologies: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Headless CMS",
    "Serverless hosting",
    "Google Analytics 4",
  ],
};

export default function CaseContent() {
  return <CaseStudyPage detail={detail} />;
}

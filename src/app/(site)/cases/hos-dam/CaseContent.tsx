"use client";

import {
  PaletteIcon,
  LayoutIcon,
  CalendarCheckIcon,
  DatabaseIcon,
  SearchIcon,
  BarChartIcon,
} from "lucide-react";
import CaseStudyPage, { type CaseDetail } from "@/components/CaseStudyPage";
import { cases } from "@/lib/cases";
import { getCase } from "@/lib/case-page";
import { getTestimonial } from "@/lib/testimonials";

const detail: CaseDetail = {
  base: getCase(cases, "hos-dam"),
  year: "2026",
  hero: {
    image: "/cases/HosDam-Case-Image-2400w.webp",
    srcSet:
      "/cases/HosDam-Case-Image-800w.webp 800w, /cases/HosDam-Case-Image-1600w.webp 1600w, /cases/HosDam-Case-Image-2400w.webp 2400w",
    alt: "Behandlingsbriks i et roligt lokale med sollys på væggen, kropsterapi hos Hos Dam i Brabrand",
  },
  intro:
    "Et nyt site til kropsterapi i Brabrand med eget designsystem, online booking og indhold, Hos Dam selv redigerer.",
  story: {
    eyebrow: "Udgangspunktet",
    heading: "En behandling, mange ikke kender.",
    headingTail: "Siden skulle forklare den først.",
    paragraphs: [
      "Ann-Sofie Dam tilbyder kropsterapi i Brabrand: pulserende massage med statiske tryk, der løsner spændinger og smerter. Mange har aldrig hørt om behandlingen, så hjemmesiden skulle både forklare, hvad kropsterapi er, og gøre det let at booke en tid.",
      "Vi startede med farverne. Paletten blev afprøvet sammen med Ann-Sofie, før den endte som et lille designsystem i sage og mint. Forsiden fortæller historien i rækkefølge: hvad kropsterapi er, priser, hvem der står bag, spørgsmål og svar og til sidst en tydelig vej til at booke.",
      "Siden gik live 26. oktober 2026. Ann-Sofie retter selv tekster, priser og sider, og et fast SEO-forløb bygger synligheden op måned for måned, nu også med en blog og en side om meditation.",
    ],
    facts: [
      { value: "2,0 sek.", label: "forsidens indlæsning på mobil" },
      { value: "0", label: "fejl i SEO-tjekket af det live site" },
      { value: "210", label: "søgninger om måneden på kropsterapi i Aarhus" },
      { value: "26/10", label: "gik siden live, med booking fra første dag" },
    ],
  },
  highlight: {
    eyebrow: "Under overfladen",
    heading: "Klar til Google fra dag ét",
    paragraphs: [
      "Før lanceringen fik sitet dansk sprogmarkering, strukturerede data og én tydelig hovedoverskrift pr. side. Vores SEO-tjek af det live site viste 0 fejl, og Google Analytics og Search Console var sat op fra start.",
    ],
    pillars: [
      { title: "Online booking", text: "Tider bookes direkte på sitet." },
      {
        title: "Selvredigerbart",
        text: "Tekster, priser og sider rettes direkte i CMS'et.",
      },
      {
        title: "Kontaktformular",
        text: "Beskeder lander direkte i Hos Dams indbakke.",
      },
    ],
  },
  disciplines: {
    eyebrow: "Det arbejder vi på nu",
    heading: "Vores indsatser for Hos Dam.",
    headingTail: "Efter lanceringen, måned for måned.",
    intro:
      "Siden gik live i oktober 2026 sammen med et fast SEO-forløb. Det her er de indsatser, vi arbejder med lige nu.",
    items: [
      {
        title: "Teknisk SEO",
        link: { href: "/services/webudvikling", label: "Læs om webudvikling" },
        visual: {
          kind: "cwv",
          rows: [
            { label: "LCP", value: "2,0 s", pct: 84 },
            { label: "TBT", value: "76 ms", pct: 92 },
            { label: "CLS", value: "0,002", pct: 98 },
          ],
          stats: [
            { label: "Fejl i SEO-tjek", value: "0" },
            { label: "Sider i sitemap", value: "6" },
          ],
        },
        text: "Hastighed, indeksering og strukturerede data holdes i orden, så Google kan læse og forstå hver side.",
        tags: ["Core Web Vitals", "Sitemap", "Schema.org", "Indeksering"],
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
              ['"kropsterapi aarhus"', "str"],
              [","],
            ],
            [["    "], ['"intent"', "key"], [": "], ['"lokal"', "str"], [" },"]],
            [
              ["  { "],
              ['"q"', "key"],
              [": "],
              ['"meditation for begyndere"', "str"],
              [","],
            ],
            [["    "], ['"intent"', "key"], [": "], ['"info"', "str"], [" }"]],
            [["]"]],
          ],
        },
        text: "Klinikken ligger i Brabrand, men folk søger på Aarhus. Siderne arbejder derfor med begge, og vi følger søgetallene hen over året.",
        tags: ["Keyword research", "Søgeintent", "Sæsoner", "Ubersuggest"],
      },
      {
        title: "Indhold og blog",
        visual: {
          kind: "serp",
          query: "meditation for begyndere",
          url: "hosdam.dk › blog",
          title: "Meditation for begyndere: ro indeni er noget, man træner",
          description:
            "Hvorfor føles meditation svært i starten? Kropsterapeut Ann-Sofie Dam fortæller …",
          badge: "Nyt indlæg",
        },
        text: "Bloggen og den nye side om meditation svarer på de spørgsmål, folk stiller, før de booker en behandling.",
        tags: ["Blog", "Long-tail", "Title og meta", "Interne links"],
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
              ['"HealthAndBeautyBusiness"', "str"],
              [","],
            ],
            [["  "], ['"name"', "key"], [": "], ['"Hos Dam"', "str"], [","]],
            [
              ["  "],
              ['"addressLocality"', "key"],
              [": "],
              ['"Brabrand"', "str"],
              [","],
            ],
            [["  "], ['"areaServed"', "key"], [": "], ['"Aarhus"', "str"]],
            [["}"]],
          ],
        },
        text: "Strukturerede data fortæller Google, hvem Hos Dam er, hvor klinikken ligger, og hvad behandlingerne koster.",
        tags: ["LocalBusiness", "Priser i data", "areaServed", "NAP"],
      },
      {
        title: "Måling og søgemaskiner",
        visual: {
          kind: "links",
          label: "Sat op og fulgt",
          stat: { label: "Søgemaskiner, der kender siden", value: "Google og Bing" },
          items: [
            "Search Console verificeret",
            "Google Analytics 4 med cookie-samtykke",
            "Siden meldt ind hos Bing",
            "Henvendelser vist med kilde",
          ],
        },
        text: "Vi måler, hvor de besøgende og henvendelserne kommer fra, så næste skridt bygger på tal og ikke på gæt.",
        tags: ["Search Console", "GA4", "Bing Webmaster", "Henvendelser"],
      },
      {
        title: "SEO-dashboard",
        text: "Hos Dam har sit eget dashboard med personligt login. Her får Ann-Sofie indsigt i tallene fra Google, henvendelserne og de indsatser, vi laver hver måned.",
        tags: [
          "Personligt login",
          "Tal fra Google",
          "Henvendelser",
          "Månedlige indsatser",
        ],
        visual: {
          kind: "dashboard",
          nav: ["Overblik", "Performance", "Opgaver", "Indbakke", "Strategi"],
          chartLabel: "Google-søgning",
          stats: [
            { label: "på hver henvendelse", value: "Kilde" },
            { label: "søgetal pr. ydelse året rundt", value: "Sæsoner" },
          ],
        },
      },
    ],
  },
  deliverables: [
    {
      icon: PaletteIcon,
      title: "Designsystem",
      text: "Én palette i sage og mint med kun de farver, sitet bruger.",
    },
    {
      icon: LayoutIcon,
      title: "Forside og undersider",
      text: "Kropsterapi, priser, om Ann-Sofie, spørgsmål og svar, kontakt, meditation og blog.",
    },
    {
      icon: CalendarCheckIcon,
      title: "Online booking",
      text: "En tydelig vej fra første besøg til en booket tid.",
    },
    {
      icon: DatabaseIcon,
      title: "CMS",
      text: "Alt indhold kan rettes af Hos Dam selv.",
    },
    {
      icon: SearchIcon,
      title: "SEO-fundament",
      text: "Sprog, strukturerede data, titler og overskrifter på plads før lancering.",
    },
    {
      icon: BarChartIcon,
      title: "SEO-dashboard og løbende SEO",
      text: "Søgeord, indsatser og henvendelser samlet ét sted.",
    },
  ],
  testimonial: getTestimonial("ann-sofie-hos-dam"),
  testimonialAfter: "story",
  technologies: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Headless CMS",
    "GSAP",
    "Serverless hosting",
  ],
};

export default function CaseContent() {
  return <CaseStudyPage detail={detail} />;
}

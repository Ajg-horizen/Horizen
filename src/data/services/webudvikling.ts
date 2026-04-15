import {
  LayoutIcon,
  SearchIcon,
  PenToolIcon,
  CodeIcon,
  RocketIcon,
  SmartphoneIcon,
  ZapIcon,
  ShieldCheckIcon,
  MousePointerClickIcon,
  PaletteIcon,
  LayersIcon,
  GaugeIcon,
  EyeIcon,
  ShieldIcon,
  SearchCheckIcon,
} from "lucide-react";
import type { ServicePage } from "@/lib/services";

export const webudvikling: ServicePage = {
  slug: "webudvikling",
  metadata: {
    title: "Webudvikling — Horizen",
    description:
      "Custom webudvikling med fokus på performance, skalerbarhed og teknisk eksekvering. Next.js, React og moderne web-arkitektur bygget fra bunden.",
  },
  blocks: [
    {
      type: "hero",
      eyebrow: { label: "Webudvikling", icon: LayoutIcon },
      heading: {
        lead: "Hjemmesider er blevet en commodity.",
        mutedTail: "Vi kombinerer erfaring med AI — ikke omvendt.",
      },
      body: "Uden forståelse for det tekniske fundament vil enhver hjemmeside fejle. Vi bygger på et fundament af 8+ års teknisk erfaring. Forstærket af AI til din fordel.",
      cta: { label: "Start et projekt", href: "/kontakt" },
      image: {
        src: "/graphics/Web-hero-image-marketing-google-ads.avif",
        alt: "Webudvikling af Horizen",
      },
    },
    {
      type: "sectionTOC",
      items: [
        { label: "Fundament", href: "#fundament" },
        { label: "Proces", href: "#proces" },
        { label: "Cases", href: "#cases" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      type: "techFoundation",
      id: "fundament",
      eyebrow: "Teknisk fundament",
      heading: "Det du ikke ser — men vi ser",
      body: "Vi går ned i det tekniske fundament — og det er dér, forskellen mellem en god og en dårlig hjemmeside afsløres. 98% af alle hjemmesideejere ser det aldrig. Det er også derfor så mange hjemmesider ikke performer som de burde.",
      lighthouseMetrics: [
        { label: "Performance", value: 98, icon: GaugeIcon, color: "#00b67a" },
        { label: "Accessibility", value: 100, icon: EyeIcon, color: "#6b8aed" },
        { label: "Best Practices", value: 95, icon: ShieldIcon, color: "#e8915a" },
        { label: "SEO", value: 100, icon: SearchCheckIcon, color: "#00b67a" },
      ],
    },
    {
      type: "centeredCta",
      stickyGroup: "techStack",
      eyebrow: "Gratis audit",
      heading: "Er din hjemmeside bygget til at holde?",
      body: "Vi ser det oftere og oftere efter AI er kommet — løsninger der ser fine ud på overfladen, men som teknisk ikke holder. Bygget med alt for få timer, uden nogen reel teknisk forståelse for fundamentet. Vi gennemgår din nuværende hjemmeside helt gratis og giver dig en professionel vurdering.",
      cta: { label: "Book en gratis audit", href: "/kontakt" },
    },
    {
      type: "techChecklist",
      stickyGroup: "techStack",
      eyebrow: "Under overfladen",
      heading: { lead: "Teknisk struktur", mutedTail: "skaber synlighed" },
      body: "WCAG-compliance, ren arkitektur, en kodebase der stadig virker om to år. Når de rigtige tiltag er taget fra dag ét, performer din side bedre — det er den erfaring AI ikke har.",
      chartLegend: {
        weak: "Svagt teknisk fundament",
        strong: "Stærkt teknisk fundament",
      },
      checklist: [
        "Fremtidssikret arkitektur med Next.js & React",
        "Server-side rendering for hurtigere loadtid",
        "Automatisk billedoptimering & lazy loading",
        "Semantisk HTML for bedre søgemaskinesynlighed",
        "Struktureret data (Schema.org) til rich snippets",
        "Code splitting — kun det nødvendige kode loades",
        "WCAG 2.1 AA tilgængelighed som standard",
        "Edge caching for global hastighed",
        "Responsivt design testet på 12+ enheder",
        "TypeScript for færre fejl og bedre vedligeholdelse",
      ],
    },
    {
      type: "positioning",
      stickyGroup: "techStack",
      eyebrow: "Vores tilgang",
      heading: { lead: "Standarden er hævet.", mutedTail: "Vi har hævet vores." },
      paragraphs: [
        "AI har ændret forudsætningerne. Vi har tilpasset vores proces — ikke vores ambitionsniveau. Vi investerer stadig 100–300 timer pr. projekt. Samme fundament som altid. Forskellen er hvad de timer producerer i dag.",
        "Hvor andre reducerer til 2–5 timer, bruger vi de frigjorte ressourcer på at levere eksemplarisk. Det er ikke hastighed der afgør kvalitet på lang sigt — det er viljen til at udnytte potentialet til det fuldeste.",
      ],
      stats: [
        { value: "150+", label: "Projekter leveret" },
        { value: "98%", label: "Tilfredse kunder" },
        { value: "12 år", label: "Erfaring i branchen" },
      ],
    },
    {
      type: "process",
      id: "proces",
      stickyGroup: "techStack",
      eyebrow: "Processen",
      heading: "Fra indsigt til resultat",
      body: "Ingen overraskelser. Du ved altid præcis hvad der sker, hvad der kommer, og hvornår vi rammer milepæle.",
      steps: [
        {
          step: "01",
          title: "Analyse & strategi",
          description:
            "Vi starter aldrig med design. Vi starter med at forstå — din forretning, dine kunder, dine konkurrenter. Det er her fundamentet lægges.",
          icon: SearchIcon,
          accent: "#00b67a",
          link: { href: "/marketing/seo", label: "SEO & synlighed" },
        },
        {
          step: "02",
          title: "Design & prototype",
          description:
            "Wireframes, mockups, interaktive prototyper. Du ser og godkender alt i Figma før en eneste linje kode bliver skrevet.",
          icon: PenToolIcon,
          accent: "#e8915a",
          link: { href: "/services/ui-ux-design", label: "UI/UX Design" },
        },
        {
          step: "03",
          title: "Udvikling",
          description:
            "Next.js, React, Tailwind — moderne teknologi der performer. Under 2 sekunders loadtid. Responsivt fra dag ét. Kode du ejer 100%.",
          icon: CodeIcon,
          accent: "#6b8aed",
        },
        {
          step: "04",
          title: "Launch & vækst",
          description:
            "Vi launcher ikke bare — vi overvåger, optimerer og sikrer at din side konverterer. SEO, hastighed, brugeradfærd. Vi slipper ikke før det virker.",
          icon: RocketIcon,
          accent: "#00b67a",
          link: { href: "/marketing/google-ads", label: "Google Ads" },
        },
      ],
    },
    {
      type: "deliverables",
      eyebrow: "Under overfladen",
      heading: ["Fra udgift", "til investering"],
      body: "De fleste ser kun overfladen. Vi ser det der ligger under — loadtid, sikkerhed, SEO-struktur, tilgængelighed. Det er de ting der afgør om din hjemmeside arbejder for dig, eller bare står der.",
      items: [
        { icon: SmartphoneIcon, text: "Responsivt design — mobil, tablet, desktop", bg: "bg-[#e4e8f0]", fg: "text-[#2a3550]" },
        { icon: ZapIcon, text: "Under 2s loadtid — optimeret til Core Web Vitals", bg: "bg-[#fce8db]", fg: "text-[#6b3a1f]" },
        { icon: ShieldCheckIcon, text: "SEO-fundament — metadata, sitemap, struktureret data", bg: "bg-[#e0eeec]", fg: "text-[#1f4a42]" },
        { icon: MousePointerClickIcon, text: "Konverteringsoptimeret — CTA, flow, brugerrejse", bg: "bg-[#f0ece4]", fg: "text-[#5a4a2d]" },
        { icon: PaletteIcon, text: "Unikt design — ingen templates, kun din forretning", bg: "bg-[#e8f0e4]", fg: "text-[#2d4a28]" },
        { icon: LayersIcon, text: "CMS-integration — redigér selv indhold", bg: "bg-[#ebe4f0]", fg: "text-[#3d2a50]" },
        { icon: LayoutIcon, text: "Tilgængelighed — WCAG 2.1 AA compliant", bg: "bg-[#e4e8f0]", fg: "text-[#2a3550]" },
        { icon: CodeIcon, text: "Ren kodebase — nem at vedligeholde og udvide", bg: "bg-[#2a2a2a]", fg: "text-[#f5f5f0]" },
      ],
    },
    {
      type: "featuredTestimonial",
    },
    {
      type: "cases",
      id: "cases",
      eyebrow: "Vores arbejde",
      heading: "Se det i praksis",
      cases: [
        {
          title: "Seitz",
          href: "/cases/malerfirma-seitz",
          image: "/cases/Case-image.webp",
          category: "Branding · Webdesign",
          result: "3x flere henvendelser",
        },
        {
          title: "OD Pro",
          href: "/cases/od-biler-pro",
          image: "/cases/OD-Cases-image-car.webp",
          category: "Webdesign · Udvikling",
          result: "Ny digital platform",
        },
        {
          title: "Tandsundhed Uden Grænser",
          href: "/cases/tandsundhed-uden-graenser",
          image: "/cases/Tand-sundhed-hero-image.webp",
          category: "Webdesign · NGO",
          result: "Lanceret på 3 uger",
        },
      ],
    },
    {
      type: "gradientCta",
      heading: "Det hele kunne starte her.",
      body: "Vi hører altid gerne om jeres visioner — og hvordan vi i fællesskab kan bygge dem.",
      primaryCta: { label: "Tag en snak", href: "/kontakt" },
      secondaryCta: { label: "hej@horizen.dk", href: "mailto:hej@horizen.dk" },
    },
    {
      type: "faq",
      id: "faq",
      eyebrow: "Spørgsmål",
      heading: ["Ofte stillede", "spørgsmål"],
      intro: "Har du et spørgsmål der ikke er besvaret her? Skriv til os på",
      email: "hej@horizen.dk",
      faqs: [
        {
          q: "Hvor lang tid tager det at bygge en hjemmeside?",
          a: "De fleste projekter tager 4-8 uger fra første møde til launch. Det afhænger af omfanget — en simpel brandingside er hurtigere end en platform med booking, betalingsflow og integrationer. Vi giver dig en realistisk tidsplan efter første samtale.",
        },
        {
          q: "Hvilken teknologi bygger I med?",
          a: "Vi arbejder primært med Next.js, React og Tailwind CSS — moderne teknologi der giver hurtige, skalerbare og søgemaskinevenlige hjemmesider. Til CMS bruger vi enten WordPress (headless), Sanity eller custom løsninger afhængigt af dit behov.",
        },
        {
          q: "Ejer jeg koden bagefter?",
          a: "Ja. 100%. Alt kode, alle assets, alle designs — det hele er dit. Vi står for hosting som en del af vores løsning, men du kan altid få det hele overdraget hvis du ønsker det. Vi binder dig aldrig til noget.",
        },
        {
          q: "Hvad med vedligeholdelse efter launch?",
          a: "Vi tilbyder løbende support og optimering. Men vores mål er at bygge noget der ikke kræver konstant vedligeholdelse. Ren kode, moderne teknologi og et CMS der lader dig opdatere indhold selv.",
        },
        {
          q: "Kan I hjælpe med SEO og markedsføring?",
          a: "Ja — og vi tænker det ind fra starten, ikke som en eftertanke. Semantisk HTML, struktureret data, hastighedsoptimering og konverteringsdesign er en del af hver hjemmeside vi bygger. Vi tilbyder også dedikeret SEO og Google Ads som separate services.",
        },
        {
          q: "Hvad adskiller jer fra andre bureauer?",
          a: "Vi kombinerer design, udvikling og strategi under ét tag. Du får ikke bare en flot side — du får en løsning der er bygget til at performe. Vi bruger AI til at accelerere processen, men det er erfaring og håndværk der sikrer kvaliteten. Og du ejer alt.",
        },
      ],
    },
  ],
};

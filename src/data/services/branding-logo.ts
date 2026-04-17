import {
  BrushIcon,
  SearchIcon,
  TargetIcon,
  PaletteIcon,
  FileTextIcon,
  PenToolIcon,
  TypeIcon,
  GridIcon,
  LayoutIcon,
} from "lucide-react";
import type { ServicePage } from "@/lib/services";

export const brandingLogo: ServicePage = {
  slug: "branding-logo",
  metadata: {
    title: "Branding — Horizen",
    description:
      "Holdbar visuel identitet bygget på strategi og fundament. Logo, farver, typografi, tone of voice og brandguide — design der holder.",
  },
  blocks: [
    {
      type: "hero",
      eyebrow: { label: "Branding", icon: BrushIcon },
      heading: {
        lead: "Branding starter ikke med et logo.",
        mutedTail: "Det starter med hvem I er.",
      },
      body: "Den visuelle identitet — farver, former, skrifttyper — udgør kun omkring 25% af et brand. Resten er fundament: virksomhedens værdier, kultur, løfte og retning. Når det indre er klart, skinner det igennem i alt det ydre. Vi bygger brands der starter indefra.",
      cta: { label: "Start et brandingprojekt", href: "/kontakt" },
      image: {
        src: "/graphics/Hero-image-branding-services.webp",
        alt: "Branding & Logo af Horizen",
      },
    },
    {
      type: "sectionTOC",
      items: [
        { label: "Identitet", href: "#identitet" },
        { label: "Tilgang", href: "#tilgang" },
        { label: "Proces", href: "#proces" },
        { label: "Leverancer", href: "#leverancer" },
        { label: "Cases", href: "#cases" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      type: "brandSplit",
      id: "identitet",
      eyebrow: "Under overfladen",
      heading: { lead: "Udtrykket er vigtigt.", mutedTail: "Men det er det indre der tæller." },
      paragraphs: [
        "Et godt udtryk fanger interessen. Men det er fundamentet — værdier, kultur og strategi — der holder den. Når overfladen fylder mere end substansen, mærker folk det.",
        "Hver intern beslutning påvirker jeres brand over tid.",
      ],
    },
    {
      type: "centeredCta",
      stickyGroup: "brandStack",
      eyebrow: "Klar til at kigge indad?",
      heading: "Lad os finde ud af hvad jeres brand har brug for.",
      body: "Uanset om I starter fra bunden eller vil styrke en eksisterende identitet — det begynder med en samtale. Fortæl os hvor I er, og hvor I gerne vil hen.",
      cta: { label: "Start en samtale", href: "/kontakt" },
    },
    {
      type: "techChecklist",
      stickyGroup: "brandStack",
      eyebrow: "Alt det der tager tid",
      heading: { lead: "Holdbare brands bygges", mutedTail: "på gode værdier." },
      body: "Et brand formes af hundredvis af små beslutninger — fra intern ledelse til hvordan I møder folk, svarer en mail eller håndterer en dårlig dag. Det er den slags oplevelser mennesker husker. Vi hjælper jer med at tænke det hele igennem, fra start til slut.",
      orbitItems: [
        [
          { label: "Tillid", dot: "#6BCB77" },
          { label: "Glade medarbejdere", dot: "#4ECDC4" },
          { label: "Gode ledere", dot: "#4D96FF" },
          { label: "Kultur", dot: "#FF8C42" },
          { label: "Intern kommunikation", dot: "#845EC2" },
        ],
        [
          { label: "Positionering", dot: "#67C6E3" },
          { label: "Tone of Voice", dot: "#D65DB1" },
          { label: "Målgruppe", dot: "#FFD93D" },
          { label: "Storytelling", dot: "#FF6F91" },
          { label: "Markedsstrategi", dot: "#2EC4B6" },
          { label: "Brandløfte", dot: "#00B67A" },
        ],
        [
          { label: "Logo", dot: "#A259FF" },
          { label: "Typografi", dot: "#FF6B6B" },
          { label: "Farver", dot: "#4ECDC4" },
          { label: "Ikoner", dot: "#FFD93D" },
          { label: "Fotografi", dot: "#FFC75F" },
          { label: "Kampagner", dot: "#FF8C42" },
        ],
      ],
      orbitCenterLabel: "smiley",
    },
    {
      type: "positioning",
      id: "tilgang",
      stickyGroup: "brandStack",
      eyebrow: "Det vi tror på",
      heading: { lead: "Vi har kigget indad.", mutedTail: "Til fordel for jer." },
      paragraphs: [
        "De bedste resultater opstår når mennesker har tilliden, friheden og ejerskabet. Det er ikke noget vi siger — det er noget vi tror på. Det er kernefundamentet hos Horizen.",
        "Vi tror ikke på micromanagement. Vi tror på at løfte i fællesskab og belønne nysgerrighed. Det mærkes i vores arbejde — fordi hvert projekt bærer præg af mennesker der fik plads til at være mennesker og eksperimentere.",
      ],
      reviews: {
        count: 200,
        avatars: [
          { src: "/staff/staff-jose-digital-design.jpg", alt: "José" },
          { src: "/staff/staff-Marketing-ansvarlig-Anne-Sofie.webp", alt: "Anne-Sofie" },
          { src: "/staff/staff-Web-udvikler-designer-Johanne-horizen.avif", alt: "Johanne" },
          { src: "/staff/staff-kommunikation-og-salg-Ludvig.webp", alt: "Ludvig" },
          { src: "/staff/staff-.Sebastian-Meta-facebook.jpg", alt: "Sebastian" },
          { src: "/staff/Kontor-Hund-Gurli-Web-udvikler.webp", alt: "Gurli" },
        ],
      },
    },
    {
      type: "process",
      id: "proces",
      stickyGroup: "brandStack",
      eyebrow: "Processen",
      heading: "Fra indsigt til identitet",
      body: "Vi tager jer igennem fire trin. Hvert trin bygger på det forrige, og I er med hele vejen — så det endelige resultat føles lige så meget jeres som vores.",
      steps: [
        {
          step: "01",
          title: "Research & positionering",
          description:
            "Vi dykker ned i jeres marked, konkurrenter og målgruppe. Hvem taler I til? Hvad gør I anderledes? Og hvad er det ene folk skal huske jer for?",
          icon: SearchIcon,
          accent: "#00b67a",
        },
        {
          step: "02",
          title: "Strategi & platform",
          description:
            "Vi definerer brandets fundament: værdier, personlighed, tone of voice og positionering. Det er kompasset der styrer alt visuelt arbejde.",
          icon: TargetIcon,
          accent: "#e8915a",
        },
        {
          step: "03",
          title: "Visuel identitet",
          description:
            "Logo, farver, typografi, billedstil, ikoner. Vi designer ikke isolerede elementer — vi bygger et system der hænger sammen på tværs af alle touchpoints.",
          icon: PaletteIcon,
          accent: "#6b8aed",
        },
        {
          step: "04",
          title: "Aktivering & implementering",
          description:
            "Et brand lever ikke i en PDF. Vi sikrer at identiteten tages i brug — internt i teamet og eksternt på alle touchpoints. I får alt værktøjet I skal bruge: brandguide, templates, eksempler. Men vigtigst: en fælles forståelse af hvorfor brandet er som det er.",
          icon: FileTextIcon,
          accent: "#00b67a",
        },
      ],
    },
    {
      type: "deliverables",
      id: "leverancer",
      eyebrow: "Hvad du får",
      heading: ["Alt fra strategi", "til færdigt brand"],
      body: "Et brand er mere end en fil, en guide eller et logo. Vi leverer både det synlige — og det der får brandet til at leve internt. Fra strategi og værdier til håndgribelige værktøjer I kan bruge fra dag ét.",
      items: [
        { icon: SearchIcon, text: "Brandløfte & positionering", bg: "bg-[#e4e8f0]", fg: "text-[#2a3550]" },
        { icon: TargetIcon, text: "Brandstrategi & værdier", bg: "bg-[#fce8db]", fg: "text-[#6b3a1f]" },
        { icon: PenToolIcon, text: "Logodesign — primær + varianter", bg: "bg-[#e0eeec]", fg: "text-[#1f4a42]" },
        { icon: PaletteIcon, text: "Farvepalet & typografisystem", bg: "bg-[#f0ece4]", fg: "text-[#5a4a2d]" },
        { icon: TypeIcon, text: "Tone of voice & sprogretningslinjer", bg: "bg-[#e8f0e4]", fg: "text-[#2d4a28]" },
        { icon: GridIcon, text: "Ikonografi & billedstil", bg: "bg-[#ebe4f0]", fg: "text-[#3d2a50]" },
        { icon: LayoutIcon, text: "Intern brand-workshop & onboarding", bg: "bg-[#e4e8f0]", fg: "text-[#2a3550]" },
        { icon: FileTextIcon, text: "Komplet brandguide (PDF + Figma)", bg: "bg-[#2a2a2a]", fg: "text-[#f5f5f0]" },
      ],
    },
    {
      type: "featuredTestimonial",
    },
    {
      type: "cases",
      id: "cases",
      eyebrow: "Vores arbejde",
      heading: "Identitet i praksis",
      cases: [
        {
          title: "Seitz",
          href: "/cases/malerfirma-seitz",
          image: "/cases/Case-image.webp",
          category: "Branding · Visuel Identitet",
          result: "Klart visuelt sprog",
        },
        {
          title: "OD Pro",
          href: "/cases/od-biler-pro",
          image: "/cases/OD-Cases-image-car.webp",
          category: "Branding · Webdesign",
          result: "Konsistent brand på tværs",
        },
        {
          title: "Tandsundhed Uden Grænser",
          href: "/cases/tandsundhed-uden-graenser",
          image: "/cases/Tand-sundhed-hero-image.webp",
          category: "Branding · NGO",
          result: "Troværdig visuel identitet",
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
      heading: ["Det vi", "oftest får"],
      intro: "Mangler du svar på noget? Skriv direkte til os på",
      email: "hej@horizen.dk",
      faqs: [
        {
          q: "Hvad er forskellen på et logo og et brand?",
          a: "Et logo er ét element — et brand er hele oplevelsen. Farver, stemme, stil, konsistens. Logoet er indgangen, men brandet er det folk husker.",
        },
        {
          q: "Hvor lang tid tager det?",
          a: "4–8 uger for en komplet proces. Et fokuseret logodesign kan være hurtigere. Vi aftaler en realistisk tidsplan fra start.",
        },
        {
          q: "Kan vi nøjes med et logo?",
          a: "Ja — men vi anbefaler altid minimum en farvepalet og typografivalg, så logoet har en kontekst at leve i. Et logo alene mister hurtigt sin kraft.",
        },
        {
          q: "Ejer vi filerne?",
          a: "Ja. Alt er jeres — logo i alle formater, Figma-filer, brandguide, templates. Ingen bindinger.",
        },
        {
          q: "Hvad med rebranding?",
          a: "Vi starter med at forstå hvad der virker og hvad der ikke gør. Så beholder vi det gode og skærper resten. Ikke alt behøver at starte forfra.",
        },
        {
          q: "Hvordan holder vi brandet konsistent?",
          a: "Brandguiden er jeres manual. Den dokumenterer præcis hvordan brandet bruges — så alle, fra intern til ekstern, rammer den samme tone.",
        },
      ],
    },
  ],
};

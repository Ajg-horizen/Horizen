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
      heading: { lead: "Holdbar identitet kræver", mutedTail: "mere end en god idé" },
      body: "Bag ethvert stærkt brand ligger hundredvis af små beslutninger — fra farvevalg og typografisk hierarki til tone of voice og billedstil. Det er det arbejde ingen ser, men alle mærker. Vi tager os af det hele.",
      orbitItems: [
        [
          { label: "Logodesign", dot: "#A259FF" },
          { label: "Farvepalet", dot: "#4ECDC4" },
          { label: "Typografi", dot: "#FF6B6B" },
          { label: "Ikoner", dot: "#FFD93D" },
        ],
        [
          { label: "Brand Strategy", dot: "#6BCB77" },
          { label: "Tone of Voice", dot: "#4D96FF" },
          { label: "Storytelling", dot: "#FF8C42" },
          { label: "Moodboard", dot: "#845EC2" },
          { label: "Brand Arkitektur", dot: "#F9F871" },
        ],
        [
          { label: "Brandguide", dot: "#00B67A" },
          { label: "Touchpoints", dot: "#FF6F91" },
          { label: "Positionering", dot: "#67C6E3" },
          { label: "Konsistens", dot: "#FFC75F" },
          { label: "Målgruppe", dot: "#D65DB1" },
          { label: "Konkurrentanalyse", dot: "#2EC4B6" },
        ],
      ],
      orbitCenterLabel: "Brand",
    },
    {
      type: "positioning",
      id: "tilgang",
      stickyGroup: "brandStack",
      eyebrow: "Vores tilgang",
      heading: { lead: "Vi starter aldrig med logoet.", mutedTail: "Vi starter med jer." },
      paragraphs: [
        "Før vi åbner Illustrator, bruger vi tid på at forstå jeres marked, jeres målgruppe og det der gør jer anderledes. Det er ikke et ekstra skridt — det er hele fundamentet. Et logo uden den forståelse er bare en pæn form.",
        "Processen tager tid — fra 40 til 120+ timer for en komplet brandplatform. Men det er den investering der gør forskellen mellem et brand folk glemmer og et de opsøger.",
      ],
      stats: [
        { value: "8+", label: "Års erfaring" },
        { value: "50+", label: "Brands udviklet" },
        { value: "100%", label: "Strategisk forankret" },
      ],
    },
    {
      type: "process",
      id: "proces",
      stickyGroup: "brandStack",
      eyebrow: "Processen",
      heading: "Fra indsigt til identitet",
      body: "Vi bygger ikke brands ud fra mavefornemmelse. Hvert valg er forankret i research, markedsforståelse og en klar strategi.",
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
          title: "Brandguide & aktivering",
          description:
            "Alt samlet i en dokumenteret guide med regler, eksempler og templates. Klar til at blive brugt — af jer, jeres team eller jeres samarbejdspartnere.",
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
      body: "Et brand er et system — ikke en enkelt fil. Vi leverer alle de dele der skal til for at identiteten fungerer i virkeligheden, ikke kun i en præsentation.",
      items: [
        { icon: SearchIcon, text: "Konkurrentanalyse & positionering", bg: "bg-[#e4e8f0]", fg: "text-[#2a3550]" },
        { icon: TargetIcon, text: "Brandstrategi & værdier", bg: "bg-[#fce8db]", fg: "text-[#6b3a1f]" },
        { icon: PenToolIcon, text: "Logodesign — primær + varianter", bg: "bg-[#e0eeec]", fg: "text-[#1f4a42]" },
        { icon: PaletteIcon, text: "Farvepalet & typografisystem", bg: "bg-[#f0ece4]", fg: "text-[#5a4a2d]" },
        { icon: TypeIcon, text: "Tone of voice & sprogretningslinjer", bg: "bg-[#e8f0e4]", fg: "text-[#2d4a28]" },
        { icon: GridIcon, text: "Ikonografi & billedstil", bg: "bg-[#ebe4f0]", fg: "text-[#3d2a50]" },
        { icon: LayoutIcon, text: "Templates til print & digital", bg: "bg-[#e4e8f0]", fg: "text-[#2a3550]" },
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

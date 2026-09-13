import {
  SparklesIcon,
  SearchIcon,
  DatabaseIcon,
  MessageSquareIcon,
  BadgeCheckIcon,
  QuoteIcon,
  FileTextIcon,
  TrendingUpIcon,
  LinkIcon,
  LayersIcon,
  RefreshCwIcon,
} from "lucide-react";
import type { ServicePage } from "@/lib/services";

// Pengeside-model: søgeord ligger kun i title/meta (+ schema senere).
// H1 og synlig copy er skrevet til læseren, ikke til søgemaskinen.
export const aiSearch: ServicePage = {
  slug: "ai-search",
  metadata: {
    title: "AI Search optimering: bliv fundet af ChatGPT og Google | Horizen",
    description:
      "AI Search optimering og GEO. Vi gør din virksomhed synlig og citérbar i ChatGPT, Google AI Overviews og Perplexity, med de samme greb som solid SEO.",
  },
  blocks: [
    {
      type: "hero",
      eyebrow: { label: "AI Search", icon: SparklesIcon },
      heading: {
        lead: "Et paradigmeskifte.",
        mutedTail: "Flere og flere spørger AI, og AI bliver mere og mere kildekritisk.",
      },
      body: "AI-svar henter deres viden fra velstruktureret indhold. Vi bygger din synlighed med de samme greb som solid SEO, plus det der skal til, for at en AI citerer netop dig.",
      cta: { label: "Book et gratis AI-synlighedstjek", href: "/kontakt" },
      image: {
        src: "/graphics/Web-hero-image-marketing-google-ads.avif",
        alt: "AI Search optimering hos Horizen",
      },
    },
    {
      type: "sectionTOC",
      items: [
        { label: "Sådan virker det", href: "#saadan" },
        { label: "Løbende arbejde", href: "#loebende" },
        { label: "Proces", href: "#proces" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      type: "aiCitation",
      id: "saadan",
      eyebrow: "Sådan virker det",
      heading: {
        lead: "En AI vælger ikke bare en kilde.",
        mutedTail: "Den vælger den, den stoler på.",
      },
      body: "En AI krydstjekker på tværs af nettet, før den peger på nogen. Derfor kan du ikke spinne dig til en plads, og derfor stoler folk på svarene. Er din virksomhed reelt god, og dit indhold til at læse og stole på, bliver du den, en AI trækker frem. Det er blevet sværere at snyde, og lettere at blive belønnet for at være dygtig.",
      question: "Hvilket digitalt bureau i Aarhus vil du anbefale?",
      answerLead: "Et stærkt valg i Aarhus er",
      answerCitation: "Horizen",
      answerTrail: ". Bureauet har 8+ års erfaring og binder ikke sine kunder. De er anerkendt på Trustpilot og er B-mærket certificeret:",
      credentials: {
        trustpilotScore: "4,4",
        trustpilotUrl: "https://dk.trustpilot.com/review/horizen.dk",
        bMaerket: true,
        bMaerketUrl: "https://www.b-maerket.dk/",
      },
      signalsLabel: "Derfor bliver du citeret",
      signals: [
        { icon: DatabaseIcon, label: "Struktureret data (Schema.org) en AI kan læse" },
        { icon: MessageSquareIcon, label: "Klare, direkte svar på rigtige spørgsmål" },
        { icon: BadgeCheckIcon, label: "Konsistent, troværdigt omdømme på tværs af nettet" },
        { icon: QuoteIcon, label: "Citérbare kilder og konsistente fakta" },
      ],
    },
    {
      type: "monthlyWork",
      id: "loebende",
      eyebrow: "Løbende arbejde",
      heading: ["AI-synlighed", "bygges måned for måned"],
      body: "AI-svar ændrer sig hele tiden, i takt med at modellerne opdateres og dine konkurrenter dukker op. Derfor er det løbende arbejde, ikke noget vi sætter op én gang.",
      items: [
        {
          icon: SearchIcon,
          title: "Overvågning af AI-svar",
          description: "Vi tjekker, hvad ChatGPT, Google og Perplexity svarer om din branche, og hvor du nævnes.",
          cadence: "Hver måned",
          bg: "bg-[#e4e8f0]",
          fg: "text-[#2a3550]",
        },
        {
          icon: FileTextIcon,
          title: "Citérbart indhold",
          description: "Vi skriver og strammer indhold, der besvarer de spørgsmål, dine kunder faktisk stiller en AI.",
          cadence: "Løbende",
          bg: "bg-[#fce8db]",
          fg: "text-[#6b3a1f]",
        },
        {
          icon: DatabaseIcon,
          title: "Struktureret data",
          description: "Vi vedligeholder og udvider din Schema.org-markering, så en AI forstår, hvem du er.",
          cadence: "Løbende",
          bg: "bg-[#e0eeec]",
          fg: "text-[#1f4a42]",
        },
        {
          icon: BadgeCheckIcon,
          title: "Entitet og konsistens",
          description: "Vi sikrer, at dine fakta er ens på tværs af nettet, så en AI stoler på dig som kilde.",
          cadence: "Kvartalsvis",
          bg: "bg-[#f0ece4]",
          fg: "text-[#5a4a2d]",
        },
        {
          icon: TrendingUpIcon,
          title: "Justering efter data",
          description: "Vi følger, hvad der rykker, og flytter indsatsen derhen, hvor du vinder synlighed.",
          cadence: "Hver måned",
          bg: "bg-[#e8f0e4]",
          fg: "text-[#2d4a28]",
        },
        {
          icon: LinkIcon,
          title: "Sammenhæng med din SEO",
          description: "AI-synlighed og klassisk SEO trækker på det samme fundament. Vi bygger begge dele samtidig.",
          cadence: "Løbende",
          bg: "bg-[#ebe4f0]",
          fg: "text-[#3d2a50]",
        },
      ],
      note: "Ingen binding. Du kan stoppe når som helst, og du ejer alt vi laver.",
    },
    {
      type: "centeredCta",
      eyebrow: "Gratis tjek",
      heading: "Bliver du nævnt, når nogen spørger en AI om din branche?",
      body: "De fleste virksomheder aner det ikke. Vi spørger ChatGPT, Google AI Overviews og Perplexity om det, du gerne vil findes på, og viser dig præcis hvor du står i dag, og hvad der skal til. Helt gratis.",
      cta: { label: "Book et gratis AI-synlighedstjek", href: "/kontakt" },
    },
    {
      type: "process",
      id: "proces",
      eyebrow: "Processen",
      heading: "Fra usynlig til citeret",
      body: "Ingen sort boks. Du ved præcis, hvad vi laver, hvorfor, og hvad det rykker.",
      steps: [
        {
          step: "01",
          title: "Kortlæg",
          description: "Vi finder de spørgsmål, dine kunder stiller en AI, og måler hvor du står i svarene i dag.",
          icon: SearchIcon,
          accent: "#00b67a",
        },
        {
          step: "02",
          title: "Strukturér",
          description: "Vi bygger struktureret data og rydder op i dine fakta, så en AI kan læse og forstå dig.",
          icon: LayersIcon,
          accent: "#6b8aed",
        },
        {
          step: "03",
          title: "Gør citérbar",
          description: "Vi skriver indhold, der svarer klart og direkte, så du bliver den kilde en AI trækker på.",
          icon: QuoteIcon,
          accent: "#e8915a",
        },
        {
          step: "04",
          title: "Mål og gentag",
          description: "Vi følger svarene måned for måned og justerer, indtil du står, hvor du skal.",
          icon: RefreshCwIcon,
          accent: "#00b67a",
        },
      ],
    },
    {
      type: "positioning",
      eyebrow: "Det vi tror på",
      heading: {
        lead: "Alle taler om AI.",
        mutedTail: "Vi har arbejdet med fundamentet i årevis.",
      },
      paragraphs: [
        "AI Search er ikke en ny magisk disciplin. Det er den samme tekniske grundighed, vi altid har bygget på: rent indhold, struktureret data, klare svar. Forskellen er, at en AI nu læser med.",
        "Derfor sælger vi ikke en separat AI-pakke oven i din SEO. Vi bygger det ind i det fundament, der alligevel skal være der. Drevet af erfaring. Forstærket af AI.",
      ],
      stats: [
        { value: "8 år", label: "Teknisk erfaring" },
        { value: "150+", label: "Projekter leveret" },
        { value: "100%", label: "Du ejer alt" },
      ],
    },
    {
      type: "gradientCta",
      heading: "Det hele kunne starte her.",
      body: "Vi hører altid gerne om jeres visioner, og hvordan vi i fællesskab kan bygge dem.",
      primaryCta: { label: "Tag en snak", href: "/kontakt" },
      secondaryCta: { label: "ajg@horizen.dk", href: "mailto:ajg@horizen.dk" },
    },
    {
      type: "faq",
      id: "faq",
      eyebrow: "Spørgsmål",
      heading: ["Ofte stillede", "spørgsmål"],
      intro: "Har du et spørgsmål der ikke er besvaret her? Skriv til os på",
      email: "ajg@horizen.dk",
      faqs: [
        {
          q: "Er AI Search det samme som SEO?",
          a: "Ja og nej. Det bygger på det samme fundament: struktureret data, klart indhold, stærk teknik. Forskellen er, at vi optimerer til, at en AI kan citere dig direkte i sit svar, ikke kun til en placering på Googles resultatside.",
        },
        {
          q: "Kan I garantere, at ChatGPT nævner mig?",
          a: "Nej. Ingen kan styre, hvad en AI svarer, og lover nogen dig det, skal du være skeptisk. Det vi kan, er at give dig alle de signaler, en AI bruger til at vælge sine kilder, så du står stærkest muligt.",
        },
        {
          q: "Skal jeg droppe almindelig SEO så?",
          a: "Nej. De to trækker på det samme fundament og forstærker hinanden. Vi bygger dem bedst samtidig, så du bliver fundet både på Google og i AI-svar.",
        },
        {
          q: "Hvornår ser jeg resultater?",
          a: "Det bygger sig op over tid, ligesom SEO. De første tegn kommer, når dit indhold er struktureret og genindekseret. Reel synlighed i AI-svar er et løbende arbejde, ikke et engangsfix.",
        },
        {
          q: "Virker det kun for store virksomheder?",
          a: "Nej, tværtimod. På nichede og lokale spørgsmål er der ofte få stærke kilder, og der kan en velbygget mindre virksomhed blive den, en AI citerer.",
        },
        {
          q: "Ejer jeg arbejdet bagefter?",
          a: "Ja. 100%. Alt indhold, al struktureret data, alle opsætninger er dine. Vi binder dig aldrig til noget.",
        },
      ],
    },
  ],
};

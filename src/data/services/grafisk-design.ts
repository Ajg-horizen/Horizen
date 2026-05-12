import {
  SparklesIcon,
  SearchIcon,
  PaletteIcon,
  PenToolIcon,
  TypeIcon,
  GridIcon,
  LayoutIcon,
  FileTextIcon,
  ImageIcon,
  MegaphoneIcon,
  PrinterIcon,
  LayersIcon,
} from "lucide-react";
import type { ServicePage } from "@/lib/services";

export const grafiskDesign: ServicePage = {
  slug: "grafisk-design",
  metadata: {
    title: "Grafisk Design | Horizen",
    description:
      "Plakater, kampagner, sociale medier, præsentationer og print. Grafisk design der bærer brandet videre uden at fortynde det.",
  },
  blocks: [
    {
      type: "hero",
      eyebrow: { label: "Grafisk Design", icon: SparklesIcon },
      heading: {
        lead: "Branding er strategien.",
        mutedTail: "Grafisk design er håndværket.",
      },
      body: "Vi sætter en ære i håndværket og forståelsen bag. Et design skal både fungere i pixels og i tryk, og samtidig skille sig ud i en jungle af konkurrerende materialer. Vi tænker mediet og konteksten ind fra start.",
      cta: { label: "Start et designprojekt", href: "/kontakt" },
      image: {
        src: "/graphics/subway_billboards_preview_20_7cbb4c31b1.webp",
        alt: "Grafisk design af Horizen",
      },
    },
    {
      type: "sectionTOC",
      items: [
        { label: "Udtryk", href: "#udtryk" },
        { label: "Tilgang", href: "#tilgang" },
        { label: "Proces", href: "#proces" },
        { label: "Leverancer", href: "#leverancer" },
        { label: "Cases", href: "#cases" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      type: "brandSplit",
      id: "udtryk",
      eyebrow: "Håndværket bag",
      heading: {
        lead: "Strategi er én ting.",
        mutedTail: "Det grafiske håndværk er en anden.",
      },
      paragraphs: [
        "Vi vurderer hver detalje når vi designer. Farvekombinationer, kontrast, læsbarhed, om folk med farveblindhed kan opfatte det vi skriver. Det er ikke noget vi tjekker til sidst. Det er noget vi designer ud fra.",
        "Et flot udtryk er ikke nok hvis halvdelen ikke kan læse det.",
      ],
      visual: "colorBlindTest",
    },
    {
      type: "centeredCta",
      stickyGroup: "graphicStack",
      eyebrow: "Klar til at få det visuelle på plads?",
      heading: "Lad os finde ud af hvad I har brug for.",
      body: "Uanset om det er en enkelt kampagne eller en løbende designpartner, så starter det med en samtale. Fortæl os hvor I er, og hvad I gerne vil opnå.",
      cta: { label: "Start en samtale", href: "/kontakt" },
    },
    {
      type: "techChecklist",
      stickyGroup: "graphicStack",
      eyebrow: "Alt det der tager tid",
      heading: { lead: "Et brand lever", mutedTail: "i hundredvis af formater." },
      body: "Annonce på Instagram. Roll-up til messen. Slide i en investorpræsentation. Hvert touchpoint kræver sit eget format, sit eget liv og samme grundtone. Vi tænker det hele igennem, så I ikke står med 20 forskellige udtryk når kampagnen ruller.",
      orbitItems: [
        [
          { label: "Plakater", dot: "#FF6B6B" },
          { label: "Roll-ups", dot: "#4ECDC4" },
          { label: "Flyers", dot: "#FFD93D" },
          { label: "Brochurer", dot: "#FF8C42" },
          { label: "Magasiner", dot: "#845EC2" },
          { label: "Visitkort", dot: "#67C6E3" },
        ],
        [
          { label: "Sociale medier", dot: "#D65DB1" },
          { label: "Bannerkampagner", dot: "#FFC75F" },
          { label: "Nyhedsbreve", dot: "#2EC4B6" },
          { label: "Præsentationer", dot: "#6BCB77" },
          { label: "Annoncer", dot: "#FF6F91" },
          { label: "Web-grafik", dot: "#4D96FF" },
        ],
        [
          { label: "Illustration", dot: "#A259FF" },
          { label: "Ikonografi", dot: "#FFD93D" },
          { label: "Infografik", dot: "#00B67A" },
          { label: "Motion graphics", dot: "#FF8C42" },
          { label: "Fotomanipulation", dot: "#4ECDC4" },
          { label: "Merchandise", dot: "#FF6B6B" },
        ],
      ],
      orbitCenterLabel: "smiley",
    },
    {
      type: "positioning",
      id: "tilgang",
      stickyGroup: "graphicStack",
      eyebrow: "Det vi tror på",
      heading: { lead: "Design der gør sit arbejde.", mutedTail: "Hver gang det møder folk." },
      paragraphs: [
        "Et visual skal ikke bare se godt ud i porteføljen. Det skal flytte noget i den virkelige verden: skabe genkendelse, sælge billetten, få folk til at læse videre. Vi designer med det for øje.",
        "Vi tror på at god grafisk design er håndværk. Det betyder eftertanke i typografien, omhu med detaljen og respekt for brandet. Det er ikke noget AI klarer alene. Det er der vores erfaring og øje for helheden gør forskellen.",
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
      stickyGroup: "graphicStack",
      eyebrow: "Processen",
      heading: "Fra brief til færdig fil",
      body: "Vi tager jer igennem fire trin. Hvert trin bygger på det forrige, og I er med hele vejen. Resultatet er færdige filer I kan bruge fra dag ét, og en proces der er nem at gentage næste gang.",
      steps: [
        {
          step: "01",
          title: "Brief & retning",
          description:
            "Vi starter med at forstå formålet. Hvem taler I til, hvad skal designet opnå, og hvor skal det leve? En klar brief sparer mange omveje senere.",
          icon: SearchIcon,
          accent: "#00b67a",
        },
        {
          step: "02",
          title: "Koncept & retning",
          description:
            "Vi præsenterer to til tre retninger med moodboards, typografi og første udkast. I vælger den vi bygger videre på.",
          icon: PenToolIcon,
          accent: "#e8915a",
        },
        {
          step: "03",
          title: "Design & produktion",
          description:
            "Vi designer i alle de formater I skal bruge. Print, digital, social, animation. Hvert format tilpasses sin kontekst, men bygger på samme fundament.",
          icon: PaletteIcon,
          accent: "#6b8aed",
        },
        {
          step: "04",
          title: "Levering & filer",
          description:
            "I får alt klargjort til brug: tryk-klare PDF'er, web-optimerede billeder, redigerbare filer og kildedokumenter. Ingen bindinger. Alt er jeres.",
          icon: FileTextIcon,
          accent: "#00b67a",
        },
      ],
    },
    {
      type: "deliverables",
      id: "leverancer",
      eyebrow: "Hvad du får",
      heading: ["Alt fra koncept", "til færdig fil"],
      body: "Grafisk design er sjældent én leverance. Det er en familie af materialer der spiller sammen. Vi leverer både det enkelte format og det system der gør det nemt at lave det næste.",
      items: [
        { icon: ImageIcon, text: "Plakater, flyers og print", bg: "bg-[#e8f0e4]", fg: "text-[#2d4a28]" },
        { icon: MegaphoneIcon, text: "Annoncer & kampagnemateriale", bg: "bg-[#fce8db]", fg: "text-[#6b3a1f]" },
        { icon: GridIcon, text: "Sociale medier-pakker", bg: "bg-[#e4e8f0]", fg: "text-[#2a3550]" },
        { icon: LayoutIcon, text: "Præsentationer & pitch-decks", bg: "bg-[#e0eeec]", fg: "text-[#1f4a42]" },
        { icon: PrinterIcon, text: "Tryk-klargjorte filer", bg: "bg-[#f0ece4]", fg: "text-[#5a4a2d]" },
        { icon: TypeIcon, text: "Typografi & grafiske templates", bg: "bg-[#ebe4f0]", fg: "text-[#3d2a50]" },
        { icon: LayersIcon, text: "Ikonografi, illustration & infografik", bg: "bg-[#e4e8f0]", fg: "text-[#2a3550]" },
        { icon: FileTextIcon, text: "Redigerbare kildefiler (Figma + Adobe)", bg: "bg-[#2a2a2a]", fg: "text-[#f5f5f0]" },
      ],
    },
    {
      type: "featuredTestimonial",
    },
    {
      type: "cases",
      id: "cases",
      eyebrow: "Vores arbejde",
      heading: "Design i praksis",
      cases: [
        {
          title: "BettrPlans",
          href: "/cases/bettrplans",
          image: "/cases/BettrPlans-Case-Image-01.webp",
          category: "Visuelt sprog · Webdesign",
          result: "Konsistent udtryk på tværs",
        },
        {
          title: "OD Pro",
          href: "/cases/od-biler-pro",
          image: "/cases/OD-Cases-image-car.webp",
          category: "Branding · Grafisk design",
          result: "Genkendeligt brand i alle formater",
        },
        {
          title: "Tandsundhed Uden Grænser",
          href: "/cases/tandsundhed-uden-graenser",
          image: "/cases/Tand-sundhed-hero-image.webp",
          category: "Visuel identitet · NGO",
          result: "Klar visuel kommunikation",
        },
      ],
    },
    {
      type: "gradientCta",
      heading: "Det hele kunne starte her.",
      body: "Vi hører altid gerne om jeres visioner, og hvordan vi i fællesskab kan bygge dem.",
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
          q: "Hvad er forskellen på grafisk design og branding?",
          a: "Branding er fundamentet: værdier, positionering, visuel identitet og system. Grafisk design er det daglige output der bygger på fundamentet. Plakaten, opslaget, præsentationen. Det ene uden det andet bliver enten utydeligt eller inkonsistent.",
        },
        {
          q: "Kan I lave enkeltopgaver, eller skal det være et helt forløb?",
          a: "Ja, vi tager gerne enkeltopgaver. Mange kunder starter med ét format og bygger på derfra. Vi bliver hurtigere og billigere over tid, fordi vi kender jeres udtryk.",
        },
        {
          q: "Arbejder I både i Figma og Adobe?",
          a: "Ja. Vi arbejder i det værktøj der passer opgaven bedst. Digital design og web ligger oftest i Figma. Tryksager og avanceret layout i Adobe. I får filerne i begge dele når det giver mening.",
        },
        {
          q: "Hvor hurtigt kan I levere?",
          a: "Det afhænger af opgaven. Et enkelt social-opslag kan være klar på få dage. En kampagne med flere formater tager typisk halvanden til tre uger. Vi aftaler en realistisk plan fra start.",
        },
        {
          q: "Ejer vi filerne?",
          a: "Ja. Alle leverancer, både færdige filer og redigerbare kildedokumenter, er jeres. Ingen bindinger. I kan tage dem videre til en anden eller fortsætte med os.",
        },
        {
          q: "Kan I løfte et eksisterende brand uden at lave det om?",
          a: "Ja. Vi går ind og forstår jeres nuværende udtryk, finder de steder hvor det halter, og strammer op. Ofte handler det om konsistens, ikke om at starte forfra.",
        },
      ],
    },
  ],
};

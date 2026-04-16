import {
  PenToolIcon,
  SearchIcon,
  LayoutIcon,
  ComponentIcon,
  PaletteIcon,
  TypeIcon,
  AccessibilityIcon,
  EyeIcon,
  GridIcon,
  RulerIcon,
  ContrastIcon,
  MousePointerClickIcon,
  GitBranchIcon,
  FileTextIcon,
  UsersIcon,
} from "lucide-react";
import type { ServicePage } from "@/lib/services";

export const uiUxDesign: ServicePage = {
  slug: "ui-ux-design",
  metadata: {
    title: "UI/UX Design — Horizen",
    description:
      "Strategisk UX og håndværksbåret UI. Brugerflow, hierarki, typografi og mikrointeraktioner — design der både virker og ser rigtigt ud.",
  },
  blocks: [
    {
      type: "hero",
      eyebrow: { label: "UI/UX Design", icon: PenToolIcon },
      heading: {
        lead: "UI/UX baseret på brugeradfærd og data.",
        mutedTail: "Ikke subjektive holdninger.",
      },
      body: "Brugerflow, hierarki, typografi, mikrointeraktioner — vi bygger det hele på research og adfærdsdata, ikke på fornemmelser. Det er forskellen mellem et design der ser godt ud, og et der rent faktisk virker.",
      cta: { label: "Start et designprojekt", href: "/kontakt" },
      image: {
        src: "/graphics/Hero-image-UI-UX-servies-hands.webp",
        alt: "UI/UX Design af Horizen",
      },
    },
    {
      type: "sectionTOC",
      items: [
        { label: "Designsystem", href: "#system" },
        { label: "Proces", href: "#proces" },
        { label: "Cases", href: "#cases" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      type: "uxVsUi",
      id: "system",
      eyebrow: "Under overfladen",
      heading: { lead: "Godt design er bygget på to lag.", mutedTail: "Det\u00A0ene\u00A0ser\u00A0du\u00A0aldrig." },
      body: "Research viser, at korrekt UX kan forbedre konverteringen med op til 400%. Alligevel er det fortsat sjældent at løsninger bliver bygget på egentlig research — selv når professionelle er sat på opgaven. Resultatet bliver designet på subjektive holdninger og oftest til virksomheden selv fremfor slutbrugeren. Det er den mest kritiske fejl vi ser gang på gang — og AI har kun gjort den hyppigere.",
      uxCaption:
        "UX er der, hvor flowet dikteres og hierarkiet bestemmes — hvad brugeren møder hvornår, og om brugerrejsen overhovedet holder. UX'en er afgørende for en struktureret proces og succes.",
      uiCaption:
        "Udtrykket oven på strukturen. UI'en er typografi, farver, komponenter og mikrointeraktioner — det brugeren faktisk mærker.",
      uxReadMoreLink: {
        href: "/blog/hvad-er-ux-design",
        label: "Lær mere om UX",
      },
      uiReadMoreLink: {
        href: "/blog/hvad-er-ui-design",
        label: "Lær mere om UI",
      },
    },
    {
      type: "centeredCta",
      stickyGroup: "designStack",
      eyebrow: "Gratis design-audit",
      heading: "Er din side bygget på rigtige designprincipper, eller er den bare bygget?",
      body: "AI har gjort det muligt for alle at bygge en standardside — og hermed hævet barren for, hvad professionelt betyder. Det er blevet sværere end nogensinde at skelne mellem professionelt og AI-slup.\n\nDerfor tilbyder vi en gratis audit, hvor vi vurderer om din side er bygget på de rette UI/UX-principper, og om det tekniske fundament er holdbart.",
      cta: { label: "Book en gratis design-audit", href: "/kontakt" },
    },
    {
      type: "techChecklist",
      stickyGroup: "designStack",
      eyebrow: "Fundamentet for succes",
      heading: { lead: "Strukturerede processer for UI/UX", mutedTail: "skaber engagement" },
      body: "Det meste af det arbejde der adskiller et professionelt produkt fra et tilfældigt, sker før den første pixel tegnes. Research, informationsarkitektur, brugerflows, hierarki — det er de beslutninger der fjerner friktion fra både processen og brugerrejsen. Vi tager de skridt, fordi vi ved det er dem der flytter resultatet.",
    },
    {
      type: "positioning",
      stickyGroup: "designStack",
      eyebrow: "Vores tilgang",
      heading: { lead: "UX er strategi.", mutedTail: "UI er håndværk. Vi gør begge dele." },
      paragraphs: [
        "UI og UX er to sider af samme mønt — men de bliver sjældent behandlet sådan. Vi insisterer på at strategi og æstetik arbejder sammen fra dag ét. Det er den kobling der gør et projekt holdbart og fremtidssikret.",
        "En grundig designfase kan nemt løbe op i 60–150 timer alene — det er den mængde research og iteration større projekter kræver for at ramme rigtigt. Omfanget tilpasses altid projekt og budget, men princippet er det samme: jo stærkere fundamentet er, jo bedre performer løsningen.",
      ],
      stats: [
        { value: "8+", label: "Års erfaring" },
        { value: "21", label: "UI/UX-principper i fundamentet" },
        { value: "100%", label: "Research-baseret" },
      ],
    },
    {
      type: "process",
      id: "proces",
      stickyGroup: "designStack",
      eyebrow: "Processen",
      heading: "Fra research til pixels",
      body: "Vi designer ikke i vakuum. Hver beslutning forankres i brugerdata, forretningsmål og det tekniske fundament siden skal bygges på.",
      steps: [
        {
          step: "01",
          title: "Research & UX-strategi",
          description:
            "Bruger-interviews, konkurrentanalyse, eksisterende data. Vi finder ud af hvem brugeren er, hvad de prøver at opnå — og hvor de bliver bremset i dag.",
          icon: SearchIcon,
          accent: "#00b67a",
          link: { href: "/marketing/seo", label: "Bruger-research" },
        },
        {
          step: "02",
          title: "Wireframes & arkitektur",
          description:
            "Informationshierarki, navigation, brugerflow. Først når strukturen står, begynder vi at tale om visuel form. Det er en bevidst rækkefølge — fordi struktur er det UI'en skal bære.",
          icon: LayoutIcon,
          accent: "#e8915a",
        },
        {
          step: "03",
          title: "UI design & system",
          description:
            "Typografi, farver, komponenter, mikrointeraktioner. Vi bygger ikke skærme — vi bygger et system som skærmene rendres ud fra. Konsistens by design, ikke by ulykke.",
          icon: PenToolIcon,
          accent: "#6b8aed",
        },
        {
          step: "04",
          title: "Prototype & handoff",
          description:
            "Interaktive Figma-prototyper, dokumenterede tokens, tilgængeligheds-noter. Udviklerne får alt de skal bruge for at bygge præcis det vi har designet.",
          icon: GitBranchIcon,
          accent: "#00b67a",
          link: { href: "/services/webudvikling", label: "Webudvikling" },
        },
      ],
    },
    {
      type: "deliverables",
      eyebrow: "Hvad du får",
      heading: ["Fra første sketch", "til siste handoff"],
      body: "UI/UX er ikke ét leverance — det er en kæde af artefakter der bygger på hinanden. Vi leverer hele kæden, ikke kun de pæne mockups til sidst.",
      items: [
        { icon: UsersIcon, text: "Bruger-research & personas", bg: "bg-[#e4e8f0]", fg: "text-[#2a3550]" },
        { icon: GridIcon, text: "Informationsarkitektur & flows", bg: "bg-[#fce8db]", fg: "text-[#6b3a1f]" },
        { icon: LayoutIcon, text: "Wireframes — low til mid fidelity", bg: "bg-[#e0eeec]", fg: "text-[#1f4a42]" },
        { icon: PenToolIcon, text: "Hi-fi UI design i Figma", bg: "bg-[#f0ece4]", fg: "text-[#5a4a2d]" },
        { icon: ComponentIcon, text: "Designsystem — tokens, komponenter, varianter", bg: "bg-[#e8f0e4]", fg: "text-[#2d4a28]" },
        { icon: MousePointerClickIcon, text: "Interaktiv prototype til test", bg: "bg-[#ebe4f0]", fg: "text-[#3d2a50]" },
        { icon: ContrastIcon, text: "Tilgængeligheds-noter (WCAG 2.1 AA)", bg: "bg-[#e4e8f0]", fg: "text-[#2a3550]" },
        { icon: FileTextIcon, text: "Dev-handoff dokumentation", bg: "bg-[#2a2a2a]", fg: "text-[#f5f5f0]" },
      ],
    },
    {
      type: "featuredTestimonial",
    },
    {
      type: "cases",
      id: "cases",
      eyebrow: "Vores arbejde",
      heading: "Designet i praksis",
      cases: [
        {
          title: "Seitz",
          href: "/cases/malerfirma-seitz",
          image: "/cases/Case-image.webp",
          category: "Branding · UI Design",
          result: "Klart visuelt sprog",
        },
        {
          title: "OD Pro",
          href: "/cases/od-biler-pro",
          image: "/cases/OD-Cases-image-car.webp",
          category: "UX · Webdesign",
          result: "Strømlinet bookingflow",
        },
        {
          title: "Tandsundhed Uden Grænser",
          href: "/cases/tandsundhed-uden-graenser",
          image: "/cases/Tand-sundhed-hero-image.webp",
          category: "UX · NGO",
          result: "Tilgængeligt designsystem",
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
          q: "Hvad er forskellen på UX og UI?",
          a: "UX (user experience) handler om hvordan noget fungerer — flow, struktur, beslutninger brugeren skal træffe. UI (user interface) handler om hvordan det ser ud — typografi, farver, komponenter. UX uden UI bliver kedeligt og overset. UI uden UX bliver flot og ubrugeligt. Vi laver begge dele, fordi de afhænger af hinanden.",
        },
        {
          q: "Hvor lang tid tager designfasen?",
          a: "Som regel 3–6 uger fra research til klar Figma-fil, afhængigt af projektets omfang. En simpel landingsside er hurtigere end et fuldt produktdesign med flere flows. Vi giver dig en realistisk tidsplan efter første samtale.",
        },
        {
          q: "Bruger I en bestemt designmetode?",
          a: "Vi læner os op ad Atomic Design og Brad Frost-tilgangen til komponenter, men vi er ikke metodefundamentalister. Vores rygrad er research → wireframe → UI → prototype → handoff. Det fungerer på tværs af projekttyper.",
        },
        {
          q: "Får jeg adgang til Figma-filerne?",
          a: "Ja. Du ejer alle designfiler, alle komponenter, alle tokens. Du kan fortsætte arbejdet selv eller med en anden designer hvis du vil. Vi binder dig aldrig til os.",
        },
        {
          q: "Bygger I et designsystem fra bunden hver gang?",
          a: "Vi bygger altid med et systematisk udgangspunkt — tokens, komponenter, varianter. Hvor avanceret systemet bliver afhænger af projektet. En simpel landingsside får et let system. Et SaaS-produkt får et fuldt design system med dokumentation.",
        },
        {
          q: "Tester I designet med rigtige brugere?",
          a: "Når det giver mening, ja — usability tests, A/B-tests, eller bare uformelle samtaler med relevante brugere. Vi anbefaler det især på produkter med komplekse flows. På mindre projekter er det ofte unødvendigt.",
        },
      ],
    },
  ],
};

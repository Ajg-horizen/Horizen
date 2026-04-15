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
      type: "designTokens",
      id: "system",
      eyebrow: "Designsystem",
      heading: "Det der gør designet konsistent",
      body: "Et godt interface er ikke ét godt skærmbillede — det er hundrede skærmbilleder der hænger sammen. Tokens, typografi, spacing og komponenter skaber den konsistens som brugere kan stole på, og som udviklere kan bygge videre på.",
      maturityScores: [
        { label: "Token-coverage", value: 100, icon: PaletteIcon, color: "#00b67a" },
        { label: "Komponenter", value: 96, icon: ComponentIcon, color: "#6b8aed" },
        { label: "Typografi", value: 100, icon: TypeIcon, color: "#e8915a" },
        { label: "Tilgængelighed", value: 100, icon: AccessibilityIcon, color: "#00b67a" },
      ],
    },
    {
      type: "centeredCta",
      stickyGroup: "designStack",
      eyebrow: "Gratis design-audit",
      heading: "Hvor meget taber du på et middelmådigt interface?",
      body: "De fleste interfaces er ikke decideret dårlige — de er bare ligegyldige. Det er ofte værre. Vi gennemgår dit nuværende design, peger på hvor brugere falder fra, og viser hvad der konkret kan ændres for at flytte tallene.",
      cta: { label: "Book en gratis design-audit", href: "/kontakt" },
    },
    {
      type: "techChecklist",
      stickyGroup: "designStack",
      eyebrow: "Det der bliver overset",
      heading: { lead: "God UX skaber", mutedTail: "engagement" },
      body: "Hierarki, læsbarhed, tilgængelighed, mikrointeraktioner. Ord der lyder som detaljer indtil du ser hvad de gør ved konverteringen. AI laver okay flows, men det er øjet og erfaringen der skaber det interface brugere faktisk bruger.",
      chartLabel: "Engagement over tid",
      chartLegend: {
        weak: "Generisk interface",
        strong: "Designet til formål",
      },
      checklist: [
        "Brugerresearch der informerer hver designbeslutning",
        "Informationshierarki der peger øjet det rigtige sted",
        "Typografisk skala bygget på matematisk forhold",
        "Spacing-system baseret på 4px grid",
        "Komponentbibliotek med varianter og states",
        "Tilgængelighed (WCAG 2.1 AA) tænkt fra første mockup",
        "Mikrointeraktioner der bekræfter brugerens handlinger",
        "Loading- og fejlstates som en del af designet",
        "Responsivt design — ikke skaleret, men gentænkt",
        "Dev-handoff i Figma med tokens og dokumentation",
      ],
    },
    {
      type: "positioning",
      stickyGroup: "designStack",
      eyebrow: "Vores tilgang",
      heading: { lead: "UX er strategi.", mutedTail: "UI er håndværk. Vi gør begge dele." },
      paragraphs: [
        "Mange bureauer leverer det ene eller det andet — enten flow-diagrammer uden visuel sans, eller flotte mockups uden forretningstanke. Vi behandler UI og UX som to sider af samme mønt: research informerer pixels, og pixels respekterer research.",
        "Vi bruger 60–150 timer på designfasen alene, alt efter omfang. Det lyder af meget. Det er det også. Men det er den investering der gør forskellen mellem et design der ser fint ud i pitch-decket og et design der bliver brugt hver dag uden friktion.",
      ],
      stats: [
        { value: "120+", label: "Designs leveret" },
        { value: "44px", label: "Min. touch target" },
        { value: "WCAG", label: "2.1 AA standard" },
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
            "Informationshierarki, navigation, brugerflow. Først når strukturen står, begynder vi at tale om visuel form. Mange spring direkte til UI — det er typisk her det går galt.",
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
            "Interaktive Figma-prototyper, dokumenterede tokens, tilgængeligheds-noter. Udviklerne får alt de skal bruge for at bygge det vi har designet — ikke en fortolkning.",
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
      type: "uxLaws",
      eyebrow: "Evidensbaseret design",
      heading: {
        lead: "Principper,",
        mutedTail: "ikke fornemmelser.",
      },
      body: "Vi arbejder efter veldokumenterede love om kognition og adfærd — ikke efter hvad der lige føles rigtigt. Her er fire af dem vi bruger hver dag, og hvordan de oversætter til konkrete designvalg.",
      laws: [
        {
          abbr: "Hick",
          name: "Hick's Law",
          definition:
            "Jo flere valgmuligheder du giver, jo længere tid tager brugeren om at beslutte sig — eller lader være.",
          application:
            "Vi reducerer valg i navigation, formularer og CTA-områder. Progressive disclosure frem for at proppe alt på én skærm.",
          accent: "#00b67a",
        },
        {
          abbr: "Fitts",
          name: "Fitts's Law",
          definition:
            "Tiden det tager at ramme et mål afhænger af dets størrelse og afstand. Små, fjerne knapper koster klik.",
          application:
            "Minimum 44×44px touch targets. Primære CTA'er får plads. Vigtige handlinger ligger tæt på hvor øjet i forvejen er.",
          accent: "#6b8aed",
        },
        {
          abbr: "Jakob",
          name: "Jakob's Law",
          definition:
            "Brugere bruger mere tid på andre sites end dit. De forventer at dit virker på samme måde.",
          application:
            "Vi genopfinder ikke hjulet. Konventioner der virker bliver brugt — innovation sker hvor det skaber reel værdi, ikke for showets skyld.",
          accent: "#e8915a",
        },
        {
          abbr: "Miller",
          name: "Miller's Law",
          definition:
            "Den gennemsnitlige bruger kan holde cirka 7 (±2) ting i arbejdshukommelsen ad gangen.",
          application:
            "Vi chunker information, begrænser felter i formularer, og grupperer relateret indhold så brugeren ikke skal bære hele skærmen i hovedet.",
          accent: "#c9a227",
        },
      ],
      sourceNote:
        "Inspireret af lawsofux.com og Nielsen Norman Group. Anvendt i praksis, ikke citeret i PDF'er.",
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
      heading: "Skal vi tegne det sammen?",
      body: "Vi laver ikke kun design der ser godt ud i en presentation. Vi laver design der bliver brugt. Lad os tale om hvad du har brug for.",
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

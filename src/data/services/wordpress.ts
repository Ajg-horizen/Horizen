import {
  LayoutIcon,
  SearchIcon,
  ShieldCheckIcon,
  RefreshCwIcon,
  DatabaseIcon,
  ZapIcon,
  WrenchIcon,
  GaugeIcon,
  FileTextIcon,
  AlertTriangleIcon,
} from "lucide-react";
import type { ServicePage } from "@/lib/services";

export const wordpress: ServicePage = {
  slug: "wordpress",
  metadata: {
    title: "WordPress support & vedligehold | Horizen",
    description:
      "Vi tager over hvor andre slap. Sikkerhed, opdateringer, backup, performance og småfejl. Din WordPress-side skal være klar når kunden kommer forbi.",
  },
  blocks: [
    {
      type: "hero",
      eyebrow: { label: "WordPress", icon: LayoutIcon },
      heading: {
        lead: "WordPress driver over 40% af alle hjemmesider.",
        mutedTail: "De færreste får det fulde potentiale ud.",
      },
      body: "WordPress er fleksibel og kraftfuld, men også kompleks. Selv etablerede virksomheder bruger den forkert: tunge billeder, langsom opsætning, plugins der hober sig op. Vi vurderer hver case for sig og leverer rådgivning, support eller en helt ny løsning hvis det er det rigtige.",
      cta: { label: "Få et gratis WordPress-tjek", href: "/kontakt" },
      image: {
        src: "/graphics/Hero-image-wordpress-service.webp",
        alt: "WordPress support og vedligehold af Horizen",
      },
    },
    {
      type: "sectionTOC",
      items: [
        { label: "Tilstand", href: "#tilstand" },
        { label: "Tilgang", href: "#tilgang" },
        { label: "Proces", href: "#proces" },
        { label: "Leverancer", href: "#leverancer" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      type: "brandSplit",
      id: "tilstand",
      eyebrow: "Under overfladen",
      heading: {
        lead: "De fleste WordPress-sider er bygget på plugins.",
        mutedTail: "Ikke på et ordentligt fundament.",
      },
      paragraphs: [
        "En af de største tendenser i WordPress lige nu er at folk installerer plugins når de ikke selv kan løse problemet. Mange af dem er tunge og dårligt kodet, og de trækker hele siden ned. Både i hastighed og hos Google.",
        "Det vi gør, er at gå ind og kigge på hvad der er nødvendigt. Nice to have eller need to have? Og hvor det giver mening, bygger vi løsningen custom fra bunden i stedet for endnu et tungt plugin.",
      ],
      visual: "wordpressChaos",
    },
    {
      type: "centeredCta",
      stickyGroup: "wpStack",
      eyebrow: "Får jeres side den opmærksomhed den fortjener?",
      heading: "Få et gratis sundhedstjek af jeres WordPress.",
      body: "Vi kigger på sikkerhed, performance, opdateringer og backup. I får en kort rapport med konkrete anbefalinger. Ingen forpligtelse.",
      cta: { label: "Book et tjek", href: "/kontakt" },
    },
    {
      type: "techChecklist",
      stickyGroup: "wpStack",
      eyebrow: "Alt det der kan gå galt",
      heading: {
        lead: "WordPress er fleksibel.",
        mutedTail: "Det er også grunden til at den knækker.",
      },
      body: "Plugins der ikke følger med. Themes der overskriver opdateringer. PHP-versioner der udløber. Backups der aldrig blev testet. Det meste opdager man først når noget er gået galt. Vi holder øje løbende.",
      orbitItems: [
        [
          { label: "Plugin-konflikter", dot: "#FF6B6B" },
          { label: "PHP-versioner", dot: "#4ECDC4" },
          { label: "Theme-opdateringer", dot: "#FFD93D" },
          { label: "Database-vækst", dot: "#FF8C42" },
          { label: "Caching-fejl", dot: "#845EC2" },
          { label: "Mediebibliotek", dot: "#67C6E3" },
        ],
        [
          { label: "Sikkerhedshuller", dot: "#D65DB1" },
          { label: "Brute force-angreb", dot: "#FFC75F" },
          { label: "Spam-kommentarer", dot: "#2EC4B6" },
          { label: "Malware-injektion", dot: "#6BCB77" },
          { label: "SSL-certifikater", dot: "#FF6F91" },
          { label: "GDPR-compliance", dot: "#4D96FF" },
        ],
        [
          { label: "Backup", dot: "#A259FF" },
          { label: "Uptime-monitorering", dot: "#FFD93D" },
          { label: "Performance", dot: "#00B67A" },
          { label: "SEO-tjek", dot: "#FF8C42" },
          { label: "Søgekonsol", dot: "#4ECDC4" },
          { label: "Loghåndtering", dot: "#FF6B6B" },
        ],
      ],
      orbitCenterLabel: "smiley",
    },
    {
      type: "positioning",
      id: "tilgang",
      stickyGroup: "wpStack",
      eyebrow: "Set i praksis",
      heading: {
        lead: "Rutinen er det der gør forskellen.",
        mutedTail: "Det er sjældent platformen.",
      },
      paragraphs: [
        "Vi har set alle slags WordPress-sider gennem årene. Hos større virksomheder hvor opsætningen er forkert fra start. Hos professionelle bureauer hvor vi har taget over for at løfte niveauet. WordPress er sjældent problemet. Det er oftest manglen på strukturerede rutiner og best practice.",
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
      stickyGroup: "wpStack",
      eyebrow: "Processen",
      heading: "Fra overtagelse til løbende drift",
      body: "Vi starter med at forstå hvad I har. Derefter stabiliserer vi, dokumenterer, og overtager driften. I får ro i maven, vi får styr på fundamentet.",
      steps: [
        {
          step: "01",
          title: "Audit & overlevering",
          description:
            "Vi gennemgår siden: plugins, theme, hosting, sikkerhed, backup, ydeevne. I får en konkret rapport med hvad der er kritisk, vigtigt og kosmetisk.",
          icon: SearchIcon,
          accent: "#00b67a",
        },
        {
          step: "02",
          title: "Stabilisering",
          description:
            "Vi rydder op i det værste. Forældede plugins skiftes, sikkerhedshuller lukkes, backup verificeres, og PHP-versionen opdateres. Siden får et sundt grundlag.",
          icon: WrenchIcon,
          accent: "#e8915a",
        },
        {
          step: "03",
          title: "Drift & overvågning",
          description:
            "Vi tager løbende ansvar for opdateringer, sikkerhedstjek, backup-verifikation og uptime-overvågning. I bliver kun forstyrret når noget kræver jeres beslutning.",
          icon: GaugeIcon,
          accent: "#6b8aed",
        },
        {
          step: "04",
          title: "Forbedring over tid",
          description:
            "Når basis kører stabilt, kigger vi fremad: performance, SEO, ny funktionalitet, brugeroplevelse. Vi bygger på i takt med jeres forretning, ikke modsat.",
          icon: ZapIcon,
          accent: "#00b67a",
        },
      ],
    },
    {
      type: "deliverables",
      id: "leverancer",
      eyebrow: "Hvad du får",
      heading: ["Hele driften", "samlet ét sted"],
      body: "WordPress-vedligehold er sjældent én ting. Det er en række opgaver der spiller sammen. Vi tager dem alle, så I ikke skal jonglere mellem hosting-support, bureau og freelancer.",
      items: [
        { icon: ShieldCheckIcon, text: "Sikkerhedstjek & opdateringer", bg: "bg-[#e8f0e4]", fg: "text-[#2d4a28]" },
        { icon: RefreshCwIcon, text: "Plugin- og theme-opdateringer", bg: "bg-[#fce8db]", fg: "text-[#6b3a1f]" },
        { icon: DatabaseIcon, text: "Backup & gendannelse", bg: "bg-[#e4e8f0]", fg: "text-[#2a3550]" },
        { icon: GaugeIcon, text: "Uptime- og performance-overvågning", bg: "bg-[#e0eeec]", fg: "text-[#1f4a42]" },
        { icon: AlertTriangleIcon, text: "Fejlrettelser & support", bg: "bg-[#f0ece4]", fg: "text-[#5a4a2d]" },
        { icon: ZapIcon, text: "Hastighedsoptimering", bg: "bg-[#ebe4f0]", fg: "text-[#3d2a50]" },
        { icon: FileTextIcon, text: "Månedlig statusrapport", bg: "bg-[#e4e8f0]", fg: "text-[#2a3550]" },
        { icon: WrenchIcon, text: "Adgang til vores team", bg: "bg-[#2a2a2a]", fg: "text-[#f5f5f0]" },
      ],
    },
    {
      type: "featuredTestimonial",
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
          q: "Kan I overtage en side I ikke selv har bygget?",
          a: "Ja. Det er faktisk det vi gør oftest. Vi starter med en audit, finder ud af hvad der er på siden, og overtager driften derfra. I behøver ikke at have alt dokumenteret. Vi finder ud af det.",
        },
        {
          q: "Bygger I også nye WordPress-sider?",
          a: "Ja, men ofte anbefaler vi en moderne stack frem for WordPress hvis I starter fra bunden. Hvis I har gode grunde til at vælge WordPress (fx eksisterende redaktører, plugins, integrationer), så bygger vi gerne fra bunden med fokus på vedligeholdbarhed.",
        },
        {
          q: "Hvor meget koster det at få jer på?",
          a: "Det afhænger af sidens størrelse og kompleksitet. En lille virksomhedsside ligger typisk omkring 1500 kr./md., en webshop eller stor side højere. Vi giver altid et fast bud efter en gratis audit.",
        },
        {
          q: "Hvad sker der hvis siden går ned?",
          a: "Vi har monitorering på sider vi vedligeholder, så vi bliver typisk advaret før jer. Vi har backup vi har testet, og kan rulle tilbage hvis det er nødvendigt. I bliver kontaktet med status så snart vi ved hvad der er sket.",
        },
        {
          q: "Hvad nu hvis I ikke kan løse problemet?",
          a: "Vi siger det. Vi tager kontakt til hosting eller plugin-udvikler, og holder jer opdaterede. Vi gemmer aldrig dårlige nyheder for at se gode ud.",
        },
        {
          q: "Kan vi skifte væk fra jer hvis vi vil?",
          a: "Ja. I har alt adgangen, koden og dokumentationen fra dag ét. Vi laver en ordentlig overlevering hvis I går videre. Ingen bindinger, ingen overraskelser.",
        },
      ],
    },
  ],
};

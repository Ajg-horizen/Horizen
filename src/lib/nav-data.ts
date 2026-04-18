import {
  PenToolIcon,
  LayoutIcon,
  PaletteIcon,
  BrushIcon,
  ShoppingCartIcon,
  CodeIcon,
  TargetIcon,
  SearchIcon,
  ShareIcon,
  MailIcon,
  BarChartIcon,
  BotIcon,
  CpuIcon,
  WorkflowIcon,
  SearchCheckIcon,
  GraduationCapIcon,
  PlayCircleIcon,
  NewspaperIcon,
  LightbulbIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

export const services: NavItem[] = [
  {
    title: "Webudvikling",
    description: "Performant kode og teknisk eksekvering",
    href: "/services/webudvikling",
    icon: CodeIcon,
  },
  {
    title: "UI/UX Design",
    description: "Brugervenlige interfaces og oplevelser",
    href: "/services/ui-ux-design",
    icon: PenToolIcon,
  },
  {
    title: "Branding",
    description: "Strategi, positionering og identitet der holder",
    href: "/services/branding-logo",
    icon: BrushIcon,
  },
  {
    title: "Grafisk Design",
    description: "Print, digital og social kommunikation",
    href: "/services/grafisk-design",
    icon: PaletteIcon,
  },
  {
    title: "Webshop",
    description: "Online butikker der sælger",
    href: "/services/webshop",
    icon: ShoppingCartIcon,
  },
  {
    title: "WordPress",
    description: "Fleksible CMS-løsninger du selv kan redigere",
    href: "/services/wordpress",
    icon: LayoutIcon,
  },
];

export const marketing: NavItem[] = [
  {
    title: "Google Ads",
    description: "Målrettet annoncering der rammer",
    href: "/marketing/google-ads",
    icon: TargetIcon,
  },
  {
    title: "SEO",
    description: "Synlighed i søgeresultater",
    href: "/marketing/seo",
    icon: SearchIcon,
  },
  {
    title: "AI Search (GEO/AIO)",
    description: "Optimering til AI-drevne søgemaskiner",
    href: "/marketing/ai-search-optimization",
    icon: SearchCheckIcon,
  },
  {
    title: "Social Media",
    description: "Strategi og indhold til sociale medier",
    href: "/marketing/social-media",
    icon: ShareIcon,
  },
  {
    title: "Email Marketing",
    description: "Nyhedsbreve der konverterer",
    href: "/marketing/email-marketing",
    icon: MailIcon,
  },
  {
    title: "Analytics & Tracking",
    description: "Data-drevet optimering",
    href: "/marketing/analytics",
    icon: BarChartIcon,
  },
];

export const ai: NavItem[] = [
  {
    title: "AI Automatisering",
    description: "Automatiser workflows og processer",
    href: "/ai/automatisering",
    icon: WorkflowIcon,
    badge: "Kommer snart",
  },
  {
    title: "AI Integration",
    description: "Integrer AI i dine eksisterende systemer",
    href: "/ai/integration",
    icon: CpuIcon,
    badge: "Kommer snart",
  },
  {
    title: "AI Assistenter",
    description: "AI-assistenter bygget til din virksomhed",
    href: "/ai/assistenter",
    icon: BotIcon,
    badge: "Kommer snart",
  },
];

export const resources: NavItem[] = [
  {
    title: "Kurser & Workshops",
    description: "Lær webdesign, SEO og branding",
    href: "/ressourcer/kurser",
    icon: GraduationCapIcon,
    badge: "Kommer snart",
  },
  {
    title: "Blog & Nyheder",
    description: "Seneste nyt og trends fra branchen",
    href: "/blog",
    icon: NewspaperIcon,
  },
  {
    title: "Tips & Tricks",
    description: "Praktiske råd til din digitale strategi",
    href: "/ressourcer/tips-og-tricks",
    icon: LightbulbIcon,
    badge: "Kommer snart",
  },
  {
    title: "Video Tutorials",
    description: "On-demand guides og walkthroughs",
    href: "/ressourcer/video-tutorials",
    icon: PlayCircleIcon,
    badge: "Kommer snart",
  },
];

export const navCategories = [
  { label: "Web & Design", items: services },
  { label: "Marketing", items: marketing },
  { label: "AI", items: ai },
  { label: "Ressourcer", items: resources },
];

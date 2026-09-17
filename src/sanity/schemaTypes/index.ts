import { seoSnapshot } from "./documents/seo-snapshot";
import { servicePage } from "./documents/service-page";
import { aiCitation } from "./blocks/ai-citation";
import { centeredCta } from "./blocks/centered-cta";
import { faq } from "./blocks/faq";
import { gradientCta } from "./blocks/gradient-cta";
import { hero } from "./blocks/hero";
import { monthlyWork } from "./blocks/monthly-work";
import { positioning } from "./blocks/positioning";
import { process } from "./blocks/process";
import { sectionTOC } from "./blocks/section-toc";

export const schemaTypes = [
  servicePage,
  seoSnapshot,
  hero,
  sectionTOC,
  aiCitation,
  monthlyWork,
  centeredCta,
  process,
  positioning,
  gradientCta,
  faq,
];

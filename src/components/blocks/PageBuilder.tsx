import HeroBlock from "./HeroBlock";
import SectionTOCBlock from "./SectionTOCBlock";
import CenteredCtaBlock from "./CenteredCtaBlock";
import ProcessBlock from "./ProcessBlock";
import DeliverablesBlock from "./DeliverablesBlock";
import PositioningBlock from "./PositioningBlock";
import CasesBlock from "./CasesBlock";
import FaqBlock from "./FaqBlock";
import GradientCtaBlock from "./GradientCtaBlock";
import FeaturedTestimonialBlock from "./FeaturedTestimonialBlock";
import TechFoundationBlock from "./TechFoundationBlock";
import TechChecklistBlock from "./TechChecklistBlock";
import DesignTokensBlock from "./DesignTokensBlock";
import UxVsUiBlock from "./UxVsUiBlock";
import UxLawsBlock from "./UxLawsBlock";
import BrandSplitBlock from "./BrandSplitBlock";
import type { ServicePage } from "@/lib/services";

type Block = ServicePage["blocks"][number];

/** Render én enkelt block med korrekt komponent. */
function renderBlock(
  block: Block,
  inStickyStack?: boolean,
  stickyIndex?: number,
  key?: string | number
) {
  switch (block.type) {
    case "hero":
      return <HeroBlock key={key} data={block} />;
    case "sectionTOC":
      return <SectionTOCBlock key={key} data={block} />;
    case "centeredCta":
      return (
        <CenteredCtaBlock
          key={key}
          data={block}
          inStickyStack={inStickyStack}
          stickyIndex={stickyIndex}
        />
      );
    case "process":
      return (
        <ProcessBlock
          key={key}
          id={block.id}
          data={block}
          inStickyStack={inStickyStack}
          stickyIndex={stickyIndex}
        />
      );
    case "deliverables":
      return <DeliverablesBlock key={key} id={block.id} data={block} />;
    case "positioning":
      return (
        <PositioningBlock
          key={key}
          id={block.id}
          data={block}
          inStickyStack={inStickyStack}
          stickyIndex={stickyIndex}
        />
      );
    case "cases":
      return <CasesBlock key={key} id={block.id} data={block} />;
    case "faq":
      return <FaqBlock key={key} id={block.id} data={block} />;
    case "gradientCta":
      return <GradientCtaBlock key={key} data={block} />;
    case "featuredTestimonial":
      return <FeaturedTestimonialBlock key={key} />;
    case "techFoundation":
      return <TechFoundationBlock key={key} id={block.id} data={block} />;
    case "techChecklist":
      return (
        <TechChecklistBlock
          key={key}
          data={block}
          inStickyStack={inStickyStack}
          stickyIndex={stickyIndex}
        />
      );
    case "designTokens":
      return <DesignTokensBlock key={key} id={block.id} data={block} />;
    case "uxVsUi":
      return <UxVsUiBlock key={key} id={block.id} data={block} />;
    case "uxLaws":
      return <UxLawsBlock key={key} id={block.id} data={block} />;
    case "brandSplit":
      return <BrandSplitBlock key={key} id={block.id} data={block} />;
    default: {
      // Eksaustiv tjek — TypeScript fanger glemte block-typer
      const _exhaustive: never = block;
      return null;
    }
  }
}

/**
 * Renderer en service-side ud fra dens blocks.
 * Grupperer fortløbende blocks med samme `stickyGroup` så de stables med
 * sticky-effekt. Andre blocks rendres direkte.
 */
export default function PageBuilder({ blocks }: { blocks: ServicePage["blocks"] }) {
  const out: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    const group = block.stickyGroup;

    if (group) {
      // Saml fortløbende blocks med samme stickyGroup
      const groupBlocks: { block: Block; index: number }[] = [];
      let j = i;
      while (j < blocks.length && blocks[j].stickyGroup === group) {
        groupBlocks.push({ block: blocks[j], index: j });
        j++;
      }

      out.push(
        <div key={`sticky-${group}-${i}`} className="relative">
          {groupBlocks.map(({ block: b, index }, localIdx) =>
            renderBlock(b, true, localIdx, `${b.type}-${index}`)
          )}
        </div>
      );

      i = j;
    } else {
      out.push(renderBlock(block, false, 0, `${block.type}-${i}`));
      i++;
    }
  }

  return <>{out}</>;
}

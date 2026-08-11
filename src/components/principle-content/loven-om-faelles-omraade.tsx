import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Læg en ramme om nogle elementer, og øjet læser dem som en gruppe. Det
      kræver hverken pile eller labels. En boks, en baggrundsflade eller en
      streg er nok til at sige, at det her hører sammen.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Stephen Palmer"]}
        institution="University of California, Berkeley"
        year={1992}
        tint={illustrationBg("Perception")}
      />

      <SectionGrid>
        <Section title="Hvor det kommer fra">
          <p>
            Stephen Palmer beskrev i 1992 et grupperingsprincip, der er stærkere
            end de øvrige gestalt-love. Et fælles, afgrænset område binder
            elementer sammen, også selvom de ikke ligner hinanden.
          </p>
          <p>
            En delt baggrund vejer tungere end afstand. To ting inde i samme
            ramme føles beslægtede, selvom noget udenfor ligger tættere på.
          </p>
        </Section>
        <Section title="Hvad det betyder i praksis">
          <p>
            Et kort samler overskrift, tekst og knap til én enhed. En sidebar
            skiller sig ud fra brødteksten, fordi den har sin egen flade.
            Formularfelter grupperes med en let indramning.
          </p>
          <p>
            Vi behøver ikke forklare, hvad der hører sammen. Vi tegner bare
            områderne op, og læseren forstår strukturen med det samme.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            For mange rammer på én skærm giver et rodet, opdelt billede.
            Når alt har sin egen kasse, forsvinder overblikket, og siden føles
            tung.
          </p>
          <p>
            En ramme kan også binde ting sammen, der ikke burde. Sætter du to
            urelaterede elementer i samme boks, læser folk dem som en gruppe,
            uanset hvad du mente.
          </p>
        </Section>
        <Section title="Sådan bruger vi det">
          <p>
            Vi bruger flader og afstand før streger. En blød baggrund eller lidt
            luft samler ofte en gruppe pænere end en hård kant.
          </p>
          <p>
            Og vi grupperer kun det, der reelt hører sammen. En ramme er et
            løfte om sammenhæng, så vi holder det, vi lover.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Law of Common Region",
      href: "https://lawsofux.com/law-of-common-region/",
    },
    {
      source: "Palmer, S. E. (1992)",
      title: "Common region: A new principle of perceptual grouping",
    },
  ],
};

export default content;

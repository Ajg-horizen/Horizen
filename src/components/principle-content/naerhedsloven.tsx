import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Når to ting står tæt på hinanden, opfatter hjernen dem som beslægtede
      — også når de ikke er det. Det er et af de mest umiddelbart kraftfulde
      designprincipper, fordi det kun kræver én ting: at du tænker over
      hvidrum.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Max Wertheimer"]}
        institution="Gestaltpsykologien"
        year={1923}
        tint={illustrationBg("Perception")}
      />

      <SectionGrid>
        <Section title="Hvor effekten kommer fra">
          <p>
            Nærhedsloven er en af de oprindelige gestaltlove, formuleret
            af Max Wertheimer i 1923. Gestaltpsykologerne påviste at vi
            ikke opfatter elementer enkeltvis — vi grupperer dem
            automatisk efter visuelle signaler.
          </p>
          <p>
            Afstand er det stærkeste af de signaler. Stærkere end farve,
            stærkere end form. Det er en bias så dyb at vi ikke kan
            slukke for den.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            En etiket og dens inputfelt skal stå tættere på hinanden end
            de er på det næste felt — ellers ved brugeren ikke hvilken
            etiket der hører til hvad. Det lyder banalt, men det er en
            af de mest oversete usability-fejl i formulardesign.
          </p>
          <p>
            Det samme gælder navigation: kategorier inde i en menu skal
            visuelt være tættere på deres underpunkter end på den næste
            kategori. Ellers smelter alt sammen.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            Den almindelige fejl er at hælde alt jævnt fordelt på siden.
            "Det ser ryddeligt ud" — men når intet er tættere på noget
            andet, kan hjernen ikke gruppere. Resultatet er at læseren
            må gøre arbejdet selv.
          </p>
          <p>
            Den anden faldgrube: at bruge linjer eller bokse til at
            gruppere, når simpel afstand ville være nok. Visuelt mere
            støj, samme effekt.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Vi bruger nærhed som første værktøj, bokse og linjer som
            sidste udvej. Hvidrum er ikke tomt — det er det der fortæller
            læseren hvad der hører sammen, og hvor én tanke slutter og
            en anden begynder.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Law of Proximity",
      href: "https://lawsofux.com/law-of-proximity/",
    },
    {
      source: "Nielsen Norman Group",
      title: "Gestalt Principles: Proximity, Uniform Connectedness, Continuation",
      href: "https://www.nngroup.com/articles/gestalt-proximity-uniform-connectedness-continuation/",
    },
    {
      source: "Wertheimer, M. (1923)",
      title: "Untersuchungen zur Lehre von der Gestalt II",
    },
  ],
};

export default content;

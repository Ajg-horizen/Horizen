import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Folk dømmer ikke en oplevelse på gennemsnittet. De husker den ud fra to
      øjeblikke: det følelsesmæssige højdepunkt og slutningen. Peak-end-reglen
      handler om at bygge de to øjeblikke med vilje.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Daniel Kahneman", "Barbara Fredrickson"]}
        institution="Princeton University"
        year={1993}
        tint={illustrationBg("Hukommelse")}
      />

      <SectionGrid>
        <Section title="Hvor reglen kommer fra">
          <p>
            Nobelpristageren Daniel Kahneman viste sammen med Barbara
            Fredrickson i 1993, at hukommelsen ikke laver et retvisende
            gennemsnit af en oplevelse.
          </p>
          <p>
            Den vægter toppen og enden langt tungere end alt derimellem. En ellers
            besværlig oplevelse kan huskes positivt, hvis den slutter godt.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            Den følelse, en bruger sidder tilbage med, afgøres af få øjeblikke.
            En kvitteringsside der føles som en lettelse. En tom tilstand der
            hjælper i stedet for at skuffe.
          </p>
          <p>
            Et højdepunkt hvor produktet gør mere end forventet. Det er dem, folk
            husker, ikke de neutrale skærme ind imellem.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            Man kan ikke gøre alt til et højdepunkt. Prøver du at pynte hvert
            eneste skridt, udjævner du forskellen, og så er der ingen top tilbage.
          </p>
          <p>
            Og et svagt slutpunkt kan trække en ellers god oplevelse ned, uanset
            hvor stærk resten var. Enden bærer mere vægt, end den ser ud til.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Vi kigger på, hvor rejsen topper, og hvor den slutter, og lægger
            omhu netop der. Det er billigere end at forgylde alt.
          </p>
          <p>
            Og det er det, der bliver hængende, når brugeren lukker fanen. Det
            sidste indtryk er ofte det eneste, de tager med sig.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Peak-End Rule",
      href: "https://lawsofux.com/peak-end-rule/",
    },
    {
      source: "Nielsen Norman Group",
      title: "The Peak-End Rule: How Impressions Become Memories",
      href: "https://www.nngroup.com/articles/peak-end-rule/",
    },
    {
      source: "Kahneman, D. & Fredrickson, B. (1993)",
      title: "When More Pain Is Preferred to Less",
    },
  ],
};

export default content;

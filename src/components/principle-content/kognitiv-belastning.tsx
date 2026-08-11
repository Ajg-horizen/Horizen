import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Hver beslutning og hver visuel støj koster mental energi. Når belastningen
      overstiger det, folk har at give af, falder de fra. Opgaven er at fjerne
      det, der ikke betaler sig, så kræfterne går til det, siden faktisk handler
      om.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["John Sweller"]}
        institution="University of New South Wales"
        year={1988}
        tint={illustrationBg("Kognition")}
      />

      <SectionGrid>
        <Section title="Hvor det kommer fra">
          <p>
            Psykologen John Sweller påviste i 1988, at arbejdshukommelsen kun kan
            holde få ting ad gangen. Overskrider en opgave grænsen, bryder
            forståelsen sammen.
          </p>
          <p>
            Han skelnede mellem den belastning, opgaven kræver, og den, der
            kommer af dårlig præsentation. Kun den sidste kan vi designe væk.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            En rodet skærm, uklare ord og for mange valg tvinger folk til at
            arbejde, før de kommer i gang. Den energi er brugt på formen i stedet
            for indholdet.
          </p>
          <p>
            Vi holder den nødvendige belastning og skærer resten fra. Et tydeligt
            hierarki, kendte mønstre og få valg gør arbejdet lettere at bære.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            At fjerne belastning er ikke det samme som at fjerne indhold. Skjuler
            man det nødvendige bag ekstra klik, har man flyttet arbejdet, ikke
            lettet det.
          </p>
          <p>
            Minimalisme kan i sig selv belaste, hvis den gør uklart, hvad man kan
            gøre. Tomhed uden retning er også en byrde.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Vi spørger til hvert element, om det hjælper opgaven videre eller bare
            fylder. Det, der bare fylder, ryger.
          </p>
          <p>
            Vi bruger det, folk allerede kender, så de ikke skal lære noget nyt
            for at komme videre. Genkendelse er den billigste vej frem.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Cognitive Load",
      href: "https://lawsofux.com/cognitive-load/",
    },
    {
      source: "Sweller, J. (1988)",
      title: "Cognitive Load During Problem Solving",
    },
  ],
};

export default content;

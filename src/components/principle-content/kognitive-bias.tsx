import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Hjernen tager mentale genveje for at spare energi, og de genveje former
      vores beslutninger på systematiske måder. Godt design regner med dem i
      stedet for at kæmpe imod. Det er billigere at følge tankens vaner end at
      bede folk om at tænke om.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Amos Tversky", "Daniel Kahneman"]}
        institution="Hebrew University of Jerusalem"
        year={1972}
        tint={illustrationBg("Kognition")}
      />

      <SectionGrid>
        <Section title="Hvor det kommer fra">
          <p>
            Amos Tversky og Daniel Kahneman viste i 1970&apos;erne, at folk ikke
            regner sig frem til beslutninger. Vi bruger tommelfingerregler, der
            som regel virker, men skævvrider systematisk.
          </p>
          <p>
            De kaldte dem heuristikker. Skævhederne er ikke fejl hos den enkelte.
            De ligger i selve måden, vi behandler information på.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            Det første tal folk ser, farver alt, hvad der kommer efter. Tab føles
            tungere end tilsvarende gevinster. Det, der er nemt at huske, virker
            mere sandt.
          </p>
          <p>
            Vi kan ikke slukke for de mønstre. Men vi kan lægge information i den
            rækkefølge og form, der fører til en god beslutning frem for en
            forhastet.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            De samme mekanismer kan bruges til at presse folk mod valg, der ikke
            gavner dem. Kunstig knaphed og vildledende ankerpriser virker, lige
            indtil tilliden brister.
          </p>
          <p>
            En bias forsvinder ikke, fordi vi kender den. Selv erfarne
            beslutningstagere falder i, og det gælder også os selv, når vi
            designer.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Vi designer med tankens genveje, ikke imod dem, og vi bruger dem til
            at gøre det rigtige valg til det nemme valg.
          </p>
          <p>
            Når en genvej kan udnyttes på brugerens bekostning, lader vi være.
            Ægthed holder længere end et hurtigt klik.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Cognitive Bias",
      href: "https://lawsofux.com/cognitive-bias/",
    },
    {
      source: "Tversky, A. & Kahneman, D. (1974)",
      title: "Judgment under Uncertainty: Heuristics and Biases",
    },
  ],
};

export default content;

import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Ting, der ligner hinanden, tror vi hører sammen. Samme form, samme farve,
      samme størrelse signalerer samme funktion. Ensartethed skaber en
      forventning, som brugeren regner med, at vi indfrier.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Max Wertheimer"]}
        institution="Gestalt-psykologien"
        year={1923}
        tint={illustrationBg("Perception")}
      />

      <SectionGrid>
        <Section title="Hvor det kommer fra">
          <p>
            Max Wertheimer viste i 1923, at vi grupperer elementer efter, hvor
            meget de ligner hinanden. Lighed binder tingene sammen, selv når de
            ligger spredt.
          </p>
          <p>
            En række prikker i to farver læses som to grupper, ikke som én
            samlet række. Øjet sorterer automatisk efter det fælles træk.
          </p>
        </Section>
        <Section title="Hvad det betyder i praksis">
          <p>
            Alle links har samme farve. Alle knapper har samme form. Alle
            overskrifter ser ens ud. Så ved brugeren, hvad tingene gør, uden at
            prøve sig frem.
          </p>
          <p>
            Vi bygger et fælles sprog med gentagelse. Når det klikbare ligner
            det klikbare, bliver hele siden nemmere at aflæse.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            Lighed lover funktion. Hvis noget, der ikke er et link, ligner et
            link, klikker folk forgæves og mister tilliden til resten.
          </p>
          <p>
            Modsat gælder det, at samme funktion skal se ens ud hver gang. To
            knapper med samme rolle, men forskelligt udseende, sår tvivl om,
            hvad der sker.
          </p>
        </Section>
        <Section title="Sådan bruger vi det">
          <p>
            Vi holder én stil pr. funktion og bruger den konsekvent. Ensartethed
            er ikke kedeligt, det er forudsigeligt på den gode måde.
          </p>
          <p>
            Og vi bryder kun ligheden med vilje. Skiller et element sig ud, er
            det fordi, det skal gøre noget andet end de øvrige.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Law of Similarity",
      href: "https://lawsofux.com/law-of-similarity/",
    },
    {
      source: "Wertheimer, M. (1923)",
      title: "Untersuchungen zur Lehre von der Gestalt",
    },
  ],
};

export default content;

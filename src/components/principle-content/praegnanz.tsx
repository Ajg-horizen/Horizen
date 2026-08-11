import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Hjernen vælger den letteste vej. Stillet over for et rodet billede læser
      den den enkleste, mest stabile form, den kan slippe afsted med. Klar
      struktur bliver forstået. Kompleksitet bliver gættet på.
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
            Max Wertheimer beskrev i 1923, hvordan vi organiserer det, vi ser,
            så enkelt som muligt. Prægnans betyder god form, den mest stabile
            fortolkning af en scene.
          </p>
          <p>
            Fem cirkler, der overlapper, ses som en kæde, ikke som fem løsrevne
            former. Øjet vælger altid den letteste læsning.
          </p>
        </Section>
        <Section title="Hvad det betyder i praksis">
          <p>
            Rene layouts, tydelige former og genkendelige mønstre kræver mindre
            af brugeren. Et logo i enkle geometriske former huskes bedre og
            skalerer bedre.
          </p>
          <p>
            Vi arbejder for øjet, ikke imod det. Jo enklere strukturen er, jo
            mindre skal folk arbejde for at forstå siden.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            Enkelhed må ikke blive fattigdom. Skærer man for meget væk,
            forsvinder de holdepunkter, der gør en side forståelig og rar at
            bruge.
          </p>
          <p>
            Og hjernens trang til at forenkle kan narre. Et uklart layout bliver
            fortolket, ikke læst, og så ser folk noget andet, end du mente.
          </p>
        </Section>
        <Section title="Sådan bruger vi det">
          <p>
            Vi rydder op, indtil formen taler for sig selv. Færre linjer, klare
            kanter og et roligt grid gør resten af arbejdet.
          </p>
          <p>
            Vi tester ved at skæle. Holder strukturen, når detaljerne bliver
            slørede, er den enkel nok til at blive forstået.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Law of Prägnanz",
      href: "https://lawsofux.com/law-of-pr%C3%A4gnanz/",
    },
    {
      source: "Wertheimer, M. (1923)",
      title: "Untersuchungen zur Lehre von der Gestalt",
    },
  ],
};

export default content;

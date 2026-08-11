import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Ethvert system har en mængde kompleksitet, der ikke kan fjernes, kun
      flyttes. Teslers lov kaldes også loven om bevarelse af kompleksitet. Det
      egentlige spørgsmål er, hvem der skal bære den, brugeren eller os.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Larry Tesler"]}
        institution="Xerox PARC"
        year={1984}
        tint={illustrationBg("Kognition")}
      />

      <SectionGrid>
        <Section title="Hvor det kommer fra">
          <p>
            Larry Tesler, en pioner inden for brugergrænseflader hos Xerox PARC,
            formulerede i midten af 1980&apos;erne, at et system rummer en
            iboende kompleksitet, der ikke kan trylles væk.
          </p>
          <p>
            Man kan forenkle det, brugeren ser, men så skal noget andet håndtere
            det bagved. Kompleksiteten forsvinder ikke, den skifter blot plads.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            Et felt til adresse virker simpelt, men postnumre, lande og formater
            er indviklede. Nogen skal tage sig af den knude, koden eller
            personen.
          </p>
          <p>
            Vi vælger at lægge så meget som muligt hos os. Automatik, fornuftige
            standarder og gætterier bag skærmen sparer brugeren for arbejdet.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            Skubber man kompleksiteten over til brugeren, ligner interfacet rent
            og enkelt, mens arbejdet bare er sendt videre. Det føles let for os
            og tungt for dem.
          </p>
          <p>
            Man kan heller ikke forenkle uendeligt. På et punkt fjerner man noget
            nødvendigt, og så er systemet ikke længere det, folk kom efter.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Vi tager kompleksiteten på os frem for at sende den videre. Det, en
            maskine kan udlede, beder vi ikke brugeren om at skrive.
          </p>
          <p>
            Når en knude ikke kan gemmes væk, gør vi den så let at komme igennem
            som muligt. Bæringen ligger hos os, ikke hos den, der bare vil videre.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Tesler's Law",
      href: "https://lawsofux.com/teslers-law/",
    },
    {
      source: "Tesler, L.",
      title: "Law of Conservation of Complexity",
    },
  ],
};

export default content;

import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Arbejdshukommelsen er den mentale notesblok, hvor vi holder og
      bearbejder det, vi er i gang med lige nu. Den er lille og skrøbelig,
      og et godt interface aflaster den i stedet for at fylde den op.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Alan Baddeley", "Graham Hitch"]}
        institution="University of Stirling"
        year={1974}
        tint={illustrationBg("Hukommelse")}
      />

      <SectionGrid>
        <Section title="Hvor det kommer fra">
          <p>
            Alan Baddeley og Graham Hitch foreslog i 1974, at
            korttidshukommelsen ikke bare er et lager, men et arbejdsrum,
            hvor vi holder information aktiv og bruger den samtidig.
          </p>
          <p>
            Rummet er lille og forsvinder hurtigt. Bliver du afbrudt,
            eller kommer der for meget ind, ryger det, du havde i
            hovedet, og du må starte forfra.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            En bruger, der skal huske et tal fra én skærm til den næste,
            bærer på en byrde. Hver ekstra ting at holde fast i gør
            opgaven tungere.
          </p>
          <p>
            Derfor er genkendelse lettere end at huske. Viser vi valgene
            frem, i stedet for at kræve, at brugeren husker dem, sparer vi
            arbejdshukommelsen.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            En proces, der kræver, at brugeren husker noget fra tidligere
            trin, taber folk undervejs. Informationen skal være der, når
            den skal bruges.
          </p>
          <p>
            Afbrydelser er dyre. En pop-up eller et skift midt i en
            opgave kan tømme notesblokken, og så starter brugeren forfra
            uden at ville det.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Vi lader skærmen bære det, brugeren ellers skulle huske.
            Indtastet information vises igen, valg gentages, og det
            relevante er synligt, når der skal handles.
          </p>
          <p>
            Vi holder ét trin fokuseret ad gangen og undgår at afbryde
            midt i en opgave. Jo mindre brugeren skal holde i hovedet,
            desto færre fejl.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Working Memory",
      href: "https://lawsofux.com/working-memory/",
    },
    {
      source: "Baddeley, A. & Hitch, G. (1974)",
      title: "Working Memory",
    },
  ],
};

export default content;

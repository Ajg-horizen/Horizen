import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Brugeren møder aldrig et interface med blanke øjne. Der er allerede en idé
      om, hvordan tingene virker, hentet fra alt det, man har brugt før. Passer
      vores løsning ikke til den idé, føles den forkert, uanset hvor pæn den er.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Kenneth Craik"]}
        institution="University of Cambridge"
        year={1943}
        tint={illustrationBg("Kognition")}
      />

      <SectionGrid>
        <Section title="Hvor det kommer fra">
          <p>
            Psykologen Kenneth Craik beskrev i 1943, at hjernen bygger små
            modeller af verden og bruger dem til at forudsige, hvad der sker,
            før det sker.
          </p>
          <p>
            Vi handler ud fra den model, ikke ud fra virkeligheden selv. Stemmer
            de to overens, føles alt let og forudsigeligt.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            Folk forventer, at en indkøbskurv virker som en kurv, og at et link
            ligner et link. Forventningen er formet af tusind andre sider.
          </p>
          <p>
            Vi møder den model frem for at overraske den. Kendte ord, kendte
            ikoner og kendt placering gør, at tingene virker, som de ser ud til.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            Et smart, nyt mønster kan føles friskt for os og forvirrende for
            brugeren. Afstanden mellem vores model og deres skaber lige præcis
            den frustration, vi ville undgå.
          </p>
          <p>
            Man kan ikke ræsonnere folk ud af en indgroet forventning. Er den
            der, må designet leve op til den eller forklare, hvorfor det ikke
            gør.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Vi tegner brugerens model, før vi tegner skærmen, og lader det, folk
            allerede kender, styre navne, flow og placering.
          </p>
          <p>
            Når vi bevidst bryder et mønster, gør vi det tydeligt og med en grund,
            man kan mærke. Ellers holder vi os til det velkendte.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Mental Model",
      href: "https://lawsofux.com/mental-model/",
    },
    {
      source: "Craik, K. (1943)",
      title: "The Nature of Explanation",
    },
  ],
};

export default content;

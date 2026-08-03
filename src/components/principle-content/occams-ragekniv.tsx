import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Når to løsninger begge virker, er den enkleste næsten altid den bedste.
      Occams ragekniv handler ikke om at fjerne for fjernelsens skyld, men om at
      skære alt væk, der ikke bærer sin egen vægt.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Vilhelm af Ockham"]}
        institution="Franciskansk filosof"
        year="1300-tallet"
        tint={illustrationBg("Kognition")}
      />

      <SectionGrid>
        <Section title="Hvor princippet kommer fra">
          <p>
            Vilhelm af Ockham, en engelsk munk og filosof i 1300-tallet,
            argumenterede for, at man ikke skal antage mere end nødvendigt for
            at forklare noget.
          </p>
          <p>
            Syv hundrede år senere er tanken en rettesnor for alt fra videnskab
            til interfacedesign: den enkleste løsning, der stadig holder, vinder.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            Hvert element på en skærm skal fortjene sin plads. En ekstra knap,
            et ekstra felt, en ekstra farve koster opmærksomhed, også når det ser
            harmløst ud.
          </p>
          <p>
            Reducér indtil du ikke kan fjerne mere, uden at noget går i stykker.
            Det punkt er som regel det rigtige.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            Enkelhed er ikke det samme som at gøre noget mindre. Fjerner du
            funktionalitet, brugeren har brug for, har du ikke forenklet, du har
            amputeret.
          </p>
          <p>
            Målet er at reducere det overflødige, ikke det nødvendige. Grænsen
            mellem de to er hele håndværket.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Vi behandler enkelhed som en disciplin, ikke en stil. Til hvert
            element spørger vi: bærer det sin vægt? Ellers ryger det.
          </p>
          <p>
            Det, der bliver tilbage, er ikke tomt. Det er renset for alt, der
            stod i vejen for det, siden faktisk skal.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Occam's Razor",
      href: "https://lawsofux.com/occams-razor/",
    },
    {
      source: "Interaction Design Foundation",
      title: "Occam's Razor",
      href: "https://www.interaction-design.org/literature/topics/occam-s-razor",
    },
    {
      source: "Vilhelm af Ockham (1300-tallet)",
      title: "Princippet om sparsommelighed (lex parsimoniae)",
    },
  ],
};

export default content;

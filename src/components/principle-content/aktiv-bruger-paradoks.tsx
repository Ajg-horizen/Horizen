import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (<>Folk vil bruge, ikke lære. De kaster sig ud i opgaven frem for at læse vejledningen først, selv når det ville have sparet dem tid. Derfor skal designet forklare sig selv, mens man er i gang.</>),
  body: (
    <>
      <ResearchOrigin authors={["John M. Carroll", "Mary Beth Rosson"]} institution="IBM Research" year={1987} tint={illustrationBg("Adfærd")} />
      <SectionGrid>
        <Section title="Hvor det kommer fra"><p>Forskerne John M. Carroll og Mary Beth Rosson beskrev i 1987 et mønster, de kaldte den aktive brugers paradoks.</p><p>Folk springer manualen over og går direkte til opgaven, selv om det ofte koster dem tid. Sådan handler mennesker, og det laver man ikke om på.</p></Section>
        <Section title="Hvad det betyder i praksis"><p>Ingen læser onboarding-teksten til ende. Folk klikker sig frem og gætter, og de lærer værktøjet ved at bruge det.</p><p>Derfor skal hjælpen ligge i selve interfacet. Tydelige labels, gode standardvalg og et layout, der peger på næste skridt.</p></Section>
      </SectionGrid>
      <SectionGrid>
        <Section title="Faldgruber"><p>Man kan ikke skrive sig ud af et forvirrende design. Et langt hjælpeafsnit er ofte et tegn på, at noget skal laves om.</p><p>Tunge introture, der skal klares før man må gøre noget, bliver klikket væk. Så står brugeren tilbage uden hjælp alligevel.</p></Section>
        <Section title="Sådan bruger vi det"><p>Vi bygger grænseflader, der kan bruges uden manual, og lægger forklaringen der, hvor handlingen sker.</p><p>Vi hjælper i små bidder på det rette tidspunkt frem for at samle alt i en vejledning ingen læser.</p></Section>
      </SectionGrid>
    </>
  ),
  sources: [
    { source: "Laws of UX", title: "Paradox of the Active User", href: "https://lawsofux.com/paradox-of-the-active-user/" },
    { source: "Carroll, J. & Rosson, M. (1987)", title: "Paradox of the Active User" },
  ],
};

export default content;

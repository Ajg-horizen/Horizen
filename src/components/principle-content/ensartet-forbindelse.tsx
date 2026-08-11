import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      En synlig forbindelse er stærkere end nærhed alene. Trækker du en linje
      mellem to elementer eller lægger dem på samme flade, læses de som ét,
      selvom noget andet ligger tættere på.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Stephen Palmer", "Irvin Rock"]}
        institution="University of California, Berkeley"
        year={1994}
        tint={illustrationBg("Perception")}
      />

      <SectionGrid>
        <Section title="Hvor det kommer fra">
          <p>
            Stephen Palmer og Irvin Rock foreslog i 1994 ensartet forbindelse
            som et af de kraftigste grupperingsprincipper. En fælles kant eller
            forbindelse binder elementer tættere sammen end afstand gør.
          </p>
          <p>
            To ikoner forbundet af en streg opfattes som beslægtede, selvom to
            andre ikoner ligger tættere på hinanden. Forbindelsen vinder over
            nærheden.
          </p>
        </Section>
        <Section title="Hvad det betyder i praksis">
          <p>
            En navigation samlet på én bjælke. Trin i en proces bundet sammen af
            en linje. Felter i en gruppe, der deler den samme baggrund.
          </p>
          <p>
            Vi viser relationer ved at forbinde dem visuelt. Det er en tydeligere
            besked end blot at placere tingene i nærheden af hinanden.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            En forbindelse er et stærkt signal, så en forkert forbindelse
            forvirrer meget. Binder du to ting sammen, der ikke hører sammen,
            tror folk på stregen, ikke på meningen.
          </p>
          <p>
            For mange linjer og flader gør det modsatte af det, du vil. Siden
            bliver et net af forbindelser, hvor ingen af dem betyder noget
            længere.
          </p>
        </Section>
        <Section title="Sådan bruger vi det">
          <p>
            Vi bruger forbindelser sparsomt og bevidst. En delt flade eller en
            enkelt linje kan bære en hel gruppe, hvis den står alene.
          </p>
          <p>
            Og vi lader forbindelsen følge indholdet. Det, der hører sammen i
            praksis, er også det, vi binder sammen på skærmen.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Law of Uniform Connectedness",
      href: "https://lawsofux.com/law-of-uniform-connectedness/",
    },
    {
      source: "Palmer, S. & Rock, I. (1994)",
      title: "Rethinking perceptual organization",
    },
  ],
};

export default content;

import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Vi husker langt mere, når informationen er delt op i mindre,
      meningsfulde bidder. Et telefonnummer i grupper, en dato, en
      opdelt formular. Chunking er det, der gør en tung mængde
      information til noget hjernen kan bære.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["George A. Miller"]}
        institution="Harvard University"
        year={1956}
        tint={illustrationBg("Hukommelse")}
      />

      <SectionGrid>
        <Section title="Hvor det kommer fra">
          <p>
            George A. Miller beskrev i 1956, at arbejdshukommelsen holder
            omkring syv elementer ad gangen. Men han pegede også på vejen
            udenom: vi kan gruppere flere ting til én enhed, et chunk.
          </p>
          <p>
            Et chunk tæller som ét element, uanset hvor meget det rummer.
            Derfor kan en øvet læser holde en hel sætning i hovedet, hvor
            en begynder kæmper med de enkelte bogstaver.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            Otte løse cifre er svære at fastholde. De samme cifre i fire
            par føles ubesværede. Vi flytter ikke mængden, vi ændrer,
            hvordan den pakkes.
          </p>
          <p>
            Det samme gælder tekst delt i afsnit, en menu delt i
            grupper og en checkout delt i trin. Struktur er ikke pynt,
            det er det, der gør indholdet til at rumme.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            Grupper skal give mening for at hjælpe. Deler du tilfældigt
            op, laver du bare flere bunker at holde styr på i stedet for
            færre.
          </p>
          <p>
            For mange niveauer af opdeling bliver sin egen forhindring.
            Hvis brugeren skal folde tre lag ud for at nå indholdet, har
            struktur vundet over formål.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Vi samler beslægtet information i klare grupper og giver hver
            gruppe en overskrift, der siger, hvad den rummer. Så kan øjet
            scanne i stedet for at læse alt.
          </p>
          <p>
            Lange formularer bryder vi op i overskuelige trin, og lange
            tal og koder viser vi i grupper. Brugeren skal aldrig holde
            mere i hovedet, end nødvendigt.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Chunking",
      href: "https://lawsofux.com/chunking/",
    },
    {
      source: "Miller, G. A. (1956)",
      title: "The Magical Number Seven, Plus or Minus Two",
    },
  ],
};

export default content;

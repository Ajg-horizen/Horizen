import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Noget, vi ikke er blevet færdige med, bliver hængende i hovedet. En
      halvfærdig opgave skaber en indre uro, der driver os mod at gøre den
      færdig. Synlig fremdrift bruger præcis den uro til noget godt.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Bluma Zeigarnik"]}
        institution="Berlins Universitet"
        year={1927}
        tint={illustrationBg("Opmærksomhed")}
      />

      <SectionGrid>
        <Section title="Hvor effekten kommer fra">
          <p>
            Bluma Zeigarnik bemærkede, at tjenere huskede ubetalte
            regninger langt bedre end de betalte. Så snart bordet var
            gjort op, forsvandt detaljerne fra hukommelsen.
          </p>
          <p>
            Hendes forsøg i 1927 bekræftede det: uafsluttede opgaver
            sidder bedre fast end de færdige. Det uafsluttede holder sig
            selv aktivt, indtil det bliver lukket.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            En påbegyndt profil med 60 procent udfyldt trækker i folk. Den
            manglende rest føles som noget, der skal gøres færdigt, ikke
            som en ny opgave.
          </p>
          <p>
            Fremdriftsbjælker, trin-tællere og checklister virker, fordi
            de gør det uafsluttede synligt. Man vil gerne lukke det
            åbne, når man kan se, hvor lidt der mangler.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            Den samme uro kan blive et pres. Kunstigt skabt ufærdighed,
            der kun findes for at trække folk tilbage, føles manipulerende
            og skaber mistillid.
          </p>
          <p>
            En proces, der viser fremdrift, men aldrig føles færdig,
            udmatter. Uden en klar afslutning bliver drivkraften til
            frustration i stedet for motivation.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Vi viser ægte fremdrift på flertrinsforløb, så brugeren kan se,
            hvor langt der er igen. Det gør resten lettere at komme
            igennem, fordi målet er synligt.
          </p>
          <p>
            Vi bruger det til at hjælpe folk i mål, ikke til at fastholde
            dem. Der er altid en tydelig afslutning, og det uafsluttede
            afspejler noget, brugeren selv vil gøre færdigt.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Zeigarnik Effect",
      href: "https://lawsofux.com/zeigarnik-effect/",
    },
    {
      source: "Zeigarnik, B. (1927)",
      title: "Das Behalten erledigter und unerledigter Handlungen",
    },
  ],
};

export default content;

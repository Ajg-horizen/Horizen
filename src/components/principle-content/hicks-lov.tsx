import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Jo flere valg du giver folk, jo længere tid tager det dem at beslutte
      sig — og jo større er chancen for at de slet ikke beslutter sig. Det
      handler ikke om at brugerne er dovne. Det handler om hvad hjernen
      reelt orker at sortere igennem.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["William Hick", "Ray Hyman"]}
        institution="Cambridge & Johns Hopkins"
        year={1952}
        tint={illustrationBg("Kognition")}
      />

      <SectionGrid>
        <Section title="Hvor effekten kommer fra">
          <p>
            William Hick beskrev i 1952 hvordan reaktionstid stiger
            logaritmisk med antallet af valgmuligheder. Året efter
            bekræftede Ray Hyman det med en bredere serie af eksperimenter.
          </p>
          <p>
            Formlen er enkel: fordoble antallet af valg, og
            beslutningstiden vokser med en konstant. Ikke et lineært
            forhold — men en kurve der bliver stejlere jo flere
            muligheder du tilføjer.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            En navigation med 12 menupunkter føles ikke bare lidt
            tungere end én med 6 — den får brugeren til at frygte
            beslutningen. Folk lukker fanen, scroller forbi, eller
            vælger ingenting.
          </p>
          <p>
            Det er derfor restauranter med tyve forretter sælger færre
            af hver enkelt, og hvorfor abonnementssider med tre planer
            konverterer bedre end dem med syv.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            Loven misforstås tit som "altid færre valg = bedre". Men
            hvis du fjerner muligheder folk faktisk har brug for, har du
            ikke gjort beslutningen lettere — du har gjort den umulig.
            Målet er kurateret valg, ikke amputeret valg.
          </p>
          <p>
            Den anden faldgrube: progressive disclosure misbrugt.
            At gemme valgene bag en menu betyder ikke at de er væk —
            brugeren ved stadig de findes, og det vejer.
          </p>
        </Section>

        <Section title="Sådan bruges det i praksis">
          <p>
            Spotify er et godt eksempel. Tidligere havde appens
            hovednavigation over 20 menupunkter; i 2019 blev det
            reduceret til tre: Hjem, Søg, Bibliotek. Trafikken til de
            afgørende skærme steg, fordi brugerne ikke længere skulle
            stoppe op og parse en lang liste.
          </p>
          <p>
            Samme princip ses i abonnementssider med 3 prisplaner i
            stedet for 7, og i hvorfor mange checkout-flows samler
            beslutninger i trin. Pointen er ikke at fjerne valg — det
            er at lade brugeren tage ét ad gangen.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Hick's Law",
      href: "https://lawsofux.com/hicks-law/",
    },
    {
      source: "Nielsen Norman Group",
      title: "Hick's Law: Making the Choice Easier for Users",
      href: "https://www.nngroup.com/articles/hicks-law/",
    },
    {
      source: "Hick, W. E. (1952)",
      title: "On the rate of gain of information",
    },
  ],
};

export default content;

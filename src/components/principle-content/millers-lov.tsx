import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Hjernen kan holde omkring syv ting i sin korttidshukommelse på én
      gang — give eller tage et par. Det er ikke en svaghed du skal kæmpe
      imod. Det er en begrænsning du skal bygge dit interface oveni.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["George A. Miller"]}
        institution="Princeton University"
        year={1956}
        tint={illustrationBg("Hukommelse")}
      />

      <SectionGrid>
        <Section title="Hvor effekten kommer fra">
          <p>
            Psykologen George A. Miller udgav i 1956 et af de mest
            citerede papers i kognitionsforskningens historie: "The
            magical number seven, plus or minus two". Han viste at
            arbejdshukommelsen håndterer 5-9 elementer ad gangen — uanset
            om det er tal, ord eller billeder.
          </p>
          <p>
            Nyere forskning peger på at det ofte er endnu lavere — 3-4
            elementer er mere realistisk for komplekst materiale. Tallet
            7 er en pejling, ikke en konstant.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            Det er derfor telefonnumre traditionelt grupperes (12 34 56
            78, ikke 12345678), og hvorfor en navigation med 6 punkter
            er nemmere at parse end én med 11.
          </p>
          <p>
            Chunking er nøgleordet: når du grupperer information i
            meningsfulde enheder, kan hjernen håndtere langt mere end
            "rå" 7 ting. Hvert chunk tæller som ét element.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            Loven misbruges tit som regel: "max 7 menupunkter". Men det
            handler ikke om visuelle elementer på en side — det handler
            om hvad brugeren skal HOLDE i hovedet samtidig.
          </p>
          <p>
            Du må gerne have 30 produkter i en liste. Brugeren skal ikke
            huske dem alle — brugeren skal bare scanne. Loven gælder når der
            kræves aktiv holdning af information.
          </p>
        </Section>

        <Section title="Sådan bruges det i praksis">
          <p>
            Det mest hverdagsnære eksempel er telefonnumre. Otte
            sammenhængende cifre (12345678) overstiger
            arbejdshukommelsen, mens fire grupper á to (12 34 56 78)
            føles ubesværet. Samme logik bag kreditkortnumre (4 ×
            4 cifre), IBAN, og verifikationskoder fra banker (typisk
            6 cifre, ofte i to grupper).
          </p>
          <p>
            På web ses det i hvordan lange formularer brydes op i trin
            — en flerstegs-checkout føles lettere end den samme
            information samlet på én skærm, selv om den totale mængde
            felter er identisk.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Miller's Law",
      href: "https://lawsofux.com/millers-law/",
    },
    {
      source: "Nielsen Norman Group",
      title: "Short-Term Memory and Web Usability",
      href: "https://www.nngroup.com/articles/short-term-memory-and-usability/",
    },
    {
      source: "Miller, G. A. (1956)",
      title:
        "The magical number seven, plus or minus two: Some limits on our capacity for processing information",
    },
  ],
};

export default content;

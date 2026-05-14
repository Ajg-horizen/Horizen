import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Hjernen filtrerer aktivt det irrelevante fra — det er sådan vi
      overhovedet kan fungere i et miljø fyldt med signaler. Problemet er
      at den også filtrerer ting fra som du *gerne* ville have at brugeren
      lagde mærke til. Folk er gode til at ignorere det de er trænet i at
      ignorere.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Colin Cherry"]}
        institution="MIT"
        year={1953}
        tint={illustrationBg("Opmærksomhed")}
      />

      <SectionGrid>
        <Section title="Hvor effekten kommer fra">
          <p>
            Colin Cherry beskrev i 1953 det berømte "cocktail
            party-fænomen": evnen til at fokusere på én samtale i et
            larmende rum og udelukke resten. Senere forskning af
            Donald Broadbent og andre kortlagde hvordan filteret
            faktisk virker.
          </p>
          <p>
            Konklusionen: opmærksomhed er ikke et søgelys der oplyser
            det vigtige. Det er en filtreringsmekanisme der dæmper alt
            det andet. Og filteret er hurtigt, automatisk, og dybt
            personligt.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            Det er årsagen til "banner-blindhed": brugere ser ikke
            elementer der ligner reklamer, selvom de står midt på
            siden. Hjernen har lært at sortere visuel støj fra, og en
            knaldgul boks ligner mistænkeligt en reklame.
          </p>
          <p>
            Det er også derfor "vigtigt"-mærkater til sidst ikke
            virker: når alt er fremhævet, er intet fremhævet. Filteret
            har lært at den slags signaler er upålidelige.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            Det fristende svar er at gøre vigtige beskeder ENDNU mere
            iøjnefaldende — større, mere farve, mere bevægelse. Det
            forstærker som regel filteret. Jo mere det ligner reklame,
            jo mere bliver det ignoreret.
          </p>
          <p>
            Den anden faldgrube er at antage at brugeren ser hvad du
            ser. Designeren har set siden hundrede gange — for brugeren
            er det første gang, og hjernen er allerede i gang med at
            sortere.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Vigtige beskeder placeres i den naturlige læserytme — ikke
            som visuelle "rør mig"-bokse. Vi skriver dem så de ligner
            indhold, ikke marketing. Hvis noget skal fanges
            absolut, bruger vi kontekst (timing, position i flowet)
            i stedet for visuel skrigen.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Selective Attention",
      href: "https://lawsofux.com/selective-attention/",
    },
    {
      source: "Nielsen Norman Group",
      title: "Banner Blindness Revisited",
      href: "https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/",
    },
    {
      source: "Cherry, E. C. (1953)",
      title:
        "Some experiments on the recognition of speech, with one and with two ears",
    },
  ],
};

export default content;

import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Brugere tilbringer det meste af deres tid på andre sider end din. Derfor
      lander de hos dig med en færdig forventning om, hvordan tingene virker.
      Jakob&rsquo;s lov handler om at møde den forventning i stedet for at
      bekæmpe den.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Jakob Nielsen"]}
        institution="Nielsen Norman Group"
        year={2000}
        tint={illustrationBg("Adfærd")}
      />

      <SectionGrid>
        <Section title="Hvor princippet kommer fra">
          <p>
            Jakob Nielsen formulerede loven i 2000 på baggrund af årtiers
            brugertest. Pointen er enkel: en bruger bygger sine forventninger op
            fra alle de sider, de allerede kender.
          </p>
          <p>
            Kurven for hvad der føles rigtigt, er sat af andre længe før folk
            lander hos dig. Du arver den, uanset om du vil det eller ej.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            Et logo øverst til venstre der linker hjem. En kurv i øverste højre
            hjørne. Søgefeltet der hvor øjet leder efter det. Det er ikke
            fantasiforladt, det er forudsigeligt.
          </p>
          <p>
            Og forudsigeligt er præcis det, der gør en side ubesværet at bruge.
            Brugeren skal ikke lære din verden, før de kan bruge den.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            Konventioner er ikke en undskyldning for at slukke hjernen.
            Kopierer du blindt et mønster, der ikke passer til opgaven, arver du
            også dets fejl.
          </p>
          <p>
            At bryde en konvention kan være rigtigt, men kun når gevinsten er
            stor nok til at retfærdiggøre den ekstra mentale friktion, det
            koster brugeren.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Vi starter aldrig et design i et tomt rum. Vi bygger på de mønstre
            brugeren allerede kender, og bruger så krudtet på det, der faktisk
            adskiller jer.
          </p>
          <p>
            Fundamentet skal føles velkendt, så det unikke får plads til at
            træde frem i stedet for at drukne i unødig nyhed.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Jakob's Law",
      href: "https://lawsofux.com/jakobs-law/",
    },
    {
      source: "Nielsen Norman Group",
      title: "End of Web Design",
      href: "https://www.nngroup.com/articles/end-of-web-design/",
    },
    {
      source: "Jakob Nielsen (2000)",
      title: "Users spend most of their time on other sites",
    },
  ],
};

export default content;

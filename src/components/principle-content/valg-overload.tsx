import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      For mange muligheder hjælper ikke, de lammer. Jo længere listen bliver,
      des sværere er det at vælge, og des mindre tilfreds er man bagefter.
      Kuratering er en gave, ikke en begrænsning.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Sheena Iyengar", "Mark Lepper"]}
        institution="Columbia & Stanford University"
        year={2000}
        tint={illustrationBg("Kognition")}
      />

      <SectionGrid>
        <Section title="Hvor det kommer fra">
          <p>
            Sheena Iyengar og Mark Lepper stillede i 2000 et bord med
            marmelade op i en butik. Nogle gange med seks slags, andre gange med
            fireogtyve.
          </p>
          <p>
            Det store udvalg tiltrak flere, men langt færre købte. For mange valg
            gjorde beslutningen så tung, at folk lod være.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            En menu med tredive punkter, en prisside med ni planer, en formular
            med endeløse felter. Hvert ekstra valg tapper energi og udskyder
            beslutningen.
          </p>
          <p>
            Vi skærer ned til de muligheder, der faktisk betyder noget. Et klart,
            afgrænset udvalg gør det let at komme videre.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            At skære ned må ikke fjerne det, folk reelt har brug for. For få valg
            kan efterlade brugeren uden den mulighed, de kom efter.
          </p>
          <p>
            Løsningen er sjældent at slette, men at ordne. Gode kategorier og en
            tydelig anbefaling gør et stort udvalg overkommeligt uden at forsvinde.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Vi kuraterer frem for at vise alt på én gang og fremhæver den vej, de
            fleste er bedst tjent med.
          </p>
          <p>
            Er der brug for mange muligheder, grupperer vi dem og pakker resten
            væk, til de bliver relevante. Så bliver valget en lettelse, ikke en
            byrde.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Choice Overload",
      href: "https://lawsofux.com/choice-overload/",
    },
    {
      source: "Iyengar, S. & Lepper, M. (2000)",
      title: "When Choice is Demotivating",
    },
  ],
};

export default content;

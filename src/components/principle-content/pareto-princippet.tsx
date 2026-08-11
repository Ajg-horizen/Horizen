import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (<>Cirka 80 procent af effekten kommer fra 20 procent af årsagerne. Finder man de få ting, der bærer det meste af værdien, ved man også, hvor arbejdet skal lægges.</>),
  body: (
    <>
      <ResearchOrigin authors={["Vilfredo Pareto"]} institution="University of Lausanne" year={1896} tint={illustrationBg("Adfærd")} />
      <SectionGrid>
        <Section title="Hvor det kommer fra"><p>Økonomen Vilfredo Pareto bemærkede i 1896, at 20 procent af befolkningen ejede omkring 80 procent af jorden i Italien.</p><p>Siden har man set den skæve fordeling overalt. Nogle få årsager står for langt størstedelen af resultatet.</p></Section>
        <Section title="Hvad det betyder i praksis"><p>På et website er der som regel nogle få sider og handlinger, folk kommer efter. Resten bruges sjældent.</p><p>Kender man de 20 procent, ved man, hvad der skal være hurtigt, tydeligt og lige ved hånden.</p></Section>
      </SectionGrid>
      <SectionGrid>
        <Section title="Faldgruber"><p>Tallene 80 og 20 er en tommelfingerregel, ikke en lov. Man skal måle sin egen fordeling frem for at gætte.</p><p>De sidste 20 procent forsvinder ikke. En lille gruppe har stadig brug for det sjældne, det skal bare ikke fylde i vejen for de mange.</p></Section>
        <Section title="Sådan bruger vi det"><p>Vi finder de få sider og handlinger, der bærer det meste af trafikken, og giver dem den bedste plads.</p><p>Vi bruger flest kræfter, hvor de flytter mest, i stedet for at pudse hvert hjørne lige meget.</p></Section>
      </SectionGrid>
    </>
  ),
  sources: [
    { source: "Laws of UX", title: "Pareto Principle", href: "https://lawsofux.com/pareto-principle/" },
    { source: "Pareto, V. (1896)", title: "Cours d'économie politique" },
  ],
};

export default content;

import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (<>Flow er tilstanden, hvor opgaven og evnen mødes så præcist, at tiden forsvinder og folk er fuldt opslugt. Designets vigtigste job er ikke at skabe den følelse, men at lade være med at bryde den.</>),
  body: (
    <>
      <ResearchOrigin authors={["Mihály Csíkszentmihályi"]} institution="University of Chicago" year={1975} tint={illustrationBg("Adfærd")} />
      <SectionGrid>
        <Section title="Hvor det kommer fra"><p>Psykologen Mihály Csíkszentmihályi undersøgte i 1970erne kunstnere, atleter og skakspillere, der arbejdede i timevis uden at mærke det.</p><p>Han kaldte tilstanden flow. Den opstår, når udfordringen står i balance med færdigheden. For let bliver kedeligt, for svært bliver angst.</p></Section>
        <Section title="Hvad det betyder i praksis"><p>Folk kommer til et website med et ærinde. Er stien klar, glider de igennem uden at tænke over værktøjet.</p><p>Hver popup, hver unødig bekræftelse og hver uventet omvej river dem ud af rytmen. Så starter de forfra mentalt.</p></Section>
      </SectionGrid>
      <SectionGrid>
        <Section title="Faldgruber"><p>Man kan komme til at ville hjælpe for meget. Guides, tips og notifikationer, der afbryder på det forkerte tidspunkt, gør netop det stik modsatte.</p><p>Flow kan heller ikke tvinges frem. Man kan kun fjerne det, der står i vejen, og lade brugeren finde tempoet selv.</p></Section>
        <Section title="Sådan bruger vi det"><p>Vi holder de vigtige flows fri for afbrydelser og gemmer det ekstra væk, til brugeren selv spørger.</p><p>Vi tester en opgave fra start til slut og fjerner alt, der får folk til at stoppe op og tvivle undervejs.</p></Section>
      </SectionGrid>
    </>
  ),
  sources: [
    { source: "Laws of UX", title: "Flow", href: "https://lawsofux.com/flow/" },
    { source: "Csíkszentmihályi, M. (1990)", title: "Flow: The Psychology of Optimal Experience" },
  ],
};

export default content;

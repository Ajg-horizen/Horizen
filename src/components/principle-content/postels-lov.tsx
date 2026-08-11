import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (<>Vær nøjsom med det, du selv sender, og rummelig med det, du tager imod. Inputfelter, der forstår de mange måder folk skriver det samme på, skaber langt færre fejl.</>),
  body: (
    <>
      <ResearchOrigin authors={["Jon Postel"]} institution="USC Information Sciences Institute" year={1980} tint={illustrationBg("Adfærd")} />
      <SectionGrid>
        <Section title="Hvor det kommer fra"><p>Internetpioneren Jon Postel skrev i 1980 robusthedsprincippet: vær konservativ i det du sender, liberal i det du modtager.</p><p>Det gjorde de tidlige netværk stabile. Systemer, der tåler variationer i input, går sjældnere i stå.</p></Section>
        <Section title="Hvad det betyder i praksis"><p>Folk skriver telefonnumre med mellemrum, bindestreger eller landekode. Et godt felt forstår dem alle.</p><p>Rammer man et system, der kun accepterer én bestemt måde, får man en fejl for noget, der egentlig var rigtigt. Det føles urimeligt.</p></Section>
      </SectionGrid>
      <SectionGrid>
        <Section title="Faldgruber"><p>Rummelighed har en grænse. Tager man imod alt uden at rydde op, gemmer man rodet længere inde i systemet.</p><p>Man skal stadig fange ægte fejl. Er en mailadresse tydeligt forkert, skal brugeren have det at vide med det samme og venligt.</p></Section>
        <Section title="Sådan bruger vi det"><p>Vi bygger felter, der selv retter mellemrum og format til, så folk kan skrive, som de plejer.</p><p>Vi holder på det, brugeren har tastet, og vejleder blidt frem for at rydde feltet og give en kold fejlbesked.</p></Section>
      </SectionGrid>
    </>
  ),
  sources: [
    { source: "Laws of UX", title: "Postel's Law", href: "https://lawsofux.com/postels-law/" },
    { source: "Postel, J. (1980)", title: "RFC 761: Robustness Principle" },
  ],
};

export default content;

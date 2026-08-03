import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Når flere ting ligner hinanden, er det den ene, der skiller sig ud, folk
      lægger mærke til og husker. Von Restorff-effekten er værktøjet bag ethvert
      velfungerende hierarki, men kun hvis man bruger det med måde.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Hedwig von Restorff"]}
        institution="Berlins Universitet"
        year={1933}
        tint={illustrationBg("Hukommelse")}
      />

      <SectionGrid>
        <Section title="Hvor effekten kommer fra">
          <p>
            Den tyske læge og psykolog Hedwig von Restorff påviste i 1933, at et
            element, der bryder mønstret i en ellers ensartet liste, huskes
            markant bedre end de øvrige.
          </p>
          <p>
            Kontrasten alene er nok til at flytte hukommelsen. Derfor kaldes den
            også isolationseffekten.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            Den primære knap der har en farve, de andre ikke har. Den ene
            prisplan der er fremhævet. Badget der markerer det anbefalede valg.
          </p>
          <p>
            Vi styrer øjet ved at lade én ting bryde reglen. Alle de andre følger
            trop og træder et skridt tilbage.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            Effekten virker kun, så længe den er sjælden. Fremhæver du fem ting,
            har du reelt ikke fremhævet nogen, du har bare lavet ny støj.
          </p>
          <p>
            Og kontrast må aldrig hvile på farve alene, hvis det skal virke for
            folk med nedsat farvesyn. Form, størrelse og placering skal bære med.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Vi vælger ét primært handlingspunkt pr. skærm og lader resten træde
            tilbage. Hierarki handler ikke om at råbe højest.
          </p>
          <p>
            Det handler om, at der kun er én stemme, der skiller sig ud ad
            gangen. Så ved brugeren altid, hvor de skal kigge hen.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Von Restorff Effect",
      href: "https://lawsofux.com/von-restorff-effect/",
    },
    {
      source: "Interaction Design Foundation",
      title: "The Von Restorff Effect (Isolation Effect)",
      href: "https://www.interaction-design.org/literature/topics/von-restorff-effect",
    },
    {
      source: "von Restorff, H. (1933)",
      title: "Über die Wirkung von Bereichsbildungen im Spurenfeld",
    },
  ],
};

export default content;

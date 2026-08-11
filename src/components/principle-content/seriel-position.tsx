import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Det første og det sidste i en række er det, folk husker bedst. Alt
      i midten falmer. Placerer du det vigtigste i enderne, arbejder du
      med hukommelsen i stedet for imod den.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Hermann Ebbinghaus"]}
        institution="Berlins Universitet"
        year={1885}
        tint={illustrationBg("Hukommelse")}
      />

      <SectionGrid>
        <Section title="Hvor effekten kommer fra">
          <p>
            Hermann Ebbinghaus kortlagde i 1885 hukommelsen ved at lære
            lange lister udenad og måle, hvad der sad fast. Mønstret var
            tydeligt og gentog sig hver gang.
          </p>
          <p>
            Starten huskes godt, fordi den nåede at synke ind. Slutningen
            huskes godt, fordi den er frisk. Det kaldes primacy og
            recency, og midten betaler prisen.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            Det første punkt i en menu og det sidste bliver husket. De i
            midten glider forbi. Rækkefølge er ikke neutral, den vægter
            indholdet for brugeren.
          </p>
          <p>
            Derfor ligger logo og primær handling ofte i enderne af en
            navigation. Det er de pladser, hjernen holder fast i uden at
            anstrenge sig.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            Effekten hjælper ikke, hvis alt skal fremhæves. Fylder du både
            start og slut med vigtige ting, konkurrerer de, og fordelen
            forsvinder.
          </p>
          <p>
            Den gælder rækker, man tager ind i ét stræk. På en side, man
            scanner frit, styrer kontrast og placering mere end
            positionen i en liste.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Vi lægger det, der betyder mest, i enderne. Det vigtigste
            først, det næstvigtigste sidst, og det, der bare skal være
            der, i midten.
          </p>
          <p>
            I menuer, lister og trinvise flows tænker vi over, hvad der
            står yderst. De pladser er gratis opmærksomhed, hvis vi
            bruger dem bevidst.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Serial Position Effect",
      href: "https://lawsofux.com/serial-position-effect/",
    },
    {
      source: "Ebbinghaus, H. (1885)",
      title: "Über das Gedächtnis",
    },
  ],
};

export default content;

import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Når et system svarer på under 400 millisekunder, holder brugerens
      opmærksomhed sammen. Bliver svaret langsommere, falder fokus fra hinanden,
      og oplevelsen med det. Doherty-grænsen er grunden til, at hastighed ikke er
      en luksus, men en del af selve brugsoplevelsen.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Walter Doherty", "Arvind Thadani"]}
        institution="IBM"
        year={1982}
        tint={illustrationBg("Adfærd")}
      />

      <SectionGrid>
        <Section title="Hvor grænsen kommer fra">
          <p>
            Walter Doherty og Arvind Thadani målte hos IBM i 1982, hvordan
            svartider påvirkede produktivitet. Under 400 ms skete der noget
            særligt.
          </p>
          <p>
            Folk arbejdede ikke bare hurtigere. De blev i flowet og fik mere fra
            hånden, end selve tidsbesparelsen kunne forklare.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            En knap der reagerer med det samme. En side der tegner sig med det
            samme. En bekræftelse der ikke lader vente på sig.
          </p>
          <p>
            Under grænsen føles produktet som en forlængelse af brugerens tanke.
            Over den bliver de mindet om, at de venter på en maskine.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            Ikke alt kan svare på 400 ms, og så handler det om at fylde
            ventetiden rigtigt. Skeletons, optimistiske opdateringer og tydelig
            fremdrift kan holde den oplevede hastighed oppe.
          </p>
          <p>
            Følt hastighed tæller lige så meget som målt hastighed. En god
            ventetilstand kan redde det, teknikken ikke kan nå.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Hastighed er en del af fundamentet, ikke noget man pynter på til
            sidst. Vi bygger på ren kode og hurtige svartider fra dag ét.
          </p>
          <p>
            Det er den slags kvalitet, man ikke ser, men altid mærker. Præcis
            der, hvor et solidt fundament adskiller sig fra et hurtigt overfladisk
            resultat.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Doherty Threshold",
      href: "https://lawsofux.com/doherty-threshold/",
    },
    {
      source: "Doherty, W. J. & Thadani, A. J. (1982)",
      title: "The Economic Value of Rapid Response Time (IBM)",
    },
  ],
};

export default content;

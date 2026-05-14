import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Tiden det tager at klikke på noget afhænger af to ting: hvor langt
      målet er væk, og hvor stort det er. Det lyder banalt — men det er den
      enkleste lov der findes om hvorfor små knapper i hjørner føles
      besværlige, og hvorfor centrerede call-to-actions konverterer bedre.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Paul Fitts"]}
        institution="Ohio State University"
        year={1954}
        tint={illustrationBg("Adfærd")}
      />

      <SectionGrid>
        <Section title="Hvor effekten kommer fra">
          <p>
            Psykologen Paul Fitts målte i 1954 hvor lang tid det tog
            forsøgspersoner at flytte en stylus mellem to plader. Han fandt
            en simpel relation: tiden voksede med afstanden og faldt med
            målets størrelse.
          </p>
          <p>
            Formlen er stadig anvendt i HCI-forskning syv årtier senere —
            inklusive på alt fra musepile til touch-targets på mobil.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            Vigtige handlinger skal være store og tæt på. Det er derfor
            primære knapper er større end sekundære, og det er derfor en
            "Køb"-knap på en webshop sjældent gemmes nede i et hjørne.
          </p>
          <p>
            Skærmens kanter er specielle: musen kan ikke flyttes længere,
            så et mål i hjørnet er reelt uendeligt stort. Det forklarer
            hvorfor menulinjer på Mac sidder helt øverst i skærmen, og
            ikke et par pixel nede.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Faldgruber">
          <p>
            Loven bruges ofte som undskyldning for at gøre knapper enorme.
            Men store knapper uden hierarki gør det modsatte — alt
            skriger lige højt, og brugeren ved ikke hvor han skal kigge.
          </p>
          <p>
            Det er afstanden mellem mål der også tæller. Hvis "Annullér"
            sidder tæt på "Slet permanent", er Fitts-vinklen forkert
            anvendt: nemheden bliver farlig.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Når vi designer interfaces, gør vi den primære handling
            visuelt og fysisk dominerende — og placerer destruktive
            handlinger et stykke væk fra muselandingen. Touch-targets
            holdes på minimum 44×44 pixels, fordi en finger ikke kan
            sigte med samme præcision som en muse.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Fitts's Law",
      href: "https://lawsofux.com/fittss-law/",
    },
    {
      source: "Nielsen Norman Group",
      title: "Fitts's Law in UX Design",
      href: "https://www.nngroup.com/articles/fitts-law/",
    },
    {
      source: "Fitts, P. M. (1954)",
      title:
        "The information capacity of the human motor system in controlling the amplitude of movement",
    },
  ],
};

export default content;

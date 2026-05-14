import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (
    <>
      Folk oplever æstetisk design som mere brugervenligt — også når det
      objektivt set ikke er det. Det er ikke en holdning eller en
      mavefornemmelse. Det er en dokumenteret effekt, og en af de mest
      praktiske ting at have med i baghovedet, når man bygger en hjemmeside.
    </>
  ),

  body: (
    <>
      <ResearchOrigin
        authors={["Masaaki Kurosu", "Kaori Kashimura"]}
        institution="Hitachi Design Center"
        year={1995}
        tint={illustrationBg("Perception")}
      />

      <SectionGrid>
        <Section title="Hvor effekten kommer fra">
          <p>
            I 1995 satte to forskere fra Hitachi Design Center, Masaaki
            Kurosu og Kaori Kashimura, 252 mennesker til at teste 26
            forskellige versioner af en hæveautomat. Funktionaliteten var
            den samme. Det eneste der ændrede sig, var hvor pænt det så ud.
          </p>
          <p>
            Resultatet: deltagerne vurderede de pæne versioner som markant
            nemmere at bruge — selv når de faktisk var lige så besværlige
            som de grimme. Æstetik påvirkede den oplevede brugervenlighed
            mere end den reelle brugervenlighed gjorde.
          </p>
        </Section>

        <Section title="Hvad det betyder i praksis">
          <p>
            Når en bruger lander på en hjemmeside der ser gennemtænkt ud,
            går hjernen automatisk i en mere tålmodig tilstand. Små bumps i
            oplevelsen — et felt der opfører sig lidt mærkeligt, en knap
            der sidder et uventet sted — bliver tilgivet i stedet for at
            føre til frustration.
          </p>
          <p>
            Det er derfor visuel kvalitet ikke er pynt. Det er en del af
            fundamentet for, om folk bliver eller forsvinder igen indenfor
            de første sekunder.
          </p>
        </Section>
      </SectionGrid>

      <SectionGrid>
        <Section title="Bagsiden af medaljen">
          <p>
            Effekten er ikke uden faldgruber. Når et design er for pænt,
            kan rigtige usability-problemer blive overset — også i
            brugertests. Testpersoner kan finde et flow forvirrende, men
            alligevel sige at det fungerer fint, fordi det ser
            professionelt ud.
          </p>
          <p>
            Det er den vigtige del at huske: æstetik er en forstærker, ikke
            en erstatning. Et æstetisk design oven på en dårlig struktur
            skubber bare problemet længere ned ad vejen.
          </p>
        </Section>

        <Section title="Sådan bruger vi det">
          <p>
            Når vi designer hos Horizen, behandler vi visuel kvalitet som
            et fundament — ikke som finpudsning til sidst. Typografi,
            rytme, kontrast og hvidrum sættes tidligt, fordi det er dét,
            der afgør hvor meget tålmodighed brugeren har, når de møder
            selve funktionaliteten.
          </p>
          <p>
            Men vi bygger aldrig pænt design oven på en utestet struktur.
            Det er rækkefølgen der gør forskellen.
          </p>
        </Section>
      </SectionGrid>
    </>
  ),

  sources: [
    {
      source: "Laws of UX",
      title: "Aesthetic-Usability Effect",
      href: "https://lawsofux.com/aesthetic-usability-effect/",
    },
    {
      source: "Nielsen Norman Group",
      title: "The Aesthetic-Usability Effect",
      href: "https://www.nngroup.com/articles/aesthetic-usability-effect/",
    },
    {
      source: "Kurosu, M. & Kashimura, K. (1995)",
      title: "Apparent usability vs. inherent usability, CHI '95",
    },
  ],
};

export default content;

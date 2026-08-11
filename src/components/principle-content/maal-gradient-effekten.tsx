import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (<>Jo tættere folk kommer på et mål, jo hurtigere bevæger de sig mod det. Viser man tydeligt, hvor langt der er igen, holder flere ved i stedet for at falde fra undervejs.</>),
  body: (
    <>
      <ResearchOrigin authors={["Clark L. Hull"]} institution="Yale University" year={1932} tint={illustrationBg("Opmærksomhed")} />
      <SectionGrid>
        <Section title="Hvor det kommer fra"><p>Psykologen Clark L. Hull observerede i 1932, at rotter løb hurtigere, jo nærmere de kom foderet for enden af en labyrint.</p><p>Samme mønster gælder mennesker. Motivationen stiger, når målet kommer inden for rækkevidde, ikke når man er langt fra det.</p></Section>
        <Section title="Hvad det betyder i praksis"><p>En fremskridtsbjælke, der viser fire ud af fem trin klaret, trækker folk det sidste stykke.</p><p>Et loyalitetskort med to felter allerede stemplet føles tættere på mål end et helt tomt. Følelsen af fremdrift driver handlingen.</p></Section>
      </SectionGrid>
      <SectionGrid>
        <Section title="Faldgruber"><p>Falsk fremdrift straffer sig. Lover bjælken snart færdig og kommer der så tre nye trin, mister folk tilliden med det samme.</p><p>Et mål, der ser uendeligt langt væk ud fra start, skræmmer folk væk, før de overhovedet går i gang.</p></Section>
        <Section title="Sådan bruger vi det"><p>Vi viser fremdrift ærligt, så folk altid kan se, hvor de er, og hvor lidt der er tilbage.</p><p>Vi giver gerne et forspring på den første del af et flow. Er man allerede godt på vej, er det lettere at fuldføre.</p></Section>
      </SectionGrid>
    </>
  ),
  sources: [
    { source: "Laws of UX", title: "Goal-Gradient Effect", href: "https://lawsofux.com/goal-gradient-effect/" },
    { source: "Kivetz, R., Urminsky, O. & Zheng, Y. (2006)", title: "The Goal-Gradient Hypothesis Resurrected" },
  ],
};

export default content;

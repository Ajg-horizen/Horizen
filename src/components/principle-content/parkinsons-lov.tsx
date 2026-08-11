import type { PrincipleContent } from "./index";
import { Section, SectionGrid, ResearchOrigin } from "./_primitives";
import { illustrationBg } from "@/lib/principle-bg";

const content: PrincipleContent = {
  intro: (<>En opgave fylder den tid, der er sat af til den. Giver man et flow en rimelig ramme eller et let tidspres, bliver folk hurtigere færdige, uden at det føles hastet.</>),
  body: (
    <>
      <ResearchOrigin authors={["Cyril Northcote Parkinson"]} institution="The Economist" year={1955} tint={illustrationBg("Adfærd")} />
      <SectionGrid>
        <Section title="Hvor det kommer fra"><p>Forfatteren Cyril Northcote Parkinson formulerede i 1955 den iagttagelse, at arbejde udvider sig, så det fylder den tid, der er til rådighed.</p><p>Han skrev det med et glimt i øjet, men pointen holder. Uden en grænse har en opgave det med at trække ud.</p></Section>
        <Section title="Hvad det betyder i praksis"><p>Et kort felt signalerer, at der ikke skal skrives meget, og folk skriver kort. Et stort tomt felt inviterer til at tøve.</p><p>En tydelig ramme om et flow hjælper folk med at træffe beslutningen og komme videre i stedet for at blive hængende.</p></Section>
      </SectionGrid>
      <SectionGrid>
        <Section title="Faldgruber"><p>Pres kan slå over i stress. En nedtælling, der jager folk, skaber fejl og fortrydelse mere end fart.</p><p>Rammen skal passe til opgaven. Sætter man for kort tid af til noget vigtigt, går det ud over kvaliteten.</p></Section>
        <Section title="Sådan bruger vi det"><p>Vi giver felter og flows en størrelse, der matcher opgaven, så formen selv fortæller, hvad der forventes.</p><p>Vi bruger tidsrammer som en blid hjælp til at komme videre, aldrig som en stopklokke, der stresser folk.</p></Section>
      </SectionGrid>
    </>
  ),
  sources: [
    { source: "Laws of UX", title: "Parkinson's Law", href: "https://lawsofux.com/parkinsons-law/" },
    { source: "Parkinson, C. N. (1957)", title: "Parkinson's Law: The Pursuit of Progress" },
  ],
};

export default content;

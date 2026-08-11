import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Handelsbetingelser | Horizen",
  description:
    "Horizens handelsbetingelser for udvikling, drift og vedligeholdelse af hjemmesider og webshops.",
  alternates: {
    canonical: "/handelsbetingelser",
  },
  openGraph: {
    title: "Handelsbetingelser | Horizen",
    description:
      "Horizens handelsbetingelser for udvikling, drift og vedligeholdelse af hjemmesider og webshops.",
    url: "/handelsbetingelser",
    siteName: "Horizen",
    locale: "da_DK",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Handelsbetingelser | Horizen",
    description:
      "Horizens handelsbetingelser for udvikling, drift og vedligeholdelse af hjemmesider og webshops.",
  },
};

type Block =
  | { type: "p"; text: string }
  | { type: "sub"; text: string }
  | { type: "list"; items: string[] };

type Section = { heading: string; blocks: Block[] };

const sections: Section[] = [
  {
    heading: "Generelle oplysninger",
    blocks: [
      {
        type: "p",
        text: 'Nærværende handelsbetingelser finder anvendelse på alle aftaler mellem Horizen (herefter "Horizen") og kunden.',
      },
      {
        type: "list",
        items: [
          "Horizen",
          "CVR: 44637588",
          "Skovvangsvej 230, 1. tv, 8200 Aarhus N",
          "ajg@horizen.dk",
          "+45 28 12 76 52",
          "horizen.dk",
        ],
      },
    ],
  },
  {
    heading: "Aftalens omfang og accept",
    blocks: [
      {
        type: "p",
        text: "Betingelserne finder anvendelse på udvikling, drift og vedligeholdelse af hjemmesider og webshops samt tilknyttede ydelser, medmindre andet er aftalt skriftligt. Ved indgåelse af en aftale accepterer kunden nærværende betingelser.",
      },
    ],
  },
  {
    heading: "Erhvervskunder (B2B)",
    blocks: [
      {
        type: "p",
        text: "Horizens ydelser retter sig mod erhvervsdrivende. Aftaler indgås på erhvervsvilkår, og de almindelige forbrugerbeskyttelsesregler, herunder 14 dages fortrydelsesret, finder ikke anvendelse.",
      },
    ],
  },
  {
    heading: "Priser og ydelser",
    blocks: [
      { type: "sub", text: "Løbende hjemmesideservice (webhotel og drift)" },
      {
        type: "list",
        items: [
          "Standard hjemmeside: 399 kr./md.",
          "Webshop: 599 kr./md.",
          "Den løbende hjemmesideservice betales årligt forud og omfatter webhotel og drift, herunder hosting af hjemmesiden.",
          "Ændringer og redigering af hjemmesiden er ikke omfattet af den løbende service. Ønsker om eksempelvis udskiftning af billeder eller rettelse af indhold afregnes særskilt på timebasis, jf. afsnittet om timebaseret arbejde.",
          "Det forudbetalte beløb refunderes ikke, herunder ved ophør inden periodens udløb.",
          "Der er ingen bindingsperiode ud over den forudbetalte periode. Kunden kan undlade at forny aftalen ved ikke at betale for den efterfølgende periode, uden at der påløber yderligere betaling.",
        ],
      },
      { type: "sub", text: "Datatræk og merforbrug" },
      {
        type: "list",
        items: [
          "Den løbende service dækker hosting og et normalt dataforbrug for en almindelig hjemmeside.",
          "Ved usædvanligt højt forbrug, eksempelvis som følge af et stort antal besøgende eller betydeligt datatræk, der medfører ekstraomkostninger hos Horizens hostingudbyder, viderefaktureres disse omkostninger til kunden efter forudgående aftale.",
          "For at begrænse uforudsete omkostninger anvender Horizen som udgangspunkt en øvre forbrugsgrænse. Nås denne grænse, orienteres kunden, og forbruget kan midlertidigt sættes i bero, indtil det videre forløb er aftalt.",
        ],
      },
      { type: "sub", text: "Timebaseret arbejde" },
      {
        type: "list",
        items: [
          "Opgaver ud over den løbende service afregnes på timebasis efter konkret aftale. Timeprisen udgør 900 kr. ekskl. moms.",
          "Der faktureres alene for arbejde, der på forhånd er aftalt og godkendt af kunden. Tid anvendt på opgaver, der ikke er godkendt af kunden, faktureres ikke.",
          "Horizen orienterer kunden og indhenter godkendelse forud for igangsættelse af opgaver, der medfører fakturering.",
        ],
      },
      { type: "sub", text: "Priser generelt" },
      { type: "p", text: "Samtlige priser er angivet ekskl. moms." },
    ],
  },
  {
    heading: "Betaling",
    blocks: [
      {
        type: "p",
        text: "Fakturaer forfalder til betaling 8 dage efter fakturadato, medmindre andet er aftalt skriftligt. Ved forsinket betaling påløber renter og rykkergebyrer i henhold til renteloven.",
      },
    ],
  },
  {
    heading: "Prisregulering",
    blocks: [
      {
        type: "p",
        text: "Horizen forbeholder sig ret til at regulere sine priser, herunder timepris og løbende service, med rimeligt varsel. De til enhver tid gældende priser fremgår af horizen.dk.",
      },
    ],
  },
  {
    heading: "Levering og tidsplan",
    blocks: [
      {
        type: "p",
        text: "Angivne tidsplaner udgør estimater og er ikke bindende. Forsinkelser som følge af forhold uden for Horizens kontrol eller manglende levering af materiale fra kunden kan påvirke leveringstidspunktet.",
      },
    ],
  },
  {
    heading: "Kundens medvirken",
    blocks: [
      {
        type: "p",
        text: "Kunden er forpligtet til rettidigt at levere nødvendigt materiale, herunder tekst og billeder, og indestår for, at det leverede materiale ikke krænker tredjemands rettigheder. Manglende eller forsinket levering af materiale kan påvirke tidsplan og pris.",
      },
    ],
  },
  {
    heading: "Indhold og opfyldning af hjemmesiden",
    blocks: [
      {
        type: "p",
        text: "Horizen forestår som udgangspunkt ikke udfyldning af hjemmesiden med indhold på kundens vegne, herunder produkter, varer i webshops, tekst og billeder. Indlæggelse af indhold påhviler kunden, medmindre andet er aftalt.",
      },
      {
        type: "p",
        text: "Ønsker kunden, at Horizen forestår indlæggelse af indhold, afregnes dette særskilt på timebasis efter aftale. Det samme gælder mere omfattende opgaver, eksempelvis indlæggelse af et større antal sider eller produkter, som ikke indgår i den oprindelige aftale.",
      },
    ],
  },
  {
    heading: "Ejerskab og rettigheder",
    blocks: [
      {
        type: "list",
        items: [
          "Kunden ejer sin hjemmeside, sit indhold, sin kildekode og sit domæne.",
          "Rettighederne til det udførte arbejde overgår til kunden ved fuld betaling.",
          "Ved samarbejdets ophør udleveres alt relevant materiale, herunder kildekode, filer, adgange og logins, således at kunden frit kan råde herover.",
          "Kunden får altid sin hjemmeside med, men selve overdragelsen og overflytningen, herunder det hertil forbundne tidsforbrug, afregnes særskilt på timebasis efter gældende timepris.",
          "Undtaget herfra er tredjepartskomponenter og licenser, der er underlagt egne vilkår.",
        ],
      },
    ],
  },
  {
    heading: "Fejl og mangler",
    blocks: [
      {
        type: "p",
        text: "Kunden bør gennemgå det leverede og reklamere over eventuelle fejl inden for rimelig tid.",
      },
      {
        type: "p",
        text: "I en periode på 30 dage efter levering udbedrer Horizen uden beregning fejl og mangler i det leverede arbejde, der kan henføres til forhold hos Horizen. Perioden omfatter alene fejlretning, det vil sige udbedring af fejl, så hjemmesiden fungerer som aftalt.",
      },
      {
        type: "p",
        text: "Perioden omfatter ikke ny udvikling, nye funktioner, nye moduler eller øvrige ændringsønsker, som afregnes særskilt på timebasis. Efter periodens udløb afregnes al fejlretning ligeledes på timebasis.",
      },
    ],
  },
  {
    heading: "Backup og sikkerhed",
    blocks: [
      {
        type: "p",
        text: "Horizen tilstræber at sikre hjemmesiden bedst muligt efter gældende praksis og træffer rimelige foranstaltninger vedrørende backup og sikkerhed. Horizen kan dog ikke garantere mod ethvert nedbrud, tab, angreb eller lignende.",
      },
      {
        type: "p",
        text: "Kunden er selv ansvarlig for egen sikkerhed, herunder forsvarlig opbevaring af adgangskoder og logins, at fortrolige oplysninger ikke deles med uvedkommende, samt at udvise almindelig agtpågivenhed, eksempelvis over for phishing og mistænkelige henvendelser. Horizen er ikke ansvarlig for skader eller tab, der kan henføres til kundens egne forhold.",
      },
    ],
  },
  {
    heading: "Fortrolighed",
    blocks: [
      {
        type: "p",
        text: "Oplysninger, som kunden betror Horizen, behandles fortroligt og videregives ikke til uvedkommende. Underleverandører og samarbejdspartnere, som Horizen måtte inddrage, er underlagt tilsvarende fortrolighed.",
      },
    ],
  },
  {
    heading: "Persondata og databehandling",
    blocks: [
      {
        type: "p",
        text: "Horizen behandler personoplysninger i overensstemmelse med databeskyttelsesforordningen (GDPR) og gældende dansk lovgivning.",
      },
      {
        type: "p",
        text: "I det omfang Horizen behandler personoplysninger på vegne af kunden, eksempelvis i forbindelse med hosting, drift eller vedligeholdelse, optræder kunden som dataansvarlig og Horizen som databehandler. I sådanne tilfælde indgås en særskilt databehandleraftale, der fastlægger formål, omfang, sikkerhedsforanstaltninger og eventuelle underdatabehandlere.",
      },
      {
        type: "p",
        text: "Horizen anvender ikke kundens data til egne formål og videregiver eller sælger ikke data til tredjemand. Data behandles alene i det omfang, det er nødvendigt for at levere den aftalte ydelse og efter kundens instruks.",
      },
      {
        type: "p",
        text: "Personoplysninger, som Horizen selv indsamler om kunden, eksempelvis til brug for fakturering og kommunikation, behandles i henhold til Horizens privatlivspolitik, der er tilgængelig på horizen.dk.",
      },
    ],
  },
  {
    heading: "Underleverandører",
    blocks: [
      {
        type: "p",
        text: "Horizen er berettiget til at anvende underleverandører og freelancere ved løsning af opgaver. Horizen er ansvarlig for det leverede arbejde, uanset om dette udføres af egne eller eksterne kræfter.",
      },
    ],
  },
  {
    heading: "Tredjepartsydelser",
    blocks: [
      {
        type: "p",
        text: "Domæner, betalingsgateways, plugins, licenser og tilsvarende tredjepartsydelser afholdes af kunden, medmindre andet er aftalt. Horizen hæfter ikke for nedetid eller fejl hos tredjepartsleverandører.",
      },
    ],
  },
  {
    heading: "Ansvar",
    blocks: [
      {
        type: "p",
        text: "Horizen er ikke ansvarlig for indirekte tab, herunder driftstab, tabt fortjeneste eller tab af data. Horizens ansvar er i alle tilfælde begrænset til det beløb, kunden har betalt for den pågældende ydelse.",
      },
    ],
  },
  {
    heading: "Resultater og ændringer (SEO, branding m.m.)",
    blocks: [
      {
        type: "p",
        text: "Horizen udfører sit arbejde efter anerkendte principper og gældende praksis inden for blandt andet SEO, branding samt UI og UX. Horizen kan dog ikke garantere bestemte resultater inden for SEO eller beslægtede discipliner, idet resultaterne afhænger af en række forhold uden for Horizens kontrol, herunder søgemaskinernes algoritmer, konkurrenceforhold og markedet generelt.",
      },
      {
        type: "p",
        text: "Foretager kunden eller tredjemand på kundens vegne efterfølgende ændringer på hjemmesiden, som ikke er anbefalet af eller meddelt Horizen, kan Horizen ikke holdes ansvarlig for eventuelle negative konsekvenser heraf, herunder forringede resultater inden for SEO, branding eller lignende.",
      },
      {
        type: "p",
        text: "Kan en fejl eller skade på hjemmesiden henføres til ændringer foretaget af kunden eller tredjemand, eksempelvis en anden leverandør, og ikke til forhold hos Horizen, er udbedring ikke omfattet af den vederlagsfrie fejlretning. Horizen bistår gerne med udbedring, der i så fald afregnes særskilt på timebasis. Kan fejlen henføres til forhold hos Horizen, udbedres den uden beregning.",
      },
      {
        type: "p",
        text: "Horizen rådgiver ud fra, hvad der efter Horizens vurdering tjener hjemmesiden bedst. Det påhviler kunden at følge disse anbefalinger, og afvigelse herfra sker på kundens eget ansvar.",
      },
    ],
  },
  {
    heading: "Reference, portfolio og kreditering",
    blocks: [
      {
        type: "p",
        text: "Horizen er berettiget til at omtale og fremvise det udførte arbejde som reference, herunder i portfolio og markedsføring, medmindre kunden skriftligt frabeder sig dette.",
      },
      {
        type: "p",
        text: 'Horizen er endvidere som udgangspunkt berettiget til at anføre en diskret kreditering med link i bunden af de hjemmesider, Horizen udvikler, eksempelvis "Lavet af Horizen". Krediteringen forbliver på hjemmesiden i mindst et år, medmindre andet aftales.',
      },
    ],
  },
  {
    heading: "Data efter ophør",
    blocks: [
      {
        type: "p",
        text: "Ved samarbejdets ophør opbevares kundens data og hjemmeside i en periode på 30 dage, hvorefter det slettes. Kunden opfordres til selv at sikre en kopi af relevante data inden ophør.",
      },
    ],
  },
  {
    heading: "Opsigelse",
    blocks: [
      {
        type: "p",
        text: "Den løbende service ophører ved manglende fornyelse, jf. afsnittet om priser og ydelser. Ved væsentlig misligholdelse er hver part berettiget til at opsige samarbejdet med rimeligt varsel. Ved manglende fornyelse tages hjemmesiden offline efter en rimelig periode, og kunden varsles forinden.",
      },
    ],
  },
  {
    heading: "Force majeure",
    blocks: [
      {
        type: "p",
        text: "Horizen er ikke ansvarlig for manglende opfyldelse, der skyldes forhold uden for Horizens kontrol, herunder nedbrud hos leverandører, strømsvigt, hackerangreb og lignende.",
      },
    ],
  },
  {
    heading: "Ændringer af betingelserne",
    blocks: [
      {
        type: "p",
        text: "Horizen forbeholder sig ret til at opdatere nærværende betingelser. Væsentlige ændringer varsles med rimeligt varsel, og de til enhver tid gældende betingelser er tilgængelige på horizen.dk.",
      },
    ],
  },
  {
    heading: "Lovvalg og værneting",
    blocks: [
      {
        type: "p",
        text: "Enhver aftale er underlagt dansk ret. Tvister søges løst i mindelighed og afgøres i mangel heraf ved de danske domstole.",
      },
    ],
  },
  {
    heading: "Kontakt",
    blocks: [
      {
        type: "p",
        text: "Spørgsmål til nærværende betingelser kan rettes til ajg@horizen.dk.",
      },
    ],
  },
];

export default function HandelsbetingelserPage() {
  return (
    <main>
      <Navbar alwaysVisible />
      <Container as="article" size="narrow" className="pt-32 pb-24 md:pt-40">
        <header>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Handelsbetingelser
          </h1>
          <p className="mt-4 text-sm text-muted">Senest opdateret: 11. august 2026</p>
        </header>

        <div className="mt-12 space-y-12">
          {sections.map((section, i) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold tracking-tight">
                {i + 1}. {section.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {section.blocks.map((block, j) => {
                  if (block.type === "sub") {
                    return (
                      <h3
                        key={j}
                        className="pt-2 text-base font-medium text-foreground"
                      >
                        {block.text}
                      </h3>
                    );
                  }
                  if (block.type === "list") {
                    return (
                      <ul
                        key={j}
                        className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-foreground/80"
                      >
                        {block.items.map((item, k) => (
                          <li key={k}>{item}</li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p
                      key={j}
                      className="text-[15px] leading-relaxed text-foreground/80"
                    >
                      {block.text}
                    </p>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </Container>
      <Footer />
    </main>
  );
}

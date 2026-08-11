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
        text: "Disse handelsbetingelser gælder for alle aftaler mellem Horizen og kunden.",
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
        text: "Betingelserne gælder for udvikling, drift og vedligeholdelse af hjemmesider og webshops samt tilknyttede ydelser, medmindre andet er aftalt skriftligt. Ved indgåelse af en aftale accepterer kunden disse betingelser.",
      },
    ],
  },
  {
    heading: "Erhvervskunder (B2B)",
    blocks: [
      {
        type: "p",
        text: "Horizens ydelser retter sig mod erhvervsdrivende. Aftaler indgås på erhvervsvilkår, og de almindelige forbrugerregler, herunder 14 dages fortrydelsesret, finder ikke anvendelse.",
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
          "Servicen betales et år forud og dækker webhotel og drift, det vil sige, at hjemmesiden er hostet og oppe at køre.",
          "Servicen omfatter ikke ændringer eller redigering af hjemmesiden. Ønsker kunden for eksempel at få skiftet et billede eller rettet indhold, afregnes det særskilt på timebasis.",
          "Beløbet refunderes ikke, heller ikke ved ophør i løbet af perioden.",
          "Der er ingen bindingsperiode ud over den forudbetalte. Kunden kan når som helst vælge ikke at forny ved blot at undlade at betale næste periode. Ingen efterregninger og ingen gebyrer.",
        ],
      },
      { type: "sub", text: "Datatræk og merforbrug" },
      {
        type: "list",
        items: [
          "Servicen dækker hosting og normalt dataforbrug for en almindelig hjemmeside.",
          "Ved usædvanligt højt forbrug, for eksempel meget store mængder besøgende eller datatræk, der giver ekstra omkostninger hos vores hostingudbyder, viderefaktureres de ekstra omkostninger til kunden efter forudgående aftale.",
          "For at undgå uventede regninger har vi som udgangspunkt sat en øvre grænse for forbruget. Rammer en hjemmeside dette loft, kontakter vi kunden og kan midlertidigt sætte forbruget på pause, indtil vi sammen har aftalt det videre forløb. På den måde løber omkostningerne aldrig løbsk uden kundens viden.",
        ],
      },
      { type: "sub", text: "Timebaseret arbejde" },
      {
        type: "list",
        items: [
          "Alle opgaver afregnes på timebasis efter konkret aftale med kunden. Vores timepris er 900 kr. ekskl. moms.",
          "Vi fakturerer kun arbejde, der på forhånd er aftalt og godkendt af kunden. Bruger vi tid på noget, kunden ikke har godkendt, faktureres det ikke.",
          "Vi informerer altid kunden og indhenter godkendelse, før vi går i gang med en opgave, der udløser fakturering.",
        ],
      },
      { type: "sub", text: "Priser generelt" },
      { type: "p", text: "Alle priser er ekskl. moms." },
    ],
  },
  {
    heading: "Betaling",
    blocks: [
      {
        type: "p",
        text: "Alle fakturaer betales inden for 8 dage fra fakturadato, medmindre andet er aftalt. Ved for sen betaling påløber renter og rykkergebyr efter renteloven.",
      },
    ],
  },
  {
    heading: "Prisregulering",
    blocks: [
      {
        type: "p",
        text: "Horizen forbeholder sig ret til at regulere priser, herunder timepris og løbende service, med rimeligt varsel. De til enhver tid gældende priser fremgår af horizen.dk.",
      },
    ],
  },
  {
    heading: "Levering og tidsplan",
    blocks: [
      {
        type: "p",
        text: "Aftalte tidsplaner er estimater og ikke bindende garantier. Forsinkelser, der skyldes forhold uden for vores kontrol eller manglende materiale fra kunden, kan påvirke leveringstidspunktet.",
      },
    ],
  },
  {
    heading: "Kundens medvirken",
    blocks: [
      {
        type: "p",
        text: "Kunden leverer nødvendigt materiale (tekst, billeder m.m.) rettidigt og indestår for, at materialet ikke krænker tredjeparts rettigheder. Leveres materiale ikke til tiden, kan det påvirke tidsplan og pris.",
      },
    ],
  },
  {
    heading: "Indhold og opfyldning af hjemmesiden",
    blocks: [
      {
        type: "p",
        text: "Som udgangspunkt udfylder Horizen ikke hjemmesiden med indhold for kunden, herunder produkter, varer i webshops, tekst og billeder. Kunden står selv for at lægge indhold ind, medmindre andet aftales.",
      },
      {
        type: "p",
        text: "Ønsker kunden, at vi udfylder hjemmesiden med indhold, gør vi det naturligvis gerne, men det afregnes særskilt på timebasis efter aftale. Det gælder også større opgaver, for eksempel opfyldning af mange sider eller produkter, som ikke er en del af den oprindelige aftale.",
      },
    ],
  },
  {
    heading: "Ejerskab og rettigheder",
    blocks: [
      {
        type: "list",
        items: [
          "Kunden ejer sin hjemmeside, sit indhold, sin kode og sit domæne.",
          "Rettighederne til det udviklede arbejde overgår til kunden, når det er fuldt betalt.",
          "Forlader kunden Horizen, udleveres alt relevant, herunder kildekode, filer, adgange og logins, så kunden frit kan tage det med.",
          "Undtaget er tredjepartskomponenter og licenser, der er underlagt egne vilkår.",
        ],
      },
    ],
  },
  {
    heading: "Fejl og mangler",
    blocks: [
      {
        type: "p",
        text: "Kunden bør gennemgå det leverede og melde eventuelle fejl inden for rimelig tid.",
      },
      {
        type: "p",
        text: "I 30 dage efter levering udbedrer vi uden beregning fejl og mangler i det leverede arbejde, som skyldes forhold hos Horizen. Perioden dækker udelukkende fejlretning, det vil sige, at vi retter fejl og sikrer, at hjemmesiden fungerer som aftalt.",
      },
      {
        type: "p",
        text: "Perioden omfatter ikke ny udvikling, nye funktioner, nye moduler eller andre ændringsønsker. Sådanne opgaver afregnes særskilt på timebasis. Efter de 30 dage afregnes al fejlretning ligeledes på timebasis.",
      },
    ],
  },
  {
    heading: "Backup og sikkerhed",
    blocks: [
      {
        type: "p",
        text: "Horizen sørger for, at hjemmesiden er så sikker som muligt efter bedste praksis og tager rimelige forholdsregler for backup og sikkerhed. Vi kan dog ikke garantere mod ethvert nedbrud, tab, angreb eller lignende.",
      },
      {
        type: "p",
        text: "Kunden er selv ansvarlig for egen sikkerhed, herunder at opbevare adgangskoder og logins korrekt og sikkert, ikke at dele fortrolige oplysninger med uvedkommende og at udvise almindelig agtpågivenhed, for eksempel over for phishing og mistænkelige mails. Horizen er ikke ansvarlig for skader eller tab, der skyldes kundens egne forhold.",
      },
    ],
  },
  {
    heading: "Fortrolighed",
    blocks: [
      {
        type: "p",
        text: "Oplysninger, kunden deler med os, behandles fortroligt og videregives ikke til uvedkommende. De underleverandører og samarbejdspartnere, vi eventuelt inddrager, er underlagt samme fortrolighed.",
      },
    ],
  },
  {
    heading: "Persondata og databehandling",
    blocks: [
      {
        type: "p",
        text: "Horizen behandler persondata i overensstemmelse med databeskyttelsesforordningen (GDPR) og gældende dansk lovgivning.",
      },
      {
        type: "p",
        text: "I det omfang Horizen behandler persondata på vegne af kunden, for eksempel i forbindelse med hosting, drift eller vedligeholdelse, optræder kunden som dataansvarlig og Horizen som databehandler. I disse tilfælde indgås en særskilt databehandleraftale, der beskriver formål, omfang, sikkerhed og eventuelle underdatabehandlere.",
      },
      {
        type: "p",
        text: "Horizen bruger ikke kundens data til egne formål, videregiver eller sælger dem ikke til tredjepart og behandler dem alene i det omfang, det er nødvendigt for at levere den aftalte ydelse og efter kundens instruks.",
      },
      {
        type: "p",
        text: "De personoplysninger, Horizen selv indsamler om kunden, for eksempel til fakturering og kommunikation, behandles efter Horizens privatlivspolitik, der findes på horizen.dk.",
      },
    ],
  },
  {
    heading: "Underleverandører",
    blocks: [
      {
        type: "p",
        text: "Horizen kan anvende underleverandører og freelancere til løsning af opgaver. Horizen er ansvarlig for det leverede arbejde, uanset om det udføres af egne eller eksterne kræfter.",
      },
    ],
  },
  {
    heading: "Tredjepartsydelser",
    blocks: [
      {
        type: "p",
        text: "Domæner, betalingsgateways, plugins, licenser og lignende tredjepartsydelser afholdes af kunden, medmindre andet er aftalt. Horizen hæfter ikke for nedetid eller fejl hos tredjepartsleverandører.",
      },
    ],
  },
  {
    heading: "Ansvar",
    blocks: [
      {
        type: "p",
        text: "Horizen er ikke ansvarlig for indirekte tab, herunder driftstab, tabt fortjeneste eller tab af data. Vores ansvar kan maksimalt udgøre det beløb, kunden har betalt for den pågældende ydelse.",
      },
    ],
  },
  {
    heading: "Resultater og ændringer (SEO, branding m.m.)",
    blocks: [
      {
        type: "p",
        text: "Horizen leverer sit arbejde efter anerkendte principper og bedste praksis inden for blandt andet SEO, branding samt UI og UX. Vi kan dog ikke garantere bestemte resultater inden for SEO eller beslægtede discipliner, da resultaterne afhænger af en række forhold uden for vores kontrol, herunder søgemaskinernes algoritmer, konkurrencesituationen og markedet generelt.",
      },
      {
        type: "p",
        text: "Foretager kunden, eller en tredjepart på kundens vegne, efterfølgende ændringer på hjemmesiden, som vi ikke har anbefalet eller er blevet informeret om, kan Horizen ikke holdes ansvarlig for eventuelle negative konsekvenser heraf, herunder forringede resultater inden for SEO, branding eller lignende.",
      },
      {
        type: "p",
        text: "Skyldes en fejl eller skade på hjemmesiden ændringer foretaget af kunden eller en tredjepart, for eksempel en anden leverandør, og ikke forhold hos Horizen, er udbedring ikke omfattet af den gratis fejlretning. Vi hjælper naturligvis gerne med at rette op på det, men det afregnes særskilt på timebasis. Viser det sig derimod, at fejlen skyldes forhold hos Horizen, udbedrer vi den uden beregning.",
      },
      {
        type: "p",
        text: "Vi rådgiver altid ud fra, hvad vi vurderer er bedst for hjemmesiden, men det er kundens ansvar at følge disse anbefalinger. Vælger kunden at afvige fra vores anbefalinger, sker det på kundens eget ansvar.",
      },
    ],
  },
  {
    heading: "Reference, portfolio og kreditering",
    blocks: [
      {
        type: "p",
        text: "Horizen må omtale og vise det færdige arbejde som reference, herunder i portfolio og markedsføring, medmindre kunden skriftligt frabeder sig det.",
      },
      {
        type: "p",
        text: 'Horizen har desuden som udgangspunkt ret til at placere en diskret kreditering med link i bunden af de hjemmesider, vi udvikler, for eksempel "Lavet af Horizen". Krediteringen bliver stående i mindst et år, medmindre andet aftales.',
      },
    ],
  },
  {
    heading: "Data efter ophør",
    blocks: [
      {
        type: "p",
        text: "Ved ophør opbevares kundens data og hjemmeside i en periode på 30 dage, hvorefter det slettes. Kunden opfordres til selv at sikre en kopi af relevant data inden ophør.",
      },
    ],
  },
  {
    heading: "Opsigelse",
    blocks: [
      {
        type: "p",
        text: "Den løbende service ophører ved manglende fornyelse, jf. pkt. 4. Ved væsentlig misligholdelse kan begge parter opsige samarbejdet med rimeligt varsel. Ved manglende fornyelse tages hjemmesiden offline efter en rimelig periode, og kunden varsles inden.",
      },
    ],
  },
  {
    heading: "Force majeure",
    blocks: [
      {
        type: "p",
        text: "Horizen er ikke ansvarlig for manglende opfyldelse, der skyldes forhold uden for vores kontrol, herunder nedbrud hos leverandører, strømsvigt, hackerangreb og lignende.",
      },
    ],
  },
  {
    heading: "Ændringer af betingelserne",
    blocks: [
      {
        type: "p",
        text: "Horizen kan opdatere disse betingelser. Væsentlige ændringer varsles med rimeligt varsel, og de til enhver tid gældende betingelser findes på horizen.dk.",
      },
    ],
  },
  {
    heading: "Lovvalg og værneting",
    blocks: [
      {
        type: "p",
        text: "Enhver aftale er underlagt dansk ret. Tvister søges løst i mindelighed og afgøres ellers ved de danske domstole.",
      },
    ],
  },
  {
    heading: "Kontakt",
    blocks: [
      {
        type: "p",
        text: "Spørgsmål kan rettes til ajg@horizen.dk.",
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

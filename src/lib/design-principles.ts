/**
 * Designprincipper, bibliotek over UX- og designprincipper.
 *
 * Single source of truth: PRINCIPLE_SLUGS er den autoritative liste.
 * Alt andet (designPrinciples, illustrations-map, content-registry) er typet
 * mod PrincipleSlug, så TypeScript fanger drift før det rammer produktion.
 *
 * Inspireret af Jon Yablonskis Laws of UX (https://lawsofux.com).
 * Indholdet skrives i Horizens egen tone og krediterer den oprindelige kilde.
 */

export type PrincipleCategory =
  | "Perception"
  | "Kognition"
  | "Hukommelse"
  | "Opmærksomhed"
  | "Adfærd";

/** Autoritativ liste over alle slug-IDs. Tilføj nye principper her først. */
export const PRINCIPLE_SLUGS = [
  "aestetik-usability-effekten",
  "chunking",
  "kognitive-bias",
  "kognitiv-belastning",
  "doherty-graensen",
  "fitts-lov",
  "flow",
  "maal-gradient-effekten",
  "hicks-lov",
  "jakobs-lov",
  "loven-om-faelles-omraade",
  "naerhedsloven",
  "praegnanz",
  "lighedsloven",
  "ensartet-forbindelse",
  "mental-model",
  "millers-lov",
  "occams-ragekniv",
  "aktiv-bruger-paradoks",
  "pareto-princippet",
  "parkinsons-lov",
  "peak-end-reglen",
  "postels-lov",
  "selektiv-opmaerksomhed",
  "seriel-position",
  "teslers-lov",
  "von-restorff",
  "arbejdshukommelse",
  "zeigarnik-effekten",
  "valg-overload",
] as const;

export type PrincipleSlug = (typeof PRINCIPLE_SLUGS)[number];

export interface DesignPrinciple {
  slug: PrincipleSlug;
  title: string;
  excerpt: string;
  category: PrincipleCategory;
  href: string;
}

function make(
  slug: PrincipleSlug,
  title: string,
  excerpt: string,
  category: PrincipleCategory,
): DesignPrinciple {
  return {
    slug,
    title,
    excerpt,
    category,
    href: `/ressourcer/designprincipper/${slug}`,
  };
}

export const designPrinciples: DesignPrinciple[] = [
  make("aestetik-usability-effekten", "Aesthetic-Usability Effect",
    "Folk oplever æstetisk design som mere brugervenligt, også når det objektivt set ikke er det.",
    "Perception"),
  make("chunking", "Chunking",
    "Mennesker husker information bedre, når den er delt op i mindre, meningsfulde grupper.",
    "Hukommelse"),
  make("kognitive-bias", "Cognitive Bias",
    "Hjernen tager mentale genveje. Godt design tager højde for det i stedet for at kæmpe imod.",
    "Kognition"),
  make("kognitiv-belastning", "Cognitive Load",
    "Hver beslutning og hver visuel støj koster mental energi. Reducer det, der ikke betaler sig.",
    "Kognition"),
  make("doherty-graensen", "Doherty Threshold",
    "Når en computer svarer på under 400 ms, falder brugerens fokus ikke fra hinanden.",
    "Adfærd"),
  make("fitts-lov", "Fitts's Law",
    "Tiden det tager at ramme et mål afhænger af afstanden og størrelsen. Store knapper tæt på, tak.",
    "Adfærd"),
  make("flow", "Flow",
    "Den tilstand hvor opgave og evne matcher. Designets job er ikke at forstyrre den.",
    "Adfærd"),
  make("maal-gradient-effekten", "Goal-Gradient Effect",
    "Jo tættere folk er på målet, jo hurtigere bevæger de sig. Vis fremdrift.",
    "Opmærksomhed"),
  make("hicks-lov", "Hick's Law",
    "Beslutningstiden vokser med antallet af valg. Færre muligheder = hurtigere handling.",
    "Kognition"),
  make("jakobs-lov", "Jakob's Law",
    "Brugere forventer at din side fungerer som alle de andre sider, de allerede kender.",
    "Adfærd"),
  make("loven-om-faelles-omraade", "Law of Common Region",
    "Elementer i samme afgrænsede område opfattes som en gruppe, selv uden andre lighedstegn.",
    "Perception"),
  make("naerhedsloven", "Law of Proximity",
    "Elementer der er tæt på hinanden, opleves som beslægtede. Afstand fortæller en historie.",
    "Perception"),
  make("praegnanz", "Law of Prägnanz",
    "Hjernen fortolker komplekse billeder som den enkleste mulige form. Klar struktur vinder.",
    "Perception"),
  make("lighedsloven", "Law of Similarity",
    "Ting der ligner hinanden, opfattes som havende samme funktion. Ensartethed skaber forventning.",
    "Perception"),
  make("ensartet-forbindelse", "Law of Uniform Connectedness",
    "Visuelt forbundne elementer opfattes som mere relaterede end blot tætheden indikerer.",
    "Perception"),
  make("mental-model", "Mental Model",
    "Brugeren har en idé om hvordan tingene virker. Mismatch mellem den og virkeligheden = frustration.",
    "Kognition"),
  make("millers-lov", "Miller's Law",
    "Arbejdshukommelsen kan holde 7±2 ting ad gangen. Designs der respekterer det, føles ubesværet.",
    "Hukommelse"),
  make("occams-ragekniv", "Occam's Razor",
    "Blandt løsninger der virker, er den enkleste oftest den bedste. Skær fra, indtil det stadig virker.",
    "Kognition"),
  make("aktiv-bruger-paradoks", "Paradox of the Active User",
    "Folk vil bruge, ikke lære. De læser ikke manualen før de prøver. Designet skal forklare sig selv.",
    "Adfærd"),
  make("pareto-princippet", "Pareto Principle",
    "Omkring 80% af effekten kommer fra 20% af årsagerne. Find de 20%, og prioriter dem.",
    "Adfærd"),
  make("parkinsons-lov", "Parkinson's Law",
    "Opgaven fylder den tid der er til den. Sætter du tidspres på et flow, færdiggør folk hurtigere.",
    "Adfærd"),
  make("peak-end-reglen", "Peak-End Rule",
    "Folk husker oplevelser ud fra højdepunktet og slutningen, ikke gennemsnittet.",
    "Hukommelse"),
  make("postels-lov", "Postel's Law",
    "Vær konservativ i hvad du sender, liberal i hvad du accepterer. Tilgivende inputfelter vinder.",
    "Adfærd"),
  make("selektiv-opmaerksomhed", "Selective Attention",
    "Hjernen filtrerer aktivt det irrelevante fra. Også dine vigtige beskeder, hvis de ligner reklame.",
    "Opmærksomhed"),
  make("seriel-position", "Serial Position Effect",
    "Folk husker det første og det sidste bedst. Placer det vigtigste i enderne.",
    "Hukommelse"),
  make("teslers-lov", "Tesler's Law",
    "Et system har en iboende mængde kompleksitet. Spørgsmålet er, hvem der skal håndtere den.",
    "Kognition"),
  make("von-restorff", "Von Restorff Effect",
    "Det der skiller sig ud, huskes. Brug det sparsomt, ellers udjævner forskellen sig.",
    "Hukommelse"),
  make("arbejdshukommelse", "Working Memory",
    "Den midlertidige mentale notesblok. Hold den let belastet, og designet føles intuitivt.",
    "Hukommelse"),
  make("zeigarnik-effekten", "Zeigarnik Effect",
    "Uafsluttede opgaver bliver hængende i hovedet. Synlige fremdriftsmål driver folk videre.",
    "Opmærksomhed"),
  make("valg-overload", "Choice Overload",
    "For mange muligheder lammer beslutninger. Kurater i stedet for at præsentere alt på én gang.",
    "Kognition"),
];

// Sanity-check ved modul-load: PRINCIPLE_SLUGS og designPrinciples skal være i synk.
// Fanges i dev og under build, aldrig i prod uden at vi har set det først.
if (process.env.NODE_ENV !== "production") {
  const built = new Set(designPrinciples.map((p) => p.slug));
  for (const slug of PRINCIPLE_SLUGS) {
    if (!built.has(slug)) {
      throw new Error(
        `[design-principles] PRINCIPLE_SLUGS contains "${slug}" but no entry in designPrinciples`,
      );
    }
  }
  if (built.size !== PRINCIPLE_SLUGS.length) {
    throw new Error(
      `[design-principles] Slug count mismatch, PRINCIPLE_SLUGS: ${PRINCIPLE_SLUGS.length}, designPrinciples: ${built.size}`,
    );
  }
}

export function getPrincipleBySlug(slug: string) {
  return designPrinciples.find((p) => p.slug === slug);
}

/** Deterministisk hash af en streng, bruges til stabil, slug-baseret picking. */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return h;
}

/**
 * Vælg N relaterede principper (eksklusiv det aktuelle).
 *
 * Pickingen er deterministisk pr. slug, samme princip viser altid de
 * samme relaterede. Det giver stabile interne links til SEO og en
 * konsekvent oplevelse på tværs af genindlæsninger.
 *
 * Trækker bredt fra hele biblioteket (ikke kun samme kategori), så
 * læseren opdager principper udenfor sit umiddelbare univers.
 */
export function getRelatedPrinciples(
  currentSlug: string,
  count = 3,
  pool: DesignPrinciple[] = designPrinciples,
): DesignPrinciple[] {
  return pool
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({ p, score: hashStr(`${currentSlug}:${p.slug}`) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
    .map((x) => x.p);
}

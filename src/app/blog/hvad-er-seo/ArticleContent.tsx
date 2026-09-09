"use client";

import { motion } from "framer-motion";
import ArticleLayout from "@/components/ArticleLayout";
import { fadeInUp } from "@/lib/animations";
import { getPostBySlug, getRelatedArticles } from "@/lib/blog-data";

const phases = [
  {
    n: 1,
    title: "Teknisk fundament",
    tier: "Fundamentet",
    desc: "Kan Google finde, læse og indeksere siderne. Sitemap, hastighed, mobil. Uden det virker resten ikke.",
    accent: "bg-amber-500/15 text-amber-300",
  },
  {
    n: 2,
    title: "On-page på siderne",
    tier: "Mest kontrol",
    desc: "Ét klart søgeord pr. side i titel og overskrifter, og sider der linker internt til hinanden. Her får du mest for indsatsen.",
    accent: "bg-blue-500/15 text-blue-300",
  },
  {
    n: 3,
    title: "Indhold der svarer på spørgsmål",
    tier: "Størst løft",
    desc: "Guides og artikler der besvarer det, folk faktisk søger på. Oftest den største kilde til ny trafik.",
    accent: "bg-emerald-500/15 text-emerald-300",
  },
  {
    n: 4,
    title: "Autoritet udefra",
    tier: "Forstærker",
    desc: "Links og omtale fra andre troværdige sites. Langsomt og delvist uden for din kontrol, så det kommer sidst.",
    accent: "bg-purple-500/15 text-purple-300",
  },
];

function PriorityLadder() {
  return (
    <figure className="my-10">
      <div className="rounded-2xl bg-[#0f0f0f] p-6 text-[#f5f5f0] sm:p-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
          Byg indefra og ud
        </span>
        <ol className="mt-5">
          {phases.map((p, i) => (
            <motion.li
              key={p.n}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeInUp}
              className="flex items-start gap-4 border-b border-white/[0.06] py-4 last:border-0"
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${p.accent}`}
              >
                {p.n}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-semibold">{p.title}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.accent}`}>
                    {p.tier}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-white/50">{p.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>
        <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
            Hele vejen igennem
          </p>
          <p className="mt-1 text-sm text-white/50">
            Billeder, hastighed og alt-tekst løbende. Og claim dine profiler på Google Business og Bing.
          </p>
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-muted">
        Prioriteringsrækkefølgen: fra det du styrer selv, til det du ikke styrer.
      </figcaption>
    </figure>
  );
}

const stages = [
  { time: "Uge 1-4", what: "Genindekseret", height: "26%", opacity: 0.5 },
  { time: "1-3 mdr", what: "On-page op", height: "48%", opacity: 0.68 },
  { time: "3-6 mdr", what: "Guides rangerer", height: "74%", opacity: 0.84 },
  { time: "6-12 mdr", what: "Sammensat effekt", height: "100%", opacity: 1 },
];

function ResultsTimeline() {
  return (
    <figure className="my-10">
      <div className="rounded-2xl bg-[#0f0f0f] p-6 text-[#f5f5f0] sm:p-8">
        <div className="mb-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
            Resultater over tid
          </span>
        </div>

        <div className="flex h-44 items-end gap-2 sm:gap-4">
          {stages.map((s, i) => (
            <motion.div
              key={s.time}
              className="flex-1 rounded-t-lg bg-[#00b67a]"
              style={{ height: s.height, opacity: s.opacity, transformOrigin: "bottom" }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          ))}
        </div>

        <div className="mt-4 flex gap-2 border-t border-white/[0.06] pt-4 sm:gap-4">
          {stages.map((s) => (
            <div key={s.time} className="flex-1 text-center">
              <p className="text-[11px] font-semibold sm:text-xs">{s.time}</p>
              <p className="mt-0.5 text-[11px] leading-tight text-white/45 sm:text-xs">
                {s.what}
              </p>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-muted">
        Resultaterne bygger sig op trin for trin. Små, tekniske tegn først, så rigtig trafik. Illustrativt forløb.
      </figcaption>
    </figure>
  );
}

const faqs = [
  {
    q: "Er SEO en engangsopgave?",
    a: "Nej. Det er den største misforståelse, vi møder. Man skriver ikke bare nogle tekster én gang og rangerer så for evigt. SEO er løbende arbejde: analysere, justere, skrive om og holde øje, måned efter måned. Det er der, resultaterne kommer fra.",
  },
  {
    q: "Kan jeg se resultater, før alt er på plads?",
    a: "Ja. De fleste tidlige gevinster kommer fra de første trin, længe før du overhovedet rører linkbuilding.",
  },
  {
    q: "Skal jeg starte med linkbuilding?",
    a: "Nej. Links er sidste trin. Uden stærkt indhold at pege på er det spildt arbejde.",
  },
  {
    q: "Hvor lang tid tager SEO?",
    a: "Mærkbare resultater efter tre til seks måneder, betydelige efter seks til tolv. Det bygger sig op og bliver ved med at arbejde.",
  },
  {
    q: "Kan små virksomheder rangere mod de store?",
    a: "Ja. På lokale og specifikke søgninger vinder den mest relevante side, ikke den største virksomhed.",
  },
];

function Content() {
  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        variants={fadeInUp}
      >
        <p className="text-lg font-medium leading-relaxed text-foreground">
          Den største misforståelse om SEO er, at det er en engangsopgave. At man får skrevet nogle
          tekster ud fra en søgeordsanalyse, lægger dem på hjemmesiden, og så rangerer man for
          altid. Sådan fungerer det ikke. SEO er løbende arbejde, og det bygges op i en bestemt
          rækkefølge.
        </p>
        <p className="mt-4 text-lg italic leading-relaxed text-muted-foreground">
          Tænk på det som et træningscenter. Går du derned én gang, ser du ingen resultater. Det er
          den tilbagevendende rutine der rykker: du kommer igen en eller to gange om ugen, holder
          øje med hvad der virker, og justerer. Og stopper du med at komme, falder resultaterne
          igen, og du skal starte forfra. Præcis sådan er SEO.
        </p>
      </motion.div>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={1}
        variants={fadeInUp}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Hvad er SEO?
        </h2>
        <p className="mt-4 text-muted leading-relaxed">
          SEO (search engine optimization) er kort sagt arbejdet med at gøre din hjemmeside nemmere
          at finde på Google, når nogen søger efter det, du tilbyder. Ikke ved tricks, men ved at
          være det bedste svar på det, folk leder efter.
        </p>
        <p className="mt-4 text-muted leading-relaxed">
          Det koger ned til tre ting: at gøre det nemt for Google at finde din side, at forstå hvad
          den handler om, og at stole på, at den er det bedste svar. Kort sagt teknik, indhold og
          troværdighed. Resten er detaljer.
        </p>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={2}
        variants={fadeInUp}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Hvad er vigtigst? Byg indefra og ud
        </h2>
        <p className="mt-4 text-muted leading-relaxed">
          Start med det, du selv styrer 100 procent, og bevæg dig udad mod det, du ikke styrer. Det
          giver fire trin, der bygger på hinanden. Du behøver ikke være igennem dem alle for at se
          effekt. Tværtimod kommer det meste fra de første tre.
        </p>
        <PriorityLadder />
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={3}
        variants={fadeInUp}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Kan man rangere uden backlinks?
        </h2>
        <p className="mt-4 text-muted leading-relaxed">
          Først kort: et backlink er bare et link fra en anden hjemmeside ind til din. Google ser
          det lidt som en anbefaling. Og svaret er ja, man kan sagtens rangere uden dem. Det er den
          største misforståelse i SEO. Troen på, at man først kan være med, når andre linker til en,
          passer kun på de allerhårdeste søgeord, hvor alle slås. På lokale og nichede fagord kan en
          velbygget side rangere på indhold alene.
        </p>
        <p className="mt-4 text-muted leading-relaxed">
          Links er en forstærker, ikke en adgangsbillet. De afgør de sværeste ord, ikke om du
          overhovedet kan komme med. Derfor kommer de sidst, oven på et fundament der allerede virker.
        </p>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={4}
        variants={fadeInUp}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Hvornår ser du resultater?
        </h2>
        <p className="mt-4 text-muted leading-relaxed">
          SEO er ikke en kontakt, du tænder. Det er en kurve, der bygger sig op. De første tegn er
          små og tekniske: siderne bliver genindekseret, og der dukker nye søgeord op i Search
          Console. De rigtige forretningsresultater, klik og henvendelser, følger efter.
        </p>
        <ResultsTimeline />
        <p className="mt-4 text-muted leading-relaxed">
          Tommelfingerregel: mærkbare resultater efter tre til seks måneder, betydelige efter seks
          til tolv. Og fordi hver ny side bliver ved med at arbejde for dig, stopper det ikke. Det
          lægger sig oven i hinanden.
        </p>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={5}
        variants={fadeInUp}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Hvad med Bing og AI-søgning?
        </h2>
        <p className="mt-4 text-muted leading-relaxed">
          Du laver ikke forskellig SEO til hver platform. Gør du det godt for Google, følger Bing og
          de andre med, fordi de læser de samme signaler. Det eneste, der er værd at gøre
          platform-specifikt, er at claime dine profiler: Bing Webmaster Tools tager fem minutter og
          kan importere direkte fra Google, og din Google Business-profil løfter de lokale søgninger.
        </p>
        <p className="mt-4 text-muted leading-relaxed">
          AI-svar som ChatGPT og Google AI Overviews trækker på det samme velstrukturerede indhold.
          Du bygger til dem med de samme greb, ikke med en separat indsats.
        </p>
      </motion.section>

      <motion.blockquote
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={6}
        variants={fadeInUp}
        className="my-16 border-l-2 border-foreground pl-6 md:pl-8"
      >
        <p className="text-xl font-medium leading-snug tracking-tight md:text-2xl">
          &ldquo;SEO belønner den, der bygger fundamentet først. Ikke den, der jagter genveje.&rdquo;
        </p>
        <cite className="mt-4 block text-sm text-muted not-italic">
          Anne-Sofie, Marketing Lead hos Horizen
        </cite>
      </motion.blockquote>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={7}
        variants={fadeInUp}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Ofte stillede spørgsmål
        </h2>
        <div className="mt-6 space-y-0">
          {faqs.map((f) => (
            <div
              key={f.q}
              className="border-b border-foreground/[0.06] py-6 first:border-t first:border-foreground/[0.06]"
            >
              <h3 className="text-lg font-semibold tracking-tight">{f.q}</h3>
              <p className="mt-2 text-muted leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={8}
        variants={fadeInUp}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Kom godt i gang</h2>
        <p className="mt-4 text-muted leading-relaxed">
          Den bedste SEO-strategi er den, du rent faktisk fører ud i livet, i den rigtige
          rækkefølge. Sørg for, at Google kan finde og forstå dine sider, skriv hver side skarpt op
          mod ét søgeord, og byg så indhold, der svarer på det, dine kunder faktisk spørger om.
          Resten forstærker. Og husk: det er løbende arbejde, ikke noget du laver én gang og glemmer.
        </p>
        <p className="mt-4 text-muted leading-relaxed">
          Vil du have hjælp til at lægge rækkefølgen for din side, så{" "}
          <a
            href="/kontakt"
            className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/60"
          >
            tag en snak
          </a>
          . Vi bygger til at holde, fra fundamentet og op.
        </p>
      </motion.section>
    </>
  );
}

export default function ArticleContent() {
  const post = getPostBySlug("hvad-er-seo")!;
  const related = getRelatedArticles("hvad-er-seo");

  return (
    <ArticleLayout
      title={post.title}
      excerpt={post.excerpt}
      image={post.image.replace("w=800", "w=1400").replace("h=500", "h=800")}
      author={post.author}
      date={post.date}
      readTime={post.readTime}
      tags={post.tags}
      content={<Content />}
      relatedArticles={related}
    />
  );
}

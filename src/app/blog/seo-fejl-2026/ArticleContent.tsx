"use client";

import { motion } from "framer-motion";
import ArticleLayout from "@/components/ArticleLayout";
import { fadeInUp } from "@/lib/animations";
import { getPostBySlug, getRelatedArticles } from "@/lib/blog-data";

function Content() {
  const mistakes = [
    {
      number: "01",
      title: "Ignorerer Core Web Vitals",
      text: "Google prioriterer brugeroplevelse højere end nogensinde. Hvis din side er langsom, hopper brugerne — og Google straffer dig i søgeresultaterne. LCP, FID og CLS er ikke bare forkortelser, de er dit fundament.",
    },
    {
      number: "02",
      title: "Ingen lokal SEO-strategi",
      text: "Hvis du er en lokal virksomhed uden en optimeret Google Business-profil, misser du de kunder der aktivt søger efter dine services i nærområdet. Lokal SEO er lavthængende frugt med kæmpe ROI.",
    },
    {
      number: "03",
      title: "Tyndt indhold uden søgeintention",
      text: "At skrive 300 ord om alt og ingenting hjælper ingen. Google belønner dybdegående, relevant indhold der rent faktisk besvarer brugerens spørgsmål. Kvalitet slår kvantitet — hver gang.",
    },
    {
      number: "04",
      title: "Dårlig intern linkstruktur",
      text: "Dine sider skal tale sammen. Uden en logisk intern linkstruktur kan Google ikke forstå hierarkiet på din side, og vigtige sider risikerer at forsvinde i mørket.",
    },
    {
      number: "05",
      title: "Manglende mobil-optimering",
      text: "Over 60% af alle søgninger sker på mobil. Hvis din hjemmeside ikke er responsive og hurtig på mobil, taber du kampen før den overhovedet er begyndt.",
    },
  ];

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        variants={fadeInUp}
      >
        <p className="text-lg leading-relaxed text-muted-foreground">
          SEO ændrer sig konstant, men nogle fejl er tidløse. Vi ser dem igen og
          igen hos virksomheder der ellers gør alt rigtigt — men mister kunder
          på grund af simple, undgåelige fejl i deres digitale strategi.
        </p>
      </motion.div>

      <div className="mt-12 space-y-0">
        {mistakes.map((mistake, i) => (
          <motion.div
            key={mistake.number}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
            variants={fadeInUp}
            className="border-b border-foreground/[0.06] py-8 first:pt-0 last:border-b-0"
          >
            <div className="flex gap-6">
              <span className="text-4xl font-bold text-foreground/10 shrink-0 tabular-nums">
                {mistake.number}
              </span>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {mistake.title}
                </h2>
                <p className="mt-3 text-muted leading-relaxed">
                  {mistake.text}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pull quote */}
      <motion.blockquote
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={2}
        variants={fadeInUp}
        className="my-16 border-l-2 border-foreground pl-6 md:pl-8"
      >
        <p className="text-xl font-medium leading-snug tracking-tight md:text-2xl">
          &ldquo;Den bedste SEO-strategi er den du faktisk implementerer. Start
          med grundlaget — resten følger.&rdquo;
        </p>
        <cite className="mt-4 block text-sm text-muted not-italic">
          — Anne-Sofie, Marketing Lead hos Horizen
        </cite>
      </motion.blockquote>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={3}
        variants={fadeInUp}
      >
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Hvad nu?
        </h2>
        <p className="mt-4 text-muted leading-relaxed">
          Hvis du genkender en eller flere af disse fejl, er du ikke alene.
          De gode nyheder er at de alle kan fikses — og resultaterne viser sig
          ofte hurtigere end du tror. En struktureret SEO-indsats er en af de
          mest rentable investeringer en virksomhed kan foretage.
        </p>
        <p className="mt-4 text-muted leading-relaxed">
          Hos Horizen hjælper vi virksomheder med at bygge en digital
          tilstedeværelse der ikke bare ser godt ud, men som også performer i
          søgeresultaterne.
        </p>
      </motion.div>
    </>
  );
}

export default function ArticleContent() {
  const post = getPostBySlug("seo-fejl-2026")!;
  const related = getRelatedArticles("seo-fejl-2026");

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

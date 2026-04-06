"use client";

import { motion } from "framer-motion";
import ArticleLayout from "@/components/ArticleLayout";
import { fadeInUp } from "@/lib/animations";
import { getPostBySlug, getRelatedArticles } from "@/lib/blog-data";

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
        <p className="text-lg leading-relaxed text-muted-foreground">
          Kunstig intelligens er ikke længere science fiction — det er en
          integreret del af den måde vi arbejder på hos Horizen. Men vi bruger
          ikke AI til at erstatte kreativitet. Vi bruger det til at forstærke
          den.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={1}
        variants={fadeInUp}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Hvorfor AI i designprocessen?
        </h2>
        <p className="mt-4 text-muted leading-relaxed">
          Traditionelt webdesign kræver utallige iterationer. Farvepaletter,
          layout-variationer, typografi-tests — alt sammen tager tid. Med AI kan
          vi generere hundredvis af variationer på sekunder og hurtigt
          identificere de bedste retninger.
        </p>
        <p className="mt-4 text-muted leading-relaxed">
          Det betyder ikke at vi blindt følger maskinens forslag. Tværtimod — AI
          giver os et bredere udgangspunkt, som vores designere derefter
          kurerer, forbedrer og tilpasser til kundens unikke behov.
        </p>
      </motion.div>

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
          &ldquo;AI giver os superkræfter — men det er stadig mennesker der
          træffer de kreative beslutninger.&rdquo;
        </p>
        <cite className="mt-4 block text-sm text-muted not-italic">
          — José, Digital Designer hos Horizen
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
          Vores AI-drevne workflow
        </h2>
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl bg-accent/50 p-6">
            <h3 className="font-semibold">1. Research & Analyse</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Vi bruger AI til at analysere konkurrenternes digitale
              tilstedeværelse, identificere trends i branchen og forstå
              målgruppens præferencer.
            </p>
          </div>
          <div className="rounded-2xl bg-accent/50 p-6">
            <h3 className="font-semibold">2. Design Exploration</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              AI-assisteret generering af layout-koncepter, farvepaletter og
              typografi-kombinationer giver os et bredt fundament at arbejde ud
              fra.
            </p>
          </div>
          <div className="rounded-2xl bg-accent/50 p-6">
            <h3 className="font-semibold">3. Prototyping & Iteration</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Hurtigere prototyping med AI-genereret kode og komponenter.
              Det giver mere tid til det der virkelig tæller: brugeroplevelsen.
            </p>
          </div>
          <div className="rounded-2xl bg-accent/50 p-6">
            <h3 className="font-semibold">4. Kvalitetssikring</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              AI hjælper os med at teste tilgængelighed, performance og
              cross-browser kompatibilitet — så vi leverer fejlfrie produkter.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={4}
        variants={fadeInUp}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Hvad betyder det for dig?
        </h2>
        <p className="mt-4 text-muted leading-relaxed">
          Som kunde får du kortere leveringstider, flere designmuligheder at
          vælge imellem, og et slutprodukt der er gennemtestet og optimeret.
          Du betaler ikke for de timer AI sparer os — du får værdien af dem.
        </p>
        <p className="mt-4 text-muted leading-relaxed">
          Samme timer, samme dedikation — bare med endnu mere værdi for din
          forretning. Drevet af erfaring. Forstærket af AI.
        </p>
      </motion.div>
    </>
  );
}

export default function ArticleContent() {
  const post = getPostBySlug("ai-webdesign")!;
  const related = getRelatedArticles("ai-webdesign");

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

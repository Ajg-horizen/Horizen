"use client";

import { motion } from "framer-motion";
import ArticleLayout from "@/components/ArticleLayout";
import { fadeInUp } from "@/lib/animations";
import { getPostBySlug, getRelatedArticles } from "@/lib/blog-data";

function Content() {
  const steps = [
    {
      icon: "🎨",
      title: "Design i Figma",
      description:
        "Alt starter i Figma. Vi designer med Auto Layout, komponent-varianter og Design Tokens — så designet er struktureret fra dag ét og klar til at blive oversat til kode.",
    },
    {
      icon: "📐",
      title: "Design Review & Handoff",
      description:
        "Før en eneste linje kode skrives, gennemgår vi designet sammen. Vi sikrer at spacing, typografi og farver er konsistente og mappes direkte til Tailwind utility-klasser.",
    },
    {
      icon: "⚡",
      title: "Komponent-udvikling",
      description:
        "Vi bygger atomare komponenter først — knapper, inputs, badges. Derefter sammensætter vi dem til komplekse sektioner. Hver komponent er isoleret, testbar og genbrugelig.",
    },
    {
      icon: "🔄",
      title: "Iteration & Feedback",
      description:
        "Med preview-deploys på Vercel kan kunden se fremskridtet i realtid. Feedback integreres løbende — ikke som en eftertanke i slutningen af projektet.",
    },
    {
      icon: "🚀",
      title: "Launch & Optimering",
      description:
        "Vi launcher ikke bare og går videre. Performance-audit, SEO-check og tilgængeligheds-test er standard. Først når alt er grønt, er vi tilfredse.",
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
          At gå fra et smukt Figma-design til en produktionsklar hjemmeside er
          en kunst i sig selv. Hos Horizen har vi finpudset vores workflow over
          mange projekter — og resultatet er en proces der er hurtig,
          forudsigelig og leverer pixel-perfekte resultater.
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
          Vores tech stack
        </h2>
        <p className="mt-4 text-muted leading-relaxed">
          Vi har valgt en moderne stack der prioriterer developer experience og
          slutbrugerens performance lige højt:
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel", "Figma", "GitHub"].map(
            (tech) => (
              <span
                key={tech}
                className="rounded-full border border-foreground/[0.08] bg-accent/50 px-4 py-2 text-sm font-medium"
              >
                {tech}
              </span>
            )
          )}
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={2}
        variants={fadeInUp}
        className="mt-16"
      >
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Processen, trin for trin
        </h2>
      </motion.div>

      <div className="mt-8 space-y-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
            variants={fadeInUp}
            className="flex gap-5 rounded-2xl bg-accent/50 p-6"
          >
            <span className="text-2xl shrink-0">{step.icon}</span>
            <div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {step.description}
              </p>
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
          &ldquo;God kode er usynlig — den bare virker. Det er det vi stræber
          efter i hvert eneste projekt.&rdquo;
        </p>
        <cite className="mt-4 block text-sm text-muted not-italic">
          — Johanne, Web Developer hos Horizen
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
          Resultatet
        </h2>
        <p className="mt-4 text-muted leading-relaxed">
          Med denne workflow leverer vi typisk en komplet hjemmeside på 3-5
          uger — fra første design-møde til lancering. Og fordi alt er bygget
          med moderne teknologier, er vedligeholdelse og videreudvikling både
          hurtigere og billigere.
        </p>
      </motion.div>
    </>
  );
}

export default function ArticleContent() {
  const post = getPostBySlug("figma-til-kode")!;
  const related = getRelatedArticles("figma-til-kode");

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

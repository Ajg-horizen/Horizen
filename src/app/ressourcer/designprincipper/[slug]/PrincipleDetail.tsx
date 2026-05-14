import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PrincipleIllustration } from "@/components/principle-illustrations";
import { illustrationBg } from "@/lib/principle-bg";
import type { PrincipleContent } from "@/components/principle-content";
import { isPublished } from "@/components/principle-content";
import {
  designPrinciples,
  getRelatedPrinciples,
  type DesignPrinciple,
} from "@/lib/design-principles";

interface Props {
  principle: DesignPrinciple;
  content: PrincipleContent | null;
}

export default function PrincipleDetail({ principle, content }: Props) {
  const bg = illustrationBg(principle.category);
  // Træk kun fra udgivne principper — vi linker aldrig til skjulte sider
  const publishedPool = designPrinciples.filter((p) => isPublished(p.slug));
  const related = getRelatedPrinciples(principle.slug, 3, publishedPool);

  return (
    <>
      <Navbar alwaysVisible />
      <main className="min-h-screen bg-background pt-32">
        <Container size="article">
          {/* Back link */}
          <Link
            href="/ressourcer/designprincipper"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Alle designprincipper
          </Link>

          {/* Header */}
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              {principle.category}
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {principle.title}
            </h1>
          </div>

          {/* Illustration */}
          <div
            className="mt-12 aspect-[16/9] overflow-hidden rounded-3xl"
            style={{ backgroundColor: bg }}
          >
            <PrincipleIllustration
              slug={principle.slug}
              bg={bg}
              className="h-full w-full"
            />
          </div>

          {/* Intro */}
          {content && (
            <p className="mt-12 text-xl leading-relaxed text-foreground md:text-2xl">
              {content.intro}
            </p>
          )}

          {/* Body */}
          <article className="mt-12">
            {content ? (
              content.body
            ) : (
              <div className="rounded-2xl border border-dashed border-foreground/15 p-8 text-center">
                <p className="text-muted">
                  Uddybende indhold til dette princip kommer snart.
                </p>
              </div>
            )}
          </article>

          {/* Sources */}
          {content && content.sources.length > 0 && (
            <aside className="mt-16">
              <h3 className="text-lg font-bold tracking-tight">Gå i dybden</h3>
              <p className="mt-3 max-w-2xl text-sm text-muted leading-relaxed">
                Begrebet er beskrevet og samlet af Jon Yablonski i hans
                projekt Laws of UX. Her er den oprindelige reference og den
                akademiske baggrund — kredit hører til dem der bærer arbejdet.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {content.sources.map((s, i) => {
                  const cardClass =
                    "group flex items-start justify-between gap-4 rounded-2xl border border-foreground/10 bg-white p-5 transition-[border-color,box-shadow,transform] duration-200";
                  const interactive =
                    "hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md hover:shadow-foreground/5";
                  const inner = (
                    <>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                          {s.source}
                        </p>
                        <p className="mt-2 text-base font-semibold leading-snug tracking-tight text-foreground">
                          {s.title}
                        </p>
                      </div>
                      {s.href && (
                        <ExternalLink className="mt-1 h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-foreground" />
                      )}
                    </>
                  );
                  return (
                    <li key={i}>
                      {s.href ? (
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${cardClass} ${interactive}`}
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className={cardClass}>{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </aside>
          )}
        </Container>

        {/* Related principles in same category */}
        {related.length > 0 && (
          <Container size="article" className="mt-24 mb-32">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Andre designprincipper
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => {
                const relatedBg = illustrationBg(p.category);
                return (
                  <li key={p.slug}>
                    <Link
                      href={p.href}
                      className="group block h-full transition-transform duration-300 hover:-translate-y-1.5"
                    >
                      <Card className="relative h-full overflow-hidden rounded-3xl border-border/50 bg-white transition-[border-color,box-shadow] duration-300 hover:border-foreground/30 hover:shadow-xl hover:shadow-foreground/5">
                        <div
                          className="relative h-44 overflow-hidden"
                          style={{ backgroundColor: relatedBg }}
                        >
                          <PrincipleIllustration
                            slug={p.slug}
                            bg={relatedBg}
                            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge
                              variant="secondary"
                              className="bg-white/85 border border-foreground/10 text-xs font-medium px-3 py-1"
                            >
                              {p.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold leading-tight tracking-tight">
                            {p.title}
                          </h3>
                          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
                            {p.excerpt}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Container>
        )}
        <Footer />
      </main>
    </>
  );
}

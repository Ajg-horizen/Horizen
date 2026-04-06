import type { Metadata } from "next";
import ArticleContent from "./ArticleContent";

export const metadata: Metadata = {
  title: "5 SEO-fejl der koster dig kunder i 2026 — Horizen",
  description:
    "De fleste virksomheder begår stadig grundlæggende SEO-fejl. Her er de fem mest kritiske — og hvordan du fikser dem.",
};

export default function Page() {
  return <ArticleContent />;
}

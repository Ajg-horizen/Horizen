import type { Metadata } from "next";
import ArticleContent from "./ArticleContent";

export const metadata: Metadata = {
  title: "Fra Figma til kode: Vores design-til-udvikling workflow — Horizen",
  description:
    "Et kig bag kulisserne på hvordan vi omsætter designs til pixel-perfekt kode med moderne værktøjer.",
};

export default function Page() {
  return <ArticleContent />;
}

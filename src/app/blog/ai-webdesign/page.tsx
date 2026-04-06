import type { Metadata } from "next";
import ArticleContent from "./ArticleContent";

export const metadata: Metadata = {
  title: "Sådan bruger vi AI til at levere bedre webdesign — Horizen",
  description:
    "Vi dykker ned i hvordan kunstig intelligens ændrer vores designproces — og hvad det betyder for dig som kunde.",
};

export default function Page() {
  return <ArticleContent />;
}

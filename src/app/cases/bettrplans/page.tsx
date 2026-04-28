import type { Metadata } from "next";
import CaseContent from "./CaseContent";

export const metadata: Metadata = {
  title: "BettrPlans — Webdesign & Interiør | Horizen",
  description:
    "Ny hjemmeside for BettrPlans — overblik der hjælper folk med at designe bedre interiører.",
};

export default function Page() {
  return <CaseContent />;
}

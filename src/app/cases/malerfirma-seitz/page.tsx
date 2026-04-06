import type { Metadata } from "next";
import CaseContent from "./CaseContent";

export const metadata: Metadata = {
  title: "Seitz — Branding & Webdesign | Horizen",
  description:
    "Komplet rebranding og ny hjemmeside for Seitz. 3x engagement og lavere omkostninger.",
};

export default function Page() {
  return <CaseContent />;
}

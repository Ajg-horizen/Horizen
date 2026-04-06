import type { Metadata } from "next";
import CaseContent from "./CaseContent";

export const metadata: Metadata = {
  title: "OD Pro — Webdesign & Udvikling | Horizen",
  description:
    "En professionel hjemmeside for OD Pro — et bilværksted i Glostrup. Se hvordan vi leverede +312% organisk trafik.",
};

export default function Page() {
  return <CaseContent />;
}

import type { Metadata } from "next";
import CaseContent from "./CaseContent";

export const metadata: Metadata = {
  title: "Never Another | Branding & Webdesign | Horizen",
  description: "Never Another. Branding og webdesign der balancerer det visuelle udtryk med en stærk teknisk grundstruktur.",
};

export default function Page() {
  return <CaseContent />;
}

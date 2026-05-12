import type { Metadata } from "next";
import CaseContent from "./CaseContent";

export const metadata: Metadata = {
  title: "Tandsundhed Uden Grænser | UI/UX & CMS | Horizen",
  description:
    "Komplet redesign for NGO. Fra forældet WPBakery til moderne CMS. Redigeringstiden reduceret med 83%.",
};

export default function Page() {
  return <CaseContent />;
}

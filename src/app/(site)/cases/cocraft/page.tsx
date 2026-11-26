import CaseContent from "./CaseContent";
import { cases } from "@/lib/cases";
import { caseMetadata, caseSchema, getCase } from "@/lib/case-page";

const c = getCase(cases, "cocraft");
const description =
  "CoCraft. En platform hvor kunder får deres idé lavet af en kunsthåndværker, bygget fra idé til live platform på en måned.";
const ogImage = "/cases/CoCraft-Hero-Model-1600w.webp";

export const metadata = caseMetadata(c, "CoCraft | Platform & UI/UX | Horizen", description, ogImage);

export default function Page() {
  return (
    <>
      <script
        id="schema-case-cocraft"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema(c, description, ogImage)) }}
      />
      <CaseContent />
    </>
  );
}

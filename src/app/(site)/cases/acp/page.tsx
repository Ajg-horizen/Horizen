import CaseContent from "./CaseContent";
import { cases } from "@/lib/cases";
import { caseMetadata, caseSchema, getCase } from "@/lib/case-page";

const c = getCase(cases, "acp");
const description =
  "ACP. En ny hjemmeside og løbende SEO for et rengøringsfirma i Horsens, bygget til at blive fundet lokalt. Forsiden indlæses på 1,3 sekunder på mobil.";
const ogImage = "/cases/ACP-MacBook-1600w.webp";

export const metadata = caseMetadata(c, "ACP | Webudvikling, UI/UX & SEO | Horizen", description, ogImage);

export default function Page() {
  return (
    <>
      <script
        id="schema-case-acp"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema(c, description, ogImage)) }}
      />
      <CaseContent />
    </>
  );
}

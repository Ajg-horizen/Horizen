import CaseContent from "./CaseContent";
import { cases } from "@/lib/cases";
import { caseMetadata, caseSchema, getCase } from "@/lib/case-page";

const c = getCase(cases, "hos-dam");
const description =
  "Hos Dam. Nyt site til kropsterapi i Brabrand med eget designsystem, online booking, blog og løbende SEO. 0 fejl i SEO-tjekket efter lancering.";
const ogImage = "/cases/HosDam-MacBook-1600w.webp";

export const metadata = caseMetadata(c, "Hos Dam | Webudvikling, UI/UX & SEO | Horizen", description, ogImage);

export default function Page() {
  return (
    <>
      <script
        id="schema-case-hos-dam"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema(c, description, ogImage)) }}
      />
      <CaseContent />
    </>
  );
}

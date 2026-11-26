import CaseContent from "./CaseContent";
import { cases } from "@/lib/cases";
import { caseMetadata, caseSchema, getCase } from "@/lib/case-page";

const c = getCase(cases, "malerfirma-seitz");
const description =
  "Malerfirma Seitz. En enkel landing page til et malerfirma uden hjemmeside, med Google Ads og konverteringssporing, der skaffer opgaver.";
const ogImage = "/cases/Seitz-Michael-1280w.webp";

export const metadata = caseMetadata(c, "Malerfirma Seitz | Webdesign & Google Ads | Horizen", description, ogImage);

export default function Page() {
  return (
    <>
      <script
        id="schema-case-malerfirma-seitz"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema(c, description, ogImage)) }}
      />
      <CaseContent />
    </>
  );
}

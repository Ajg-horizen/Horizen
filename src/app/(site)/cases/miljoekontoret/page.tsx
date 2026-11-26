import CaseContent from "./CaseContent";
import { cases } from "@/lib/cases";
import { caseMetadata, caseSchema, getCase } from "@/lib/case-page";

const c = getCase(cases, "miljoekontoret");
const description =
  "Miljøkontoret. Et nyt site med eget designsystem og løbende SEO, der har øget synligheden i Google med over 5.000 %.";
const ogImage = "/cases/Miljoekontoret-iPad-1600w.webp";

export const metadata = caseMetadata(
  c,
  "Miljøkontoret | Webudvikling, UI/UX & SEO | Horizen",
  description,
  ogImage,
);

export default function Page() {
  return (
    <>
      <script
        id="schema-case-miljoekontoret"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(caseSchema(c, description, ogImage)),
        }}
      />
      <CaseContent />
    </>
  );
}

import type { Metadata } from "next";
import DesignprincipperOverview from "./DesignprincipperOverview";

const title = "Designprincipper | Horizen";
const description =
  "Bibliotek over de UX- og designprincipper vi arbejder ud fra hos Horizen. Forskningsbaserede principper omsat til praksis, krediteret Jon Yablonskis Laws of UX.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/ressourcer/designprincipper",
  },
  openGraph: {
    title,
    description,
    url: "/ressourcer/designprincipper",
    siteName: "Horizen",
    locale: "da_DK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function Page() {
  return <DesignprincipperOverview />;
}

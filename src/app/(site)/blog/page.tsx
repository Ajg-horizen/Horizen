import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/og";
import BlogOverview from "./BlogOverview";

export const metadata: Metadata = {
  title: "Blog | Horizen",
  description:
    "Indsigt, tips og artikler om webdesign, SEO, branding og digital strategi fra teamet bag Horizen.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Horizen",
    description:
      "Indsigt, tips og artikler om webdesign, SEO, branding og digital strategi fra teamet bag Horizen.",
    url: "/blog",
    siteName: "Horizen",
    locale: "da_DK",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Horizen",
    description:
      "Indsigt, tips og artikler om webdesign, SEO, branding og digital strategi fra teamet bag Horizen.",
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function Page() {
  return <BlogOverview />;
}

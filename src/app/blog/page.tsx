import type { Metadata } from "next";
import BlogOverview from "./BlogOverview";

export const metadata: Metadata = {
  title: "Blog | Horizen",
  description:
    "Indsigt, tips og artikler om webdesign, SEO, branding og digital strategi fra teamet bag Horizen.",
  openGraph: {
    title: "Blog | Horizen",
    description:
      "Indsigt, tips og artikler om webdesign, SEO, branding og digital strategi fra teamet bag Horizen.",
    url: "/blog",
    siteName: "Horizen",
    locale: "da_DK",
    type: "website",
    images: [
      {
        url: "/graphics/Hero-image-branding-services.webp",
        width: 1200,
        height: 630,
        alt: "Horizen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Horizen",
    description:
      "Indsigt, tips og artikler om webdesign, SEO, branding og digital strategi fra teamet bag Horizen.",
    images: ["/graphics/Hero-image-branding-services.webp"],
  },
};

export default function Page() {
  return <BlogOverview />;
}

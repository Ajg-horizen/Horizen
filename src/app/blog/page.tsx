import type { Metadata } from "next";
import BlogOverview from "./BlogOverview";

export const metadata: Metadata = {
  title: "Blog — Horizen",
  description:
    "Indsigt, tips og artikler om webdesign, SEO, branding og digital strategi fra teamet bag Horizen.",
};

export default function Page() {
  return <BlogOverview />;
}

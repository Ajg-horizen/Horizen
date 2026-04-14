import type { Metadata } from "next";
import WebudviklingContent from "./WebudviklingContent";

export const metadata: Metadata = {
  title: "Webudvikling — Horizen",
  description:
    "Custom webudvikling med fokus på performance, skalerbarhed og teknisk eksekvering. Next.js, React og moderne web-arkitektur bygget fra bunden.",
};

export default function Page() {
  return <WebudviklingContent />;
}

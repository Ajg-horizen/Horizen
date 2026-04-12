import type { Metadata } from "next";
import WebdesignContent from "./WebdesignContent";

export const metadata: Metadata = {
  title: "Webdesign — Horizen",
  description:
    "Websites der konverterer. Vi designer og udvikler moderne, hurtige hjemmesider med fokus på brugeroplevelse og resultater.",
};

export default function Page() {
  return <WebdesignContent />;
}

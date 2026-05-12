import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactPageContent from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Kontakt | Horizen",
  description:
    "Har du et projekt, en idé eller bare brug for en sparring? Skriv til os.",
};

export default function KontaktPage() {
  return (
    <main>
      <Navbar alwaysVisible />
      <ContactPageContent />
      <Footer />
    </main>
  );
}

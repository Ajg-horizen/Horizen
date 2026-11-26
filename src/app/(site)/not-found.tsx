import type { Metadata } from "next";
import NotFoundContent from "@/components/NotFoundContent";

// Dansk 404, når en side under sitet kalder notFound() (fx en ukendt service).
export const metadata: Metadata = {
  title: "Siden findes ikke | Horizen",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundContent />;
}

import type { Metadata } from "next";

// Eget root-layout: Studio må ikke arve sitets smooth-scroll, Cal-embed,
// GTM eller JSON-LD fra (site)/layout.tsx.
export const metadata: Metadata = {
  title: "Horizen · Admin",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}

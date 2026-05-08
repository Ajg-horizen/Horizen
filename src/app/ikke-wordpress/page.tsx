import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hov! — Horizen",
  description:
    "Lille besked til den nysgerrige. Vi afslører lidt om vores stack.",
  robots: { index: false, follow: false },
};

export default function IkkeWordPressPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f0f0f1] px-6 py-16 text-[#1d2327]">
      <div className="w-full max-w-sm">
        {/* Logo top */}
        <div className="mb-6 flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-foreground text-background">
            <span className="text-2xl font-bold tracking-tight">H</span>
          </div>
        </div>

        {/* Card */}
        <div className="space-y-5 rounded-lg border border-[#c3c4c7] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="rounded-sm border-l-4 border-[#dba617] bg-[#fcf9e8] p-3 text-sm leading-relaxed">
            <strong>Hov!</strong> Der er vist en, der er nysgerrig på, hvordan
            vi har bygget vores side.
          </div>

          <div>
            <label
              htmlFor="user"
              className="mb-1 block text-sm font-medium text-[#1d2327]"
            >
              Brugernavn eller e-mailadresse
            </label>
            <input
              id="user"
              type="text"
              defaultValue="snager@internettet.dk"
              disabled
              className="w-full rounded-sm border border-[#8c8f94] bg-[#f6f7f7] px-3 py-2 text-sm text-[#50575e] outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="pass"
              className="mb-1 block text-sm font-medium text-[#1d2327]"
            >
              Adgangskode
            </label>
            <input
              id="pass"
              type="password"
              defaultValue="ingenadgangher"
              disabled
              className="w-full rounded-sm border border-[#8c8f94] bg-[#f6f7f7] px-3 py-2 text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              disabled
              className="size-4 rounded-sm border-[#8c8f94] bg-[#f6f7f7]"
            />
            <label htmlFor="remember" className="text-sm text-[#50575e]">
              Husk mig
            </label>
          </div>

          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-sm bg-[#2271b1] px-4 py-2 text-sm font-medium text-white opacity-70"
          >
            Log ind
          </button>

          <div className="space-y-3 border-t border-[#dcdcde] pt-5 text-sm leading-relaxed text-[#50575e]">
            <p>
              Hvad vi kan afsløre er, at vi måske — måske ikke — har bygget
              vores løsning i WordPress.
            </p>
            <p>
              Men det vi i hvert fald kan afsløre, er at vi ikke har brugt
              buildere som <strong className="text-[#1d2327]">Divi</strong>,{" "}
              <strong className="text-[#1d2327]">WPBakery</strong> eller{" "}
              <strong className="text-[#1d2327]">YooTheme</strong> — vi
              foretrækker stærke, moderne stacks bygget på et solidt
              fundament, frem for opinionated design og dårlige
              CMS-strukturer fyldt med begrænsninger.
            </p>
            <p>
              Sidder du i en lignende situation og kan genkende dig selv, er
              du altid velkommen til at kontakte os.
            </p>
          </div>
        </div>

        {/* Links under card */}
        <div className="mt-5 flex flex-col items-center gap-2 text-sm">
          <Link
            href="/#contact"
            className="text-[#2271b1] underline-offset-4 hover:underline"
          >
            Kontakt os
          </Link>
          <Link
            href="/"
            className="text-[#50575e] underline-offset-4 hover:text-[#1d2327] hover:underline"
          >
            ← Tilbage til Horizen
          </Link>
        </div>
      </div>
    </main>
  );
}

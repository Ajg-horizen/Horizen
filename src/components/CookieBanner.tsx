"use client";

import { useEffect, useState } from "react";
import {
  acceptAll,
  getConsent,
  rejectAll,
  setConsent,
  subscribe,
} from "@/lib/consent";

/**
 * Cookie-banner (Andreas 6/11-2026). Google Analytics og Google Ads (via GTM,
 * src/components/ConsentGtm.tsx) kører først efter et ja. "Kun nødvendige"
 * står lige så synligt som "Accepter alle", og valget kan altid ændres via
 * "Cookie-indstillinger" i footeren. Den anonyme måling uden cookies
 * (SiteTracking) nævnes åbent, fordi den kører uanset valget.
 */

const T = {
  title: "Cookies på horizen.dk",
  body: "Vi tæller besøg anonymt uden cookies, så vi kan se, hvilke sider der bliver læst. Siger du ja, bruger vi også Google Analytics og Google Ads, som sætter cookies. Du kan altid ændre dit valg under “Cookie-indstillinger” nederst på siden.",
  acceptAll: "Accepter alle",
  rejectAll: "Kun nødvendige",
  choose: "Vælg selv",
  prefTitle: "Cookie-indstillinger",
  prefBody:
    "Vælg, hvad du vil tillade. Nødvendige cookies kan ikke slås fra, fordi siden ikke virker uden dem.",
  necessaryLabel: "Nødvendige",
  necessaryDesc: "Får siden til at virke og husker dit cookie-valg.",
  statsLabel: "Statistik",
  statsDesc: "Google Analytics: hvordan siden bliver brugt.",
  marketingLabel: "Marketing",
  marketingDesc: "Google Ads: måler effekten af vores annoncer.",
  save: "Gem valg",
  back: "Tilbage",
} as const;

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<"banner" | "preferences">("banner");
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!getConsent()) setOpen(true);
    // "Cookie-indstillinger" i footeren nulstiller valget og åbner igen
    return subscribe((c) => {
      if (c !== null) return;
      setStatistics(false);
      setMarketing(false);
      setPanel("banner");
      setOpen(true);
    });
  }, []);

  function close(save: () => void) {
    save();
    setOpen(false);
  }

  function openPreferences() {
    const c = getConsent();
    setStatistics(c?.statistics ?? false);
    setMarketing(c?.marketing ?? false);
    setPanel("preferences");
  }

  const solid =
    "rounded-full bg-[#f5f5f0] px-5 py-2.5 text-sm font-medium text-[#0f0f0f] transition-colors hover:bg-white";
  const outline =
    "rounded-full border border-[#f5f5f0]/30 px-5 py-2.5 text-sm font-medium text-[#f5f5f0] transition-colors hover:border-[#f5f5f0]/60";

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-body"
      inert={!open}
      className={`fixed inset-x-3 bottom-3 z-[60] max-w-md rounded-2xl border border-white/[0.08] bg-[#0f0f0f] p-5 text-[#f5f5f0] shadow-2xl transition-[translate,opacity] duration-500 md:inset-x-auto md:bottom-6 md:left-6 md:p-6 ${
        open
          ? "translate-y-0 opacity-100"
          : "pointer-events-none invisible translate-y-10 opacity-0 transition-[translate,opacity,visibility] delay-[0ms,0ms,500ms]"
      }`}
    >
      <h2 id="cookie-title" className="text-base font-medium tracking-[-0.01em]">
        {panel === "banner" ? T.title : T.prefTitle}
      </h2>
      <p id="cookie-body" className="mt-2 text-sm leading-relaxed text-[#f5f5f0]/65">
        {panel === "banner" ? T.body : T.prefBody}
      </p>

      {panel === "banner" ? (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button type="button" className={solid} onClick={() => close(acceptAll)}>
            {T.acceptAll}
          </button>
          <button type="button" className={outline} onClick={() => close(rejectAll)}>
            {T.rejectAll}
          </button>
          <button
            type="button"
            className="px-3 py-2 text-sm text-[#f5f5f0]/60 underline-offset-4 transition-colors hover:text-[#f5f5f0] hover:underline"
            onClick={openPreferences}
          >
            {T.choose}
          </button>
        </div>
      ) : (
        <>
          <div className="mt-5 space-y-2">
            <ToggleRow label={T.necessaryLabel} description={T.necessaryDesc} checked disabled />
            <ToggleRow
              label={T.statsLabel}
              description={T.statsDesc}
              checked={statistics}
              onChange={setStatistics}
            />
            <ToggleRow
              label={T.marketingLabel}
              description={T.marketingDesc}
              checked={marketing}
              onChange={setMarketing}
            />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={solid}
              onClick={() => close(() => setConsent({ statistics, marketing }))}
            >
              {T.save}
            </button>
            <button
              type="button"
              className="px-3 py-2 text-sm text-[#f5f5f0]/60 transition-colors hover:text-[#f5f5f0]"
              onClick={() => setPanel("banner")}
            >
              {T.back}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-start justify-between gap-4 rounded-xl bg-white/[0.04] p-3 ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        <span className="mt-0.5 block text-xs leading-snug text-[#f5f5f0]/55">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        role="switch"
        className="mt-0.5 size-4 shrink-0 accent-[#00b67a] disabled:opacity-50"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
    </label>
  );
}

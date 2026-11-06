"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { getConsent, subscribe, type Consent } from "@/lib/consent";

/**
 * GTM-containeren (GA4 G-HC4NR97H1P + Google Ads) med Google Consent Mode v2.
 *
 * GTM indlæses FØRST, når den besøgende har sagt ja til statistik eller
 * marketing i cookie-banneret (src/components/CookieBanner.tsx). Før det sendes
 * intet til Google. Samtykket lægges i dataLayer som `consent default`, før GTM
 * starter, så første sidevisning går med det rigtige valg: statistik styrer
 * analytics_storage, marketing de tre ad_*-signaler. Trækkes samtykket
 * tilbage, opdateres signalerne til "denied" uden reload.
 *
 * Anonym måling uden cookies (besøg, sider, tid, henvendelser) kører altid via
 * src/components/SiteTracking.tsx og afhænger ikke af valget her.
 */

const GTM_ID = "GTM-WFZ26CS4";

/** Lægger et gtag-kald i dataLayer (samme kø, som GTM læser). */
function gtag(..._args: unknown[]) {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  // gtag forventer selve arguments-objektet, ikke et array
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer.push(arguments);
}

function consentState(c: Consent | null) {
  const statistics = c?.statistics ? "granted" : "denied";
  const marketing = c?.marketing ? "granted" : "denied";
  return {
    analytics_storage: statistics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
  };
}

export default function ConsentGtm() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    let started = false;

    function apply(c: Consent | null) {
      if (started) {
        gtag("consent", "update", consentState(c));
        return;
      }
      if (!c?.statistics && !c?.marketing) return;
      started = true;
      gtag("consent", "default", consentState(c));
      setLoad(true);
    }

    apply(getConsent());
    return subscribe(apply);
  }, []);

  if (!load) return null;

  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

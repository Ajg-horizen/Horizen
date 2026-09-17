"use client";

import Script from "next/script";

/**
 * Cal.com-embed. Selve embed.js (og Cal.coms cookie) hentes først, når
 * brugeren interagerer med siden. Det holder den ude af første indlæsning.
 * Klikker nogen på en booking-knap, før scriptet er klar, åbnes kalenderen
 * via Cal-køen, så snart det er indlæst.
 */
export default function CalEmbed() {
  return (
    <Script id="cal-embed" strategy="afterInteractive">
      {`
        (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
        (function () {
          var started = false;
          var ready = false;
          var events = ["pointerdown", "pointermove", "touchstart", "keydown", "scroll", "wheel"];
          function start() {
            if (started) return;
            started = true;
            events.forEach(function (e) { window.removeEventListener(e, start, true); });
            Cal("init", "15min", {origin:"https://app.cal.com"});
            Cal.ns["15min"]("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
            var s = document.querySelector('script[src="https://app.cal.com/embed/embed.js"]');
            if (s) s.addEventListener("load", function () { ready = true; });
          }
          events.forEach(function (e) { window.addEventListener(e, start, { capture: true, passive: true }); });
          // Klik før embed.js er klar: læg kalenderen i Cal-køen. Når scriptet er
          // indlæst, håndterer Cal selv klik på [data-cal-link].
          document.addEventListener("click", function (e) {
            if (ready) return;
            var el = e.target && e.target.closest && e.target.closest("[data-cal-link]");
            if (!el || el.__calQueued) return;
            start();
            var config = {};
            try { config = JSON.parse(el.getAttribute("data-cal-config") || "{}"); } catch (err) {}
            el.__calQueued = true;
            Cal.ns["15min"]("modal", { calLink: el.getAttribute("data-cal-link"), config: config });
          }, true);
        })();
      `}
    </Script>
  );
}

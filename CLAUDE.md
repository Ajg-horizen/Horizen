@AGENTS.md

# Horizen Homepage — Layout & Container Regler

## Container-komponent (`src/components/Container.tsx`)

Alle sider SKAL bruge Container til padding og max-width. Aldrig hardcode `px-6 md:px-10 lg:px-16` eller `max-w-[2500px]` direkte.

### Sizes

| Size | Max-width | Brug |
|------|-----------|------|
| `site` | 2500px | Forsiden, services, cases, blog-oversigt |
| `article` | max-w-6xl | Blogartikler |
| `narrow` | max-w-3xl | Smalle tekstblokke |

### Tre mønstre

**1. Simpel sektion (ingen baggrund):**
```tsx
<Container as="section" size="site" className="py-24">
  {/* indhold */}
</Container>
```

**2. Sektion med fuld-bredde baggrund (SKARPE hjørner):**
Baggrunden skal strække sig til viewport-kanten. Brug box-shadow trick:
```tsx
<section
  className="bg-[#0f0f0f] text-[#f5f5f0]"
  style={{ boxShadow: "0 0 0 100vmax #0f0f0f", clipPath: "inset(0 -100vmax)" }}
>
  <Container size="site" className="py-24">
    {/* indhold */}
  </Container>
</section>
```

**3. Sektion med afrundede hjørner (cards, accent-boxes):**
Beholder margin fra kanten — INGEN box-shadow trick:
```tsx
<section className="py-24 bg-accent/50 rounded-3xl mx-4 md:mx-8">
  <Container size="site">
    {/* indhold */}
  </Container>
</section>
```

### Hovedregel: skarpe vs. afrundede hjørner
- **Skarpe hjørner** → baggrund ALTID full-width (box-shadow trick)
- **Afrundede hjørner** → med margin fra kanten

### Hero-billeder (case-sider)
- Billede: full-width via box-shadow trick på `<section>`
- Tekst-overlay: positioneres med `left-6 md:left-10 lg:left-16` (flugter med Container padding)
- Hele case-siden wrappes i `<Container size="site" noPadding>` inkl. hero

### Komponenter der IKKE bruger Container (bevidst)
- **Navbar** — har egen dynamisk padding + max-w-[2500px]
- **TrustpilotSection** — edge-to-edge slider, ingen padding

### Footer
Bruger `<Container size="site" noPadding>` med egen tæt padding (`px-4 md:px-6 lg:px-8`) for card-effekt med afrundede hjørner.

---

# Arkitektur: Sanity, Studio og SEO-motor (indført 2026-09-17)

## Grundprincip: frontenden er frosset, Sanity er kun en datakilde

Komponenterne kender kun `ServicePage` (se `src/lib/services.ts`) og ved ikke, hvor indholdet kommer fra. Når noget flyttes til Sanity, må den server-renderede HTML **ikke ændre sig**. Succeskriteriet pr. side er en normaliseret HTML-diff med 0 afvigelser mod før.

- `src/lib/service-options.ts`: ren data. Listerne over tilladte ikon-navne og farvetoner. Deles af sitet og Studio.
- `src/lib/service-registry.ts`: navn ↔ LucideIcon og tone ↔ Tailwind-klasser. `satisfies` sikrer, at den dækker præcis listerne. Sanity gemmer ALDRIG komponenter eller klasser, kun navne og toner.
- `src/lib/service-serialize.ts`: `serializeService` / `hydrateService` / `toSanityDoc` / `fromSanityDoc`. Blokke får `_type: "block.<type>"`.
- `src/sanity/service-content.ts`: `getServiceContent(slug)` returnerer `null` ved enhver tvivl, og så bruges datafilen i `src/data/services/`. **Datafilerne er fallback og må ikke slettes.**
- `scripts/seed-services.ts`: skubber datafiler til Sanity. Springer sider over, der allerede findes (Studio ejer dem). `--force` overskriver, `--production` kræves for production.
- `scripts/check-service-roundtrip.ts`: vagt. Kør den, når en blok-type, et ikon eller en farve tilføjes.

Status: kun `ai-search` ligger i Sanity. De øvrige 5 service-sider, blog, cases og forside bor i koden.

## Sanity

- Projekt **`4555ww0t`** ("Horizen"). Datasets: `production` (det live læser) og `development` (sandkasse, kun lokalt via `.env.local`). Begge er offentlige, så udgivet indhold læses anonymt.
- Projekt-id og dataset har defaults i `src/sanity/env.ts`. Der kræves ingen Sanity-variabler i Vercel for at læse indhold.
- **Studio er indlejret på `/admin`** (route-gruppe `(studio)` med eget root-layout, så det ikke arver Lenis, Cal-embed, GTM eller JSON-LD). Sitets egne ruter ligger i `src/app/(site)/`. Foreslå ikke Sanity-hostet eller separat Studio.
- To arbejdsområder: "Horizen · live" (`production`, rammer horizen.dk ved udgivelse) og "Horizen · udvikling".
- Schema: `src/sanity/schemaTypes/`. Validering håndhæver tone of voice: tankestreg, "skræddersy" og "B Corp" blokerer udgivelse, for lange tekster giver advarsel.
- Live cacher service-sider i 60 sek. (`revalidate: 60`). Der findes endnu intet revaliderings-webhook.

## Afhængigheder: lås animationspakkerne

`framer-motion` (12.38.0), `motion-dom` (12.38.0) og `motion-utils` (12.36.0) er låst eksakt. Sanity bruger de samme pakker, og et almindeligt `npm install` opgraderer dem ellers i stilhed. Tjek versionerne efter enhver installation.

Brug aldrig Tailwind `transition-all` på et element, som framer-motion animerer. Det giver et dobbelt hak i fade-in. Brug `transition-colors`.

## SEO-motoren (Search Console → dashboard)

- `src/lib/search-console.ts`, `src/app/api/cron/seo-snapshot/route.ts`, `vercel.json` (cron `0 4 3 * *`), `src/sanity/seo-snapshots.ts`.
- Hver kørsel opdaterer forrige måned OG henter alle manglende måneder i Googles 16-måneders vindue. Kan udløses uden hemmelighed i Vercel: Settings → Cron Jobs → Run.
- Snapshots skrives altid til `production` og har id `seoSnapshot.ÅÅÅÅ-MM`. Punktummet gør dem private på det offentlige dataset, så de kun læses server-side med `SANITY_API_READ_TOKEN`.
- Vercel-env (Production): `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`, `CRON_SECRET`, `SEARCH_CONSOLE_SITE=sc-domain:horizen.dk`, `SANITY_API_WRITE_TOKEN`, `SANITY_API_READ_TOKEN`. Google-nøglerne findes IKKE lokalt.
- Dashboardet ligger i `src/app/(site)/dashboard/seo/`. Fanen "Google-søgning" viser snapshots. Fanen "Arbejdsrum" (tidligere "SEO Status") og resten af `data.ts` er stadig manuelle.

## Arbejdsgang

- Efter ruteflytninger eller et produktions-build: slet `.next/types` og kør `npx next typegen`, ellers fejler `tsc` på forældede stier.
- Efter `git checkout main` under en push-kæde kan dev-serveren hænge i mains gamle `next.config`. `touch next.config.ts` får den til at genindlæse.
- Før commit: scan diffen for tokens med node (ikke grep, som fejler stille på lange mønstre).

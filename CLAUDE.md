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

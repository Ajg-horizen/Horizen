# SEO Checklist — Horizen Homepage

> Status pr. 2026-04-16. Vi tager SEO som en samlet sprint, NÅR alle sider er designet og indhold er på plads.

## Side-for-side status

| Side | Title | Meta desc | OpenGraph | JSON-LD | Alt-tekster | H1 | Status |
|------|:-----:|:---------:|:---------:|:-------:|:-----------:|:--:|--------|
| **Forside** | Layout-arv | Layout-arv | - | - | Delvist | OK | Mangler egen metadata |
| **UI/UX Design** (service) | OK | OK | - | - | OK | Mangler | Afventer SEO-sprint |
| **Webudvikling** (service) | OK | OK | - | - | OK | Mangler | Afventer SEO-sprint |
| **Case: Seitz** | OK | OK | - | - | Delvist | OK | Afventer SEO-sprint |
| **Case: OD Pro** | OK | OK | - | - | Delvist | OK | Afventer SEO-sprint |
| **Case: Tandsundhed** | OK | OK | - | - | Delvist | OK | Afventer SEO-sprint |
| **Case: Never Another** | OK | Placeholder! | - | - | Delvist | OK | Afventer indhold + SEO |
| **Blog: Oversigt** | OK | OK | - | - | OK | OK | Afventer SEO-sprint |
| **Blog: AI & Webdesign** | OK | OK | - | - | OK | OK | Afventer SEO-sprint |
| **Blog: SEO Fejl 2026** | OK | OK | - | - | OK | OK | Afventer SEO-sprint |
| **Blog: Figma til Kode** | OK | OK | - | - | OK | OK | Afventer SEO-sprint |

**Tegnforklaring:** OK = på plads | `-` = mangler helt | Delvist = noget er der, men kan forbedres

---

## Hvad vi fikser i SEO-sprinten

### Alle sider (site-wide)
- [ ] OpenGraph tags (og:title, og:description, og:image, og:url)
- [ ] Twitter Card meta
- [ ] JSON-LD: Organization schema (layout)
- [ ] JSON-LD: BreadcrumbList (layout)
- [ ] Opret `sitemap.ts`
- [ ] Opret `robots.ts`
- [ ] Canonical URLs

### Forside
- [ ] Egen metadata (title + description) i page.tsx — ikke bare layout-arv

### Service-sider
- [ ] Fix H1 i HeroBlock (renderer ingen `<h1>` tag pt.)
- [ ] JSON-LD: Service schema
- [ ] Mere beskrivende alt-tekster på hero-billeder

### Case-sider
- [ ] JSON-LD: CreativeWork eller CaseStudy schema
- [ ] Bedre alt-tekster (ikke bare firmanavn)
- [ ] Never Another: erstat placeholder-description

### Blog
- [ ] JSON-LD: Article schema per post
- [ ] JSON-LD: FAQPage schema (hvis FAQ-sektion bruges)

---

## Ting vi allerede gør godt (rør ikke)
- Heading-hierarki (H1 → H2 → H3) er korrekt på blog og cases
- Semantisk HTML (`<section>`, `<nav>`, skip-link)
- `<html lang="da">` sat korrekt
- Meta descriptions er inden for 155-tegns grænsen
- Billeder har alt-tekst (kan forbedres, men er der)

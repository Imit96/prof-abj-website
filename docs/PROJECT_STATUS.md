# Project status

Rebuild from Vite/React SPA to Astro + Keystatic, branch `rebuild/astro`.

## Done
- New stack, design system, and all pages: Home, About, Research (themes, grants, collaborators, publications), Contact, Gallery, conditional Foundation, 404.
- All content taken from the 2026 CV and AACR biosketch. The old site's invented content was removed. It had the wrong university (UNILAG), a PhD from "TU Dresden", fake phone numbers, made-up foundation statistics and placeholder publications.
- 103 publications seeded from ORCID and Crossref, matched against the CV's 97 entries. New ORCID works merge in at build time.
- SEO: static HTML, per-page titles and descriptions, canonical URLs, Open Graph, `Person` JSON-LD, sitemap.
- Accessibility: skip link, visible focus, reduced-motion fallbacks, labelled map and canvas, colour contrast checked against the palette.

## Needs content or a decision
- [x] CV as PDF (`public/files/abolaji-cv-2026.pdf`).
- [x] Phone number shown on the Contact page.
- [x] Collaborators limited to those named in the CV (grant partners, fellowship hosts, Ph.D. co-supervisors, DrosAfrica).
- [x] Publications cleaned: mis-split author names fixed, CV #49 chapter added, the 9 ORCID-only works kept (2 labelled as conference abstracts).
- [ ] Add the 9 ORCID-only works to the CV document itself (citations ready in `docs/cv-additions.md`), then re-upload the PDF.
- [ ] **Foundation**: fill in and tick "published" when ready.
- [ ] **Gallery and news**: add photos and news items. Both stay hidden until there is content.
- [ ] **Domain**: set `SITE_URL` once a domain is chosen.

## Deployment checklist
- [ ] Create a Keystatic Cloud project, connect the repo, set `PUBLIC_KEYSTATIC_CLOUD_PROJECT`, and invite him.
- [ ] Web3Forms key in `PUBLIC_WEB3FORMS_KEY`.
- [ ] Vercel project with Node 24.

## Known
- `npm audit` lists advisories in build-time tooling only (the Vercel adapter's bundler and Keystatic's glob matching). Nothing that ships to visitors. Recheck when upgrading.
- The original source documents are in `content-source/` (git-ignored, not deployed).

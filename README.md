# Prof. Amos Olalekan Abolaji — website

Personal academic website for Prof. Amos Olalekan Abolaji, Professor of Molecular Drug Metabolism and Toxicology, University of Ibadan.

## Stack

| | |
|---|---|
| Framework | [Astro 7](https://astro.build): static HTML, near-zero JavaScript |
| Styling | Tailwind CSS 4 (tokens in `src/styles/global.css`) |
| CMS | [Keystatic](https://keystatic.com): edits are saved as files in this repo, admin at `/keystatic` |
| Motion | Hand-written canvas (hero lattice, compound-eye chapter), Lenis smooth scroll; all respect `prefers-reduced-motion` |
| Map | `d3-geo` + `world-atlas`, rendered to SVG at build time |
| Publications | CMS entries, plus any new works on his ORCID record merged in at build time |
| Hosting | Vercel (`@astrojs/vercel`) |

Requires **Node ≥ 22.23.4** (Astro 7). Vercel's default Node 24 is fine.

## Develop

```bash
npm install
npm run dev          # http://localhost:4321  —  CMS at http://localhost:4321/keystatic
npm run build
npm run check        # type-check .astro files
```

In development the CMS writes straight to `src/content/`.

## Content

```
src/content/
  profile.yaml        name, bio, contact, metrics, CV file, links
  career.yaml         education, appointments, honours, memberships, service, talks
  foundation.yaml     hidden until "published" is ticked
  themes/  projects/  publications/  places/  collaborators/  gallery/  news/
public/images/        portrait and gallery uploads
public/files/         CV
```

- **Publications** were seeded from ORCID and Crossref and cross-checked against the 2026 CV (`scripts/sync-orcid.mjs`). New ORCID works appear automatically at build. Set `ORCID_SYNC=false` to turn that off. To remove a work from the site, tick **Hide from website**; don't delete it, or ORCID will re-add it.
- **Nav adapts to content**: Gallery appears once it has photos, Foundation once published.
- Old URLs `/portfolio`, `/cooperation` and `/publications` redirect to `/research`.

## Deploy (Vercel)

1. Import the repo in Vercel (framework is detected automatically).
2. Environment variables (see `.env.example`):
   - `SITE_URL`: the production URL (for canonical links and the sitemap).
   - `PUBLIC_WEB3FORMS_KEY`: free key from web3forms.com, which turns on the contact form. Without it the page shows an email button.
   - CMS storage, one of:
     - `PUBLIC_KEYSTATIC_CLOUD_PROJECT`: **recommended**. Create a project at keystatic.cloud, connect this GitHub repo and invite Prof. Abolaji by email. He signs in without needing a GitHub account.
     - `PUBLIC_KEYSTATIC_GITHUB_REPO` (`owner/repo`): editors sign in with GitHub. The first visit to `/keystatic` walks you through creating the GitHub app.
3. Every save in the CMS commits to the repo, and Vercel redeploys in about a minute.

See `docs/editing-guide.md` for the guide written for Prof. Abolaji, and `docs/PROJECT_STATUS.md` for open items.

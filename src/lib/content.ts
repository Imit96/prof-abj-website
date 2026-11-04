import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

export type Publication = {
  slug: string;
  title: string;
  authors: string;
  journal: string;
  year: number | null;
  doi: string;
  url: string | null;
  kind: 'article' | 'review' | 'chapter' | 'preprint' | 'abstract' | 'other';
  featured: boolean;
  source: 'cms' | 'orcid';
};

const ORCID_ID = '0000-0002-4203-452X';

export const normTitle = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export const cleanDoi = (doi?: string | null) =>
  (doi ?? '')
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .toLowerCase();

const words = (t: string) => new Set(t.split(' ').filter((w) => w.length > 2));
/** Titles that share ≥80% of their words are treated as the same work (ORCID often holds variants). */
function isNearDuplicate(nt: string, titles: Set<string>) {
  const a = words(nt);
  if (a.size < 4) return false;
  for (const t of titles) {
    const b = words(t);
    let shared = 0;
    for (const w of a) if (b.has(w)) shared++;
    if (shared / Math.max(a.size, b.size) >= 0.8) return true;
  }
  return false;
}

let profileCache: Awaited<ReturnType<typeof loadProfile>> | undefined;
async function loadProfile() {
  const p = await reader.singletons.profile.readOrThrow();
  return p;
}
export async function getProfile() {
  profileCache ??= await loadProfile();
  return profileCache;
}

export async function getCareer() {
  return reader.singletons.career.readOrThrow();
}

export async function getFoundation() {
  return reader.singletons.foundation.read();
}

export async function getThemes() {
  const all = await reader.collections.themes.all();
  return all.map((t) => ({ slug: t.slug, ...t.entry })).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export async function getProjects() {
  const all = await reader.collections.projects.all();
  return all
    .map((p) => ({ slug: p.slug, ...p.entry }))
    .sort((a, b) => (b.end ?? b.start ?? 0) - (a.end ?? a.start ?? 0) || (b.start ?? 0) - (a.start ?? 0));
}

export async function getPlaces() {
  const all = await reader.collections.places.all();
  return all.map((p) => ({ slug: p.slug, ...p.entry }));
}

export async function getCollaborators() {
  const all = await reader.collections.collaborators.all();
  return all.map((c) => ({ slug: c.slug, ...c.entry })).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export async function getGallery() {
  const all = await reader.collections.gallery.all();
  return all
    .map((g) => ({ slug: g.slug, ...g.entry }))
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

export async function getNews() {
  const all = await reader.collections.news.all();
  return all.map((n) => ({ slug: n.slug, ...n.entry })).sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

/**
 * New works on his ORCID record that are not yet in the CMS are added automatically at build time,
 * so the list stays current without anyone typing. Entries in the CMS always win (and "hidden" ones stay hidden).
 * Set ORCID_SYNC=false to turn this off.
 */
async function fetchOrcidExtras(known: { dois: Set<string>; titles: Set<string> }): Promise<Publication[]> {
  if (process.env.ORCID_SYNC === 'false') return [];
  try {
    const res = await fetch(`https://pub.orcid.org/v3.0/${ORCID_ID}/works`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { group?: any[] };
    const extras: Publication[] = [];
    for (const g of data.group ?? []) {
      const s = g['work-summary']?.[0];
      if (!s) continue;
      const title: string = s.title?.title?.value ?? '';
      const doi = cleanDoi(
        (s['external-ids']?.['external-id'] ?? []).find((e: any) => e['external-id-type'] === 'doi')?.[
          'external-id-value'
        ],
      );
      const nt = normTitle(title);
      const journal: string = s['journal-title']?.value ?? '';
      if (!title || (doi && known.dois.has(doi)) || known.titles.has(nt)) continue;
      // same rules as scripts/sync-orcid.mjs: no corrigenda, no conference abstracts, no near-duplicate titles
      if (/^(corrigendum|erratum|correction)\b/i.test(title)) continue;
      if (/faseb j|planta med/i.test(journal) || /^10\.1055\/s-/.test(doi)) continue;
      if (isNearDuplicate(nt, known.titles)) continue;
      known.titles.add(nt);
      if (doi) known.dois.add(doi);
      const type: string = s.type ?? '';
      extras.push({
        slug: `orcid-${s['put-code']}`,
        title: title.replace(/<[^>]+>/g, ''),
        authors: '',
        journal,
        year: Number(s['publication-date']?.year?.value) || null,
        doi,
        url: s.url?.value ?? null,
        kind: type === 'preprint' ? 'preprint' : type === 'book-chapter' ? 'chapter' : 'article',
        featured: false,
        source: 'orcid',
      });
    }
    return extras;
  } catch {
    return [];
  }
}

let pubCache: Publication[] | undefined;
export async function getPublications(): Promise<Publication[]> {
  if (pubCache) return pubCache;
  const all = await reader.collections.publications.all();
  const known = { dois: new Set<string>(), titles: new Set<string>() };
  const cms: Publication[] = [];
  for (const { slug, entry } of all) {
    const doi = cleanDoi(entry.doi);
    if (doi) known.dois.add(doi);
    known.titles.add(normTitle(entry.title));
    if (entry.hidden) continue;
    cms.push({
      slug,
      title: entry.title,
      authors: entry.authors ?? '',
      journal: entry.journal ?? '',
      year: entry.year ?? null,
      doi,
      url: entry.url ?? null,
      kind: (entry.kind ?? 'article') as Publication['kind'],
      featured: !!entry.featured,
      source: 'cms',
    });
  }
  const extras = await fetchOrcidExtras(known);
  pubCache = [...cms, ...extras].sort(
    (a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title),
  );
  return pubCache;
}

export const pubHref = (p: Pick<Publication, 'doi' | 'url'>) =>
  p.doi ? `https://doi.org/${p.doi}` : p.url ?? undefined;

export const paragraphs = (text?: string | null) =>
  (text ?? '')
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

/** Visible nav adapts to content: Gallery appears once it has photos, Foundation once published. */
export async function getNav() {
  const [gallery, foundation] = await Promise.all([getGallery(), getFoundation()]);
  return [
    { href: '/about', label: 'About' },
    { href: '/research', label: 'Research' },
    { href: '/research#publications', label: 'Publications' },
    ...(gallery.length ? [{ href: '/gallery', label: 'Gallery' }] : []),
    ...(foundation?.published ? [{ href: '/foundation', label: 'Foundation' }] : []),
    { href: '/contact', label: 'Contact' },
  ];
}

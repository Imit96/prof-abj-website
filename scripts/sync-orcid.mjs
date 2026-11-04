#!/usr/bin/env node
/**
 * Seed / sync src/content/publications/*.yaml (Keystatic collection) from:
 *   1. ORCID public API (0000-0002-4203-452X)
 *   2. Crossref (authors + journal, when a DOI exists) — cached in scripts/.cache/crossref
 *   3. Optionally the CV publication list (--cv=<path to cv.txt>), used to report / add
 *      entries missing from ORCID.
 *
 * Never overwrites an existing entry: if a file with the same DOI or normalized title
 * already exists, the work is skipped, so edits made in the CMS survive re-runs.
 *
 * Usage:
 *   node scripts/sync-orcid.mjs [--dry-run] [--cv=path/to/cv.txt] [--no-cache] [--include-abstracts]
 *
 * Likely conference abstracts (FASEB J / Planta Med supplements) that are not on the CV are
 * skipped unless --include-abstracts is passed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'src/content/publications');
const CACHE_DIR = path.join(__dirname, '.cache');
const CROSSREF_CACHE = path.join(CACHE_DIR, 'crossref');

const ORCID_ID = '0000-0002-4203-452X';
const UA = 'prof-abolaji-site/1.0 (mailto:noreply@example.org)';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const NO_CACHE = args.includes('--no-cache');
const INCLUDE_ABSTRACTS = args.includes('--include-abstracts');
const CV_PATH = args.find((a) => a.startsWith('--cv='))?.slice(5) || null;

const FEATURED = new Set([
  '10.64898/2026.03.26.714433',
  '10.1038/s41598-025-00698-9',
  '10.1038/s41598-022-07909-7',
  '10.1016/j.redox.2015.06.001',
  '10.1002/jbt.70915',
  '10.1016/j.cbpc.2024.109971',
  '10.1016/bs.ant.2026.03.007',
  '10.1080/01677063.2026.2613797',
]);
const PREPRINT_PREFIXES = ['10.1101/', '10.21203/', '10.64898/'];
// Not standalone publications: skipped (and reported).
const SKIP_TITLE = /^(corrigendum|erratum|correction)\b/i;

/* ------------------------------------------------------------------ helpers */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—' };
function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}
function cleanText(s) {
  if (!s) return '';
  let t = decodeEntities(String(s));
  t = t.replace(/<[^>]+>/g, ''); // strip tags (<i>, <sub>, <scp> …)
  t = decodeEntities(t); // double-encoded input (&amp;lt;i&amp;gt;)
  return t.replace(/\s+/g, ' ').trim();
}
function cleanTitle(s) {
  return cleanText(s).replace(/[.\s]+$/, '');
}
export function normTitle(s) {
  return cleanText(s)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}
export function normDoi(d) {
  if (!d) return '';
  let s = String(d).trim().toLowerCase();
  s = s.replace(/^https?:\/\/(dx\.)?doi\.org\//, '').replace(/^doi:\s*/, '');
  s = s.replace(/[.,;]+$/, '');
  return /^10\.\d{4,9}\/\S+$/.test(s) ? s : '';
}
export function slugify(title, max = 80) {
  let s = title
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[α]/g, 'alpha')
    .replace(/[β]/g, 'beta')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (s.length > max) {
    const cut = s.slice(0, max + 1);
    const i = cut.lastIndexOf('-');
    s = (i > 20 ? cut.slice(0, i) : s.slice(0, max)).replace(/-+$/, '');
  }
  return s || 'publication';
}
function isAllCaps(s) {
  const letters = s.replace(/[^A-Za-z]/g, '');
  return letters.length > 10 && letters === letters.toUpperCase();
}

/* --------------------------------------------------------------- fetching */

async function fetchJson(url, headers = {}, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, ...headers } });
      if (res.status === 404) return null;
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      if (i === tries - 1) {
        console.warn(`  ! fetch failed ${url}: ${e.message}`);
        return null;
      }
      await sleep(1000 * (i + 1));
    }
  }
  return null;
}

async function fetchOrcid() {
  const cacheFile = path.join(CACHE_DIR, 'orcid-works.json');
  const data = await fetchJson(`https://pub.orcid.org/v3.0/${ORCID_ID}/works`, {
    Accept: 'application/json',
  });
  if (data) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(cacheFile, JSON.stringify(data));
    return data;
  }
  if (fs.existsSync(cacheFile)) {
    console.warn('  ! ORCID unreachable, using cached copy');
    return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  }
  throw new Error('Could not fetch ORCID works');
}

let lastCrossref = 0;
async function crossref(doi) {
  if (!doi) return null;
  const file = path.join(CROSSREF_CACHE, doi.replace(/[^a-z0-9._-]+/gi, '_') + '.json');
  if (!NO_CACHE && fs.existsSync(file)) {
    const cached = JSON.parse(fs.readFileSync(file, 'utf8'));
    return cached.message ?? null;
  }
  const wait = 200 - (Date.now() - lastCrossref); // ~5 req/sec
  if (wait > 0) await sleep(wait);
  lastCrossref = Date.now();
  const data = await fetchJson(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
  fs.mkdirSync(CROSSREF_CACHE, { recursive: true });
  // cache misses too (as {message:null}) so re-runs don't hammer the API
  fs.writeFileSync(file, JSON.stringify(data ?? { message: null }));
  return data?.message ?? null;
}

/** Fallback: contributor list from the full ORCID work record ("Family, Given" credit names). */
async function orcidContributors(putCode) {
  const dir = path.join(CACHE_DIR, 'orcid-work');
  const file = path.join(dir, `${putCode}.json`);
  let w;
  if (!NO_CACHE && fs.existsSync(file)) w = JSON.parse(fs.readFileSync(file, 'utf8'));
  else {
    await sleep(200);
    w = await fetchJson(`https://pub.orcid.org/v3.0/${ORCID_ID}/work/${putCode}`, { Accept: 'application/json' });
    if (w) {
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(file, JSON.stringify(w));
    }
  }
  const list = (w?.contributors?.contributor || [])
    .map((c) => c['credit-name']?.value)
    .filter(Boolean)
    .map((n) => {
      if (n.includes(',')) {
        const [family, given = ''] = n.split(',').map((x) => x.trim());
        return { family, given };
      }
      const parts = n.trim().split(/\s+/); // "Amos O Abolaji"
      return parts.length > 1 ? { family: parts.pop(), given: parts.join(' ') } : { name: n };
    });
  return formatCrossrefAuthors(list);
}

/* ---------------------------------------------------------------- authors */

function initials(given) {
  return given
    .replace(/\./g, ' ')
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase())
    .join('');
}
function isAbolaji(family) {
  return /abolaji/i.test(family || '');
}
function formatCrossrefAuthors(list) {
  if (!Array.isArray(list) || !list.length) return { text: '', hasAbolaji: false };
  const names = list.map((a) => {
    // Some deposits are malformed: family "." and the full name in "given" ("A.O. Abolaji").
    if (a.given && (!a.family || !/\p{L}/u.test(a.family))) {
      const parts = a.given.trim().split(/\s+/);
      a = { family: parts.pop(), given: parts.join(' ') };
    }
    if (a.family) {
      if (isAbolaji(a.family)) return 'Abolaji AO';
      const ini = a.given ? initials(a.given) : '';
      return ini ? `${a.family} ${ini}` : a.family;
    }
    return a.name || '';
  }).filter(Boolean);
  const hasAbolaji = names.includes('Abolaji AO');
  let out = names;
  if (names.length > 12) {
    out = names.slice(0, 10);
    out.push('…');
    if (hasAbolaji && !out.includes('Abolaji AO')) out.push('Abolaji AO');
    const last = names[names.length - 1];
    if (!out.includes(last)) out.push(last);
  }
  return { text: out.join(', '), hasAbolaji };
}
/** "Eteng, M.U., Bassey, B.J., Abolaji, A.O." or "Abolaji AO, Adedara AO" -> "Eteng MU, …" */
function formatCvAuthors(raw) {
  let s = raw.replace(/\s+and\s+/g, ', ').replace(/[.,\s]+$/, '').trim();
  const out = [];
  const re = /([A-Z][\p{L}'’-]+(?:\s(?:de|da|dos|van|von)\s[A-Z][\p{L}'’-]+)?)\.?,?\s+((?:[A-Z]\.?\s?){1,4})(?=,|$)/gu;
  let m;
  let consumed = 0;
  while ((m = re.exec(s))) {
    const fam = m[1];
    const ini = m[2].replace(/[.\s]/g, '');
    out.push(isAbolaji(fam) ? 'Abolaji AO' : `${fam} ${ini}`);
    consumed += m[0].length;
  }
  // only trust the conversion if it covered (almost) the whole string
  if (out.length && consumed >= s.replace(/,\s*/g, ',').length * 0.8) return out.join(', ');
  return s;
}

function preprintServer(doi, cr) {
  const inst = cr?.institution?.[0]?.name;
  if (inst) return cleanText(inst);
  if (doi.startsWith('10.1101/') || doi.startsWith('10.64898/')) return 'bioRxiv';
  if (doi.startsWith('10.21203/')) return 'Research Square';
  return '';
}

/* ---------------------------------------------------------------- kinding */

function classify({ doi, orcidType, crossrefType, title, journal }) {
  if (doi && PREPRINT_PREFIXES.some((p) => doi.startsWith(p))) return 'preprint';
  if (orcidType === 'preprint' || crossrefType === 'posted-content') return 'preprint';
  if (orcidType === 'book-chapter' || crossrefType === 'book-chapter') return 'chapter';
  if (/advances in neurotoxicology/i.test(journal || '')) return 'chapter';
  if (/\breview\b/i.test(title) || orcidType === 'review') return 'review';
  return 'article';
}

/* ------------------------------------------------------------- existing */

function loadExisting() {
  const dois = new Set();
  const titles = new Set();
  const slugs = new Set();
  if (!fs.existsSync(OUT_DIR)) return { dois, titles, slugs };
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (!/\.ya?ml$/.test(f)) continue;
    slugs.add(f.replace(/\.ya?ml$/, ''));
    try {
      const d = yaml.load(fs.readFileSync(path.join(OUT_DIR, f), 'utf8')) || {};
      if (d.doi) dois.add(normDoi(d.doi));
      if (d.title) titles.add(normTitle(d.title));
    } catch (e) {
      console.warn(`  ! could not parse existing ${f}: ${e.message}`);
    }
  }
  return { dois, titles, slugs };
}

/* -------------------------------------------------------------------- ORCID */

function orcidDoi(group) {
  const ids = [
    ...(group['work-summary'][0]['external-ids']?.['external-id'] || []),
    ...group['work-summary'].flatMap((w) => w['external-ids']?.['external-id'] || []),
    ...(group['external-ids']?.['external-id'] || []),
  ];
  for (const e of ids) {
    if (e['external-id-type'] !== 'doi') continue;
    const d = normDoi(e['external-id-normalized']?.value || e['external-id-value']);
    if (d) return d;
  }
  return '';
}

async function recordFromOrcid(group) {
  const w = group['work-summary'][0];
  let doi = orcidDoi(group);
  let cr = doi ? await crossref(doi) : null;
  // Research Square DOIs need a version suffix; ORCID sometimes stores them without it.
  if (!cr && /^10\.21203\/rs\.3\.rs-\d+$/.test(doi)) {
    const v1 = await crossref(`${doi}/v1`);
    if (v1) (doi = `${doi}/v1`), (cr = v1);
  }
  const title = cleanTitle(w.title?.title?.value || cr?.title?.[0] || '');
  const orcidJournal = cleanText(w['journal-title']?.value || '');
  const crJournal = cleanText(cr?.['container-title']?.[0] || '');
  const journal = crJournal || orcidJournal || preprintServer(doi, cr) || (cr?.publisher ? cleanText(cr.publisher) : '');
  let year = parseInt(w['publication-date']?.year?.value, 10);
  if (!year) {
    const parts = cr?.issued?.['date-parts']?.[0] || cr?.published?.['date-parts']?.[0];
    year = parts?.[0] ? Number(parts[0]) : NaN;
  }
  let authors = formatCrossrefAuthors(cr?.author);
  let authorsWeak = false;
  if (!authors.text) (authors = await orcidContributors(w['put-code'])), (authorsWeak = true);
  const url = doi ? null : w.url?.value || null;
  return {
    source: 'orcid',
    orcidType: w.type,
    hasCrossref: !!cr,
    hasAbolaji: authors.hasAbolaji,
    authorsWeak,
    data: {
      title,
      authors: authors.text,
      journal,
      year,
      doi,
      url,
      kind: classify({ doi, orcidType: w.type, crossrefType: cr?.type, title, journal }),
      featured: FEATURED.has(doi),
      hidden: false,
    },
  };
}

/* ----------------------------------------------------------------------- CV */

function parseCvEntries(text) {
  const start = text.search(/^\s*13\.\s+PUBLICATIONS/m);
  if (start < 0) return [];
  const rest = text.slice(start);
  const end = rest.search(/^\s*14\.\s+[A-Z][A-Z ()&,-]{5,}\s*$/m);
  const block = end > 0 ? rest.slice(0, end) : rest;
  const entries = [];
  for (const line of block.split('\n')) {
    const m = line.match(/^\s*(\d{1,3})\.\s+(.+)$/);
    if (m && !/^PUBLICATIONS/.test(m[2])) entries.push({ n: Number(m[1]), text: m[2].trim() });
  }
  return entries;
}
function cvDoi(text) {
  const m = text.match(/10\.\d{4,9}\/[^\s;,]+/);
  return m ? normDoi(m[0]) : '';
}
function tokens(s) {
  return normTitle(s).split(' ').filter((t) => t.length > 2);
}
/** Fraction of the record title's tokens that appear in the CV line. */
function overlap(recTitle, cvText) {
  const rt = tokens(recTitle);
  if (rt.length < 4) return 0;
  const cv = new Set(tokens(cvText));
  return rt.filter((t) => cv.has(t)).length / rt.length;
}
/**
 * Conservative parse of an old-style CV citation without DOI:
 *   "Authors (2010): Title. Journal Vol. 5 No. 9, 1009-1013. (Nigeria)."
 */
function parseCvCitation(text) {
  const m = text.match(/^(.+?)\s*\((\d{4})\)[:.]?\s+(.+)$/);
  if (!m) return null;
  const [, rawAuthors, year, rest] = m;
  if (/\bIn:\s/.test(rest) || /ISBN/i.test(rest)) return null; // book chapters: report, don't guess
  const j = rest.match(/^(.+?)\.\s+([A-Z][A-Za-z&,:()' -]+?)\.?\s+Vol\.?\s*\d/);
  if (!j) return null;
  const [, title, journal] = j;
  if (title.length < 15 || journal.length < 4) return null;
  return {
    title: cleanTitle(title),
    authors: formatCvAuthors(rawAuthors),
    journal: journal.trim(),
    year: Number(year),
  };
}

/** Fill authors/journal that ORCID + Crossref could not provide, from the CV citation. */
function fillFromCv(rec, text) {
  const d = rec.data;
  if (!d.authors || rec.authorsWeak) {
    const m = text.match(/^(.+?)\s*\(\d{4}\)/);
    // ORCID contributor lists are often partial; prefer the CV list when it is longer.
    if (m && (!d.authors || formatCvAuthors(m[1]).split(',').length > d.authors.split(',').length)) {
      d.authors = formatCvAuthors(m[1]);
      rec.hasAbolaji = /Abolaji AO/.test(d.authors);
      rec.authorsFromCv = true;
    }
  }
  if (!d.journal) {
    const p = parseCvCitation(text);
    if (p?.journal) (d.journal = p.journal), (rec.journalFromCv = true);
  }
}

/* --------------------------------------------------------------------- main */

async function main() {
  console.log(`Sync publications ${DRY_RUN ? '(dry run)' : ''}`);
  const existing = loadExisting();
  console.log(`Existing entries: ${existing.slugs.size}`);

  const orcid = await fetchOrcid();
  const groups = orcid.group || [];
  console.log(`ORCID work groups: ${groups.length}`);

  const records = [];
  for (const g of groups) records.push(await recordFromOrcid(g));

  // Prefer DOI-bearing versions when deduping by title.
  records.sort((a, b) => (b.data.doi ? 1 : 0) - (a.data.doi ? 1 : 0));

  const report = { written: [], skippedExisting: [], dupes: [], skippedOther: [], suspicious: [], cvUnmatched: [], cvAdded: [], cvProbable: [], orcidNotInCv: [] };
  const seenDoi = new Set();
  const seenTitle = new Set();
  const accepted = [];

  const accept = (rec) => {
    const d = rec.data;
    const nt = normTitle(d.title);
    if (!d.title) return report.skippedOther.push(`(untitled) ${d.doi}`), false;
    if (SKIP_TITLE.test(d.title)) return report.skippedOther.push(`${d.title} [${d.doi}] — corrigendum/erratum`), false;
    if ((d.doi && seenDoi.has(d.doi)) || seenTitle.has(nt)) return report.dupes.push(`${d.title} [${d.doi || 'no doi'}]`), false;
    if (d.doi) seenDoi.add(d.doi);
    seenTitle.add(nt);
    accepted.push(rec);
    return true;
  };
  for (const r of records) accept(r);

  // ---- CV comparison
  if (CV_PATH) {
    if (!fs.existsSync(CV_PATH)) console.warn(`  ! CV not found at ${CV_PATH}`);
    else {
      const cv = parseCvEntries(fs.readFileSync(CV_PATH, 'utf8'));
      console.log(`CV entries: ${cv.length}`);
      const matchedRecs = new Set();
      for (const e of cv) {
        const doi = cvDoi(e.text);
        let match = doi ? accepted.find((r) => r.data.doi === doi) : null;
        let best = null;
        let bestScore = 0;
        if (!match) {
          for (const r of accepted) {
            const s = overlap(r.data.title, e.text);
            if (s > bestScore) (bestScore = s), (best = r);
          }
          if (bestScore >= 0.85) match = best;
        }
        if (match) {
          matchedRecs.add(match);
          match.inCv = true;
          fillFromCv(match, e.text);
          continue;
        }
        const label = `CV #${e.n}: ${e.text.slice(0, 160)}${e.text.length > 160 ? '…' : ''}`;
        if (!doi && bestScore >= 0.6) {
          report.cvProbable.push(`${label}\n      ~ probably ORCID "${best.data.title}" (${Math.round(bestScore * 100)}% overlap) — not added`);
          matchedRecs.add(best);
          fillFromCv(best, e.text);
          continue;
        }
        // Clearly missing from ORCID -> try to add.
        if (doi) {
          const cr = await crossref(doi);
          if (cr?.title?.[0]) {
            const title = cleanTitle(cr.title[0]);
            const journal = cleanText(cr['container-title']?.[0] || '') || preprintServer(doi, cr);
            const parts = cr.issued?.['date-parts']?.[0] || cr.published?.['date-parts']?.[0];
            const authors = formatCrossrefAuthors(cr.author);
            const rec = {
              source: 'cv',
              hasCrossref: true,
              hasAbolaji: authors.hasAbolaji,
              data: {
                title,
                authors: authors.text,
                journal,
                year: parts?.[0] ? Number(parts[0]) : NaN,
                doi,
                url: null,
                kind: classify({ doi, crossrefType: cr.type, title, journal }),
                featured: FEATURED.has(doi),
                hidden: false,
              },
            };
            if (accept(rec)) report.cvAdded.push(`CV #${e.n} via Crossref: ${title} [${doi}]`);
            continue;
          }
          report.cvUnmatched.push(`${label}\n      (DOI ${doi} not resolvable on Crossref)`);
          continue;
        }
        const parsed = parseCvCitation(e.text);
        if (parsed) {
          const rec = {
            source: 'cv',
            hasCrossref: false,
            hasAbolaji: /Abolaji AO/.test(parsed.authors),
            data: {
              ...parsed,
              doi: '',
              url: null,
              kind: classify({ title: parsed.title, journal: parsed.journal }),
              featured: false,
              hidden: false,
            },
          };
          if (accept(rec)) report.cvAdded.push(`CV #${e.n} parsed: ${parsed.title} — ${parsed.journal} (${parsed.year})`);
          continue;
        }
        report.cvUnmatched.push(label);
      }
      for (const r of accepted) {
        if (r.source === 'orcid' && !matchedRecs.has(r)) report.orcidNotInCv.push(`${r.data.title} [${r.data.doi || 'no doi'}] (${r.data.year})`);
      }
    }
  }

  // ---- suspicious checks + write
  const usedSlugs = new Set(existing.slugs);
  for (const r of accepted) {
    const d = r.data;
    const flags = [];
    if (!Number.isInteger(d.year)) flags.push('no year');
    if (d.doi && !r.hasCrossref) flags.push('DOI not found on Crossref');
    if (r.hasCrossref && r.data.authors && !r.hasAbolaji && !r.authorsFromCv) flags.push('Abolaji not in Crossref author list');
    if (!d.authors) flags.push('no authors');
    if (!d.journal) flags.push('no journal');
    if (isAllCaps(d.title)) flags.push('ALL-CAPS title (kept as is)');
    if (/faseb j/i.test(d.journal) || /planta med/i.test(d.journal) || /^10\.1055\/s-/.test(d.doi)) flags.push('likely conference abstract');
    if (flags.length) report.suspicious.push(`${d.title.slice(0, 100)} [${d.doi || 'no doi'}]: ${flags.join('; ')}`);
    if (flags.includes('likely conference abstract') && !INCLUDE_ABSTRACTS && (!CV_PATH || !r.inCv)) {
      report.skippedOther.push(`${d.title} [${d.doi || 'no doi'}] — likely conference abstract, not on CV (use --include-abstracts)`);
      continue;
    }

    if ((d.doi && existing.dois.has(d.doi)) || existing.titles.has(normTitle(d.title))) {
      report.skippedExisting.push(d.title);
      continue;
    }
    if (!Number.isInteger(d.year)) {
      report.skippedOther.push(`${d.title} — no year`);
      continue;
    }
    let slug = slugify(d.title);
    for (let i = 2; usedSlugs.has(slug); i++) slug = `${slugify(d.title, 76)}-${i}`;
    usedSlugs.add(slug);
    const out = {
      title: d.title,
      authors: d.authors,
      journal: d.journal,
      year: d.year,
      doi: d.doi || '',
      url: d.url ?? null,
      kind: d.kind,
      featured: !!d.featured,
      hidden: false,
    };
    if (!DRY_RUN) {
      fs.mkdirSync(OUT_DIR, { recursive: true });
      fs.writeFileSync(path.join(OUT_DIR, `${slug}.yaml`), yaml.dump(out, { lineWidth: -1, noRefs: true, quotingType: '"' }));
    }
    report.written.push(`${slug}.yaml`);
  }

  // ---- summary
  const section = (name, list) => {
    console.log(`\n${name}: ${list.length}`);
    for (const x of list) console.log(`  - ${x}`);
  };
  console.log(`\n=== Summary ${DRY_RUN ? '(dry run, nothing written)' : ''}`);
  console.log(`ORCID groups: ${groups.length}; accepted unique works: ${accepted.length}`);
  console.log(`${DRY_RUN ? 'Would write' : 'Written'}: ${report.written.length}; already present (skipped): ${report.skippedExisting.length}`);
  section('Duplicates dropped', report.dupes);
  section('Skipped (other)', report.skippedOther);
  section('Suspicious', report.suspicious);
  if (CV_PATH) {
    section('CV entries added (missing from ORCID)', report.cvAdded);
    section('CV entries probably matching an ORCID work under a different title', report.cvProbable);
    section('CV entries NOT matched and NOT added (please review)', report.cvUnmatched);
    section('ORCID works not found in CV', report.orcidNotInCv);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

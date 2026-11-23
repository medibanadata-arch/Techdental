/**
 * Import an archived WordPress URL into the shared `legacy_pages` table so the
 * old article keeps being served at its original path (Laravel + Astro both
 * read this table through LegacyPageController / src/lib/legacy.ts).
 *
 * Usage (from the astro-site directory):
 *   node scripts/import-legacy-page.mjs --dry-run
 *   node scripts/import-legacy-page.mjs
 *   node scripts/import-legacy-page.mjs --only /bn/dentistry/toothache-relief-tips
 *
 * The script:
 *   1. Finds the matching WordPress post/page through the public REST API.
 *   2. Copies the original <head> metadata (title, description, robots,
 *      canonical, OG/Twitter, JSON-LD) from the live old page.
 *   3. Downloads the body images at full resolution and stores them as WebP
 *      under public/uploads/old-site/posts (astro-site/public/uploads is a
 *      junction to that folder).
 *   4. Rewrites old-site links to their current equivalent.
 *   5. Upserts one row into legacy_pages.
 */
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import sharp from 'sharp';

const ROOT = process.cwd(); // .../astro-site
const REPO = path.resolve(ROOT, '..');
const DB_FILE = path.join(REPO, 'database', 'database.sqlite');
const UPLOAD_DIR = path.join(REPO, 'public', 'uploads', 'old-site', 'posts');
const SITE = 'https://techdentalcare.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36';

/** Archived URLs to import. */
const PAGES = [
  {
    path: '/bn/dentistry/toothache-relief-tips',
    lang: 'bn',
    // Old article links that no longer exist -> current service pages.
    links: {
      '/en/service/tooth-root-canal-cost-bd': '/bn/service/tooth-root-canal-cost',
      '/en/service/dental-filling': '/bn/service/tooth-filling-cost',
      '/en/service/teeth-scaling-polishing-price-bd': '/bn/service/teeth-scaling-polishing-price-bn',
    },
  },
];

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const onlyIndex = args.indexOf('--only');
const only = onlyIndex >= 0 ? args[onlyIndex + 1] : null;

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
};

function decodeEntities(value) {
  return String(value || '')
    .replace(/&#x([0-9a-f]+);/gi, (_m, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_m, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (m, name) => (ENTITIES[name.toLowerCase()] ?? m));
}

function stripHtml(value) {
  return decodeEntities(String(value || '').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizePath(value) {
  const clean = String(value || '').replace(/^https?:\/\/[^/]+/i, '');
  return '/' + decodeURIComponent(clean).replace(/^\/+/, '').replace(/\/+$/, '');
}

async function get(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: '*/*' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
}

async function findWpDoc(pagePath) {
  const slug = pagePath.split('/').filter(Boolean).pop();
  for (const type of ['posts', 'pages']) {
    const res = await get(`${SITE}/wp-json/wp/v2/${type}?slug=${encodeURIComponent(slug)}`);
    const list = await res.json();
    const doc = Array.isArray(list)
      ? list.find((item) => normalizePath(item.link) === normalizePath(pagePath))
      : null;
    if (doc) return { type, doc };
  }
  throw new Error(`WordPress item not found for ${pagePath}`);
}

function extractHead(html) {
  const pick = (re) => {
    const match = html.match(re);
    return match ? decodeEntities(match[1]).trim() : '';
  };
  const og = {};
  for (const match of html.matchAll(/<meta\b[^>]*property=["']([^"']+)["'][^>]*content=["']([^"']*)["'][^>]*>/gi)) {
    og[match[1]] = decodeEntities(match[2]);
  }
  const twitter = {};
  for (const match of html.matchAll(/<meta\b[^>]*name=["'](twitter:[^"']+)["'][^>]*content=["']([^"']*)["'][^>]*>/gi)) {
    twitter[match[1]] = decodeEntities(match[2]);
  }
  const hreflang = [];
  for (const match of html.matchAll(/<link\b[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    hreflang.push({ lang: match[1], href: decodeEntities(match[2]) });
  }
  const schema = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const raw = match[1].trim();
    try {
      schema.push(JSON.parse(raw));
    } catch {
      try {
        schema.push(JSON.parse(decodeEntities(raw)));
      } catch {
        /* ignore malformed blocks */
      }
    }
  }
  return {
    title: pick(/<title[^>]*>([\s\S]*?)<\/title>/i),
    description: pick(/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i),
    robots: pick(/<meta\b[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i),
    keywords: pick(/<meta\b[^>]*name=["']keywords["'][^>]*content=["']([^"']*)["']/i),
    canonical: pick(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i),
    og,
    twitter,
    hreflang,
    schema,
  };
}

function fileSlug(url) {
  const base = decodeURIComponent(String(url).split('/').pop() || 'image')
    .replace(/-\d+x\d+(?=\.\w+$)/, '')
    .replace(/\.(png|jpe?g|webp|gif|avif)$/i, '');
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'image';
}

function bestImageUrl(tag, fallbackSrc) {
  const widths = [];
  const srcset = (tag.match(/\bsrcset=["']([^"']+)["']/i) || [])[1];
  if (srcset) {
    for (const part of srcset.split(',')) {
      const [url, descriptor] = part.trim().split(/\s+/);
      const width = descriptor && /(\d+)w/.test(descriptor) ? Number(/(\d+)w/.exec(descriptor)[1]) : 0;
      if (url) widths.push({ url, width });
    }
  }
  widths.sort((a, b) => b.width - a.width);
  if (widths.length) return widths[0].url;
  // No srcset: strip the WordPress "-1024x768" suffix to reach the original.
  return String(fallbackSrc || '').replace(/-\d+x\d+(?=\.\w+$)/, '');
}

async function localizeImage(url) {
  const original = url.startsWith('//') ? `https:${url}` : url;
  const res = await get(original);
  const buffer = Buffer.from(await res.arrayBuffer());
  const name = `${fileSlug(original)}.webp`;
  const target = path.join(UPLOAD_DIR, name);
  const webp = await sharp(buffer)
    .rotate()
    .resize({ width: 1408, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  if (!dryRun) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    fs.writeFileSync(target, webp);
  }
  const meta = await sharp(webp).metadata();
  console.log(`  image ${original} -> /uploads/old-site/posts/${name} (${meta.width}x${meta.height}, ${webp.length} bytes)`);
  return `/uploads/old-site/posts/${name}`;
}

async function localizeImages(html) {
  const tags = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const replacements = new Map();
  for (const tag of tags) {
    const src = (tag.match(/\bsrc=["']([^"']+)["']/i) || [])[1];
    if (!src) continue;
    const local = await localizeImage(bestImageUrl(tag, src));
    const next = tag
      .replace(/\s+src=["'][^"']*["']/i, ` src="${local}"`)
      .replace(/\s+srcset=["'][^"']*["']/gi, '')
      .replace(/\s+sizes=["'][^"']*["']/gi, '');
    replacements.set(tag, next);
  }
  let out = html;
  for (const [from, to] of replacements) out = out.split(from).join(to);
  return out;
}

function localizeLinks(html, linkMap) {
  return html.replace(/(<a\b[^>]*\bhref=["'])([^"']+)(["'])/gi, (_match, start, href, end) => {
    let target = href;
    if (/^(?:https?:)?\/\/(?:www\.)?techdentalcare\.com\//i.test(target)) {
      target = target.replace(/^(?:https?:)?\/\/(?:www\.)?techdentalcare\.com/i, '');
    }
    if (/^https?:\/\//i.test(target)) return `${start}${href}${end}`;
    const key = normalizePath(target);
    const mapped = linkMap[key];
    if (mapped) target = mapped;
    return `${start}${target}${end}`;
  });
}

function headingsFrom(html) {
  return [...html.matchAll(/<h([2-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: Number(m[1]),
    text: stripHtml(m[2]),
  }));
}

function firstParagraph(html) {
  const match = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
  return match ? stripHtml(match[1]) : '';
}

function nowSql() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function upsert(row) {
  const db = new DatabaseSync(DB_FILE);
  try {
    const existing = db.prepare('SELECT id FROM legacy_pages WHERE path = ?').get(row.path);
    if (dryRun) {
      console.log(`  [dry-run] ${existing ? 'update' : 'insert'} legacy_pages.id=${existing?.id ?? '(new)'} ${row.path}`);
      return;
    }
    if (existing) {
      db.prepare(
        `UPDATE legacy_pages SET lang=?, status_code=?, title=?, meta_description=?, meta_keywords=?,
           robots=?, canonical=?, og_json=?, twitter_json=?, hreflang_json=?, schema_json=?, h1=?,
           headings_json=?, body_html=?, faqs_json=?, source_url=?, snapshot_at=?, is_active=?, updated_at=?
         WHERE id=?`
      ).run(
        row.lang, row.status_code, row.title, row.meta_description, row.meta_keywords,
        row.robots, row.canonical, row.og_json, row.twitter_json, row.hreflang_json, row.schema_json,
        row.h1, row.headings_json, row.body_html, row.faqs_json, row.source_url, row.snapshot_at,
        row.is_active, nowSql(), existing.id
      );
      console.log(`  updated legacy_pages.id=${existing.id} (${row.path})`);
    } else {
      db.prepare(
        `INSERT INTO legacy_pages
           (path, lang, status_code, title, meta_description, meta_keywords, robots, canonical,
            og_json, twitter_json, hreflang_json, schema_json, h1, headings_json, body_html,
            faqs_json, source_url, snapshot_at, is_active, created_at, updated_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
      ).run(
        row.path, row.lang, row.status_code, row.title, row.meta_description, row.meta_keywords,
        row.robots, row.canonical, row.og_json, row.twitter_json, row.hreflang_json, row.schema_json,
        row.h1, row.headings_json, row.body_html, row.faqs_json, row.source_url, row.snapshot_at,
        row.is_active, nowSql(), nowSql()
      );
      console.log(`  inserted legacy_pages (${row.path})`);
    }
  } finally {
    db.close();
  }
}

async function importPage(config) {
  console.log(`\n=== ${config.path} (${config.lang}) ===`);
  const { type, doc } = await findWpDoc(config.path);
  console.log(`  WordPress ${type} id=${doc.id} slug=${doc.slug}`);

  const oldUrl = doc.link;
  const head = extractHead(await (await get(oldUrl)).text());
  const title = head.title || stripHtml(doc.title?.rendered);
  const h1 = stripHtml(doc.title?.rendered) || title;
  const description = head.description || firstParagraph(doc.excerpt?.rendered || '');
  const canonical = head.canonical || oldUrl;

  let body = doc.content?.rendered || '';
  body = await localizeImages(body);
  body = localizeLinks(body, config.links || {});

  const og = { ...head.og };
  const twitter = { ...head.twitter };
  // Locale/site tags are generated by the Astro/PHP SEO layer; drop the old
  // WordPress values so they do not leak "My Blog" / en_US onto a Bangla page.
  delete og['og:locale'];
  delete og['og:locale:alternate'];
  delete og['og:site_name'];

  // Point social previews at the local copy of the same image.
  const ogImage = head.og['og:image'] || '';
  const localOgImage = ogImage ? findExistingLocalImage(ogImage) : null;
  if (localOgImage) {
    og['og:image'] = `${SITE}${localOgImage}`;
    og['og:image:secure_url'] = `${SITE}${localOgImage}`;
    const ext = path.extname(localOgImage).toLowerCase();
    og['og:image:type'] = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';
    if (twitter['twitter:image']) twitter['twitter:image'] = `${SITE}${localOgImage}`;
  }

  // The archived Yoast graph still names the site "My Blog" and points the logo
  // at a deleted WordPress upload. Publish a clean BlogPosting graph instead.
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: h1,
      description,
      ...(localOgImage ? { image: `${SITE}${localOgImage}` } : {}),
      url: canonical,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      datePublished: doc.date || doc.modified || undefined,
      dateModified: doc.modified || doc.date || undefined,
      inLanguage: config.lang === 'bn' ? 'bn-BD' : 'en-US',
      author: { '@type': 'Organization', name: 'Tech Dental Care' },
      publisher: {
        '@type': 'Organization',
        name: 'Tech Dental Care',
        logo: { '@type': 'ImageObject', url: `${SITE}/uploads/images/tech-dental-logo.webp` },
      },
    },
  ];

  const row = {
    path: config.path,
    lang: config.lang,
    status_code: 200,
    title,
    meta_description: description,
    meta_keywords: head.keywords || null,
    robots: head.robots || 'index, follow',
    canonical,
    og_json: Object.keys(og).length ? JSON.stringify(og) : null,
    twitter_json: Object.keys(twitter).length ? JSON.stringify(twitter) : null,
    hreflang_json: head.hreflang.length ? JSON.stringify(head.hreflang) : null,
    schema_json: JSON.stringify(schema),
    h1,
    headings_json: JSON.stringify(headingsFrom(body)),
    body_html: body,
    faqs_json: null,
    source_url: oldUrl,
    snapshot_at: doc.modified || doc.date || null,
    is_active: 1,
  };

  console.log(`  title: ${title}`);
  console.log(`  description: ${description.slice(0, 90)}...`);
  console.log(`  body: ${body.length} chars, ${headingsFrom(body).length} headings`);
  upsert(row);
}

function findExistingLocalImage(url) {
  const stem = fileSlug(url).toLowerCase();
  const dirs = ['posts', 'medicines', 'services', 'images', 'old-site/posts'];
  for (const dir of dirs) {
    const abs = path.join(REPO, 'public', 'uploads', dir);
    if (!fs.existsSync(abs)) continue;
    for (const entry of fs.readdirSync(abs)) {
      const dot = entry.lastIndexOf('.');
      if (dot < 0) continue;
      const ext = entry.slice(dot).toLowerCase();
      if (!['.webp', '.png', '.jpg', '.jpeg'].includes(ext)) continue;
      const cleaned = entry.slice(0, dot).replace(/-\d+x\d+$/, '').toLowerCase();
      if (cleaned === stem) return `/uploads/${dir}/${entry}`;
    }
  }
  return null;
}

const selected = only ? PAGES.filter((page) => page.path === only) : PAGES;
if (!selected.length) {
  console.error(`No configured page matches ${only}`);
  process.exit(1);
}
for (const page of selected) {
  await importPage(page);
}
console.log('\nDone.');

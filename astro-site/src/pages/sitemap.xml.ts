import type { APIRoute } from 'astro';
import { all } from '../lib/db';
import { SITE_URL } from '../lib/shared';
import { teamSlug } from '../lib/pages/people';

/**
 * XML sitemap with English + Bangla URLs and hreflang alternates.
 * Port of SitemapController::index.
 */

interface SitemapUrl {
  loc: string;
  lastmod?: string | null;
  priority?: string | null;
  alternates: Record<string, string>;
}

function atom(value: any): string | null {
  if (!value) return null;
  const raw = String(value);
  const date = new Date(raw.includes('T') ? raw : raw.replace(' ', 'T') + 'Z');
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().replace(/\.\d{3}Z$/, '+00:00');
}

function xmlEscape(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function clean(value: any): string {
  return String(value ?? '').trim();
}

export const GET: APIRoute = async () => {
  const base = SITE_URL;
  const urls: SitemapUrl[] = [];

  const add = (
    path: string,
    lastmod: string | null = null,
    priority: string | null = null,
    alternates: Record<string, string> = {}
  ) => {
    urls.push({
      loc: `${base}/${String(path).replace(/^\/+/, '')}`,
      lastmod,
      priority,
      alternates,
    });
  };

  // Core pages
  const staticPages: Array<[string, string]> = [
    ['', '1.0'],
    ['/doctors', '0.9'],
    ['/medicines', '0.9'],
    ['/blog', '0.9'],
    ['/blog/others', '0.7'],
    ['/branches', '0.8'],
    ['/about', '0.8'],
    ['/price-list', '0.8'],
    ['/patient-rights', '0.6'],
    ['/how-to-pay', '0.6'],
    ['/appointment', '0.8'],
    ['/team', '0.6'],
    ['/gallery', '0.6'],
  ];
  for (const [path, priority] of staticPages) add(path, null, priority);

  // Team member profiles
  for (const member of all<any>('SELECT * FROM team_members ORDER BY id')) {
    const slug = teamSlug(member.name);
    if (slug) add(`/team/${slug}`, atom(member.updated_at), '0.5');
  }

  // Services listing (English + Bangla)
  const serviceListAlternates = {
    en: `${base}/services`,
    bn: `${base}/bn/services`,
    'x-default': `${base}/services`,
  };
  add('/services', null, '0.9', serviceListAlternates);
  add('/bn/services', null, '0.7', serviceListAlternates);

  // Branches
  for (const branch of all<any>('SELECT * FROM locations ORDER BY sort_order')) {
    if (branch.slug) add(`/branch/${branch.slug}`, atom(branch.updated_at), '0.7');
  }

  // Services — canonical pattern matches the old product sitemap
  for (const service of all<any>("SELECT * FROM services WHERE status = 'Published' ORDER BY rank_order")) {
    if (!service.slug) continue;
    const enPath = `/service/${service.slug}`;
    const bnPath = service.slug_bn ? `/bn/service/${service.slug_bn}` : null;
    const lastmod = atom(service.updated_at);
    const alternates = bnPath
      ? { en: `${base}${enPath}`, bn: `${base}${bnPath}`, 'x-default': `${base}${enPath}` }
      : {};

    add(enPath, lastmod, '0.8', alternates);
    if (bnPath) add(bnPath, lastmod, '0.7', alternates);
  }

  // Doctors
  for (const doctor of all<any>('SELECT * FROM doctors ORDER BY rank_order')) {
    add(`/doctors/${doctor.id}`, atom(doctor.updated_at), '0.7');
  }

  // Medicines (real medicines only — articles live on the blog)
  const postSlugs = all<{ slug: string }>('SELECT slug FROM posts WHERE slug IS NOT NULL')
    .map((row) => row.slug)
    .filter(Boolean);
  const placeholders = postSlugs.map(() => '?').join(',');
  const medicineSql =
    'SELECT * FROM medicines WHERE is_active = 1' +
    (postSlugs.length ? ` AND slug NOT IN (${placeholders})` : '') +
    ' ORDER BY sort_order';
  for (const medicine of all<any>(medicineSql, postSlugs)) {
    const slug = medicine.slug || medicine.id;
    const alternates = clean(medicine.intro_bn)
      ? { en: `${base}/medicines/${slug}`, bn: `${base}/bn/medicines/${slug}` }
      : {};
    add(`/medicines/${slug}`, atom(medicine.updated_at), '0.7', alternates);
  }

  // Blog posts: skip trashed and thin/empty ones
  const posts = all<any>(
    "SELECT * FROM posts WHERE (status IS NULL OR status IN ('Published','published','1',1)) AND slug IS NOT NULL ORDER BY id"
  );

  for (const post of posts) {
    const plain = clean(String(post.content ?? '').replace(/<[^>]+>/g, ''));
    if ([...plain].length < 300) continue;
    const alternates = clean(post.content_bn)
      ? { en: `${base}/blog/${post.slug}`, bn: `${base}/bn/blog/${post.slug}` }
      : {};
    add(`/blog/${post.slug}`, atom(post.updated_at), '0.7', alternates);
  }

  // Translated core pages
  add('/bn/blog', null, '0.7');
  add('/bn/blog/others', null, '0.5');
  add('/bn/patient-rights', null, '0.5');
  for (const post of posts) {
    if (clean(post.content_bn)) {
      add(`/bn/blog/${post.slug}`, atom(post.updated_at), '0.6');
    }
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  for (const url of urls) {
    xml += '  <url>\n';
    xml += `    <loc>${xmlEscape(url.loc)}</loc>\n`;
    if (url.lastmod) xml += `    <lastmod>${xmlEscape(url.lastmod)}</lastmod>\n`;
    if (url.priority) xml += `    <priority>${url.priority}</priority>\n`;
    for (const [lang, href] of Object.entries(url.alternates)) {
      xml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${xmlEscape(href)}"/>\n`;
    }
    xml += '  </url>\n';
  }
  xml += '</urlset>';

  return new Response(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=UTF-8' },
  });
};

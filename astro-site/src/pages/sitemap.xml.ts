import type { APIRoute } from 'astro';
import { all } from '../lib/db';
import { SITE_URL } from '../lib/shared';
import { teamSlug } from '../lib/pages/people';
import { branchPath, CORE_PATHS, PRICE_LIST_PATHS } from '../lib/publicPaths';

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

  const seen = new Map<string, SitemapUrl>();

  const add = (
    path: string,
    lastmod: string | null = null,
    priority: string | null = null,
    alternates: Record<string, string> = {}
  ) => {
    const loc = `${base}/${String(path).replace(/^\/+/, '')}`;
    const existing = seen.get(loc);
    if (existing) {
      // Never emit the same <loc> twice; keep the richest metadata.
      existing.lastmod = existing.lastmod || lastmod;
      existing.priority = existing.priority || priority;
      existing.alternates = { ...existing.alternates, ...alternates };
      return;
    }
    const entry: SitemapUrl = { loc, lastmod, priority, alternates };
    seen.set(loc, entry);
    urls.push(entry);
  };

  // Core pages. Pages that exist in both languages carry hreflang alternates.
  const blogAlternates = {
    en: `${base}/dentistry`,
    bn: `${base}/bn/dentistry`,
    'x-default': `${base}/dentistry`,
  };
  const blogOthersAlternates = {
    en: `${base}/dentistry/others`,
    bn: `${base}/bn/dentistry/others`,
    'x-default': `${base}/dentistry/others`,
  };
  const patientRightsAlternates = {
    en: `${base}/patient-rights`,
    bn: `${base}/bn/patient-rights`,
    'x-default': `${base}/patient-rights`,
  };
  const medicationAlternates = {
    en: `${base}/medication`,
    bn: `${base}/bn/medication`,
    'x-default': `${base}/medication`,
  };
  const priceListAlternates = {
    en: `${base}${PRICE_LIST_PATHS.en}`,
    bn: `${base}${PRICE_LIST_PATHS.bn}`,
    'x-default': `${base}${PRICE_LIST_PATHS.en}`,
  };
  const doctorsAlternates = {
    en: `${base}${CORE_PATHS.doctors.en}`,
    bn: `${base}${CORE_PATHS.doctors.bn}`,
    'x-default': `${base}${CORE_PATHS.doctors.en}`,
  };
  const branchesAlternates = {
    en: `${base}${CORE_PATHS.branches.en}`,
    bn: `${base}${CORE_PATHS.branches.bn}`,
    'x-default': `${base}${CORE_PATHS.branches.en}`,
  };
  const aboutAlternates = {
    en: `${base}${CORE_PATHS.about.en}`,
    bn: `${base}${CORE_PATHS.about.bn}`,
    'x-default': `${base}${CORE_PATHS.about.en}`,
  };
  const appointmentAlternates = {
    en: `${base}${CORE_PATHS.appointment.en}`,
    bn: `${base}${CORE_PATHS.appointment.bn}`,
    'x-default': `${base}${CORE_PATHS.appointment.en}`,
  };
  const teamAlternates = {
    en: `${base}${CORE_PATHS.team.en}`,
    bn: `${base}${CORE_PATHS.team.bn}`,
    'x-default': `${base}${CORE_PATHS.team.en}`,
  };

  const staticPages: Array<[string, string, Record<string, string>?]> = [
    ['', '1.0'],
    ['/doctors', '0.9', doctorsAlternates],
    ['/bn/doctor', '0.7', doctorsAlternates],
    ['/medication', '0.9', medicationAlternates],
    ['/bn/medication', '0.7', medicationAlternates],
    ['/dentistry', '0.9', blogAlternates],
    ['/bn/dentistry', '0.7', blogAlternates],
    ['/dentistry/others', '0.7', blogOthersAlternates],
    ['/bn/dentistry/others', '0.5', blogOthersAlternates],
    [CORE_PATHS.branches.en, '0.8', branchesAlternates],
    [CORE_PATHS.branches.bn, '0.6', branchesAlternates],
    [CORE_PATHS.about.en, '0.8', aboutAlternates],
    [CORE_PATHS.about.bn, '0.6', aboutAlternates],
    [PRICE_LIST_PATHS.en, '0.8', priceListAlternates],
    [PRICE_LIST_PATHS.bn, '0.6', priceListAlternates],
    ['/patient-rights', '0.6', patientRightsAlternates],
    ['/bn/patient-rights', '0.5', patientRightsAlternates],
    ['/how-to-pay', '0.6'],
    [CORE_PATHS.appointment.en, '0.8', appointmentAlternates],
    [CORE_PATHS.appointment.bn, '0.7', appointmentAlternates],
    [CORE_PATHS.team.en, '0.6', teamAlternates],
    [CORE_PATHS.team.bn, '0.5', teamAlternates],
    ['/gallery', '0.6'],
    ['/complaint-box', '0.4'],
  ];
  for (const [path, priority, alternates] of staticPages) add(path, null, priority, alternates);

  // Public custom pages. Core slugs already have their own routes and are excluded.
  const CORE_PAGE_SLUGS = new Set([
    'home', 'blog', 'services', 'price-list', 'doctors', 'medicines', 'branches',
    'about', 'team', 'appointment', 'mirpur', 'uttara', 'badda', 'jatrabari',
    'branch-mirpur', 'branch-uttara', 'branch-badda', 'branch-jatrabari',
    'best-dentist-in-dhaka', 'best-dentist', 'best-dentist-in-dhaka-bangladesh',
    'about-tech-dental-care', 'about-us',
  ]);
  for (const page of all<any>('SELECT * FROM pages ORDER BY id')) {
    const slug = clean(page.slug);
    if (!slug || CORE_PAGE_SLUGS.has(slug) || page.robots_index === 0) continue;
    add(`/page/${slug}`, atom(page.updated_at), '0.4');
  }

  // Team member profiles
  for (const member of all<any>('SELECT * FROM team_members WHERE is_active = 1 ORDER BY id')) {
    const slug = teamSlug(member.name);
    if (slug) add(`/team/${slug}`, atom(member.updated_at), '0.5');
  }

  // Services listing (English + Bangla)
  const serviceListAlternates = {
    en: `${base}${CORE_PATHS.services.en}`,
    bn: `${base}${CORE_PATHS.services.bn}`,
    'x-default': `${base}${CORE_PATHS.services.en}`,
  };
  add(CORE_PATHS.services.en, null, '0.9', serviceListAlternates);
  add(CORE_PATHS.services.bn, null, '0.7', serviceListAlternates);

  // Branches (English + Bangla with hreflang alternates)
  for (const branch of all<any>('SELECT * FROM locations ORDER BY sort_order')) {
    if (!branch.slug || branch.robots_index === 0) continue;
    const enPath = branchPath(branch, false);
    const bnPath = branchPath(branch, true);
    const alternates = {
      en: `${base}${enPath}`,
      bn: `${base}${bnPath}`,
      'x-default': `${base}${enPath}`,
    };
    add(enPath, atom(branch.updated_at), '0.7', alternates);
    add(bnPath, atom(branch.updated_at), '0.6', alternates);
  }

  // Services — canonical pattern matches the old product sitemap
  for (const service of all<any>("SELECT * FROM services WHERE status = 'Published' ORDER BY rank_order")) {
    if (!service.slug || service.robots_index === 0) continue;
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
    if (doctor.robots_index === 0) continue;
    add(`/doctors/${doctor.slug || doctor.id}`, atom(doctor.updated_at), '0.7');
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
      ? { en: `${base}/medication/${slug}`, bn: `${base}/bn/medication/${slug}` }
      : {};
    add(`/medication/${slug}`, atom(medicine.updated_at), '0.7', alternates);
  }

  // Blog posts: skip trashed and thin/empty ones
  const posts = all<any>(
    "SELECT * FROM posts WHERE (status IS NULL OR status IN ('Published','published','1',1)) AND slug IS NOT NULL ORDER BY id"
  );

  for (const post of posts) {
    if (post.robots_index === 0) continue;
    const plain = clean(String(post.content ?? '').replace(/<[^>]+>/g, ''));
    if ([...plain].length < 300) continue;
    const hasBn = Boolean(clean(post.content_bn));
    const alternates = hasBn
      ? { en: `${base}/dentistry/${post.slug}`, bn: `${base}/bn/dentistry/${post.slug}`, 'x-default': `${base}/dentistry/${post.slug}` }
      : {};
    add(`/dentistry/${post.slug}`, atom(post.updated_at), '0.7', alternates);
    if (hasBn) add(`/bn/dentistry/${post.slug}`, atom(post.updated_at), '0.6', alternates);
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

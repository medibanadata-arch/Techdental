import { all, firstModel, get, json, model, models } from './db';
import { getWebsiteTexts } from '../app/data/websiteTexts';

export const SITE_URL = (process.env.SITE_URL || 'https://techdentalcare.com').replace(/\/+$/, '');
export const SITE_NAME = 'Tech Dental Care';

export interface SharedProps {
  auth: { user: any | null };
  site_settings: any;
  site_url: string;
  locale: string;
  flash: { success: string | null };
}

export function siteSettings(): any {
  return firstModel('home_content');
}

export function sharedProps(locale = 'en', flash: string | null = null): SharedProps {
  return {
    auth: { user: null },
    site_settings: siteSettings(),
    site_url: SITE_URL,
    locale,
    flash: { success: flash },
  };
}

export function pagePayload(component: string, props: Record<string, any>, url: string, locale = 'en') {
  return {
    component,
    props: { ...sharedProps(locale), ...props },
    url,
    version: '1',
  };
}

export function locations() {
  return models('locations', all('SELECT * FROM locations ORDER BY sort_order, id'));
}

export function navMenu() {
  const row = get('SELECT * FROM nav_menus LIMIT 1');
  return row ? model('nav_menus', row) : null;
}

export function servicesPublished() {
  return models('services', all("SELECT * FROM services WHERE status = 'Published' ORDER BY rank_order, id"));
}

export function featuredImages(where = '') {
  const rows = all(`SELECT * FROM featured_images WHERE is_active = 1 ${where} ORDER BY sort_order`);
  return models('featured_images', rows);
}

export function videos() {
  return models('home_videos', all('SELECT * FROM home_videos WHERE is_active = 1 ORDER BY sort_order, id'));
}

export function postsAll() {
  return models('posts', all('SELECT * FROM posts ORDER BY published_at DESC, id DESC'));
}

export function slugify(value: string): string {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

/** Strip HTML for meta descriptions (mirrors Seo.tsx trimDescription). */
export function trimDescription(text?: string, max = 158): string {
  const clean = String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return 'Tech Dental Care provides advanced, painless dental treatments across Mirpur, Uttara, Badda and Jatrabari in Dhaka, Bangladesh.';
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 60 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:\-–—]$/, '') + '…';
}

export function absoluteUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) return SITE_URL;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

/** Mirrors resources/js/data/websiteTexts.ts without a React dependency. */
export function websiteTexts(): Record<string, string> {
  return getWebsiteTexts(siteSettings()?.website_texts);
}

/** Laravel's UsesLocalizedContent::applyBanglaContent. */
export function applyBangla<T extends Record<string, any>>(row: T | null, fields: string[]): T | null {
  if (!row) return row;
  for (const field of fields) {
    const bangla = row[`${field}_bn`];
    if (bangla !== null && bangla !== undefined && String(bangla).trim() !== '') {
      row[field] = bangla;
    }
  }
  const faqsBn = row.faqs_bn;
  if (faqsBn !== null && faqsBn !== undefined && String(faqsBn).trim() !== '') {
    const decoded = typeof faqsBn === 'object' ? faqsBn : json(faqsBn, null);
    if (Array.isArray(decoded)) row.faqs = decoded;
  }
  return row;
}

export function uniqueBy<T extends Record<string, any>>(rows: T[], key: string): T[] {
  const seen = new Set();
  const out: T[] = [];
  for (const row of rows) {
    const value = row?.[key];
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(row);
  }
  return out;
}

/** Distinct, non-empty values (Eloquent distinct()->pluck()). */
export function distinctValues(rows: Record<string, any>[], key: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const row of rows) {
    const value = row?.[key];
    if (value === null || value === undefined || value === '') continue;
    const text = String(value);
    if (seen.has(text)) continue;
    seen.add(text);
    out.push(text);
  }
  return out;
}

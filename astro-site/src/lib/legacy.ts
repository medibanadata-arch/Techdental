import legacyMap from '../data/legacy-entity-map.json';
import { all, get, model, models } from './db';
import { navMenu } from './shared';
import { appointmentProps, appointmentSeo, priceListProps, priceListSeo } from './pages/info';
import { branchIndexProps, branchIndexSeo, branchShowProps, branchShowSeo } from './pages/branches';
import { blogShow } from './pages/blog';
import { aboutProps, aboutSeo, doctorProps, doctorSeo, doctorsIndexProps, doctorsIndexSeo } from './pages/people';
import { medicineShow } from './pages/medicines';
import { medicineAlias } from './medicineAliases';
import { serviceProps, serviceSeo } from './pages/services';
import { homeProps, homeSeo } from './pages/home';
import { pageShow } from './pages/custom';

export interface LegacyEntity {
  type: string;
  id?: number;
  slug?: string;
  lang?: 'en' | 'bn';
}

const REMOVED_PATHS = [
  '/en/home-en',
  '/bn/home',
  // Deleted on purpose: the three departed doctors' old profiles and the two
  // old Google-review pages. They must 404 instead of showing the doctors
  // index / Mirpur branch page under a misleading old URL.
  '/doctors/dr-tasnova-rahman-mohona',
  '/doctors/dr-afsana-haque-joty',
  '/doctors/dr-reshma-islam',
  '/doctors/dr-sadia-afrin',
  '/bn/patiant-gogle-review-tech-dental',
  '/patiant-gogle-review-tech-dental-en',
];

/** Normalised key (leading slash, no trailing slash) used by the entity map. */
function normalizeKey(pathname: string): string {
  const trimmed = String(pathname || '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
  return '/' + trimmed;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

const LOOKUP = new Map<string, LegacyEntity>();
for (const [path, entry] of Object.entries(legacyMap as Record<string, LegacyEntity>)) {
  const key = normalizeKey(path);
  if (!LOOKUP.has(key)) LOOKUP.set(key, entry);
}

/** Old URL -> current entity map, checking raw and percent-decoded forms. */
export function lookupEntity(pathname: string): LegacyEntity | null {
  for (const candidate of new Set([pathname, safeDecode(pathname)])) {
    const key = normalizeKey(candidate);
    const entry = LOOKUP.get(key) ?? LOOKUP.get(key + '/');
    if (entry) return entry;
  }
  return null;
}

/** True when an old URL is served by an existing page of the current site. */
export function hasMappedEntity(pathname: string): boolean {
  return lookupEntity(pathname) !== null;
}

/** Permanently removed old URLs must return 404, never redirect. */
export function isRemovedPath(pathname: string): boolean {
  for (const candidate of new Set([pathname, safeDecode(pathname)])) {
    if (REMOVED_PATHS.includes(normalizeKey(candidate))) return true;
  }
  return false;
}

/** Path candidates Laravel's middleware checks against the archived pages table. */
export function pathCandidates(pathname: string): string[] {
  const out = new Set<string>();
  const add = (value: string) => {
    if (!value) return;
    out.add(value);
    const key = normalizeKey(value);
    out.add(key);
    if (key !== '/') out.add(key + '/');
  };
  add(pathname);
  add(safeDecode(pathname));
  return [...out];
}

export function hasLegacyPage(pathname: string): boolean {
  for (const candidate of pathCandidates(pathname)) {
    const row = get<{ id: number }>('SELECT id FROM legacy_pages WHERE is_active = 1 AND path = ? LIMIT 1', [candidate]);
    if (row) return true;
  }
  return false;
}

export function findLegacyPage(pathname: string): any | null {
  const clean = normalizeKey(safeDecode(pathname));
  const row =
    get('SELECT * FROM legacy_pages WHERE is_active = 1 AND path = ? LIMIT 1', [clean]) ||
    get('SELECT * FROM legacy_pages WHERE is_active = 1 AND path = ? LIMIT 1', [clean + '/']);
  return row ? model('legacy_pages', row) : null;
}

/* ------------------------------------------------------------------------- */
/* React page rendering for mapped entities                                   */
/* ------------------------------------------------------------------------- */

export type LegacyRender =
  | { kind: 'render'; component: string; props: any; seo: any; lang: string; url: string }
  | { kind: 'redirect'; location: string; status?: number }
  | null;

function isBanglaPath(pathname: string): boolean {
  const clean = normalizeKey(pathname);
  return clean === '/bn' || clean.startsWith('/bn/');
}

/** Render the current page that an archived old URL should now show. */
export function renderMappedEntity(pathname: string, entity: LegacyEntity): LegacyRender {
  const pathIsBn = isBanglaPath(pathname);
  const localeIsBn = entity.lang === 'bn';
  const lang = localeIsBn ? 'bn' : 'en';
  const slug = String(entity.slug ?? entity.id ?? '');
  const base = { url: normalizeKey(pathname), lang };

  const page = (component: string, props: any, seo: any): LegacyRender => ({
    kind: 'render',
    component,
    props,
    seo,
    ...base,
  });

  try {
    switch (entity.type) {
      case 'medicine': {
        const result = medicineShow(slug, pathIsBn, true);
        if (!result) return null;
        if (result.kind === 'redirect') return { kind: 'redirect', location: result.location, status: result.status || 301 };
        return page('Medicines/PublicSingle', result.props, result.seo);
      }

      case 'post': {
        const result = blogShow(slug, pathIsBn, true);
        if (!result) return null;
        if (result.kind === 'redirect') return { kind: 'redirect', location: result.location, status: result.status || 301 };
        return page('Blog/PublicSingle', result.props, result.seo);
      }

      case 'service': {
        const result = serviceProps(slug, pathIsBn);
        if (!result) return null;
        return page('Services/PublicSingle', result.props, serviceSeo(result.props.item, pathIsBn));
      }

      case 'doctor': {
        const props = doctorProps(String(entity.id ?? entity.slug ?? ''), localeIsBn);
        if (!props) return null;
        return page('Doctors/PublicSingle', props, doctorSeo(props.item, props.hotline, localeIsBn));
      }

      case 'page': {
        const result = pageShow(slug || 'about', true);
        if (!result) return null;
        if (result.kind === 'redirect') return { kind: 'redirect', location: result.location, status: result.status || 301 };
        return page(result.component, result.props, result.seo);
      }

      case 'appointment': {
        const props = appointmentProps();
        return page('BookAppointment/PublicIndex', props, appointmentSeo(localeIsBn));
      }

      case 'home': {
        const props = homeProps();
        return page('Home', props, homeSeo(props));
      }

      case 'about': {
        const props = aboutProps(localeIsBn);
        return page('About/PublicIndex', props, aboutSeo(props.content, localeIsBn));
      }

      case 'branches': {
        const props = branchIndexProps();
        return page('Branch/PublicIndex', props, branchIndexSeo(localeIsBn));
      }

      case 'branch': {
        const props = branchShowProps(slug, localeIsBn);
        if (!props) return null;
        return page('Branch/PublicShow', props, branchShowSeo(props.branch, localeIsBn));
      }

      case 'doctors': {
        const props = doctorsIndexProps(localeIsBn);
        return page('Doctors/PublicIndex', props, doctorsIndexSeo(props.settings, localeIsBn));
      }

      case 'price_list': {
        const props = priceListProps(localeIsBn, /special-offer/i.test(pathname));
        return page('PriceList/PublicIndex', props, priceListSeo(props.settings, localeIsBn));
      }

      default:
        return null;
    }
  } catch (error) {
    console.error('Legacy entity render failed', pathname, error);
    return null;
  }
}

/* ------------------------------------------------------------------------- */
/* Archived page renderer (legacy WordPress rows)                            */
/* ------------------------------------------------------------------------- */

function decodeArray(value: any): any[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  const parsed = decodeJson(value);
  return Array.isArray(parsed) ? parsed : [];
}

function decodeObject(value: any): Record<string, string> {
  if (!value) return {};
  const parsed = typeof value === 'string' ? decodeJson(value) : value;
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    const out: Record<string, string> = {};
    for (const [key, item] of Object.entries(parsed)) {
      if (item !== null && item !== undefined && item !== '') out[key] = String(item);
    }
    return out;
  }
  return {};
}

function decodeJson(value: any): any {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/** Archived HTML: keep text and images only, never archived buttons/forms. */
export function prepareLegacyBody(html: string): string {
  let out = String(html || '');
  out = out.replace(/https?:\/\/web\.archive\.org\/web\/\d+(?:[a-z_]{0,4})?\//gi, '');
  out = out.replace(/(href=["'])(?:https?:)?\/\/techdentalcare\.com/gi, '$1');
  out = out.replace(/<(script|style|noscript|form|button|input|select|textarea|iframe)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  out = out.replace(/<(input|select|textarea|button|iframe)\b[^>]*\/?>/gi, '');

  for (let i = 0; i < 6; i++) {
    const before = out;
    out = out.replace(
      /<div\b[^>]*class="[^"]*(?:elementor-widget-button|elementor-widget-form|elementor-widget-call-to-action|elementor-widget-nav-menu|elementor-widget-search-form)[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
      ''
    );
    if (out === before) break;
  }

  out = out.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (match, attrs: string, body: string) => {
    if (/class="[^"]*(?:btn|button|elementor-button|add-to-cart|order-now|book-online|call-now)[^"]*"/i.test(attrs)) {
      return `<span>${body}</span>`;
    }
    return match;
  });

  out = out.replace(/<div\b[^>]*(?:elementor-widget-fixed|sticky|floating|hotline-box|call-now-box)[^>]*>[\s\S]*?<\/div>/gi, '');
  out = out.replace(/<h1(\s[^>]*)?>([\s\S]*?)<\/h1>/gi, (_match, attrs: string | undefined, body: string) => {
    return `<h2${attrs || ''}>${body}</h2>`;
  });

  return out;
}

export function renderLegacyPage(pathname: string, page: any): LegacyRender {
  const isBn = page?.lang === 'bn';
  const title = String(page?.title || page?.h1 || '').trim();
  const h1 = String(page?.h1 || page?.title || '').trim();
  const canonical = page?.canonical || `https://techdentalcare.com${page?.path || normalizeKey(pathname)}`;
  const schema = decodeArray(page?.schema_json);
  const og = decodeObject(page?.og_json);
  const twitter = decodeObject(page?.twitter_json);
  const hreflang = decodeArray(page?.hreflang_json);
  const faqs = decodeArray(page?.faqs_json);

  const legacySeo = {
    title,
    description: String(page?.meta_description || ''),
    keywords: String(page?.meta_keywords || ''),
    robots: page?.robots || 'index, follow',
    canonical,
    lang: isBn ? 'bn' : 'en',
    og,
    twitter,
    hreflang,
    schema,
  };

  return {
    kind: 'render',
    component: 'Legacy/Show',
    props: {
      legacy: {
        path: page?.path,
        title,
        h1,
        body_html: prepareLegacyBody(String(page?.body_html || '')),
        faqs,
        snapshot_at: page?.snapshot_at,
        is_bn: isBn,
      },
      legacy_seo: legacySeo,
      locations: models('locations', all('SELECT * FROM locations ORDER BY sort_order')),
      nav_menu: navMenu(),
    },
    seo: {
      title,
      description: legacySeo.description,
      keywords: legacySeo.keywords || undefined,
      robots: legacySeo.robots,
      canonical,
      lang: legacySeo.lang,
      schema,
      og,
      twitter,
      hreflang,
      noSuffix: true,
    },
    lang: isBn ? 'bn' : 'en',
    url: normalizeKey(pathname),
  };
}

/* ------------------------------------------------------------------------- */
/* Old WordPress URL patterns with a 301 fallback                            */
/* ------------------------------------------------------------------------- */

export interface OldPattern {
  /** Path used for the legacy entity / archived page lookup. */
  candidatePath: string;
  /** 301 target when no archived copy exists. */
  fallback: string;
}

const OLD_PATTERNS: Array<{ re: RegExp; build: (match: RegExpMatchArray) => OldPattern }> = [
  {
    re: /^\/dental\/([^/]+)$/,
    build: (m) => ({ candidatePath: `/dental/${m[1]}`, fallback: `/dentistry/${m[1]}` }),
  },
  {
    re: /^\/blog-en\/dental(?:\/([^/]+))?$/,
    build: (m) => ({ candidatePath: normalizeKey(`/blog-en/dental${m[1] ? '/' + m[1] : ''}`), fallback: m[1] ? `/dentistry/${m[1]}` : '/dentistry' }),
  },
  {
    re: /^\/bn\/blog\/dental(?:\/([^/]+))?$/,
    build: (m) => ({ candidatePath: normalizeKey(`/bn/blog/dental${m[1] ? '/' + m[1] : ''}`), fallback: m[1] ? `/bn/dentistry/${m[1]}` : '/bn/dentistry' }),
  },
  {
    re: /^\/bn\/dentistry\/([^/]+)$/,
    build: (m) => ({ candidatePath: `/bn/dentistry/${m[1]}`, fallback: '/bn/dentistry' }),
  },
  {
    re: /^\/medicine\/([^/]+)$/,
    build: (m) => ({ candidatePath: `/medicine/${m[1]}`, fallback: `/medication/${medicineAlias(m[1]) || m[1]}` }),
  },
  {
    re: /^\/bn\/medicine\/([^/]+)$/,
    build: (m) => ({ candidatePath: `/bn/medicine/${m[1]}`, fallback: `/bn/medication/${medicineAlias(m[1]) || m[1]}` }),
  },
  {
    re: /^\/bn\/medication\/([^/]+)$/,
    build: (m) => ({
      candidatePath: `/bn/medication/${m[1]}`,
      fallback: medicineAlias(m[1]) ? `/bn/medication/${medicineAlias(m[1])}` : '/bn/medication',
    }),
  },
  {
    re: /^\/blog-en\/medical(?:\/([^/]+))?$/,
    build: (m) => ({ candidatePath: normalizeKey(`/blog-en/medical${m[1] ? '/' + m[1] : ''}`), fallback: m[1] ? `/medication/${m[1]}` : '/medication' }),
  },
  {
    re: /^\/bn\/blog\/medical(?:\/([^/]+))?$/,
    build: (m) => ({ candidatePath: normalizeKey(`/bn/blog/medical${m[1] ? '/' + m[1] : ''}`), fallback: m[1] ? `/bn/medication/${m[1]}` : '/bn/medication' }),
  },
  {
    re: /^\/physician\/([^/]+)$/,
    build: (m) => ({ candidatePath: `/physician/${m[1]}`, fallback: `/dentistry/${m[1]}` }),
  },
  {
    re: /^\/bn\/physicians\/([^/]+)$/,
    build: (m) => ({ candidatePath: `/bn/physicians/${m[1]}`, fallback: `/bn/dentistry/${m[1]}` }),
  },
  {
    re: /^\/bn\/wellness\/([^/]+)$/,
    build: (m) => ({ candidatePath: `/bn/wellness/${m[1]}`, fallback: `/bn/dentistry/${m[1]}` }),
  },
  {
    re: /^\/bn\/updates\/([^/]+)$/,
    build: (m) => ({ candidatePath: `/bn/updates/${m[1]}`, fallback: `/bn/dentistry/${m[1]}` }),
  },
  {
    re: /^\/update\/case-study\/([^/]+)$/,
    build: (m) => ({ candidatePath: `/update/case-study/${m[1]}`, fallback: `/dentistry/${m[1]}` }),
  },
  {
    re: /^\/update\/centres\/([^/]+)$/,
    build: (m) => ({ candidatePath: `/update/centres/${m[1]}`, fallback: `/dentistry/${m[1]}` }),
  },
  {
    re: /^\/update\/([^/]+)$/,
    build: (m) => ({ candidatePath: `/update/${m[1]}`, fallback: `/dentistry/${m[1]}` }),
  },
  {
    re: /^\/uncategorized-en\/([^/]+)$/,
    build: (m) => ({ candidatePath: `/uncategorized-en/${m[1]}`, fallback: `/dentistry/${m[1]}` }),
  },
  {
    re: /^\/tech-physio\/([^/]+)$/,
    build: (m) => ({ candidatePath: `/tech-physio/${m[1]}`, fallback: `/dentistry/${m[1]}` }),
  },
];

export function matchOldPattern(pathname: string): OldPattern | null {
  const clean = normalizeKey(safeDecode(pathname));
  for (const pattern of OLD_PATTERNS) {
    const match = clean.match(pattern.re);
    if (match) return pattern.build(match);
  }
  return null;
}

/* ------------------------------------------------------------------------- */
/* Direct 301 aliases from routes/web.php                                    */
/* ------------------------------------------------------------------------- */

export interface SpecialRedirect {
  /** 301 target. */
  location: string;
  /** Serve the mapped entity / archived page at this URL instead of redirecting. */
  resolve?: boolean;
}

const SPECIAL_REDIRECTS: Record<string, SpecialRedirect> = {
  '/patient-rights-and-responsibilities': { location: '/patient-rights' },
  '/patient-bill-of-rights': { location: '/patient-rights' },
  '/complaint': { location: '/complaint-box' },
  '/complaints': { location: '/complaint-box' },
  '/feedback': { location: '/complaint-box' },
  '/payment-methods': { location: '/how-to-pay' },
  '/payment': { location: '/how-to-pay' },
  '/howtopay': { location: '/how-to-pay' },
  '/photos': { location: '/gallery' },
  '/videos': { location: '/gallery#videos' },
  // Canonical branch URLs from the old site. The remaining old branch aliases
  // (/mirpur, /branch-mirpur, /uttara-branch, …) must 404, never redirect.
  '/mirpur-branch': { location: '/mirpur-branch', resolve: true },
  // Structural pages (about-tech-dental, corporate-tram-en, our-services,
  // contact, book-an-appointment, /bn/doctor) are real routes in src/pages.
  '/message-from-ceo': { location: '/corporate-tram-en' },
  '/message-from-medical-director': { location: '/corporate-tram-en' },
  '/message-from-head-of-human-resources': { location: '/corporate-tram-en' },
  '/bn/updates/patient-bill-of-rights': { location: '/bn/patient-rights' },
  '/bn/patient-speaks': { location: '/' },
  '/terms-of-service': { location: '/page/terms-of-service' },
  '/terms': { location: '/page/terms-of-service' },
  '/privacy-policy': { location: '/page/privacy-policy' },
  '/privacy': { location: '/page/privacy-policy' },
};

export function matchSpecialRedirect(pathname: string): SpecialRedirect | null {
  const clean = normalizeKey(safeDecode(pathname));
  return SPECIAL_REDIRECTS[clean] || null;
}

/** Encode non-ASCII characters for the Location header. */
export function encodeLocation(location: string): string {
  return location.replace(/[^\x20-\x7E]/g, (char) => encodeURIComponent(char));
}

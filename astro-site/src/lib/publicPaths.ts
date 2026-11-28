/**
 * Canonical public URLs shared by server code and client islands.
 *
 * These mirror the old WordPress slugs so every page keeps exactly one URL
 * that Google already knows. Keep this module dependency-free: it is imported
 * from React components that ship to the browser.
 */

export const BRANCH_PATHS: Record<string, { en: string; bn: string }> = {
  mirpur: { en: '/mirpur-branch', bn: '/bn/best-dentist-mirpur' },
  badda: { en: '/best-dentist-in-badda', bn: '/bn/best-dentist-badda' },
  uttara: { en: '/best-dentist-in-uttara', bn: '/bn/best-dentist-uttara' },
  jatrabari: { en: '/best-dentist-jatrabari-en', bn: '/bn/best-dentist-jatrabari' },
};

export function branchPathFromSlug(slug: string, isBn = false): string {
  const key = String(slug || '')
    .toLowerCase()
    .replace(/branch/gi, '')
    .replace(/-/g, '')
    .trim();
  const found = Object.keys(BRANCH_PATHS).find((name) => key.includes(name));
  if (!found) return isBn ? `/bn/branch/${slug}` : `/branch/${slug}`;
  return isBn ? BRANCH_PATHS[found].bn : BRANCH_PATHS[found].en;
}

export function branchPath(branch: any, isBn = false): string {
  return branchPathFromSlug(String(branch?.slug ?? branch?.short_name ?? branch?.name ?? ''), isBn);
}

/** Branch key ('mirpur', 'badda', …) for any canonical EN/BN branch URL. */
export function branchKeyFromPath(path: string): string | null {
  const clean = String(path || '').replace(/^\/+|\/+$/g, '');
  for (const [key, paths] of Object.entries(BRANCH_PATHS)) {
    if (clean === paths.en.replace(/^\/+|\/+$/g, '')) return key;
    if (clean === paths.bn.replace(/^\/+|\/+$/g, '')) return key;
  }
  return null;
}

export function branchPathFromKey(key: string, isBn = false): string {
  const paths = BRANCH_PATHS[key];
  if (!paths) return isBn ? `/bn/branch/${key}` : `/branch/${key}`;
  return isBn ? paths.bn : paths.en;
}

export const PRICE_LIST_PATHS = {
  en: '/tech-dental-treatment-price-list-bangladesh',
  bn: '/bn/tech-dental-treatment-price-list-bn',
};

export function priceListPath(isBn = false): string {
  return isBn ? PRICE_LIST_PATHS.bn : PRICE_LIST_PATHS.en;
}

/**
 * Canonical URLs for the structural pages, again matching the old WordPress
 * site so the new site keeps one address per page.
 */
export const CORE_PATHS: Record<string, { en: string; bn: string }> = {
  about: { en: '/about-tech-dental', bn: '/bn/about-tech-dental-en' },
  team: { en: '/corporate-tram-en', bn: '/bn/corporate-tram' },
  services: { en: '/our-services', bn: '/bn/services' },
  branches: { en: '/contact', bn: '/bn/contact' },
  appointment: { en: '/book-an-appointment', bn: '/bn/appointment' },
  doctors: { en: '/doctors', bn: '/bn/doctor' },
};

export function corePath(key: keyof typeof CORE_PATHS, isBn = false): string {
  const paths = CORE_PATHS[key];
  return isBn ? paths.bn : paths.en;
}

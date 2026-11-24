import { all, get, model, models } from '../db';
import { SITE_URL, locations, navMenu, websiteTexts } from '../shared';

export function postSlugs(): string[] {
  return all<{ slug: string }>('SELECT slug FROM posts WHERE slug IS NOT NULL').map((row) => row.slug);
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * The "Last Updated" badge always shows the current month and year, so the
 * stored value is refreshed at render time instead of going stale.
 */
function currentLastUpdated(): string {
  const now = new Date();
  return `${MONTHS_EN[now.getMonth()]} ${now.getFullYear()}`;
}

function withCurrentLastUpdated<T extends { author?: any }>(item: T): T {
  if (!item || !item.author) return item;
  return { ...item, author: { ...item.author, last_updated: currentLastUpdated() } };
}

export function medicinesIndexProps(isBn: boolean) {
  const slugs = postSlugs();
  const placeholders = slugs.map(() => '?').join(',');
  const sql =
    'SELECT * FROM medicines WHERE is_active = 1' +
    (slugs.length ? ` AND slug NOT IN (${placeholders})` : '') +
    ' ORDER BY sort_order';
  const medicines = models('medicines', all(sql, slugs)).map((m: any) => withCurrentLastUpdated(m));
  return {
    medicines,
    locations: locations(),
    nav_menu: navMenu(),
    is_bn: isBn,
  };
}

export function medicinesIndexSeo(isBn: boolean) {
  const copy = websiteTexts();
  return {
    title: isBn ? copy.medicines_seo_title_bn : copy.medicines_seo_title,
    description: isBn ? copy.medicines_seo_desc_bn : copy.medicines_seo_desc,
    path: '/medicines',
    noSuffix: isBn,
  };
}

export function medicinesIndexSchema(medicines: any[], isBn: boolean) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isBn ? 'ঔষধ ও প্রেসক্রিপশন নির্দেশিকা' : 'Medicines & Pharmacy Guides',
    itemListElement: medicines.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: isBn ? m.name_bn || m.name : m.name,
      url: `${SITE_URL}/medicines/${m.slug}`,
    })),
  };
}

export type MedicineResult =
  | { kind: 'page'; props: any; seo: any }
  | { kind: 'redirect'; location: string }
  | null;

export function medicineShow(slug: string, isBn: boolean, legacy = false): MedicineResult {
  if (!legacy) {
    const post = get('SELECT * FROM posts WHERE slug = ?', [slug]);
    if (post) {
      const toBn = isBn && String(post.content_bn || '').trim() !== '';
      return { kind: 'redirect', location: `${toBn ? '/bn/blog/' : '/blog/'}${slug}` };
    }
  }

  const row = get('SELECT * FROM medicines WHERE slug = ? OR id = ?', [slug, slug]);
  if (!row) return null;
  const item = model<any>('medicines', row);

  if (!item.is_active && !legacy) {
    const path = item.canonical_url ? new URL(String(item.canonical_url), SITE_URL).pathname : null;
    if (path && path !== `/medicines/${item.slug}` && path !== `/bn/medicines/${item.slug}`) {
      const target = isBn && path.startsWith('/medicines/') ? `/bn${path}` : path;
      return { kind: 'redirect', location: target };
    }
    return { kind: 'redirect', location: '/medicines' };
  }

  const slugs = postSlugs();
  const placeholders = slugs.map(() => '?').join(',');
  const sql =
    'SELECT * FROM medicines WHERE is_active = 1 AND id != ?' +
    (slugs.length ? ` AND slug NOT IN (${placeholders})` : '') +
    ' ORDER BY sort_order LIMIT 4';
  const related = models('medicines', all(sql, [item.id, ...slugs]));

  const medSlug = item.slug || String(item.id);
  return {
    kind: 'page',
    props: {
      item: withCurrentLastUpdated(item),
      related: related.map((r: any) => withCurrentLastUpdated(r)),
      locations: locations(),
      nav_menu: navMenu(),
      is_bn: isBn,
      canonical_url: `${SITE_URL}/${isBn ? 'bn/' : ''}medicines/${medSlug}`,
      hreflang: {
        en: `${SITE_URL}/medicines/${medSlug}`,
        bn: `${SITE_URL}/bn/medicines/${medSlug}`,
        'x-default': `${SITE_URL}/medicines/${medSlug}`,
      },
    },
    seo: medicineSeo(item, isBn),
  };
}

export function medicineSeo(item: any, isBn: boolean) {
  const displayName = isBn ? item.name_bn || '' : item.name;
  const cleanMedicineName =
    String(displayName || item.name || '')
      .replace(/\s+(tablet|capsule|syrup|suspension|mouthwash|gel)\s*$/i, '')
      .trim() || displayName || (isBn ? 'ঔষধ' : 'Medicine');

  const displaySubtitle = isBn ? item.subtitle_bn || '' : item.subtitle || '';
  const displayIntro = isBn ? item.intro_bn || '' : item.intro || '';
  const pageDescription = isBn
    ? item.meta_desc_bn || displayIntro || ''
    : item.meta_desc || displaySubtitle || displayIntro || '';

  const seoTitleSuffix = isBn
    ? String(item.seo_title_bn || '').trim() || 'ব্যবহার, ডোজ ও পার্শ্বপ্রতিক্রিয়া'
    : item.seo_title && !/^more about\b/i.test(String(item.seo_title).trim())
      ? item.seo_title
      : 'Uses, Dosage, Side Effects & Price in Bangladesh';

  const medSlug = item.slug || String(item.id);
  const medPath = `${isBn ? '/bn' : ''}/medicines/${medSlug}`;
  const medCanonical = `${SITE_URL}${medPath}`;
  const medImage = item.image
    ? /^https?:\/\//i.test(item.image)
      ? item.image
      : `${SITE_URL}${item.image.startsWith('/') ? '' : '/'}${item.image}`
    : undefined;

  const schemas: any[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Drug',
      name: displayName || item.name,
      alternateName: (isBn ? item.generic_bn : item.generic) || undefined,
      description: pageDescription || undefined,
      image: medImage,
      url: medCanonical,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: isBn ? 'হোম' : 'Home', item: SITE_URL },
        {
          '@type': 'ListItem',
          position: 2,
          name: isBn ? 'ঔষধ' : 'Medicines',
          item: `${SITE_URL}/medicines`,
        },
        { '@type': 'ListItem', position: 3, name: displayName || item.name, item: medCanonical },
      ],
    },
  ];

  return {
    title: displayName ? `${displayName} - ${seoTitleSuffix}` : cleanMedicineName,
    description: pageDescription,
    canonical: medCanonical,
    image: medImage || '/images/og-default.jpg',
    type: 'article',
    alternates: {
      en: `${SITE_URL}/medicines/${medSlug}`,
      bn: `${SITE_URL}/bn/medicines/${medSlug}`,
      'x-default': `${SITE_URL}/medicines/${medSlug}`,
    },
    schema: schemas,
  };
}

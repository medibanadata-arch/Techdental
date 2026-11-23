import { all, get, json, model, models } from '../db';
import { SITE_URL, applyBangla, distinctValues, locations, navMenu, websiteTexts } from '../shared';

export const SERVICE_CATEGORY_FALLBACK = 'Dental';

export function servicesIndexProps(isBn: boolean) {
  const services = models(
    'services',
    all("SELECT * FROM services WHERE status = 'Published' ORDER BY rank_order")
  );
  return {
    services,
    categories: distinctValues(services as any[], 'category'),
    locations: locations(),
    nav_menu: navMenu(),
    is_bn: isBn,
  };
}

export function servicesIndexSeo(isBn: boolean) {
  const copy = websiteTexts();
  const title = isBn ? copy.services_seo_title_bn : copy.services_seo_title;
  const description = isBn ? copy.services_seo_desc_bn : copy.services_seo_desc;
  return {
    title,
    description,
    path: isBn ? '/bn/services' : '/services',
    alternates: {
      en: `${SITE_URL}/services`,
      bn: `${SITE_URL}/bn/services`,
      'x-default': `${SITE_URL}/services`,
    },
    noSuffix: isBn,
  };
}

export function servicesIndexSchema(services: any[], isBn: boolean) {
  const copy = websiteTexts();
  const title = isBn ? copy.services_seo_title_bn : copy.services_seo_title;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: isBn ? s.title_bn || s.title : s.title,
      url: `${SITE_URL}${isBn ? `/bn/service/${s.slug_bn || s.slug}` : `/service/${s.slug}`}`,
    })),
  };
}

/** Resolve a service the same way ServiceController::resolveService does. */
export function resolveService(slug: string, isBn: boolean): any | null {
  if (/^\d+$/.test(slug)) {
    const row = get('SELECT * FROM services WHERE id = ?', [Number(slug)]);
    return row ? model('services', row) : null;
  }

  if (isBn) {
    const bn = get('SELECT * FROM services WHERE slug_bn = ?', [slug]);
    if (bn) return model('services', bn);
    const en = get('SELECT * FROM services WHERE slug = ?', [slug]);
    return en ? model('services', en) : null;
  }

  const row = get('SELECT * FROM services WHERE slug = ?', [slug]);
  if (row) return model('services', row);

  for (const candidate of all('SELECT * FROM services WHERE slug_legacy IS NOT NULL')) {
    const legacy = json<string[]>(candidate.slug_legacy, []) || [];
    if (legacy.includes(slug)) return model('services', candidate);
  }
  return null;
}

export function serviceProps(slug: string, isBn: boolean) {
  const item = resolveService(slug, isBn);
  if (!item) return null;
  if (isBn && String(item.details_html_bn || '').trim() === '') return null;

  const canonicalSlug = isBn ? item.slug_bn || item.slug : item.slug;
  const doctors = models('doctors', all('SELECT * FROM doctors ORDER BY rank_order'));
  const related = models(
    'services',
    all("SELECT * FROM services WHERE status = 'Published' AND id != ? ORDER BY rank_order LIMIT 4", [item.id])
  );

  return {
    canonicalSlug,
    props: {
      item,
      doctors,
      locations: locations(),
      related,
      nav_menu: navMenu(),
      is_bn: isBn,
      language_urls: {
        en: `/service/${item.slug}`,
        bn: item.slug_bn ? `/bn/service/${item.slug_bn}` : null,
      },
    },
  };
}

export function serviceSeo(item: any, isBn: boolean) {
  const title = isBn ? item.title_bn || item.title : item.title;
  const pagePath = isBn ? `/bn/service/${item.slug_bn || item.slug}` : `/service/${item.slug}`;
  const pageTitle = isBn ? item.seo_title_bn || title : item.seo_title || title;
  const pageDesc = isBn
    ? item.meta_desc_bn || item.short_desc_bn || item.short_desc || ''
    : item.meta_desc ||
      item.short_desc ||
      `Learn more about ${item.title} at Tech Dental Care. Specialist dental treatments with modern equipment in Dhaka.`;
  const robots = `${item.robots_index !== false ? 'index' : 'noindex'}, ${
    item.robots_follow !== false ? 'follow' : 'nofollow'
  }`;

  const shortName = (() => {
    const heading = isBn
      ? item.details_heading_bn || `${title} সম্পর্কে আরও জানুন`
      : item.details_heading || item.title || 'Treatment';
    return String(heading)
      .replace(/^More About\s+/i, '')
      .replace(/\s*সম্পর্কে আরও জানুন\s*$/, '')
      .trim();
  })();

  const faqs = Array.isArray(item.faqs) ? item.faqs : [];
  const url = `${SITE_URL}${pagePath}`;
  const graph: any[] = [
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: title,
      description: pageDesc,
      serviceType: shortName,
      url,
      ...(item.hero_main ? { image: `${SITE_URL}${item.hero_main}` } : {}),
      provider: {
        '@type': 'Dentist',
        name: 'Tech Dental Care',
        url: SITE_URL,
        telephone: '+8809638000505',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '827 (2nd Floor), Shewrapara, Begum Rokeya Sarani',
          addressLocality: 'Mirpur, Dhaka',
          postalCode: '1216',
          addressCountry: 'BD',
        },
      },
      areaServed: { '@type': 'City', name: 'Dhaka' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BDT',
        ...(String(item.price || '').replace(/[^\d]/g, '')
          ? { price: String(item.price || '').replace(/[^\d]/g, '') }
          : {}),
        availability: 'https://schema.org/InStock',
        url,
      },
    },
  ];

  if (faqs.filter((f: any) => f?.q).length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faqs
        .filter((f: any) => f?.q)
        .map((f: any) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    });
  }

  graph.push({
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isBn ? 'হোম' : 'Home', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: isBn ? 'সেবাসমূহ' : 'Services',
        item: `${SITE_URL}${isBn ? '/bn/services' : '/services'}`,
      },
      { '@type': 'ListItem', position: 3, name: title, item: url },
    ],
  });

  return {
    title: pageTitle,
    description: pageDesc,
    path: pagePath,
    image: item.hero_main,
    type: 'website',
    robots,
    alternates: {
      en: `${SITE_URL}/service/${item.slug}`,
      ...(item.slug_bn ? { bn: `${SITE_URL}/bn/service/${item.slug_bn}` } : {}),
      'x-default': `${SITE_URL}/service/${item.slug}`,
    },
    schema: { '@context': 'https://schema.org', '@graph': graph },
    noSuffix: isBn,
  };
}

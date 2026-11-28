import { all, get, model, models } from '../db';
import { SITE_URL, navMenu } from '../shared';
import { aboutProps, aboutSeo } from './people';

const REDIRECT_MAP: Record<string, string> = {
  home: '/',
  'price-list': '/tech-dental-treatment-price-list-bangladesh',
  doctors: '/doctors',
  medicines: '/medication',
  branches: '/contact',
  'branch-mirpur': '/mirpur-branch',
  mirpur: '/mirpur-branch',
  'branch-uttara': '/best-dentist-in-uttara',
  uttara: '/best-dentist-in-uttara',
  'branch-badda': '/best-dentist-in-badda',
  badda: '/best-dentist-in-badda',
  'branch-jatrabari': '/best-dentist-jatrabari-en',
  jatrabari: '/best-dentist-jatrabari-en',
  about: '/about-tech-dental',
  blog: '/dentistry',
};

const BEST_DENTIST_SLUGS = ['best-dentist-in-dhaka', 'best-dentist', 'best-dentist-in-dhaka-bangladesh'];

export type PageResult =
  | { kind: 'page'; component: string; props: any; seo: any; url: string }
  | { kind: 'redirect'; location: string; status?: number }
  | null;

export function findPage(slug: string): any | null {
  let row = get('SELECT * FROM pages WHERE slug = ? OR id = ?', [slug, slug]);
  if (!row) {
    const aliases: Record<string, string> = {
      mirpur: 'branch-mirpur',
      uttara: 'branch-uttara',
      badda: 'branch-badda',
      jatrabari: 'branch-jatrabari',
    };
    if (aliases[slug]) row = get('SELECT * FROM pages WHERE slug = ?', [aliases[slug]]);
  }
  return row ? model('pages', row) : null;
}

export function pageShow(slug: string, legacy = false): PageResult {
  if (!legacy && BEST_DENTIST_SLUGS.includes(slug)) {
    return { kind: 'redirect', location: '/doctors', status: 301 };
  }

  const page = findPage(slug);
  if (!page) return null;

  if (['about-tech-dental-care', 'about-us', 'about'].includes(page.slug)) {
    const props = aboutProps();
    return {
      kind: 'page',
      component: 'About/PublicIndex',
      props,
      seo: aboutSeo(props.content),
      url: `/page/${slug}`,
    };
  }

  if (!legacy && REDIRECT_MAP[page.slug]) {
    return { kind: 'redirect', location: REDIRECT_MAP[page.slug], status: 302 };
  }

  return {
    kind: 'page',
    component: 'CustomPages/Show',
    props: {
      item: page,
      locations: all('SELECT * FROM locations'),
      nav_menu: navMenu(),
    },
    seo: pageSeo(page),
    url: `/page/${slug}`,
  };
}

export function pageSeo(item: any) {
  const textContent = item?.content ? String(item.content).replace(/<[^>]+>/g, '') : '';
  const pageCanonical = item.canonical_url || `${SITE_URL}/page/${item.slug}`;
  const pageTitle = item.seo_title || `${item.title} - Tech Dental`;
  const pageDesc = item.meta_desc || (textContent ? `${textContent.substring(0, 155)}...` : 'Tech Dental Care information and patient guides.');
  const robots = `${item.robots_index !== false ? 'index' : 'noindex'}, ${
    item.robots_follow !== false ? 'follow' : 'nofollow'
  }`;
  const faqs = Array.isArray(item.faqs) ? item.faqs : [];

  let schema: any;
  if (item.schema_json) {
    try {
      schema = JSON.parse(item.schema_json);
    } catch {
      schema = undefined;
    }
  }
  if (!schema) {
    const base = {
      '@context': 'https://schema.org',
      '@type': item.schema_type || 'WebPage',
      name: item.title,
      description: pageDesc,
      url: pageCanonical,
    };
    schema = faqs.length
      ? {
          '@context': 'https://schema.org',
          '@graph': [
            base,
            {
              '@type': 'FAQPage',
              mainEntity: faqs
                .filter((f: any) => f && f.q)
                .map((f: any) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
            },
          ],
        }
      : base;
  }

  return {
    title: pageTitle,
    description: pageDesc,
    canonical: pageCanonical,
    robots,
    schema,
    type: 'article',
    noSuffix: true,
  };
}

export function postRow(slug: string): any | null {
  const row = get('SELECT * FROM posts WHERE slug = ? OR id = ?', [slug, slug]);
  return row ? model('posts', row) : null;
}

export function postShow(slug: string) {
  const item = postRow(slug);
  if (!item) return null;
  return {
    props: { item },
    seo: {
      title: item.title,
      description: item.meta_desc || item.excerpt,
      path: `/post/${slug}`,
      robots: 'noindex, follow',
      noSuffix: true,
    },
  };
}

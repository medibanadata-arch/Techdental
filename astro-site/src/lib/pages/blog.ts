import { all, get, model, models } from '../db';
import { SITE_URL, locations, navMenu } from '../shared';

const PUBLISHED = "(status IS NULL OR status IN ('Published','published','1',1))";

export function blogIndexProps(isBn: boolean) {
  const posts = models(
    'posts',
    all(`SELECT * FROM posts WHERE ${PUBLISHED} AND (category = 'Dental' OR category_id = 7) ORDER BY id ASC`)
  );
  return {
    posts,
    locations: locations(),
    nav_menu: navMenu(),
    is_bn: isBn,
  };
}

export function blogOthersProps(isBn: boolean) {
  const posts = models(
    'posts',
    all(
      `SELECT * FROM posts WHERE ${PUBLISHED} AND (category IS NULL OR category != 'Dental') AND (category_id IS NULL OR category_id != 7) ORDER BY id ASC`
    )
  );
  return {
    posts,
    locations: locations(),
    nav_menu: navMenu(),
    is_bn: isBn,
    page_title: 'Other Articles & Guides',
    page_subtitle: 'Health news, case studies, clinic updates and patient guides from Tech Dental.',
    page_title_bn: 'অন্যান্য আর্টিকেল ও গাইড',
    page_subtitle_bn: 'টেক ডেন্টালের স্বাস্থ্য সংবাদ, কেস স্টাডি, ক্লিনিক আপডেট ও রোগীর গাইড।',
  };
}

export function blogIndexSeo(isBn: boolean, isOthers = false) {
  const seoTitle = isOthers
    ? isBn
      ? 'ডেন্টাল কেস স্টাডি, ক্লিনিক আপডেট ও রোগীর গাইড (২০২৬)'
      : 'Dental Case Studies, Clinic Updates & Patient Guides (2026)'
    : isBn
      ? 'ডেন্টাল ব্লগ ও মুখের স্বাস্থ্য গাইড (২০২৬) | টেক ডেন্টাল'
      : 'Dental Blog & Oral Health Guides in Dhaka (2026)';
  const seoDescription = isOthers
    ? isBn
      ? 'টেক ডেন্টাল কেয়ারের ডেন্টাল কেস স্টাডি, চিকিৎসা রিপোর্ট, ক্লিনিক আপডেট ও রোগীর নির্দেশিকা—ঢাকার ডেন্টিস্টদের অভিজ্ঞতা থেকে লেখা।'
      : 'Real dental case studies, treatment reports, clinic updates and patient guides from the dentists at Tech Dental Care in Mirpur, Uttara, Badda and Jatrabari, Dhaka.'
    : isBn
      ? 'দাঁত ব্যথা, রুট ক্যানেল, ইমপ্লান্ট, ব্রেসেস, মাড়ির রোগ ও মুখের স্বাস্থ্য নিয়ে ঢাকার বিশেষজ্ঞ ডেন্টিস্টদের লেখা নির্ভরযোগ্য বাংলা নিবন্ধ ও চিকিৎসা গাইড পড়ুন।'
      : 'Expert dental articles from the BDS dentists at Tech Dental Care, Dhaka — tooth pain relief, root canal, implants, braces, gum disease and daily oral hygiene guides.';

  const enPath = isOthers ? '/blog/others' : '/blog';
  const bnPath = isOthers ? '/bn/blog/others' : '/bn/blog';
  return {
    title: seoTitle,
    description: seoDescription,
    path: isBn ? bnPath : enPath,
    alternates: {
      en: `${SITE_URL}${enPath}`,
      bn: `${SITE_URL}${bnPath}`,
      'x-default': `${SITE_URL}${enPath}`,
    },
    noSuffix: isBn,
  };
}

export function blogIndexSchema(posts: any[], isBn: boolean, isOthers = false) {
  const seo = blogIndexSeo(isBn, isOthers);
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: seo.title,
    itemListElement: posts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: isBn ? p.title_bn || p.title : p.title,
      url: `${SITE_URL}${isBn ? '/bn/blog/' : '/blog/'}${p.slug}`,
    })),
  };
}

const SLUG_REDIRECTS: Record<string, string> = {
  'best-dental-clinic-in-chennai-best-dentist-in-chennai': 'best-dental-clinic-in-chennai',
  'bad-breath-halitosis-causes-home-remedies-prevention': 'bad-breath-causes',
  'gum-cancer-symptoms-causes-and-prevention-strategies': 'gum-cancer-symptoms-causes',
  'wisdom-tooth-pain-relief-medication-and-5-effective-home-remedies': 'wisdom-tooth-pain-relief-tips',
  'medicines-and-4-home-remedies-to-reduce-tooth-pain': 'toothache-relief',
  'orthodontic-centre-tech-dental': 'best-orthodontist-doctor-in-dhaka',
  'bad-breath-remedies': 'bad-breath-causes',
  'gum-cancer-symptoms': 'gum-cancer-symptoms-causes',
  'wisdom-tooth-pain-relief': 'wisdom-tooth-pain-relief-tips',
  'toothache-relief-tips': 'toothache-relief',
};

export type BlogResult =
  | { kind: 'page'; props: any; seo: any }
  | { kind: 'redirect'; location: string }
  | null;

export function blogShow(slug: string, isBn: boolean, legacy = false): BlogResult {
  if (!legacy && SLUG_REDIRECTS[slug]) {
    return { kind: 'redirect', location: `${isBn ? '/bn/blog/' : '/blog/'}${SLUG_REDIRECTS[slug]}` };
  }

  let row = get('SELECT * FROM posts WHERE slug = ?', [slug]) || get('SELECT * FROM posts WHERE id = ?', [slug]);
  if (!row) row = get("SELECT * FROM posts WHERE tags LIKE ?", [`%${slug}%`]);
  if (!row) return null;
  const post = model('posts', row);

  const related = models(
    'posts',
    all('SELECT * FROM posts WHERE id != ? ORDER BY published_at DESC LIMIT 2', [post.id])
  );

  if (!legacy && isBn && String(post.content_bn || '').trim() === '') {
    return { kind: 'redirect', location: `/blog/${post.slug}` };
  }
  if (!legacy && !isBn && String(post.content || '').trim() === '' && String(post.content_bn || '').trim() !== '') {
    return { kind: 'redirect', location: `/bn/blog/${post.slug}` };
  }

  const postSlug = post.slug || String(post.id);
  return {
    kind: 'page',
    props: {
      post,
      related,
      locations: locations(),
      nav_menu: navMenu(),
      is_bn: isBn,
      canonical_url: `${SITE_URL}/${isBn ? 'bn/' : ''}blog/${postSlug}`,
      hreflang: {
        en: `${SITE_URL}/blog/${postSlug}`,
        bn: `${SITE_URL}/bn/blog/${postSlug}`,
        'x-default': `${SITE_URL}/blog/${postSlug}`,
      },
    },
    seo: blogSeo(post, isBn),
  };
}

export function blogSeo(post: any, isBn: boolean) {
  const activeTitle = isBn ? post.title_bn || '' : post.title;
  const activeExcerpt = isBn ? post.excerpt_bn || '' : post.excerpt;
  const authorName = isBn
    ? post.author_name_bn || 'ডা. আয়েশা সিদ্দিকা, বিডিএস'
    : post.author_name || 'Dr. Aysha Siddika, BDS';

  const seoTitle = isBn
    ? post.seo_title_bn || post.title_bn || activeTitle || 'ডেন্টাল ব্লগ'
    : post.seo_title || activeTitle || 'Dental Blog';
  const metaDescription = isBn
    ? post.meta_desc_bn || post.excerpt_bn || activeExcerpt || post.meta_desc || ''
    : post.meta_desc || activeExcerpt || '';
  const focusKeyword = isBn ? post.focus_keyword_bn || post.focus_keyword || '' : post.focus_keyword || '';

  const blogPath = `/blog/${post.slug || ''}`;
  const bnBlogPath = `/bn/blog/${post.slug || ''}`;
  const seoPath = isBn ? bnBlogPath : blogPath;
  const seoImage = post.img || '/images/og-default.jpg';

  return {
    title: seoTitle,
    description: metaDescription,
    keywords: focusKeyword || undefined,
    path: seoPath,
    image: seoImage,
    type: 'article',
    publishedTime: post.published_at ? new Date(post.published_at).toISOString() : undefined,
    modifiedTime: post.published_at ? new Date(post.published_at).toISOString() : undefined,
    author: authorName,
    section: isBn ? post.category_bn || post.category : post.category,
    alternates: {
      en: `${SITE_URL}${blogPath}`,
      ...(post.content_bn ? { bn: `${SITE_URL}${bnBlogPath}` } : {}),
      'x-default': `${SITE_URL}${blogPath}`,
    },
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: activeTitle,
      description: metaDescription || '',
      image: /^https?:\/\//i.test(seoImage) ? seoImage : `${SITE_URL}${seoImage}`,
      url: `${SITE_URL}${seoPath}`,
      author: { '@type': 'Person', name: authorName },
      publisher: {
        '@type': 'Organization',
        name: 'Tech Dental Care',
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/uploads/images/tech-dental-logo.webp` },
      },
      datePublished: post.published_at ? new Date(post.published_at).toISOString() : undefined,
      dateModified: post.published_at ? new Date(post.published_at).toISOString() : undefined,
    },
    noSuffix: isBn,
  };
}

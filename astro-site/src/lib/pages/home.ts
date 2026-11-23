import { all, get, json } from '../db';
import { SITE_URL, navMenu, siteSettings } from '../shared';

function uniqueBy(rows: any[], key: string) {
  const seen = new Set();
  const out: any[] = [];
  for (const row of rows) {
    const value = row?.[key];
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(row);
  }
  return out;
}

export function homeProps() {
  const locations = all('SELECT * FROM locations ORDER BY sort_order, id');
  const services = all('SELECT * FROM pricing ORDER BY sort_order, id');
  const doctors = all('SELECT * FROM doctors ORDER BY rank_order, id');
  const posts = all("SELECT * FROM posts WHERE status IS NULL OR status != 'trash' ORDER BY published_at DESC, id DESC");
  const featured = uniqueBy(
    all(
      "SELECT * FROM featured_images WHERE is_active = 1 AND (branch = 'homepage' OR branch = 'all' OR branch IS NULL OR branch = '') ORDER BY sort_order"
    ),
    'src'
  );
  const videos = all('SELECT * FROM home_videos WHERE is_active = 1 ORDER BY sort_order, id');
  const home = siteSettings();
  const ai = get('SELECT * FROM ai_chat_settings LIMIT 1') as any;

  const chips = ai?.chips ? json<string[]>(ai.chips, null) : null;
  const starter = ai?.starter_questions ? json<string[]>(ai.starter_questions, null) : null;

  return {
    locations,
    services,
    doctors,
    posts,
    featured_images: featured,
    nav_menu: navMenu(),
    videos,
    home_content: home,
    ai_chips: chips,
    ai_settings: {
      bot_name: ai?.bot_name ?? 'Tech Dental Agent',
      bot_avatar: ai?.bot_avatar ?? null,
      starter_questions: starter ?? [
        'ফিলিং চিকিৎসার খরচ কত?',
        'দাঁতে গর্ত হলে কি করা উচিৎ?',
        'রুট ক্যানেল করতে কত খরচ হয়?',
        'দাঁত সোজা করার উপায় কি?',
      ],
      gemini_enabled: Boolean(ai?.gemini_enabled),
    },
  };
}

export function homeSeo(props: ReturnType<typeof homeProps>) {
  const home = props.home_content;
  const title = home?.seo_title || 'Tech Dental Care | Best Dental Clinic in Dhaka, Bangladesh (2026)';
  const description =
    home?.meta_desc ||
    'টেক ডেন্টাল কেয়ার - মিরপুর, উত্তরা, বাড্ডা ও যাত্রাবাড়ী শাখায় অভিজ্ঞ ডেন্টাল সার্জনদের তত্ত্বাবধানে বিশ্বমানের ব্যথামুক্ত চিকিৎসা।';

  const faqs = Array.isArray(home?.faqs) ? home.faqs.filter((f: any) => f && f.q) : [];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}#organization`,
        name: 'Tech Dental Care',
        url: SITE_URL,
        logo: `${SITE_URL}/uploads/images/tech-dental-logo.webp`,
        telephone: '+8809638000505',
        email: 'info@techdentalcare.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '827 (2nd Floor), Shewrapara, Begum Rokeya Sarani',
          addressLocality: 'Mirpur, Dhaka',
          postalCode: '1216',
          addressCountry: 'BD',
        },
      },
      {
        '@type': 'Dentist',
        '@id': `${SITE_URL}#clinic`,
        name: 'Tech Dental Care',
        url: SITE_URL,
        image: `${SITE_URL}/uploads/images/tech-dental-logo.webp`,
        telephone: '+8809638000505',
        priceRange: '৳৳',
        currenciesAccepted: 'BDT',
        paymentAccepted: 'Cash, Debit Card, Credit Card, bKash, Nagad, Rocket, Bangla QR',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '827 (2nd Floor), Shewrapara, Begum Rokeya Sarani',
          addressLocality: 'Mirpur, Dhaka',
          postalCode: '1216',
          addressCountry: 'BD',
        },
        areaServed: [
          { '@type': 'City', name: 'Dhaka' },
          { '@type': 'Place', name: 'Mirpur' },
          { '@type': 'Place', name: 'Uttara' },
          { '@type': 'Place', name: 'Badda' },
          { '@type': 'Place', name: 'Jatrabari' },
        ],
        parentOrganization: { '@id': `${SITE_URL}#organization` },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}#website`,
        url: SITE_URL,
        name: 'Tech Dental Care',
        publisher: { '@id': `${SITE_URL}#organization` },
        inLanguage: ['en', 'bn'],
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/medicines?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      ...(faqs.length
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${SITE_URL}#faq`,
              mainEntity: faqs.map((f: any) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a || '' },
              })),
            },
          ]
        : []),
    ],
  };

  return {
    title,
    description,
    path: '/',
    noSuffix: true,
    schema,
  };
}

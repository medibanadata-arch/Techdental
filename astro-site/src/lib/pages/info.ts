import { all, get, model, models } from '../db';
import { SITE_URL, applyBangla, locations, navMenu, uniqueBy, websiteTexts } from '../shared';
import { SPECIAL_OFFERS_BN } from '../../app/data/specialOffersBn';
import { corePath, PRICE_LIST_PATHS, priceListPath } from '../publicPaths';

export { PRICE_LIST_PATHS, priceListPath };

/* ----------------------------- Price list ----------------------------- */

export function priceListProps(isBn = false, withOffers = false) {
  const row = get('SELECT * FROM price_settings LIMIT 1');
  const settings = row ? model('price_settings', row) : null;
  if (settings && isBn) {
    applyBangla(settings, ['seo_content']);
    // Bangla page must not fall back to the English FAQ list.
    settings.faqs =
      Array.isArray(settings.faqs_bn) && settings.faqs_bn.length > 0 ? settings.faqs_bn : [];
  }

  const categories = models('price_categories', all('SELECT * FROM price_categories ORDER BY sort_order'));
  for (const category of categories as any[]) {
    category.rows = models(
      'price_rows',
      all('SELECT * FROM price_rows WHERE category_id = ? ORDER BY sort_order', [category.id])
    );
  }

  return {
    categories,
    settings,
    locations: locations(),
    nav_menu: navMenu(),
    is_bn: isBn,
    offers: withOffers && isBn ? SPECIAL_OFFERS_BN : [],
  };
}

/** Canonical price-list URLs from the old WordPress site. */

export function priceListSeo(settings: any, isBn = false) {
  const schemas: any[] = [];
  if (settings?.schema_json) {
    try {
      schemas.push(JSON.parse(settings.schema_json));
    } catch {
      /* ignore invalid custom schema */
    }
  }
  if (Array.isArray(settings?.faqs) && settings.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: settings.faqs.map((faq: any) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
  }

  return {
    title:
      settings?.seo_title ||
      settings?.page_title ||
      'Tech Dental Treatment Price List in Bangladesh - 2026',
    description:
      settings?.meta_desc ||
      settings?.seo_content ||
      'Updated treatment prices for dental implants, braces, root canal, crowns and more at Tech Dental Care in Dhaka.',
    path: priceListPath(isBn),
    robots: `${settings?.robots_index !== false ? 'index' : 'noindex'}, ${
      settings?.robots_follow !== false ? 'follow' : 'nofollow'
    }`,
    schema: schemas,
    noSuffix: true,
  };
}

/* ----------------------------- Patient rights ----------------------------- */

export function patientRightsProps(isBn: boolean) {
  const row = get('SELECT * FROM patient_rights_settings LIMIT 1');
  const settings = row ? model('patient_rights_settings', row) : {};
  const rights = models(
    'patient_rights',
    all('SELECT * FROM patient_rights WHERE is_active = 1 ORDER BY "order", id')
  );
  const responsibilities = models(
    'patient_responsibilities',
    all('SELECT * FROM patient_responsibilities WHERE is_active = 1 ORDER BY "order", id')
  );
  return {
    settings,
    rights,
    responsibilities,
    locations: locations(),
    nav_menu: navMenu(),
    is_bn: isBn,
    canonical_url: `${SITE_URL}/${isBn ? 'bn/' : ''}patient-rights`,
    hreflang: {
      en: `${SITE_URL}/patient-rights`,
      bn: `${SITE_URL}/bn/patient-rights`,
      'x-default': `${SITE_URL}/patient-rights`,
    },
  };
}

export function patientRightsSeo(settings: any, isBn: boolean) {
  const metaTitle = isBn
    ? settings?.meta_title_bn || 'রোগীর অধিকার ও দায়িত্বসমূহ | টেক ডেন্টাল কেয়ার'
    : settings?.meta_title_en || 'Patient Bill of Rights and Responsibilities | Tech Dental Care';
  const metaDesc = isBn
    ? settings?.meta_desc_bn || 'টেক ডেন্টাল কেয়ারে রোগীর অধিকার এবং দায়িত্ব সম্পর্কে বিস্তারিত জানুন।'
    : settings?.meta_desc_en ||
      'Learn about patient rights and responsibilities at Tech Dental Care Bangladesh.';
  return {
    title: metaTitle,
    description: metaDesc,
    path: isBn ? '/bn/patient-rights' : '/patient-rights',
    alternates: {
      en: `${SITE_URL}/patient-rights`,
      bn: `${SITE_URL}/bn/patient-rights`,
      'x-default': `${SITE_URL}/patient-rights`,
    },
    noSuffix: true,
  };
}

/* ----------------------------- How to pay ----------------------------- */

export function howToPayProps(initialBranch = '') {
  const row = get('SELECT * FROM payment_methods_settings LIMIT 1');
  const paymentSettings = row ? model('payment_methods_settings', row) : null;
  const home = get('SELECT * FROM home_content LIMIT 1');
  return {
    locations: locations(),
    nav_menu: navMenu(),
    home_content: home ? model('home_content', home) : null,
    payment_settings: paymentSettings,
    initial_branch: initialBranch,
    canonical_url: `${SITE_URL}/how-to-pay`,
  };
}

export function howToPaySeo(paymentSettings: any) {
  return {
    title:
      paymentSettings?.seo_title ||
      'How to Pay | Payment Methods by Branch | Tech Dental Care',
    description:
      paymentSettings?.meta_desc ||
      'Choose your branch to see accepted payment methods at Tech Dental Care: Cash, POS Debit/Credit Card, Bangla QR, bKash, Nagad, and Rocket.',
    path: '/how-to-pay',
    noSuffix: true,
  };
}

/* ----------------------------- Appointment & complaint ----------------------------- */

export function appointmentProps() {
  return {
    locations: locations(),
    nav_menu: navMenu(),
  };
}

export function appointmentSeo(isBn = false) {
  const copy = websiteTexts();
  return {
    title: copy.appointment_seo_title,
    description: copy.appointment_seo_desc,
    path: corePath('appointment', isBn),
  };
}

export function complaintProps() {
  return {
    locations: locations(),
    nav_menu: navMenu(),
  };
}

export function complaintSeo() {
  const copy = websiteTexts();
  return {
    title: copy.complaint_seo_title,
    description: copy.complaint_seo_desc,
    path: '/complaint-box',
  };
}

/* ----------------------------- Gallery ----------------------------- */

export function galleryProps() {
  const images = uniqueBy(
    all('SELECT * FROM featured_images WHERE is_active = 1 ORDER BY sort_order'),
    'src'
  );
  return {
    locations: all('SELECT * FROM locations ORDER BY sort_order, id'),
    nav_menu: navMenu(),
    featured_images: images,
    videos: models(
      'home_videos',
      all('SELECT * FROM home_videos WHERE is_active = 1 ORDER BY sort_order, id')
    ),
  };
}

export function gallerySeo() {
  const copy = websiteTexts();
  return {
    title: copy.gallery_seo_title,
    description: copy.gallery_seo_desc,
    path: '/gallery',
  };
}

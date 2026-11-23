import { all, get, model, models } from '../db';
import { SITE_URL, applyBangla, locations, navMenu, uniqueBy } from '../shared';

/** Resolve a branch the same way BranchController::publicShow does. */
export function resolveBranch(slug: string): any | null {
  const clean = String(slug)
    .toLowerCase()
    .replace(/branch-|-branch|branch/g, '')
    .replace(/^[-\s]+|[-\s]+$/g, '');
  const needle = clean.toLowerCase();
  const rows = all('SELECT * FROM locations');
  for (const row of rows) {
    const slugValue = String(row.slug ?? '').toLowerCase();
    const shortName = String(row.short_name ?? '').toLowerCase();
    const name = String(row.name ?? '').toLowerCase();
    if (
      slugValue === String(slug).toLowerCase() ||
      slugValue === needle ||
      shortName === String(slug).toLowerCase() ||
      (needle && shortName.includes(needle)) ||
      (needle && name.includes(needle)) ||
      String(row.id) === String(slug)
    ) {
      return model('locations', row);
    }
  }
  return null;
}

export function branchIndexProps() {
  return {
    branches: locations(),
    nav_menu: navMenu(),
  };
}

export function branchIndexSeo() {
  return {
    title: 'Dental Clinic Branches in Dhaka — Mirpur, Uttara, Badda & Jatrabari',
    description:
      'Find your nearest Tech Dental Care branch in Dhaka. View addresses, opening hours, phone numbers and directions for Mirpur, Uttara, Badda and Jatrabari.',
    path: '/branches',
  };
}

export function branchShowProps(slug: string, isBn = false) {
  const branch = resolveBranch(slug);
  if (!branch) return null;
  if (isBn) applyBangla(branch, ['seo_content']);

  const branchKey = String(branch.slug ?? branch.short_name ?? branch.name ?? '')
    .replace(/branch/gi, '')
    .replace(/-/g, '')
    .trim()
    .toLowerCase();

  const gallery = uniqueBy(
    all('SELECT * FROM featured_images WHERE is_active = 1 ORDER BY sort_order').filter((row: any) => {
      const value = String(row.branch ?? '');
      return (
        value === String(branch.short_name ?? '') ||
        value === String(branch.name ?? '') ||
        value === String(branch.slug ?? '') ||
        (branchKey && value.toLowerCase().includes(branchKey)) ||
        value === 'all'
      );
    }),
    'src'
  );

  let doctors = models(
    'doctors',
    all('SELECT * FROM doctors WHERE branch LIKE ? OR branch_location = ? ORDER BY rank_order', [
      `%${branch.short_name ?? branch.name ?? ''}%`,
      branch.short_name ?? branch.name ?? '',
    ])
  );
  if (!doctors.length) {
    doctors = models('doctors', all('SELECT * FROM doctors ORDER BY rank_order LIMIT 6'));
  }

  const services = all(
    "SELECT id, slug, title, title_bn, price, hero_main AS image, short_desc FROM services WHERE status = 'Published' ORDER BY rank_order, id"
  );

  return {
    branch,
    gallery,
    doctors,
    services,
    locations: locations(),
    nav_menu: navMenu(),
  };
}

export function branchShowSeo(branch: any) {
  const rawName = branch?.short_name || branch?.name || 'Mirpur';
  const cleanBranch = String(rawName).replace(/branch/gi, '').trim();
  const branchName = `${cleanBranch} Branch`;
  const hotline = branch?.phone || '09638-000505';
  const branchPath = `/branch/${branch?.slug || branch?.id}`;
  const pageCanonical = `${SITE_URL}${branchPath}`;
  const metaTitle = branch?.seo_title || `Best Dental Clinic in ${branchName} - Tech Dental Care`;
  const metaDescription =
    branch?.meta_desc ||
    `Visit Tech Dental ${branchName} in Dhaka for painless root canal therapy, dental implants, cosmetic veneers and general dental treatments.`;
  const robots = `${branch?.robots_index !== false ? 'index' : 'noindex'}, ${
    branch?.robots_follow !== false ? 'follow' : 'nofollow'
  }`;
  const faqs = Array.isArray(branch?.faqs) ? branch.faqs : [];

  let schema: any;
  if (branch?.schema_json) {
    try {
      schema = JSON.parse(branch.schema_json);
    } catch {
      schema = undefined;
    }
  }
  if (!schema) {
    const base = {
      '@context': 'https://schema.org',
      '@type': branch?.schema_type || 'Dentist',
      name: `Tech Dental Care - ${branchName}`,
      description: metaDescription,
      url: pageCanonical,
      telephone: hotline,
      address: {
        '@type': 'PostalAddress',
        streetAddress: branch?.address || '',
        addressLocality: 'Dhaka',
        addressCountry: 'BD',
      },
      priceRange: '৳৳',
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
                  acceptedAnswer: { '@type': 'Answer', text: f.a || '' },
                })),
            },
          ],
        }
      : base;
  }

  return {
    title: metaTitle,
    description: metaDescription,
    canonical: pageCanonical,
    type: 'website',
    robots,
    image: branch?.image,
    schema,
    noSuffix: true,
  };
}

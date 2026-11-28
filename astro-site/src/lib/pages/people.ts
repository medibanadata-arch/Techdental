import { all, get, json, model, models } from '../db';
import { SITE_URL, applyBangla, locations, navMenu, websiteTexts } from '../shared';
import { ABOUT_CONTENT_BN } from '../../app/data/aboutContentBn';
import { corePath } from '../publicPaths';

/* ----------------------------- About ----------------------------- */

export function aboutContent(): any {
  const row = get('SELECT * FROM about_content LIMIT 1');
  return row ? model('about_content', row) : null;
}

export function aboutProps(isBn = false) {
  const content = isBn ? { ...aboutContent(), ...ABOUT_CONTENT_BN } : aboutContent();
  return {
    content,
    doctors: models('doctors', all('SELECT * FROM doctors ORDER BY rank_order')),
    management: models(
      'team_members',
      all("SELECT * FROM team_members WHERE is_active = 1 AND section = 'management' ORDER BY sort_order")
    ),
    locations: locations(),
    nav_menu: navMenu(),
    is_bn: isBn,
  };
}

export function aboutSeo(content: any, isBn = false) {
  const schemas: any[] = [];
  if (content?.schema_json) {
    try {
      schemas.push(JSON.parse(content.schema_json));
    } catch {
      /* ignore invalid custom schema */
    }
  }
  if (Array.isArray(content?.faqs) && content.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faqs.map((faq: any) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
  }

  return {
    title:
      content?.seo_title ||
      `${content?.hero_title || 'About Tech Dental Care'} — Digital Oral Healthcare`,
    description: content?.meta_desc || content?.hero_subtitle || content?.story_p1,
    path: corePath('about', isBn),
    robots: `${content?.robots_index !== false ? 'index' : 'noindex'}, ${
      content?.robots_follow !== false ? 'follow' : 'nofollow'
    }`,
    schema: schemas,
    noSuffix: true,
  };
}

/* ----------------------------- Team ----------------------------- */

export function teamSlug(name: string): string {
  return String(name || '')
    .toLowerCase()
    .replace(/[.']/g, '')
    .replace(/\s+/g, '-');
}

export function teamIndexProps() {
  return {
    members: models('team_members', all('SELECT * FROM team_members WHERE is_active = 1 ORDER BY sort_order')),
    locations: locations(),
    nav_menu: navMenu(),
  };
}

export function teamIndexSeo(isBn = false) {
  const copy = websiteTexts();
  return {
    title: copy.team_seo_title,
    description: copy.team_seo_desc,
    path: corePath('team', isBn),
  };
}

export function teamMember(slug: string): any | null {
  const members = models<any>('team_members', all('SELECT * FROM team_members ORDER BY sort_order'));
  const byId = get('SELECT * FROM team_members WHERE id = ?', [slug]);
  if (byId) return model('team_members', byId);
  const found = members.find((member: any) => teamSlug(member.name).includes(slug));
  return found || null;
}

export function teamMemberProps(slug: string) {
  const member = teamMember(slug);
  if (!member) return null;
  if (!member.is_active) return null;
  return {
    member,
    locations: locations(),
    nav_menu: navMenu(),
  };
}

function parseLetter(letter: any): string[] {
  if (!letter) return [];
  if (Array.isArray(letter)) {
    return letter.map((p: any) => (typeof p === 'string' ? p : p?.text || '')).filter(Boolean);
  }
  if (typeof letter === 'string') {
    try {
      const parsed = JSON.parse(letter);
      if (Array.isArray(parsed)) return parseLetter(parsed);
    } catch {
      return [letter];
    }
  }
  return [];
}

export function teamMemberSeo(member: any) {
  const paragraphs = parseLetter(member.letter);
  return {
    title: `${member.name} — ${member.role} at Tech Dental Care`,
    description:
      paragraphs[0] ||
      `${member.name} is ${member.role} at Tech Dental Care, a leading dental care network in Dhaka, Bangladesh.`,
    path: `/team/${teamSlug(member.name)}`,
    image: member.image,
    type: 'profile',
    noSuffix: true,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: member.name,
      jobTitle: member.role,
      image: member.image || undefined,
      worksFor: { '@type': 'Organization', name: 'Tech Dental Care' },
    },
  };
}

/* ----------------------------- Doctors ----------------------------- */

export function doctorSettings(): any {
  const row = get('SELECT * FROM doctor_settings LIMIT 1');
  return row ? model('doctor_settings', row) : null;
}

export function doctorsIndexProps(isBn = false) {
  const settings = doctorSettings();
  if (settings && isBn) applyBangla(settings, ['seo_content']);
  return {
    data: models('doctors', all('SELECT * FROM doctors ORDER BY rank_order, id')),
    settings,
    locations: locations(),
    nav_menu: navMenu(),
    is_bn: isBn,
  };
}

export function doctorsIndexSeo(settings: any, isBn = false) {
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
      mainEntity: settings.faqs
        .filter((f: any) => f && f.q)
        .map((faq: any) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a || '' },
        })),
    });
  }

  return {
    title: settings?.page_title || 'Specialist Dentists & Dental Surgeons',
    description:
      settings?.meta_desc ||
      'Meet our certified dental surgeons and specialists across Mirpur, Uttara, Badda and Jatrabari in Dhaka.',
    path: corePath('doctors', isBn),
    robots: `${settings?.robots_index ?? true ? 'index' : 'noindex'}, ${
      settings?.robots_follow ?? true ? 'follow' : 'nofollow'
    }`,
    schema: schemas,
  };
}

export function doctorSlug(item: any): string {
  const explicit = String(item?.slug || '').trim();
  if (explicit) return explicit;
  return teamSlug(item?.name || '').replace(/^dr-/, '');
}

export function findDoctor(id: string, allowId = true): any | null {
  const key = String(id || '').trim();
  if (!key) return null;
  const bySlug = get('SELECT * FROM doctors WHERE lower(slug) = lower(?)', [key]);
  if (bySlug) return model('doctors', bySlug);
  if (/^\d+$/.test(key)) {
    if (!allowId) return null;
    const row = get('SELECT * FROM doctors WHERE id = ?', [Number(key)]);
    return row ? model('doctors', row) : null;
  }
  return null;
}

export function doctorProps(id: string, isBn = false, allowId = true) {
  const item = findDoctor(id, allowId);
  if (!item) return null;
  if (isBn) applyBangla(item, ['bio', 'seo_content']);
  return {
    item,
    hotline: item.hotline || '09638000505',
    locations: locations(),
    nav_menu: navMenu(),
  };
}

export function doctorSeo(item: any, hotline: string, isBn = false) {
  const schemas: any[] = [];
  if (item.schema_json) {
    try {
      schemas.push(JSON.parse(item.schema_json));
    } catch {
      /* ignore invalid custom schema */
    }
  }
  const faqs = Array.isArray(item.faqs) ? item.faqs : [];
  if (schemas.length === 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': item.schema_type || 'Physician',
      name: item.name,
      description: item.meta_desc || item.bio,
      medicalSpecialty: item.spec || 'Dentistry',
      telephone: item.hotline || hotline,
      address: {
        '@type': 'PostalAddress',
        streetAddress: item.chamber_address,
        addressLocality: 'Dhaka',
        addressCountry: 'BD',
      },
    });
  }
  if (faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs
        .filter((f: any) => f && f.q)
        .map((faq: any) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a || '' },
        })),
    });
  }

  return {
    title: item.seo_title
      ? `${item.name} – ${item.seo_title}`
      : `${item.name} - Senior Dental Specialist Profile`,
    description: item.meta_desc || item.bio,
    path: `${corePath('doctors', isBn)}/${doctorSlug(item)}`,
    image: item.img,
    type: 'profile',
    robots: `${item.robots_index !== false ? 'index' : 'noindex'}, ${
      item.robots_follow !== false ? 'follow' : 'nofollow'
    }`,
    schema: schemas,
  };
}

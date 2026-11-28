import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {
  all,
  get,
  insertRow,
  jsonField,
  nowSql,
  readBody,
  successRedirect,
  updateRow,
  validationError,
  type Body,
} from '../http';
import { model } from '../../db';

/**
 * Site settings, header/footer configuration and website texts, ported from
 * SettingController. Backed by the single `home_content` row.
 */

const SETTINGS_DEFAULTS: Record<string, any> = {
  company_name: 'Tech Dental',
  brand_name_line1: 'TECH',
  brand_name_line2: 'DENTAL',
  tagline: 'Your Trusted Dental Care Provider in Dhaka',
  header_logo: '/uploads/images/1793169843_gemini-generated-imagendh8oqnh8oqndh-removebg-preview.webp',
  favicon: '/favicon.ico',
  contact_phone: '09638000505',
  contact_email: 'info@techdentalcare.com',
  address: 'Dhaka, Bangladesh',
};

function createHomeRow(defaults: Record<string, any>): any {
  const now = nowSql();
  const id = insertRow('home_content', { ...defaults, created_at: now, updated_at: now });
  return get<any>('SELECT * FROM home_content WHERE id = ?', [id]);
}

export function homeSettingsRow(): any {
  let row = get<any>('SELECT * FROM home_content ORDER BY id LIMIT 1');
  if (!row) row = createHomeRow(SETTINGS_DEFAULTS);
  return row;
}

function homeSettingsRowWith(defaults: Record<string, any>): any {
  let row = get<any>('SELECT * FROM home_content ORDER BY id LIMIT 1');
  if (!row) row = createHomeRow(defaults);
  return row;
}

export function mediaList(): any[] {
  return all('SELECT * FROM media ORDER BY created_at DESC');
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HEADER_FOOTER_DEFAULTS = () => {
  const year = new Date().getFullYear();
  const defaultQuickLinks = [
    { label: 'Home', url: '/' },
    { label: 'Services & Pricing', url: '/our-services' },
    { label: 'Specialist Doctors', url: '/doctors' },
    { label: 'Treatment Price List', url: '/tech-dental-treatment-price-list-bangladesh' },
    { label: 'Medicines & Care', url: '/medication' },
    { label: 'About Tech Dental', url: '/about-tech-dental' },
    { label: 'Book Appointment', url: '/book-an-appointment' },
  ];
  const defaultBranches = [
    { name: 'Mirpur Branch', address: 'Shewrapara, Rokeya Sarani (Pillar 318)', url: '/mirpur-branch' },
    { name: 'Uttara Branch', address: 'Sector 7, Jasimuddin Avenue, Dhaka', url: '/best-dentist-in-uttara' },
    { name: 'Badda Branch', address: 'Middle Badda, Pragati Sarani, Dhaka', url: '/best-dentist-in-badda' },
    { name: 'Jatrabari Branch', address: 'Shahid Faruk Road, Jatrabari, Dhaka', url: '/best-dentist-jatrabari-en' },
  ];
  const defaultBottomLinks = [
    { label: 'Facebook', url: 'https://facebook.com/techdentalbd' },
    { label: 'Privacy Policy', url: '/privacy-policy' },
    { label: 'Terms of Service', url: '/terms-of-service' },
  ];

  const headerSettings = {
    global: {
      sticky: true,
      show_language: true,
      show_branch_picker: true,
      announcement_enabled: false,
      announcement_text: 'Welcome to Tech Dental – Painless Digital Dental Care across Dhaka',
    },
    pages: {
      home: {
        title: 'Homepage',
        variant: 'full',
        override_logo: false,
        custom_logo: '',
        show_branch_picker: true,
        show_language: true,
        menu_id: '',
      },
      branch: {
        title: 'Branch Pages',
        variant: 'full',
        override_logo: false,
        custom_logo: '',
        show_branch_picker: true,
        show_language: true,
        menu_id: '',
      },
      services: {
        title: 'Services & Pricing',
        variant: 'full',
        override_logo: false,
        custom_logo: '',
        show_branch_picker: true,
        show_language: true,
        menu_id: '',
      },
      doctors: {
        title: 'Specialist Doctors',
        variant: 'full',
        override_logo: false,
        custom_logo: '',
        show_branch_picker: true,
        show_language: true,
        menu_id: '',
      },
      blog: {
        title: 'Blog & Dental Guides',
        variant: 'full',
        override_logo: false,
        custom_logo: '',
        show_branch_picker: false,
        show_language: true,
        menu_id: '',
      },
      appointment: {
        title: 'Appointments',
        variant: 'minimal',
        override_logo: false,
        custom_logo: '',
        show_branch_picker: false,
        show_language: true,
        menu_id: '',
      },
      about: {
        title: 'About & Corporate',
        variant: 'full',
        override_logo: false,
        custom_logo: '',
        show_branch_picker: true,
        show_language: true,
        menu_id: '',
      },
      default: {
        title: 'Other / Custom Pages',
        variant: 'full',
        override_logo: false,
        custom_logo: '',
        show_branch_picker: true,
        show_language: true,
        menu_id: '',
      },
    },
  };

  const footerSettings = {
    enabled: true,
    brand_logo_text: 'TD',
    brand_logo_image: '',
    brand_name: 'Tech Dental',
    brand_badge: 'ORAL HEALTHCARE',
    tagline: 'Painless Clinical Dentistry & Modern Maxillofacial Care in Dhaka',
    about_text:
      'Tech Dental is a leading multi-branch dental care provider in Dhaka, dedicated to painless digital procedures, expert orthodontic solutions, and modern implant dentistry.',
    hotline: '09638-000505',
    whatsapp: '+8801400786162',
    whatsapp_label: 'WhatsApp Direct Help',
    email: 'info@techdentalcare.com',
    address: 'Mirpur, Uttara, Badda & Jatrabari, Dhaka, Bangladesh',
    hours: 'Saturday – Thursday: 10:00 AM – 9:00 PM (Friday Closed)',
    quick_links_title: 'QUICK LINKS',
    quick_links: defaultQuickLinks,
    branches_title: 'OUR BRANCHES',
    branches: defaultBranches,
    support_title: 'EMERGENCY & SUPPORT',
    support_subtext:
      'Need urgent assistance or want to schedule a dental checkup? Reach out directly:',
    copyright: `© ${year} Tech Dental Care Center. All rights reserved.`,
    bottom_links: defaultBottomLinks,
    facebook_url: 'https://facebook.com/techdentalbd',
    instagram_url: '',
    youtube_url: '',
    linkedin_url: '',
    show_cta_strip: true,
    cta_badge: 'Painless Clinical Dentistry in Dhaka',
    cta_title: 'Ready to Restore Your Healthy Smile?',
    cta_subtext:
      'Consult with our specialist oral surgeons across Mirpur, Uttara, Badda, and Jatrabari branches.',
    cta_button_text: 'Make Appointment',
    cta_button_url: '/book-an-appointment',
  };

  return { headerSettings, footerSettings };
};

/** PHP array_replace_recursive semantics for JSON-decoded values. */
function arrayReplaceRecursive(target: any, source: any): any {
  if (Array.isArray(target) && Array.isArray(source)) {
    const out = target.slice();
    source.forEach((value, index) => {
      out[index] =
        value && typeof value === 'object' && out[index] && typeof out[index] === 'object'
          ? arrayReplaceRecursive(out[index], value)
          : value;
    });
    return out;
  }
  if (Array.isArray(source) && source.length === 0) return target;
  if (
    target &&
    typeof target === 'object' &&
    !Array.isArray(target) &&
    source &&
    typeof source === 'object' &&
    !Array.isArray(source)
  ) {
    const out: Record<string, any> = { ...target };
    for (const [key, value] of Object.entries(source)) {
      out[key] =
        value && typeof value === 'object' && out[key] && typeof out[key] === 'object'
          ? arrayReplaceRecursive(out[key], value)
          : value;
    }
    return out;
  }
  return source;
}

export function headerFooterProps(settings: any) {
  const defaults = HEADER_FOOTER_DEFAULTS();
  const headerSettings = arrayReplaceRecursive(
    defaults.headerSettings,
    jsonField(settings.header_settings, []) || []
  );
  const footerSettings = arrayReplaceRecursive(
    defaults.footerSettings,
    jsonField(settings.footer_settings, []) || []
  );
  return { headerSettings, footerSettings };
}

function publicRoot(): string {
  const candidates = [
    path.resolve(process.cwd(), '..', 'public'),
    path.resolve(process.cwd(), 'public'),
    path.resolve(process.cwd(), '..', '..', 'public'),
  ];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(path.join(candidate, 'uploads'))) return candidate;
    } catch {
      // ignore
    }
  }
  return candidates[0];
}

async function storeUploadedImage(file: File, prefix: string): Promise<string> {
  const directory = path.join(publicRoot(), 'uploads', 'images');
  fs.mkdirSync(directory, { recursive: true });
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
  const filename = `${Math.floor(Date.now() / 1000)}_${prefix}_${safe}`;
  const source = path.join(directory, filename);
  fs.writeFileSync(source, Buffer.from(await file.arrayBuffer()));

  const webpName = filename.replace(/\.[^.]+$/, '') + '.webp';
  const webpPath = path.join(directory, webpName);
  try {
    await sharp(fs.readFileSync(source)).webp({ quality: 82 }).toFile(webpPath);
    if (webpPath !== source) fs.unlinkSync(source);
    return '/uploads/images/' + webpName;
  } catch {
    return '/uploads/images/' + filename;
  }
}

export async function handleSettingsUpdate(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors: Record<string, string[]> = {};

  const required = (field: string, max?: number) => {
    if (!body[field]) {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field is required.`];
    } else if (typeof body[field] === 'object') {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must be a string.`];
    } else if (max && String(body[field]).length > max) {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must not be greater than ${max} characters.`];
    }
  };
  const optional = (field: string, max?: number, email = false) => {
    const value = body[field];
    if (value === null || value === undefined) return;
    if (typeof value === 'object' && !(value instanceof File)) {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must be a string.`];
    } else if (max && String(value).length > max) {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must not be greater than ${max} characters.`];
    } else if (email && !EMAIL_RE.test(String(value))) {
      errors[field] = ['The contact email field must be a valid email address.'];
    }
  };

  required('company_name', 255);
  optional('brand_name_line1', 100);
  optional('brand_name_line2', 100);
  optional('tagline', 255);
  optional('header_logo');
  optional('favicon');
  optional('contact_phone', 100);
  optional('contact_email', 255, true);
  optional('address');

  if (Object.keys(errors).length) return validationError(errors);

  const settings = homeSettingsRow();
  const data: Record<string, any> = { updated_at: nowSql() };
  for (const field of [
    'company_name',
    'brand_name_line1',
    'brand_name_line2',
    'tagline',
    'header_logo',
    'favicon',
    'contact_phone',
    'contact_email',
    'address',
  ]) {
    if (field in body && !(body[field] instanceof File)) {
      data[field] = body[field] === null || body[field] === undefined ? null : String(body[field]);
    }
  }

  if (body.logo_file instanceof File && body.logo_file.size > 0) {
    data.header_logo = await storeUploadedImage(body.logo_file, 'logo');
  }
  if (body.favicon_file instanceof File && body.favicon_file.size > 0) {
    data.favicon = await storeUploadedImage(body.favicon_file, 'favicon');
  }

  updateRow('home_content', settings.id, data);
  return successRedirect('/settings-admin', { message: 'Settings updated successfully.' });
}

export function settingsRowForHeaderFooter(): any {
  return homeSettingsRowWith({
    company_name: 'Tech Dental',
    brand_name_line1: 'TECH',
    brand_name_line2: 'DENTAL',
    contact_phone: '09638000505',
    contact_email: 'info@techdentalcare.com',
    address: 'Dhaka, Bangladesh',
  });
}

export function settingsRowForWebsiteTexts(): any {
  return homeSettingsRowWith({
    company_name: 'Tech Dental',
    brand_name_line1: 'TECH',
    brand_name_line2: 'DENTAL',
  });
}

export async function handleHeaderFooterUpdate(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors: Record<string, string[]> = {};
  for (const field of ['header_settings', 'footer_settings']) {
    const value = body[field];
    if (value === null || value === undefined) {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field is required.`];
    } else if (typeof value !== 'object') {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must be an array.`];
    }
  }
  if (Object.keys(errors).length) return validationError(errors);

  const settings = homeSettingsRow();
  updateRow('home_content', settings.id, {
    header_settings: JSON.stringify(body.header_settings),
    footer_settings: JSON.stringify(body.footer_settings),
    updated_at: nowSql(),
  });

  return successRedirect('/settings/header-footer', {
    message: 'Header and Footer configurations saved successfully!',
  });
}

export async function handleWebsiteTextsSave(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors: Record<string, string[]> = {};

  const value = body.website_texts;
  if (value !== null && value !== undefined) {
    if (typeof value !== 'object') {
      errors.website_texts = ['The website texts field must be an array.'];
    } else {
      for (const [key, entry] of Object.entries(value)) {
        if (entry !== null && entry !== undefined && typeof entry === 'object') {
          errors[`website_texts.${key}`] = ['The website texts field must be a string.'];
        }
      }
    }
  }
  if (Object.keys(errors).length) return validationError(errors);

  const settings = settingsRowForWebsiteTexts();
  const texts: Record<string, any> = {};
  if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      if (typeof entry === 'string' && entry.trim() !== '') texts[key] = entry;
    }
  }

  updateRow('home_content', settings.id, {
    website_texts: Object.keys(texts).length ? JSON.stringify(texts) : '[]',
    updated_at: nowSql(),
  });

  return successRedirect('/settings/website-texts', {
    message: 'Website texts saved successfully.',
  });
}

export function settingsPageModel(row: any) {
  return model('home_content', row);
}

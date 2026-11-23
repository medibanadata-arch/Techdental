import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

/**
 * Direct, read-mostly access to the Laravel SQLite database. The Astro app is a
 * drop-in replacement for the Laravel public site, so it reads the same tables
 * and reproduces Eloquent's casts/serialisation.
 */

function resolveDatabasePath(): string {
  const candidates = [
    process.env.DATABASE_PATH,
    path.resolve(process.cwd(), '..', 'database', 'database.sqlite'),
    path.resolve(process.cwd(), 'database', 'database.sqlite'),
    path.resolve(process.cwd(), '..', '..', 'database', 'database.sqlite'),
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch {
      // ignore
    }
  }
  return candidates[1];
}

let database: DatabaseSync | null = null;

export function db(): DatabaseSync {
  if (!database) {
    database = new DatabaseSync(resolveDatabasePath());
    try {
      database.exec('PRAGMA busy_timeout = 5000');
      database.exec('PRAGMA foreign_keys = ON');
    } catch {
      // pragmas are best-effort
    }
  }
  return database;
}

export function all<T = any>(sql: string, params: any[] = []): T[] {
  return db().prepare(sql).all(...params) as T[];
}

export function get<T = any>(sql: string, params: any[] = []): T | undefined {
  return db().prepare(sql).get(...params) as T | undefined;
}

export function run(sql: string, params: any[] = []) {
  return db().prepare(sql).run(...params);
}

export function json<T = any>(value: any, fallback: T | null = null): T | null {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'object') return value as T;
  try {
    return JSON.parse(String(value)) as T;
  } catch {
    return fallback;
  }
}

export function bool(value: any): boolean {
  return value === true || value === 1 || value === '1' || value === 'true';
}

/** Laravel/Eloquent serialises datetimes as ISO-8601 UTC with microseconds. */
export function dateIso(value: any): any {
  if (!value) return value;
  const raw = String(value);
  const normalised = raw.includes('T') ? raw : raw.replace(' ', 'T') + 'Z';
  const date = new Date(normalised);
  if (Number.isNaN(date.getTime())) return raw;
  const pad = (n: number, length = 2) => String(n).padStart(length, '0');
  return (
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}` +
    `.${pad(date.getUTCMilliseconds(), 3)}000Z`
  );
}

const JSON_COLUMNS: Record<string, string[]> = {
  home_content: ['faqs', 'header_settings', 'footer_settings', 'sections_config', 'homepage_texts', 'website_texts'],
  about_content: ['services_cards', 'tech_cards', 'why_cards'],
  doctors: ['milestones', 'faqs'],
  doctor_settings: ['faqs'],
  locations: ['faqs'],
  medicines: [
    'uses_items',
    'side_effects_items',
    'warnings',
    'gallery',
    'faqs',
    'author',
    'related',
    'section_titles',
    'price_note',
    'price_note_bn',
  ],
  pages: ['blocks', 'faqs'],
  posts: ['faqs', 'section_titles', 'cta_box'],
  price_settings: ['faqs'],
  services: ['hero_thumbs', 'features', 'pricing_cards', 'results', 'seo_images', 'faqs', 'reviews'],
  team_members: ['letter'],
  payment_methods_settings: ['methods_data', 'branches_data'],
  redirects: [],
  legacy_pages: ['og_json', 'twitter_json', 'hreflang_json', 'schema_json', 'headings_json', 'faqs_json'],
};

const BOOLEAN_COLUMNS: Record<string, string[]> = {
  doctors: ['verified', 'robots_index', 'robots_follow'],
  doctor_settings: ['robots_index', 'robots_follow'],
  locations: ['robots_index', 'robots_follow'],
  medicines: ['is_active', 'robots_index', 'robots_follow'],
  pages: ['robots_index', 'robots_follow'],
  posts: [],
  price_settings: ['robots_index', 'robots_follow'],
  team_members: ['is_active'],
  home_videos: ['is_active'],
  patient_rights: ['is_active'],
  patient_responsibilities: ['is_active'],
  redirects: ['is_active'],
  legacy_pages: ['is_active'],
};

const INTEGER_COLUMNS: Record<string, string[]> = {
  patient_rights: ['order'],
  patient_responsibilities: ['order'],
  ai_chat_replies: ['is_active', 'priority', 'match_count'],
};

/** Reproduce an Eloquent model's array serialisation for one row. */
export function model<T = any>(table: string, row: any): T {
  if (!row) return row;
  const out: Record<string, any> = { ...row };
  for (const column of JSON_COLUMNS[table] || []) {
    if (column in out) out[column] = json(out[column], null);
  }
  for (const column of BOOLEAN_COLUMNS[table] || []) {
    if (column in out) out[column] = bool(out[column]);
  }
  for (const column of INTEGER_COLUMNS[table] || []) {
    if (column in out && out[column] !== null) out[column] = Number(out[column]);
  }
  for (const column of ['created_at', 'updated_at', 'email_verified_at']) {
    if (column in out) out[column] = dateIso(out[column]);
  }
  return out as T;
}

export function models<T = any>(table: string, rows: any[]): T[] {
  return rows.map((row) => model<T>(table, row));
}

export function firstModel<T = any>(table: string): T | null {
  const row = get(`SELECT * FROM "${table}" LIMIT 1`);
  return row ? model<T>(table, row) : null;
}

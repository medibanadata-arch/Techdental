import {
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

/**
 * About page CMS, ported from AboutContentController (index/update).
 *
 * `AboutContent` only casts services_cards/tech_cards/why_cards to arrays, so
 * the model serialises `faqs` back as a raw JSON string. We reproduce that
 * quirk by keeping faqs out of the JSON_COLUMNS map in lib/db.ts.
 */

const STRING_FIELDS = [
  'hero_title',
  'hero_subtitle',
  'hero_bg',
  'headline',
  'founded_year',
  'patients_count',
  'story_p1',
  'story_p2',
  'video_thumb',
  'video_url',
  'tech_headline',
  'tech_subtext',
  'vision_title',
  'vision_text',
  'mission_title',
  'mission_text',
  'team_banner',
  'seo_title',
  'meta_desc',
  'canonical_url',
  'schema_type',
  'schema_json',
];

const CARD_FIELDS = ['services_cards', 'tech_cards', 'why_cards'];

export function aboutContentRow(): any {
  let row = get<any>('SELECT * FROM about_content ORDER BY id LIMIT 1');
  if (!row) {
    const now = nowSql();
    const id = insertRow('about_content', { created_at: now, updated_at: now });
    row = get<any>('SELECT * FROM about_content WHERE id = ?', [id]);
  }
  return row;
}

function isArrayLike(value: any): boolean {
  // PHP's `array` rule also accepts associative arrays, which arrive as objects here.
  return Array.isArray(value) || (value !== null && typeof value === 'object');
}

export async function handleAboutUpdate(request: Request): Promise<Response> {
  const body = await readBody(request);

  const errors: Record<string, string[]> = {};
  for (const field of STRING_FIELDS) {
    if (field in body && body[field] !== null && body[field] !== undefined) {
      if (typeof body[field] === 'object') {
        errors[field] = [`The ${field.replace(/_/g, ' ')} field must be a string.`];
      }
    }
  }
  for (const field of [...CARD_FIELDS, 'faqs']) {
    if (field in body && body[field] !== null && body[field] !== undefined && !isArrayLike(body[field])) {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must be an array.`];
    }
  }
  if (Object.keys(errors).length) return validationError(errors);

  const content = aboutContentRow();
  const data: Record<string, any> = { updated_at: nowSql() };

  for (const field of STRING_FIELDS) {
    if (field in body) {
      const value = body[field];
      data[field] = value === undefined || value === null ? null : String(value);
    }
  }

  // `$request->input('x') ?: []` – present-but-empty arrays become `[]`.
  for (const field of CARD_FIELDS) {
    if (field in body) {
      const value = body[field];
      data[field] = JSON.stringify(value ? jsonField(value, []) : []);
    }
  }

  if ('faqs' in body) {
    const value = body.faqs;
    data.faqs = value === undefined || value === null ? null : JSON.stringify(jsonField(value, []));
  }

  for (const field of ['robots_index', 'robots_follow']) {
    if (field in body) {
      const value = body[field];
      data[field] =
        value === true || value === 1 || value === '1' || value === 'true' || value === 'on' ? 1 : 0;
    }
  }

  updateRow('about_content', content.id, data);
  return successRedirect('/about-cms', { message: 'About page content updated successfully!' });
}

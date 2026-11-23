import {
  deleteRow,
  get,
  insertRow,
  jsonField,
  nowSql,
  readBody,
  str,
  successRedirect,
  updateRow,
  validationError,
  type Body,
} from '../http';

/** Services admin module, ported from ServiceController. */

const STRING_FIELDS: Array<[string, number | null]> = [
  ['category', 255],
  ['slug', 255],
  ['price', null],
  ['price_suffix', null],
  ['short_desc', null],
  ['hero_main', null],
  ['details_heading', null],
  ['details_html', null],
  ['seo_title', 255],
  ['meta_desc', null],
  ['canonical_url', null],
  ['schema_type', null],
  ['schema_json', null],
  ['status', 50],
];

const JSON_FIELDS = ['hero_thumbs', 'features', 'pricing_cards', 'results', 'seo_images', 'faqs', 'reviews'];
const OVERRIDE_ARRAYS = ['pricing_cards', 'features', 'faqs', 'seo_images', 'hero_thumbs'];

function slugify(value: string): string {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function validateService(body: Body): Record<string, string[]> | null {
  const errors: Record<string, string[]> = {};
  if (!str(body.title)) errors.title = ['The title field is required.'];
  if (str(body.title).length > 255) {
    errors.title = ['The title field must not be greater than 255 characters.'];
  }
  for (const [field, max] of STRING_FIELDS) {
    if (max === null) continue;
    if (field in body && body[field] !== null && body[field] !== undefined && typeof body[field] !== 'object') {
      if (String(body[field]).length > max) {
        errors[field] = [`The ${field.replace(/_/g, ' ')} field must not be greater than ${max} characters.`];
      }
    }
  }
  for (const field of JSON_FIELDS) {
    if (field in body && body[field] !== null && body[field] !== undefined) {
      const value = body[field];
      if (!Array.isArray(value) && typeof value !== 'object') {
        errors[field] = [`The ${field} field must be an array.`];
      }
    }
  }
  if ('rank_order' in body && body.rank_order !== null && body.rank_order !== undefined) {
    const value = body.rank_order;
    if (typeof value === 'object' || !/^-?\d+$/.test(String(value).trim())) {
      errors.rank_order = ['The rank order must be an integer.'];
    }
  }
  return Object.keys(errors).length ? errors : null;
}

function servicePayload(body: Body): Record<string, any> {
  const data: Record<string, any> = {};

  if ('title' in body) {
    const value = body.title;
    data.title = value === undefined || value === null || typeof value === 'object' ? null : String(value);
  }
  for (const [field] of STRING_FIELDS) {
    if (field in body) {
      const value = body[field];
      data[field] =
        value === undefined || value === null || typeof value === 'object' ? null : String(value);
    }
  }
  for (const field of JSON_FIELDS) {
    if (field in body) {
      const value = body[field];
      data[field] =
        value === undefined || value === null ? null : JSON.stringify(jsonField(value, []));
    }
  }
  for (const field of ['robots_index', 'robots_follow']) {
    if (field in body) {
      const value = body[field];
      data[field] =
        value === true || value === 1 || value === '1' || value === 'true' || value === 'on' ? 1 : 0;
    }
  }
  if ('rank_order' in body) {
    const value = body.rank_order;
    data.rank_order =
      value === undefined || value === null ? null : Math.trunc(Number(value));
  }

  if (data.slug === null || data.slug === undefined) data.slug = slugify(str(body.title));
  for (const field of OVERRIDE_ARRAYS) {
    const value = field in body ? body[field] : [];
    data[field] = value === null || value === undefined ? null : JSON.stringify(jsonField(value, []));
  }
  return data;
}

export async function handleServiceStore(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors = validateService(body);
  if (errors) return validationError(errors);

  const data = servicePayload(body);
  data.created_at = nowSql();
  data.updated_at = nowSql();

  insertRow('services', data);
  return successRedirect('/services-admin', { message: 'Service created successfully.' });
}

export async function handleServiceUpdate(request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM services WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });

  const body = await readBody(request);
  const errors = validateService(body);
  if (errors) return validationError(errors);

  const data = servicePayload(body);
  data.updated_at = nowSql();

  updateRow('services', id, data);
  return successRedirect('/services-admin', { message: 'Service updated successfully.' });
}

export async function handleServiceDestroy(_request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM services WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });
  deleteRow('services', id);
  return successRedirect('/services-admin', { message: 'Service deleted.' });
}

export async function handleServiceReorder(request: Request): Promise<Response> {
  const body = await readBody(request);
  const items = Array.isArray(body.items) ? body.items : [];
  for (const item of items) {
    if (item && item.id !== undefined && item.id !== null && item.rank_order !== undefined && item.rank_order !== null) {
      updateRow('services', Number(item.id), { rank_order: Math.trunc(Number(item.rank_order)) });
    }
  }
  return successRedirect('/services-admin', { message: 'Service ranking updated.' });
}

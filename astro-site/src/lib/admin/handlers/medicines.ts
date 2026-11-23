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

/** Medicines admin module, ported from MedicineController. */

const STRING_FIELDS: Array<[string, number | null]> = [
  ['name_bn', 255],
  ['slug', 255],
  ['generic', null],
  ['generic_bn', null],
  ['category', null],
  ['tag', null],
  ['tag_bn', null],
  ['image', null],
  ['quick_use', null],
  ['quick_use_bn', null],
  ['pharma', null],
  ['pharma_bn', null],
  ['dosage', null],
  ['dosage_bn', null],
  ['dental_usage', null],
  ['dental_usage_bn', null],
  ['uses_text', null],
  ['uses_text_bn', null],
  ['side_effects', null],
  ['side_effects_bn', null],
  ['subtitle', null],
  ['subtitle_bn', null],
  ['seo_title', 255],
  ['seo_title_bn', 255],
  ['seo_content', null],
  ['seo_content_bn', null],
  ['meta_desc', null],
  ['meta_desc_bn', null],
  ['canonical_url', null],
  ['schema_type', null],
  ['schema_json', null],
  ['published_date', null],
  ['intro', null],
  ['intro_bn', null],
  ['dosage_admin', null],
  ['dosage_admin_bn', null],
  ['dosage_timing', null],
  ['dosage_timing_bn', null],
  ['verified_badge', null],
  ['verified_badge_bn', null],
  ['price_per_tablet', null],
  ['price_per_strip', null],
  ['price_manufacturer', null],
];

const JSON_FIELDS = [
  'uses_items',
  'side_effects_items',
  'warnings',
  'gallery',
  'faqs',
  'author',
  'related',
  'section_titles',
];

function slugify(value: string): string {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function validateMedicine(body: Body): Record<string, string[]> | null {
  const errors: Record<string, string[]> = {};
  if (!str(body.name)) errors.name = ['The name field is required.'];
  if (str(body.name).length > 255) {
    errors.name = ['The name field must not be greater than 255 characters.'];
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
      // PHP `array` also accepts associative arrays, which arrive as objects here.
      if (!Array.isArray(value) && typeof value !== 'object') {
        errors[field] = [`The ${field} field must be an array.`];
      }
    }
  }
  if ('sort_order' in body && body.sort_order !== null && body.sort_order !== undefined) {
    const value = body.sort_order;
    if (typeof value === 'object' || !/^-?\d+$/.test(String(value).trim())) {
      errors.sort_order = ['The sort order must be an integer.'];
    }
  }
  return Object.keys(errors).length ? errors : null;
}

function medicinePayload(body: Body): Record<string, any> {
  const data: Record<string, any> = {};

  if ('name' in body) {
    const value = body.name;
    data.name = value === undefined || value === null || typeof value === 'object' ? null : String(value);
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
  for (const field of ['robots_index', 'robots_follow', 'is_active']) {
    if (field in body) {
      const value = body[field];
      data[field] =
        value === true || value === 1 || value === '1' || value === 'true' || value === 'on' ? 1 : 0;
    }
  }
  if ('sort_order' in body) {
    const value = body.sort_order;
    data.sort_order = value === undefined || value === null ? null : Math.trunc(Number(value));
  }

  if (data.slug === null || data.slug === undefined) data.slug = slugify(str(body.name));
  return data;
}

export async function handleMedicineStore(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors = validateMedicine(body);
  if (errors) return validationError(errors);

  const data = medicinePayload(body);
  data.created_at = nowSql();
  data.updated_at = nowSql();

  insertRow('medicines', data);
  return successRedirect('/medicines-admin', { message: 'Medicine saved successfully.' });
}

export async function handleMedicineUpdate(request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM medicines WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });

  const body = await readBody(request);
  const errors = validateMedicine(body);
  if (errors) return validationError(errors);

  const data = medicinePayload(body);
  data.updated_at = nowSql();

  updateRow('medicines', id, data);
  return successRedirect('/medicines-admin', { message: 'Medicine updated successfully.' });
}

export async function handleMedicineDestroy(_request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM medicines WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });
  deleteRow('medicines', id);
  return successRedirect('/medicines-admin', { message: 'Medicine deleted.' });
}

export async function handleMedicineReorder(request: Request): Promise<Response> {
  const body = await readBody(request);
  const items = Array.isArray(body.items) ? body.items : [];
  for (const item of items) {
    if (item && item.id !== undefined && item.id !== null && item.sort_order !== undefined && item.sort_order !== null) {
      updateRow('medicines', Number(item.id), { sort_order: Math.trunc(Number(item.sort_order)) });
    }
  }
  return successRedirect('/medicines-admin', { message: 'Medicine order updated.' });
}

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

/**
 * Branch admin module, ported from BranchController (adminIndex/store/update/
 * destroy/reorder). Public branch pages already live in src/pages/branch.
 */

const STORE_FIELDS = [
  'name',
  'address',
  'address_main',
  'address_sub',
  'landmark',
  'phone',
  'whatsapp',
  'hours_text',
  'morning_hours',
  'evening_hours',
  'working_days',
  'off_days',
];

const UPDATE_FIELDS = [
  'name',
  'address',
  'address_main',
  'address_sub',
  'landmark',
  'phone',
  'whatsapp',
  'hours_text',
  'morning_hours',
  'evening_hours',
  'working_days',
  'off_days',
  'map_url',
  'review_url',
  'reviews_text',
  'booking_url',
  'call_label',
  'directions_label',
  'whatsapp_label',
  'book_label',
  'appointment_btn_label',
  'more_about_title',
  'slug',
  'seo_title',
  'meta_desc',
  'canonical_url',
  'schema_type',
  'schema_json',
  'seo_content',
];

function slugify(value: string): string {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function validate(body: Body, fields: string[]): Record<string, string[]> | null {
  const errors: Record<string, string[]> = {};
  if (!str(body.name)) errors.name = ['The name field is required.'];
  if (!str(body.address)) errors.address = ['The address field is required.'];
  if (str(body.name).length > 255) {
    errors.name = ['The name field must not be greater than 255 characters.'];
  }
  for (const field of fields) {
    if (field in body && typeof body[field] === 'object' && body[field] !== null) {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must be a string.`];
    }
  }
  if ('faqs' in body && body.faqs !== null && body.faqs !== undefined && !Array.isArray(body.faqs)) {
    errors.faqs = ['The faqs field must be an array.'];
  }
  return Object.keys(errors).length ? errors : null;
}

function stringPayload(body: Body, fields: string[]): Record<string, any> {
  const data: Record<string, any> = {};
  for (const field of fields) {
    if (field in body) {
      const value = body[field];
      data[field] =
        value === undefined || value === null || typeof value === 'object' ? null : String(value);
    }
  }
  return data;
}

export async function handleBranchStore(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors = validate(body, STORE_FIELDS);
  if (errors) return validationError(errors);

  const data = stringPayload(body, STORE_FIELDS);
  const name = str(body.name);
  const slug = slugify(name);
  data.location_id = slug;
  data.short_name = name;
  data.slug = slug;
  data.call_label = 'Call';
  data.directions_label = 'Directions';
  data.whatsapp_label = 'WhatsApp';
  data.book_label = 'Book';
  data.created_at = nowSql();
  data.updated_at = nowSql();

  insertRow('locations', data);
  return successRedirect('/branch-admin', { message: 'New branch created successfully!' });
}

export async function handleBranchUpdate(request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM locations WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });

  const body = await readBody(request);
  const errors = validate(body, UPDATE_FIELDS);
  if (errors) return validationError(errors);

  const data = stringPayload(body, UPDATE_FIELDS);
  if ('faqs' in body) {
    data.faqs = body.faqs === null || body.faqs === undefined ? null : JSON.stringify(jsonField(body.faqs, []));
  }
  for (const field of ['robots_index', 'robots_follow']) {
    if (field in body) {
      const value = body[field];
      data[field] =
        value === true || value === 1 || value === '1' || value === 'true' || value === 'on' ? 1 : 0;
    }
  }
  data.updated_at = nowSql();

  updateRow('locations', id, data);
  return successRedirect('/branch-admin', { message: 'Branch details updated successfully!' });
}

export async function handleBranchDestroy(_request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM locations WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });
  deleteRow('locations', id);
  return successRedirect('/branch-admin', { message: 'Branch removed successfully!' });
}

export async function handleBranchReorder(request: Request): Promise<Response> {
  const body = await readBody(request);
  const items = Array.isArray(body.items) ? body.items : [];
  for (const item of items) {
    if (item && item.id !== undefined && item.id !== null && item.sort_order !== undefined && item.sort_order !== null) {
      updateRow('locations', Number(item.id), { sort_order: Math.trunc(Number(item.sort_order)) });
    }
  }
  return successRedirect('/branch-admin', { message: 'Branch order updated.' });
}

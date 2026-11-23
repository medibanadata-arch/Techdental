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
 * Doctors admin module, ported from DoctorController (index/settings/create/
 * store/edit/update/destroy/reorder).
 */

const STRING_FIELDS = [
  'name',
  'spec',
  'deg',
  'exp',
  'img',
  'branch',
  'bio',
  'phone',
  'designation',
  'specialty_banner',
  'bmdc',
  'visiting_time',
  'experience_years',
  'patients_treated',
  'branch_location',
  'chamber_title',
  'chamber_address',
  'hotline',
  'seo_title',
  'seo_content',
  'meta_desc',
  'canonical_url',
  'schema_type',
  'schema_json',
];

const MAX_LENGTHS: Record<string, number> = {
  name: 255,
  deg: 255,
  exp: 255,
  branch: 255,
  phone: 50,
  designation: 255,
  specialty_banner: 255,
  bmdc: 50,
  visiting_time: 255,
  experience_years: 50,
  patients_treated: 50,
  branch_location: 100,
  chamber_title: 255,
  hotline: 50,
  seo_title: 255,
};

const JSON_FIELDS = ['milestones', 'faqs'];
const BOOLEAN_FIELDS = ['verified', 'robots_index', 'robots_follow'];

const BRANCHES: Array<[string, string]> = [
  ['uttara', 'Uttara'],
  ['badda', 'Badda'],
  ['jatra', 'Jatrabari'],
  ['mirpur', 'Mirpur'],
];

function normaliseBranch(value: string): string {
  const lower = value.toLowerCase();
  for (const [needle, label] of BRANCHES) {
    if (lower.includes(needle)) return label;
  }
  return 'Mirpur';
}

/** Validate the shared doctor payload; returns errors or null. */
function validateDoctor(body: Body): Record<string, string[]> | null {
  const errors: Record<string, string[]> = {};
  if (!str(body.name)) errors.name = ['The name field is required.'];

  for (const [field, max] of Object.entries(MAX_LENGTHS)) {
    if (field in body && body[field] !== null && body[field] !== undefined && typeof body[field] !== 'object') {
      if (String(body[field]).length > max) {
        errors[field] = [`The ${field.replace(/_/g, ' ')} field must not be greater than ${max} characters.`];
      }
    }
  }

  if ('rank_order' in body && body.rank_order !== null && body.rank_order !== '') {
    const value = body.rank_order;
    if (typeof value === 'object' || !/^-?\d+$/.test(String(value).trim())) {
      errors.rank_order = ['The rank order must be an integer.'];
    }
  }

  for (const field of ['milestones', 'faqs']) {
    if (field in body && body[field] !== null && body[field] !== undefined && !Array.isArray(body[field])) {
      errors[field] = [`The ${field} field must be an array.`];
    }
  }

  if (Array.isArray(body.milestones)) {
    body.milestones.forEach((item: any, index: number) => {
      if (!item || typeof item !== 'object') return;
      const limits: Array<[string, number]> = [
        ['count', 50],
        ['label', 150],
        ['color', 50],
        ['icon', 50],
      ];
      for (const [key, max] of limits) {
        if (item[key] !== undefined && item[key] !== null && typeof item[key] !== 'object') {
          if (String(item[key]).length > max) {
            errors[`milestones.${index}.${key}`] = [
              `The milestones.${index}.${key} field must not be greater than ${max} characters.`,
            ];
          }
        }
      }
    });
  }

  return Object.keys(errors).length ? errors : null;
}

/** Build the Eloquent-equivalent payload for store/update ($validated only). */
function doctorPayload(body: Body): Record<string, any> {
  const data: Record<string, any> = {};
  for (const field of STRING_FIELDS) {
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
        value === undefined || value === null || value === '' ? null : JSON.stringify(jsonField(value, []));
    }
  }
  for (const field of BOOLEAN_FIELDS) {
    if (field in body) {
      const value = body[field];
      data[field] =
        value === true || value === 1 || value === '1' || value === 'true' || value === 'on' ? 1 : 0;
    }
  }
  if ('rank_order' in body) {
    const value = body.rank_order;
    data.rank_order =
      value === undefined || value === null || value === '' ? null : Math.trunc(Number(value));
  }
  return data;
}

export function doctorSettingsRow(): any {
  let row = get<any>('SELECT * FROM doctor_settings ORDER BY id LIMIT 1');
  if (!row) {
    const now = nowSql();
    const id = insertRow('doctor_settings', { created_at: now, updated_at: now });
    row = get<any>('SELECT * FROM doctor_settings WHERE id = ?', [id]);
  }
  return row;
}

export async function handleDoctorStore(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors = validateDoctor(body);
  if (errors) return validationError(errors);

  const data = doctorPayload(body);
  if (data.branch !== undefined && data.branch) {
    const clean = normaliseBranch(str(data.branch));
    data.branch = clean;
    data.branch_location = clean;
  }
  data.created_at = nowSql();
  data.updated_at = nowSql();

  insertRow('doctors', data);
  return successRedirect('/doctors-admin', { message: 'Doctor created successfully.' });
}

export async function handleDoctorUpdate(request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM doctors WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });

  const body = await readBody(request);
  const errors = validateDoctor(body);
  if (errors) return validationError(errors);

  const data = doctorPayload(body);
  // Laravel overrides these three casts after validation when the key is present.
  for (const field of ['robots_index', 'robots_follow', 'verified']) {
    if (field in body) {
      const value = body[field];
      data[field] =
        value === true || value === 1 || value === '1' || value === 'true' || value === 'on' ? 1 : 0;
    }
  }
  if (data.branch !== undefined && data.branch) {
    const clean = normaliseBranch(str(data.branch));
    data.branch = clean;
    data.branch_location = clean;
  }
  data.updated_at = nowSql();

  updateRow('doctors', id, data);
  return successRedirect('/doctors-admin', { message: 'Doctor updated successfully.' });
}

export async function handleDoctorDestroy(_request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM doctors WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });
  deleteRow('doctors', id);
  return successRedirect('/doctors-admin', { message: 'Doctor deleted successfully.' });
}

export async function handleDoctorReorder(request: Request): Promise<Response> {
  const body = await readBody(request);
  const items = Array.isArray(body.items) ? body.items : [];
  items.forEach((item: any, index: number) => {
    const id = item?.id;
    const rank =
      item?.rank_order !== undefined && item?.rank_order !== null && item?.rank_order !== ''
        ? Math.trunc(Number(item.rank_order))
        : index + 1;
    if (id) updateRow('doctors', Number(id), { rank_order: rank });
  });
  return successRedirect('/doctors-admin', { message: 'Doctors ranking updated successfully.' });
}

const SETTINGS_STRING_FIELDS = [
  'page_title',
  'seo_title',
  'seo_content',
  'meta_desc',
  'canonical_url',
  'schema_type',
  'schema_json',
];

export async function handleDoctorSettings(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors: Record<string, string[]> = {};
  for (const field of ['page_title', 'seo_title']) {
    if (field in body && body[field] !== null && body[field] !== undefined && typeof body[field] !== 'object') {
      if (String(body[field]).length > 255) {
        errors[field] = [`The ${field.replace(/_/g, ' ')} field must not be greater than 255 characters.`];
      }
    }
  }
  if ('faqs' in body && body.faqs !== null && body.faqs !== undefined && !Array.isArray(body.faqs)) {
    errors.faqs = ['The faqs field must be an array.'];
  }
  if (Object.keys(errors).length) return validationError(errors);

  const settings = doctorSettingsRow();
  const data: Record<string, any> = { updated_at: nowSql() };

  // `$validated['x'] ?? $settings->x` keeps the old value when the input is null.
  for (const field of SETTINGS_STRING_FIELDS) {
    if (field in body && body[field] !== null && body[field] !== undefined) {
      data[field] = String(body[field]);
    }
  }
  if ('faqs' in body && body.faqs !== null && body.faqs !== undefined) {
    data.faqs = JSON.stringify(jsonField(body.faqs, []));
  }
  for (const field of ['robots_index', 'robots_follow']) {
    if (field in body) {
      const value = body[field];
      data[field] =
        value === true || value === 1 || value === '1' || value === 'true' || value === 'on' ? 1 : 0;
    }
  }

  updateRow('doctor_settings', settings.id, data);
  return successRedirect('/doctors-admin', {
    message: 'Doctors page SEO settings updated successfully!',
  });
}

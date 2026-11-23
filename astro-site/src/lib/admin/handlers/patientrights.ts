import {
  all,
  deleteRow,
  get,
  insertRow,
  nowSql,
  readBody,
  successRedirect,
  updateRow,
  validationError,
  type Body,
} from '../http';

/**
 * Patient rights & responsibilities CMS, ported from PatientRightsController
 * (adminIndex/updateSettings/rights/responsibilities). Mirrors Laravel's
 * `$request->boolean('is_active', true)` semantics.
 */

const SETTINGS_DEFAULTS = {
  hero_title_en: 'Tech Dental Patient Bill of Rights and Responsibilities',
  hero_title_bn: 'টেক ডেন্টাল রোগীর অধিকার ও দায়িত্বসমূহ',
  hero_desc_en:
    'At Tech Dental, we are committed to providing high-quality, compassionate, and modern dental care in a comfortable and respectful environment. The following outlines your rights as our valued patient, along with the responsibilities we ask of you to help ensure the best possible experience and outcomes for everyone.',
  hero_desc_bn:
    'টেক ডেন্টালে আমরা একটি আরামদায়ক ও শ্রদ্ধাশীল পরিবেশে উচ্চমানের, যত্নশীল এবং আধুনিক ডেন্টাল কেয়ার প্রদানের জন্য অঙ্গীকারবদ্ধ। নিচে আমাদের সম্মানিত রোগী হিসেবে আপনার অধিকারসমূহ এবং দায়িত্বসমূহ তুলে ধরা হলো।',
  partnership_title_en: 'Our Partnership',
  partnership_title_bn: 'আমাদের অংশীদারিত্ব',
  author_name_en: 'Tech Dental',
  author_name_bn: 'টেক ডেন্টাল',
};

export function patientRightsSettingsRow(): any {
  let row = get<any>('SELECT * FROM patient_rights_settings ORDER BY id LIMIT 1');
  if (!row) {
    const now = nowSql();
    const id = insertRow('patient_rights_settings', { ...SETTINGS_DEFAULTS, created_at: now, updated_at: now });
    row = get<any>('SELECT * FROM patient_rights_settings WHERE id = ?', [id]);
  }
  return row;
}

export function patientRightsAdminProps() {
  return {
    settings: patientRightsSettingsRow(),
    rights: all<any>('SELECT * FROM patient_rights ORDER BY "order", id'),
    responsibilities: all<any>('SELECT * FROM patient_responsibilities ORDER BY "order", id'),
  };
}

/** FILTER_VALIDATE_BOOLEAN, used by Laravel's `$request->boolean()`. */
function filterBoolean(value: any): boolean {
  if (value === true || value === 1) return true;
  if (typeof value === 'string') {
    return ['1', 'true', 'on', 'yes'].includes(value.toLowerCase());
  }
  return false;
}

/** `$request->boolean($key, true)` – absent falls back to the default. */
function requestBoolean(body: Body, key: string, fallback: boolean): boolean {
  if (!(key in body) || body[key] === undefined) return fallback;
  return filterBoolean(body[key]);
}

function isIntegerLike(value: any): boolean {
  if (value === null || value === undefined || typeof value === 'boolean' || typeof value === 'object') return false;
  return /^[+-]?\d+$/.test(String(value).trim());
}

const SETTINGS_FIELDS: Array<[string, number | null]> = [
  ['hero_title_en', 255],
  ['hero_title_bn', 255],
  ['hero_desc_en', null],
  ['hero_desc_bn', null],
  ['partnership_title_en', 255],
  ['partnership_title_bn', 255],
  ['partnership_text_en', null],
  ['partnership_text_bn', null],
  ['author_name_en', 255],
  ['author_name_bn', 255],
  ['author_bio_en', null],
  ['author_bio_bn', null],
  ['author_image', 500],
  ['meta_title_en', 255],
  ['meta_title_bn', 255],
  ['meta_desc_en', null],
  ['meta_desc_bn', null],
];

export async function handlePatientRightsSettings(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors: Record<string, string[]> = {};

  for (const [field, max] of SETTINGS_FIELDS) {
    if (!(field in body) || body[field] === null || body[field] === undefined) continue;
    if (typeof body[field] === 'object') {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must be a string.`];
    } else if (max !== null && String(body[field]).length > max) {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must not be greater than ${max} characters.`];
    }
  }
  if (Object.keys(errors).length) return validationError(errors);

  const settings = patientRightsSettingsRow();
  const data: Record<string, any> = { updated_at: nowSql() };
  for (const [field] of SETTINGS_FIELDS) {
    if (field in body) {
      data[field] = body[field] === null || body[field] === undefined ? null : String(body[field]);
    }
  }
  updateRow('patient_rights_settings', settings.id, data);

  return successRedirect('/patient-rights-cms', { message: 'Page settings saved successfully.' });
}

/* ------------------------------------------------------------------ rights */

function validateRight(body: Body, withTitle: boolean): Record<string, string[]> | null {
  const errors: Record<string, string[]> = {};

  if (withTitle) {
    if (body.title_en === null || body.title_en === undefined || body.title_en === '') {
      errors.title_en = ['The title en field is required.'];
    } else if (typeof body.title_en === 'object') {
      errors.title_en = ['The title en field must be a string.'];
    } else if (String(body.title_en).length > 255) {
      errors.title_en = ['The title en field must not be greater than 255 characters.'];
    }
    if (body.title_bn !== null && body.title_bn !== undefined) {
      if (typeof body.title_bn === 'object') {
        errors.title_bn = ['The title bn field must be a string.'];
      } else if (String(body.title_bn).length > 255) {
        errors.title_bn = ['The title bn field must not be greater than 255 characters.'];
      }
    }
  }

  if (body.text_en === null || body.text_en === undefined || body.text_en === '') {
    errors.text_en = ['The text en field is required.'];
  } else if (typeof body.text_en === 'object') {
    errors.text_en = ['The text en field must be a string.'];
  }
  if (body.text_bn !== null && body.text_bn !== undefined && typeof body.text_bn === 'object') {
    errors.text_bn = ['The text bn field must be a string.'];
  }
  if (body.order !== null && body.order !== undefined && !isIntegerLike(body.order)) {
    errors.order = ['The order field must be an integer.'];
  }
  if (body.is_active !== null && body.is_active !== undefined) {
    const value = body.is_active;
    if (![true, false, 0, 1, '0', '1'].includes(value)) {
      errors.is_active = ['The is active field must be true or false.'];
    }
  }
  return Object.keys(errors).length ? errors : null;
}

function rightPayload(body: Body, withTitle: boolean): Record<string, any> {
  const data: Record<string, any> = {};
  if (withTitle) {
    for (const field of ['title_en', 'title_bn']) {
      if (field in body) {
        data[field] = body[field] === null || body[field] === undefined ? null : String(body[field]);
      }
    }
  }
  for (const field of ['text_en', 'text_bn']) {
    if (field in body) {
      data[field] = body[field] === null || body[field] === undefined ? null : String(body[field]);
    }
  }
  return data;
}

/* ------------------------------------------------------------- store/update */

export async function handlePatientRightStore(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors = validateRight(body, false);
  if (errors) return validationError(errors);

  const data = rightPayload(body, false);
  data.is_active = requestBoolean(body, 'is_active', true) ? 1 : 0;
  data.order =
    body.order === null || body.order === undefined
      ? (Number(get<any>('SELECT MAX("order") AS m FROM patient_rights')?.m) || 0) + 1
      : Math.trunc(Number(body.order));
  data.created_at = nowSql();
  data.updated_at = nowSql();

  insertRow('patient_rights', data);
  return successRedirect('/patient-rights-cms', { message: 'Patient right added successfully.' });
}

export async function handlePatientRightUpdate(request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM patient_rights WHERE id = ?', [id])) {
    return new Response('Not Found', { status: 404 });
  }

  const body = await readBody(request);
  const errors = validateRight(body, false);
  if (errors) return validationError(errors);

  const data = rightPayload(body, false);
  data.is_active = requestBoolean(body, 'is_active', true) ? 1 : 0;
  if ('order' in body && body.order !== null) data.order = Math.trunc(Number(body.order));
  data.updated_at = nowSql();

  updateRow('patient_rights', id, data);
  return successRedirect('/patient-rights-cms', { message: 'Patient right updated successfully.' });
}

export async function handlePatientRightDestroy(_request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM patient_rights WHERE id = ?', [id])) {
    return new Response('Not Found', { status: 404 });
  }
  deleteRow('patient_rights', id);
  return successRedirect('/patient-rights-cms', { message: 'Patient right deleted successfully.' });
}

/* ------------------------------------------------------ responsibilities */

export async function handlePatientResponsibilityStore(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors = validateRight(body, true);
  if (errors) return validationError(errors);

  const data = rightPayload(body, true);
  data.is_active = requestBoolean(body, 'is_active', true) ? 1 : 0;
  data.order =
    body.order === null || body.order === undefined
      ? (Number(get<any>('SELECT MAX("order") AS m FROM patient_responsibilities')?.m) || 0) + 1
      : Math.trunc(Number(body.order));
  data.created_at = nowSql();
  data.updated_at = nowSql();

  insertRow('patient_responsibilities', data);
  return successRedirect('/patient-rights-cms', { message: 'Patient responsibility added successfully.' });
}

export async function handlePatientResponsibilityUpdate(request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM patient_responsibilities WHERE id = ?', [id])) {
    return new Response('Not Found', { status: 404 });
  }

  const body = await readBody(request);
  const errors = validateRight(body, true);
  if (errors) return validationError(errors);

  const data = rightPayload(body, true);
  data.is_active = requestBoolean(body, 'is_active', true) ? 1 : 0;
  if ('order' in body && body.order !== null) data.order = Math.trunc(Number(body.order));
  data.updated_at = nowSql();

  updateRow('patient_responsibilities', id, data);
  return successRedirect('/patient-rights-cms', { message: 'Patient responsibility updated successfully.' });
}

export async function handlePatientResponsibilityDestroy(_request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM patient_responsibilities WHERE id = ?', [id])) {
    return new Response('Not Found', { status: 404 });
  }
  deleteRow('patient_responsibilities', id);
  return successRedirect('/patient-rights-cms', { message: 'Patient responsibility deleted successfully.' });
}

/* --------------------------------------------------------------- reorder */

function reorder(table: string, body: Body) {
  const items = Array.isArray(body.items) ? body.items : [];
  for (const item of items) {
    if (item && item.id !== undefined && item.id !== null && item.order !== undefined && item.order !== null) {
      updateRow(table, item.id, { order: Math.trunc(Number(item.order)), updated_at: nowSql() });
    }
  }
}

export async function handlePatientRightsReorder(request: Request): Promise<Response> {
  reorder('patient_rights', await readBody(request));
  return successRedirect('/patient-rights-cms', { message: 'Patient rights order updated.' });
}

export async function handlePatientResponsibilitiesReorder(request: Request): Promise<Response> {
  reorder('patient_responsibilities', await readBody(request));
  return successRedirect('/patient-rights-cms', { message: 'Patient responsibilities order updated.' });
}

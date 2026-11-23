import {
  deleteRow,
  get,
  insertRow,
  nowSql,
  readBody,
  str,
  successRedirect,
  updateRow,
  validationError,
  type Body,
} from '../http';

/**
 * Team admin module, ported from TeamMemberController (index/create/store/edit/
 * update/toggle-active/destroy/reorder).
 */

const SECTIONS = ['management', 'ceo_assistant', 'digital_marketing', 'call_center'];
const STRING_FIELDS: Array<[string, number | null]> = [
  ['name', 255],
  ['role', 255],
  ['image', null],
  ['quote', null],
  ['photo_alt', null],
];

function validateMember(body: Body): Record<string, string[]> | null {
  const errors: Record<string, string[]> = {};
  if (!str(body.name)) errors.name = ['The name field is required.'];
  if (!str(body.role)) errors.role = ['The role field is required.'];
  if (!str(body.section)) {
    errors.section = ['The section field is required.'];
  } else if (!SECTIONS.includes(str(body.section))) {
    errors.section = ['The selected section is invalid.'];
  }

  for (const [field, max] of STRING_FIELDS) {
    if (max === null) continue;
    if (field in body && body[field] !== null && body[field] !== undefined && typeof body[field] !== 'object') {
      if (String(body[field]).length > max) {
        errors[field] = [`The ${field.replace(/_/g, ' ')} field must not be greater than ${max} characters.`];
      }
    }
  }

  if ('letter' in body && body.letter !== null && body.letter !== undefined && !Array.isArray(body.letter)) {
    errors.letter = ['The letter field must be an array.'];
  }
  if ('sort_order' in body && body.sort_order !== null && body.sort_order !== '') {
    const value = body.sort_order;
    if (typeof value === 'object' || !/^-?\d+$/.test(String(value).trim())) {
      errors.sort_order = ['The sort order must be an integer.'];
    }
  }

  return Object.keys(errors).length ? errors : null;
}

function memberPayload(body: Body): Record<string, any> {
  const data: Record<string, any> = {};
  for (const field of ['name', 'role', 'section', 'image', 'quote', 'photo_alt']) {
    if (field in body) {
      const value = body[field];
      data[field] =
        value === undefined || value === null || typeof value === 'object' ? null : String(value);
    }
  }
  if ('letter' in body) {
    const value = body.letter;
    data.letter =
      value === undefined || value === null || value === '' ? null : JSON.stringify(Array.isArray(value) ? value : []);
  }
  if ('is_active' in body) {
    const value = body.is_active;
    data.is_active =
      value === true || value === 1 || value === '1' || value === 'true' || value === 'on' ? 1 : 0;
  }
  if ('sort_order' in body) {
    const value = body.sort_order;
    data.sort_order =
      value === undefined || value === null || value === '' ? 0 : Math.trunc(Number(value));
  }
  return data;
}

export async function handleTeamStore(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors = validateMember(body);
  if (errors) return validationError(errors);

  const data = memberPayload(body);
  if (!('is_active' in body)) data.is_active = 1;
  data.created_at = nowSql();
  data.updated_at = nowSql();

  insertRow('team_members', data);
  return successRedirect('/team-admin', { message: 'Member added successfully.' });
}

export async function handleTeamUpdate(request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM team_members WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });

  const body = await readBody(request);
  const errors = validateMember(body);
  if (errors) return validationError(errors);

  const data = memberPayload(body);
  if (!('is_active' in body)) data.is_active = 1;
  data.updated_at = nowSql();

  updateRow('team_members', id, data);
  return successRedirect('/team-admin', { message: 'Member updated successfully.' });
}

export async function handleTeamToggle(_request: Request, id: number): Promise<Response> {
  const member = get<any>('SELECT * FROM team_members WHERE id = ?', [id]);
  if (!member) return new Response('Not Found', { status: 404 });
  const active = member.is_active === true || member.is_active === 1 || member.is_active === '1';
  updateRow('team_members', id, { is_active: active ? 0 : 1, updated_at: nowSql() });
  return successRedirect('/team-admin', { message: 'Status updated successfully.' });
}

export async function handleTeamDestroy(_request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM team_members WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });
  deleteRow('team_members', id);
  return successRedirect('/team-admin', { message: 'Member deleted.' });
}

export async function handleTeamReorder(request: Request): Promise<Response> {
  const body = await readBody(request);
  const items = Array.isArray(body.items) ? body.items : [];
  for (const item of items) {
    if (item && item.id !== undefined && item.id !== null && item.sort_order !== undefined && item.sort_order !== null) {
      updateRow('team_members', Number(item.id), { sort_order: Math.trunc(Number(item.sort_order)) });
    }
  }
  return successRedirect('/team-admin', { message: 'Team order updated.' });
}

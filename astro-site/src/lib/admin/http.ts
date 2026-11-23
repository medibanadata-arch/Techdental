import { all, get, model, models, run } from '../db';
import { authUserFromRequest, isAdminUser, jsonResponse, successRedirect, validationError, type AuthUser } from '../auth';
import { pagePayload } from '../shared';

/** Shared helpers for the admin panel routes (props + request parsing + validation). */

export function currentAdmin(request: Request): AuthUser | null {
  return authUserFromRequest(request);
}

export function adminPagePayload(
  request: Request,
  component: string,
  props: Record<string, any> = {},
  overrides: Record<string, any> = {}
) {
  const user = currentAdmin(request);
  const url = new URL(request.url);
  const page = pagePayload(component, props, url.pathname + url.search);
  return {
    ...page,
    props: { ...page.props, auth: { user }, ...overrides },
  };
}

/** Admin pages require the Administrator role (mirrors EnsureUserIsAdmin). */
export function guardAdmin(request: Request): Response | null {
  const user = currentAdmin(request);
  if (!user) {
    const url = new URL(request.url);
    const redirect = encodeURIComponent(url.pathname + url.search);
    return new Response(null, { status: 302, headers: { Location: `/login?redirect=${redirect}` } });
  }
  if (!isAdminUser(user)) {
    return new Response('You do not have permission to access the admin area.', {
      status: 403,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
  return null;
}

/** Pages accessible to any signed-in account (profile). */
export function guardAuth(request: Request): Response | null {
  if (currentAdmin(request)) return null;
  const url = new URL(request.url);
  const redirect = encodeURIComponent(url.pathname + url.search);
  return new Response(null, { status: 302, headers: { Location: `/login?redirect=${redirect}` } });
}

export type Body = Record<string, any>;

/** Keys Laravel's TrimStrings middleware leaves untouched. */
const TRIM_EXCEPT = new Set(['current_password', 'password', 'password_confirmation']);

/**
 * Reproduce Laravel's global TrimStrings + ConvertEmptyStringsToNull middleware:
 * every string is trimmed (except password fields) and empty strings become null.
 */
function normaliseInput(value: any, key = ''): any {
  if (Array.isArray(value)) return value.map((item) => normaliseInput(item));
  if (value && typeof value === 'object' && !(value instanceof File)) {
    const out: Record<string, any> = {};
    for (const [childKey, childValue] of Object.entries(value)) {
      out[childKey] = normaliseInput(childValue, childKey);
    }
    return out;
  }
  if (typeof value === 'string') {
    const trimmed = TRIM_EXCEPT.has(key) ? value : value.trim();
    return trimmed === '' ? null : trimmed;
  }
  return value;
}

/** Read a JSON or multipart/form-data body into a plain object. */
export async function readBody(request: Request): Promise<Body> {
  const type = (request.headers.get('content-type') || '').toLowerCase();
  try {
    if (type.includes('application/json')) {
      const parsed = await request.json();
      return parsed && typeof parsed === 'object' ? (normaliseInput(parsed) as Body) : {};
    }
    if (type.includes('multipart/form-data') || type.includes('application/x-www-form-urlencoded')) {
      const form = await request.formData();
      const out: Body = {};
      for (const [key, value] of form.entries()) {
        if (value instanceof File) {
          out[key] = value;
        } else if (key in out) {
          const existing = out[key];
          out[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
        } else {
          out[key] = value;
        }
      }
      // Laravel/PHP turns `tags[]=a&tags[]=b` into arrays; FormData keys arrive as `tags[]`.
      for (const key of Object.keys(out)) {
        if (key.endsWith('[]')) {
          const plain = key.slice(0, -2);
          const value = out[key];
          delete out[key];
          out[plain] = Array.isArray(value) ? value : [value];
        }
      }
      return normaliseInput(out) as Body;
    }
    const text = await request.text();
    if (!text) return {};
    try {
      const parsed = JSON.parse(text);
      return parsed && typeof parsed === 'object' ? (normaliseInput(parsed) as Body) : {};
    } catch {
      const params = new URLSearchParams(text);
      const out: Body = {};
      for (const [key, value] of params.entries()) out[key] = value;
      return normaliseInput(out) as Body;
    }
  } catch {
    return {};
  }
}

export function str(value: any): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'object') return '';
  return String(value);
}

export function optionalStr(value: any): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'object') return null;
  const text = String(value);
  return text === '' ? null : text;
}

export function intOrNull(value: any): number | null {
  if (value === undefined || value === null || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.trunc(number) : null;
}

export function flag(value: any): boolean {
  return value === true || value === 1 || value === '1' || value === 'true' || value === 'on' || value === 'yes';
}

export function arrayOf<T = any>(value: any): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** Decode a JSON column coming back from a form submission. */
export function jsonField(value: any, fallback: any = null): any {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(String(value));
  } catch {
    return fallback;
  }
}

export function nowSql(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

/** Insert a row and return its id (Laravel `Model::create` + `id`). */
export function insertRow(table: string, data: Record<string, any>): number {
  const keys = Object.keys(data);
  const columns = keys.map((k) => `"${k}"`).join(', ');
  const placeholders = keys.map(() => '?').join(', ');
  const values = keys.map((k) => (data[k] === undefined ? null : data[k]));
  const result = run(`INSERT INTO "${table}" (${columns}) VALUES (${placeholders})`, values);
  return Number(result.lastInsertRowid);
}

export function updateRow(table: string, id: number | string, data: Record<string, any>): void {
  const keys = Object.keys(data);
  if (!keys.length) return;
  const assignments = keys.map((k) => `"${k}" = ?`).join(', ');
  run(`UPDATE "${table}" SET ${assignments} WHERE id = ?`, [...keys.map((k) => (data[k] === undefined ? null : data[k])), id]);
}

export function deleteRow(table: string, id: number | string): void {
  run(`DELETE FROM "${table}" WHERE id = ?`, [id]);
}

export { all, get, model, models, run, jsonResponse, successRedirect, validationError };

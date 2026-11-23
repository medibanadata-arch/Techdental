import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { get } from './db';

/**
 * Session + authentication helpers for the migrated admin panel.
 *
 * Laravel used its own (encrypted) session cookie; this port keeps the same
 * login credentials (bcrypt hashes in `users.password`) but stores a small,
 * HMAC-signed cookie so the shared SQLite database stays untouched.
 */

export const AUTH_COOKIE = 'td_admin_session';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  username?: string | null;
  role?: string | null;
  avatar?: string | null;
  email_verified_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

function loadSecret(): string {
  const fromEnv = process.env.AUTH_SECRET || process.env.APP_KEY;
  if (fromEnv && fromEnv.length >= 16) {
    return createHmac('sha256', 'td-admin').update(fromEnv).digest('hex');
  }
  try {
    const dir = path.resolve(process.cwd(), '.data');
    const file = path.join(dir, 'auth-secret');
    if (fs.existsSync(file)) {
      const value = fs.readFileSync(file, 'utf8').trim();
      if (value.length >= 32) return value;
    }
    fs.mkdirSync(dir, { recursive: true });
    const generated = randomBytes(48).toString('hex');
    fs.writeFileSync(file, generated, { mode: 0o600 });
    return generated;
  } catch {
    // Last resort: per-process secret (sessions end on restart).
    return randomBytes(48).toString('hex');
  }
}

const SECRET = loadSecret();

function sign(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('base64url');
}

function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    const key = part.slice(0, index).trim();
    if (!key) continue;
    out[key] = decodeURIComponent(part.slice(index + 1).trim());
  }
  return out;
}

/** Create the Set-Cookie value for a signed-in user. */
export function authCookie(userId: number | string, remember = false): string {
  const ttlSeconds = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 8;
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${userId}.${exp}`;
  const value = `${payload}.${sign(payload)}`;
  const maxAge = ttlSeconds;
  return `${AUTH_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearAuthCookie(): string {
  return `${AUTH_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

/** Resolve the signed-in user from a request (or null). */
export function authUserFromRequest(request: Request): AuthUser | null {
  const cookies = parseCookies(request.headers.get('cookie'));
  const raw = cookies[AUTH_COOKIE];
  if (!raw) return null;
  const parts = raw.split('.');
  if (parts.length !== 3) return null;
  const [id, exp, signature] = parts;
  const payload = `${id}.${exp}`;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (!/^\d+$/.test(exp) || Number(exp) * 1000 < Date.now()) return null;
  const row = get('SELECT * FROM users WHERE id = ?', [Number(id)]);
  if (!row) return null;
  return publicUser(row);
}

export function publicUser(row: any): AuthUser {
  return {
    id: Number(row.id),
    name: String(row.name ?? ''),
    email: String(row.email ?? ''),
    username: row.username ?? null,
    role: row.role ?? null,
    avatar: row.avatar ?? null,
    email_verified_at: row.email_verified_at ?? null,
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null,
  };
}

export function isAdminUser(user: AuthUser | null | undefined): boolean {
  return String(user?.role ?? '').trim().toLowerCase() === 'administrator';
}

export async function verifyPassword(plain: string, hash: string | null | undefined): Promise<boolean> {
  if (!hash) return false;
  const value = String(hash);
  try {
    if (/^\$2[aby]\$/.test(value)) return await bcrypt.compare(String(plain), value);
    // Fallback for other bcrypt-ish hashes produced by PHP (`$2y$` is handled above).
    return false;
  } catch {
    return false;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(String(plain), 12);
}

export function jsonResponse(data: any, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders },
  });
}

export function redirectResponse(location: string, status = 302, extraHeaders: Record<string, string> = {}): Response {
  return new Response(null, { status, headers: { Location: location, ...extraHeaders } });
}

/** Inertia-style success payload understood by the shim (it navigates). */
export function successRedirect(location: string, data: Record<string, any> = {}): Response {
  return jsonResponse({ success: true, redirect: location, ...data });
}

export function validationError(errors: Record<string, string | string[]>): Response {
  const normalized: Record<string, string[]> = {};
  for (const [field, messages] of Object.entries(errors)) {
    normalized[field] = Array.isArray(messages) ? messages : [String(messages)];
  }
  return jsonResponse({ message: 'The given data was invalid.', errors: normalized }, 422);
}

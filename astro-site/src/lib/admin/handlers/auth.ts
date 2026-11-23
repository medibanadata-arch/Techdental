import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { get, run } from '../../db';
import {
  AUTH_COOKIE,
  authCookie,
  authUserFromRequest,
  clearAuthCookie,
  hashPassword,
  isAdminUser,
  successRedirect,
  validationError,
  verifyPassword,
  jsonResponse,
  type AuthUser,
} from '../../auth';
import { insertRow, nowSql, optionalStr, readBody, str, updateRow, type Body } from '../http';

/**
 * Ports of the Breeze auth controllers plus the profile endpoints.
 * Messages follow Laravel's default translations so the UI reads the same.
 */

const attempts = new Map<string, number[]>();

function throttleKey(email: string, request: Request): string {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'local';
  return `${email.toLowerCase()}|${ip}`;
}

function tooManyAttempts(key: string): number {
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter((time) => now - time < 60_000);
  attempts.set(key, recent);
  if (recent.length < 5) return 0;
  const oldest = recent[0];
  return Math.max(1, Math.ceil((60_000 - (now - oldest)) / 1000));
}

function hitAttempt(key: string): void {
  const list = attempts.get(key) || [];
  list.push(Date.now());
  attempts.set(key, list.slice(-10));
}

function clearAttempts(key: string): void {
  attempts.delete(key);
}

function setCookie(response: Response, cookie: string): Response {
  response.headers.append('Set-Cookie', cookie);
  return response;
}

function intendedFrom(request: Request): string {
  try {
    const referer = request.headers.get('referer');
    if (!referer) return '/dashboard';
    const url = new URL(referer);
    const redirect = url.searchParams.get('redirect');
    if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) return redirect;
  } catch {
    // ignore
  }
  return '/dashboard';
}

const PUBLIC_EMAIL_DOMAINS = new Set(['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.com']);

export async function handleLogin(request: Request): Promise<Response> {
  const body = await readBody(request);
  const email = str(body.email).trim();
  const password = str(body.password);
  const errors: Record<string, string[]> = {};

  if (!email) errors.email = ['The email field is required.'];
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = ['The email field must be a valid email address.'];
  if (!password) errors.password = ['The password field is required.'];
  if (Object.keys(errors).length) return validationError(errors);

  const key = throttleKey(email, request);
  const wait = tooManyAttempts(key);
  if (wait > 0) {
    return validationError({
      email: [`Too many login attempts. Please try again in ${wait} seconds.`],
    });
  }

  const row = get('SELECT * FROM users WHERE lower(email) = ?', [email.toLowerCase()]);
  if (!row || !(await verifyPassword(password, row.password))) {
    hitAttempt(key);
    return validationError({ email: ['These credentials do not match our records.'] });
  }
  clearAttempts(key);

  const cookie = authCookie(row.id, body.remember === true || body.remember === 'true' || body.remember === 1);
  const response = successRedirect(intendedFrom(request));
  return setCookie(response, cookie);
}

export async function handleLogout(request: Request): Promise<Response> {
  const response = jsonResponse({ success: true, redirect: '/' });
  return setCookie(response, clearAuthCookie());
}

/** Breeze registration: public sign-ups are always Editors. */
export async function handleRegister(request: Request): Promise<Response> {
  const body = await readBody(request);
  const name = str(body.name).trim();
  const email = str(body.email).trim().toLowerCase();
  const password = str(body.password);
  const confirmation = str(body.password_confirmation);
  const errors: Record<string, string[]> = {};

  if (!name) errors.name = ['The name field is required.'];
  if (!email) errors.email = ['The email field is required.'];
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = ['The email field must be a valid email address.'];
  else if (get('SELECT id FROM users WHERE lower(email) = ?', [email])) errors.email = ['The email has already been taken.'];
  if (!password) errors.password = ['The password field is required.'];
  else if (password.length < 8) errors.password = ['The password field must be at least 8 characters.'];
  else if (password !== confirmation) errors.password = ['The password field confirmation does not match.'];
  if (Object.keys(errors).length) return validationError(errors);

  const id = insertRow('users', {
    name,
    email,
    password: await hashPassword(password),
    role: 'Editor',
    created_at: nowSql(),
    updated_at: nowSql(),
  });

  const response = successRedirect('/dashboard');
  return setCookie(response, authCookie(id, false));
}

/** Password reset request: Laravel's mailer is configured to `log`, keep that behaviour. */
export async function handlePasswordEmail(request: Request): Promise<Response> {
  const body = await readBody(request);
  const email = str(body.email).trim().toLowerCase();
  if (!email) return validationError({ email: ['The email field is required.'] });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return validationError({ email: ['The email field must be a valid email address.'] });
  }

  const user = get('SELECT * FROM users WHERE lower(email) = ?', [email]);
  if (user) {
    const token = randomBytes(32).toString('hex');
    const hashed = await bcrypt.hash(token, 10);
    run('DELETE FROM password_reset_tokens WHERE email = ?', [email]);
    run('INSERT INTO password_reset_tokens (email, token, created_at) VALUES (?, ?, ?)', [email, hashed, nowSql()]);
    try {
      const dir = path.resolve(process.cwd(), '.data');
      fs.mkdirSync(dir, { recursive: true });
      fs.appendFileSync(
        path.join(dir, 'mail.log'),
        `[${nowSql()}] Password reset for ${email}: ${new URL(request.url).origin}/reset-password/${token}\n`
      );
    } catch {
      // Logging is best-effort, exactly like MAIL_MAILER=log.
    }
  }

  return jsonResponse({
    success: true,
    status: 'We have emailed your password reset link.',
  });
}

export async function handlePasswordReset(request: Request): Promise<Response> {
  const body = await readBody(request);
  const token = str(body.token);
  const email = str(body.email).trim().toLowerCase();
  const password = str(body.password);
  const confirmation = str(body.password_confirmation);
  const errors: Record<string, string[]> = {};

  if (!token) errors.token = ['The token field is required.'];
  if (!email) errors.email = ['The email field is required.'];
  if (!password) errors.password = ['The password field is required.'];
  else if (password.length < 8) errors.password = ['The password field must be at least 8 characters.'];
  else if (password !== confirmation) errors.password = ['The password field confirmation does not match.'];
  if (Object.keys(errors).length) return validationError(errors);

  const record = get('SELECT * FROM password_reset_tokens WHERE email = ?', [email]);
  const validToken = record && (await bcrypt.compare(token, String(record.token)));
  const fresh = record?.created_at ? Date.now() - new Date(String(record.created_at).replace(' ', 'T') + 'Z').getTime() < 3600_000 : true;
  const user = get('SELECT * FROM users WHERE lower(email) = ?', [email]);

  if (!record || !validToken || !fresh || !user) {
    return validationError({ email: ['This password reset token is invalid.'] });
  }

  updateRow('users', user.id, {
    password: await hashPassword(password),
    remember_token: randomBytes(30).toString('hex'),
    updated_at: nowSql(),
  });
  run('DELETE FROM password_reset_tokens WHERE email = ?', [email]);

  return successRedirect('/login');
}

export async function handlePasswordUpdate(request: Request): Promise<Response> {
  const user = authUserFromRequest(request);
  if (!user) return jsonResponse({ message: 'Unauthenticated.' }, 401);
  const body = await readBody(request);
  const current = str(body.current_password);
  const password = str(body.password);
  const confirmation = str(body.password_confirmation);
  const row = get('SELECT * FROM users WHERE id = ?', [user.id]);
  const errors: Record<string, string[]> = {};

  if (!current) errors.current_password = ['The current password field is required.'];
  else if (!row || !(await verifyPassword(current, row.password))) {
    errors.current_password = ['The password is incorrect.'];
  }
  if (!password) errors.password = ['The password field is required.'];
  else if (password.length < 8) errors.password = ['The password field must be at least 8 characters.'];
  else if (password !== confirmation) errors.password = ['The password field confirmation does not match.'];
  if (Object.keys(errors).length) return validationError(errors);

  updateRow('users', user.id, { password: await hashPassword(password), updated_at: nowSql() });
  return successRedirect('/profile');
}

export async function handleConfirmPassword(request: Request): Promise<Response> {
  const user = authUserFromRequest(request);
  if (!user) return jsonResponse({ message: 'Unauthenticated.' }, 401);
  const body = await readBody(request);
  const row = get('SELECT * FROM users WHERE id = ?', [user.id]);
  const password = str(body.password);
  if (!row || !(await verifyPassword(password, row.password))) {
    return validationError({ password: ['The provided password does not match our records.'] });
  }
  const response = successRedirect('/dashboard');
  response.headers.append(
    'Set-Cookie',
    `td_password_confirmed=${Math.floor(Date.now() / 1000)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=10800`
  );
  return response;
}

export async function handleProfileUpdate(request: Request): Promise<Response> {
  const user = authUserFromRequest(request);
  if (!user) return jsonResponse({ message: 'Unauthenticated.' }, 401);
  const body = await readBody(request);
  const name = str(body.name).trim();
  const email = str(body.email).trim().toLowerCase();
  const errors: Record<string, string[]> = {};

  if (!name) errors.name = ['The name field is required.'];
  if (!email) errors.email = ['The email field is required.'];
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = ['The email field must be a valid email address.'];
  else {
    const other = get('SELECT id FROM users WHERE lower(email) = ? AND id <> ?', [email, user.id]);
    if (other) errors.email = ['The email has already been taken.'];
  }
  if (Object.keys(errors).length) return validationError(errors);

  const data: Record<string, any> = { name, email, updated_at: nowSql() };
  if (email !== String(user.email || '').toLowerCase()) data.email_verified_at = null;
  updateRow('users', user.id, data);
  return successRedirect('/profile');
}

export async function handleProfileDestroy(request: Request): Promise<Response> {
  const user = authUserFromRequest(request);
  if (!user) return jsonResponse({ message: 'Unauthenticated.' }, 401);
  const body = await readBody(request);
  const row = get('SELECT * FROM users WHERE id = ?', [user.id]);
  if (!row || !(await verifyPassword(str(body.password), row.password))) {
    return validationError({ password: ['The provided password does not match our records.'] });
  }
  run('DELETE FROM users WHERE id = ?', [user.id]);
  const response = jsonResponse({ success: true, redirect: '/' });
  return setCookie(response, clearAuthCookie());
}

export async function handleVerificationSend(): Promise<Response> {
  return jsonResponse({ success: true, status: 'verification-link-sent' });
}

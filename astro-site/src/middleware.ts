import { defineMiddleware } from 'astro:middleware';
import { get, run } from './lib/db';
import { encodeLocation, hasLegacyPage, hasMappedEntity, isRemovedPath } from './lib/legacy';
import { handleAiChat } from './lib/api/aiChat';
import { handleAppointmentStore, handleComplaintStore, handleFeaturedImageView } from './lib/api/forms';
import { guardAdmin, guardAuth } from './lib/admin/http';
import { handleAdminRoute } from './lib/admin/router';
import { authUserFromRequest } from './lib/auth';
import { isAdminPath, isAuthPath, isGuestPath } from './lib/admin/paths';

/**
 * Mirrors app/Http/Middleware/TrailingSlashAndRedirectMiddleware.php and serves
 * the public POST endpoints that Inertia/React posts to.
 */

const SKIP_PREFIXES = [
  '/api/',
  '/_astro/',
  '/uploads/',
  '/fonts/',
  '/src/',
  '/node_modules/',
  '/@vite',
  '/@id/',
  '/@fs/',
  '/_image',
  '/_debugbar',
  '/build/',
];

function normalized(pathname: string): string {
  return '/' + String(pathname || '').replace(/^\/+/, '').replace(/\/+$/, '');
}

function shouldSkip(pathname: string): boolean {
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  return (
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/favicon.svg'
  );
}

function redirect(location: string, status = 301): Response {
  return new Response(null, {
    status,
    headers: { Location: encodeLocation(location) },
  });
}

function managedRedirect(path: string, rawPath: string): any | null {
  return (
    get(
      'SELECT * FROM redirects WHERE is_active = 1 AND source_url IN (?, ?, ?, ?) ORDER BY id LIMIT 1',
      [path, rawPath, path.replace(/\/+$/, ''), path.replace(/^\/+/, '')]
    ) || null
  );
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname, search } = context.url;
  const method = context.request.method.toUpperCase();

  // Public form/API endpoints (no Astro page can export POST alongside GET).
  if (method === 'POST') {
    const cleanPath = normalized(pathname);
    if (cleanPath === '/api/ai-chat') {
      const ip = context.clientAddress || context.request.headers.get('x-forwarded-for') || null;
      return handleAiChat(context.request, ip);
    }
    if (cleanPath === '/appointments') return handleAppointmentStore(context.request);
    if (cleanPath === '/complaint-box') return handleComplaintStore(context.request);
    const viewMatch = cleanPath.match(/^\/api\/featured-images\/(\d+)\/view$/);
    if (viewMatch) return handleFeaturedImageView(Number(viewMatch[1]));
  }

  // Admin/auth mutations (POST/PUT/PATCH/DELETE) and admin JSON APIs.
  const handled = await handleAdminRoute(context.request, normalized(pathname));
  if (handled) return handled;

  if (method !== 'GET' && method !== 'HEAD') return next();

  if (shouldSkip(pathname)) return next();

  const rawPath = pathname;
  const path = normalized(rawPath);

  // Auth screens: signed-in users are sent to the dashboard (Laravel `guest`).
  if (isGuestPath(path) && authUserFromRequest(context.request)) {
    return redirect('/dashboard', 302);
  }

  // Administrator area and signed-in-only pages.
  if (isAdminPath(path)) {
    const denied = guardAdmin(context.request);
    if (denied) return denied;
  } else if (isAuthPath(path)) {
    const denied = guardAuth(context.request);
    if (denied) return denied;
  }

  // Permanently removed old URLs must 404 without chaining through a 301.
  if (isRemovedPath(path) || isRemovedPath(rawPath)) return next();

  // 1. Trailing slash consistency. Archived pages and old URLs that now serve
  //    a current page keep the exact path they were published with.
  if (rawPath.length > 1 && rawPath.endsWith('/')) {
    const cleanPath = rawPath.replace(/\/+$/, '');
    const isLegacy =
      hasLegacyPage(rawPath) ||
      hasLegacyPage(cleanPath) ||
      hasLegacyPage(path) ||
      hasLegacyPage(normalized(cleanPath));

    if (!isLegacy) {
      const isMapped = hasMappedEntity(rawPath) || hasMappedEntity(cleanPath);
      const redirectRow = managedRedirect(normalized(cleanPath), rawPath);
      const hasManagedRedirect = !!redirectRow;

      if (!hasManagedRedirect && !isMapped) {
        return redirect(cleanPath + (search || ''));
      }
    }
  }

  // 2. Managed 301/302 redirects.
  const redirectRow = managedRedirect(path, rawPath);
  if (redirectRow && redirectRow.target_url) {
    const hasLegacy =
      hasLegacyPage(path) ||
      hasLegacyPage(rawPath) ||
      hasMappedEntity(path) ||
      hasMappedEntity(rawPath);

    const target = String(redirectRow.target_url);
    if (!hasLegacy && target.replace(/\/+$/, '') !== path.replace(/\/+$/, '')) {
      try {
        run('UPDATE redirects SET hits = COALESCE(hits, 0) + 1 WHERE id = ?', [redirectRow.id]);
      } catch {
        // best effort
      }
      const code = Number(redirectRow.status_code) === 302 ? 302 : 301;
      return redirect(target, code);
    }
  }

  return next();
});

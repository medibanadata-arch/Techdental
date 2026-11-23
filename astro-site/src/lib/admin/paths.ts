/**
 * Path classification for the admin panel and auth screens. Mirrors the
 * `auth`, `guest` and `admin` middleware groups in routes/web.php + routes/auth.php.
 */

/** Prefixes that belong to the administrator-only area. */
const ADMIN_PREFIXES = [
  '/dashboard',
  '/appointments',
  '/posts',
  '/pages',
  '/featured-images',
  '/media',
  '/admin-api',
  '/doctors-admin',
  '/doctors/create',
  '/users',
  '/settings-admin',
  '/settings/header-footer',
  '/settings/website-texts',
  '/menus',
  '/medicines-admin',
  '/services-admin',
  '/about-cms',
  '/team-admin',
  '/price-list-admin',
  '/branch-admin',
  '/homepage-cms',
  '/redirects-admin',
  '/ai-assistant',
  '/complaints-admin',
  '/patient-rights-cms',
  '/how-to-pay-cms',
  '/pricing',
  '/locations',
];

/** Admin paths that are not simple prefixes (e.g. /doctors/{id}/edit). */
const ADMIN_PATTERNS = [/^\/doctors\/\d+\/edit$/];

export function isAdminPath(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (ADMIN_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + '/'))) return true;
  return ADMIN_PATTERNS.some((pattern) => pattern.test(path));
}

/** Pages behind Laravel's `guest` middleware. */
export function isGuestPath(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/login' || path === '/register' || path === '/forgot-password') return true;
  return /^\/reset-password\/[^/]+$/.test(path);
}

/** Pages behind Laravel's `auth` middleware but open to every account. */
export function isAuthPath(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/profile' || path === '/confirm-password') return true;
  return path === '/verify-email' || path.startsWith('/verify-email/');
}

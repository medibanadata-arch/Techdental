/**
 * Route name ⇄ URL table used by the Inertia shim (a tiny Ziggy stand-in).
 *
 * Laravel code calls `route('posts.edit', id)` and `route().current('posts.*')`;
 * the migrated React pages need the same behaviour, so names are resolved here
 * and the current URL is matched back to a route name for active menu states.
 *
 * Keep this file dependency-free: it is bundled into the browser as well.
 */

type Params = Record<string, any> | any[] | undefined;

/** Route name → path pattern. Patterns use {param} placeholders, like Laravel. */
export const ROUTES: Record<string, string> = {
  // ---- Public ----
  home: '/',
  'home.alias': '/home',
  sitemap: '/sitemap.xml',
  'posts.public.show': '/post/{slug}',
  'pages.public.show': '/page/{slug}',
  'medicines.public': '/medicines',
  'medicines.public.show': '/medicines/{slug}',
  'medicines.public.show.bn': '/bn/medicines/{slug}',
  'services.public': '/services',
  'services.public.bn': '/bn/services',
  'service.public.show': '/service/{slug}',
  'service.public.bn.show': '/bn/service/{slug}',
  'blog.public': '/blog',
  'blog.public.bn': '/bn/blog',
  'blog.public.others': '/blog/others',
  'blog.public.others.bn': '/bn/blog/others',
  'blog.public.show': '/blog/{slug}',
  'blog.public.show.bn': '/bn/blog/{slug}',
  'about.public': '/about',
  'team.public': '/team',
  'team.public.show': '/team/{slug}',
  'doctors.public': '/doctors',
  'doctors.public.show': '/doctors/{id}',
  'pricelist.public': '/price-list',
  'patient-rights.public': '/patient-rights',
  'patient-rights.public.bn': '/bn/patient-rights',
  'complaints.public': '/complaint-box',
  'complaints.store': '/complaint-box',
  'how-to-pay.public': '/how-to-pay',
  'appointment.public': '/appointment',
  'book.public': '/appointment',
  'appointments.store': '/appointments',
  'gallery.public': '/gallery',
  'branches.public': '/branches',
  'branch.public.show': '/branch/{slug}',
  'ai-chat.api': '/api/ai-chat',
  'featured-images.increment-view': '/api/featured-images/{id}/view',

  // ---- Auth ----
  login: '/login',
  register: '/register',
  logout: '/logout',
  'password.request': '/forgot-password',
  'password.email': '/forgot-password',
  'password.reset': '/reset-password/{token}',
  'password.store': '/reset-password',
  'password.confirm': '/confirm-password',
  'password.update': '/password',
  'verification.notice': '/verify-email',
  'verification.verify': '/verify-email/{id}/{hash}',
  'verification.send': '/email/verification-notification',
  'profile.edit': '/profile',
  'profile.update': '/profile',
  'profile.destroy': '/profile',

  // ---- Admin: overview ----
  dashboard: '/dashboard',
  'appointments.index': '/appointments',
  'appointments.update': '/appointments/{id}',
  'appointments.destroy': '/appointments/{id}',

  // ---- Admin: blog ----
  'posts.categories': '/posts/categories',
  'posts.categories.store': '/posts/categories',
  'posts.categories.destroy': '/posts/categories/{id}',
  'posts.tags': '/posts/tags',
  'posts.tags.store': '/posts/tags',
  'posts.tags.destroy': '/posts/tags/{id}',
  'posts.others': '/posts/others',
  'posts.index': '/posts',
  'posts.create': '/posts/create',
  'posts.store': '/posts',
  'posts.show': '/posts/{id}',
  'posts.edit': '/posts/{id}/edit',
  'posts.update': '/posts/{id}',
  'posts.destroy': '/posts/{id}',
  'posts.restore': '/posts/{id}/restore',
  'posts.force-delete': '/posts/{id}/force-delete',

  // ---- Admin: pages ----
  'pages.index': '/pages',
  'pages.create': '/pages/create',
  'pages.store': '/pages',
  'pages.show': '/pages/{id}',
  'pages.edit': '/pages/{id}/edit',
  'pages.update': '/pages/{id}',
  'pages.destroy': '/pages/{id}',
  'pages.builder': '/pages/{id}/builder',
  'pages.quick-draft': '/pages/quick-draft',

  // ---- Admin: media ----
  'media.index': '/media',
  'media.store': '/media',
  'media.update': '/media/{id}',
  'media.destroy': '/media/{id}',
  'media.download': '/media/{id}/download',
  'admin.api.media': '/admin-api/media',
  'admin.api.media.upload': '/admin-api/media/upload',
  'admin.api.media.bulk-destroy': '/admin-api/media/bulk-delete',
  'admin.api.media.rotate': '/admin-api/media/{id}/rotate',

  // ---- Admin: featured images ----
  'featured-images.index': '/featured-images',
  'featured-images.create': '/featured-images/create',
  'featured-images.store': '/featured-images',
  'featured-images.edit': '/featured-images/{id}/edit',
  'featured-images.update': '/featured-images/{id}',
  'featured-images.destroy': '/featured-images/{id}',
  'featured-images.reorder': '/featured-images/reorder',

  // ---- Admin: doctors ----
  'doctors.index': '/doctors-admin',
  'doctors.create': '/doctors/create',
  'doctors.store': '/doctors',
  'doctors.edit': '/doctors/{id}/edit',
  'doctors.update': '/doctors/{id}',
  'doctors.destroy': '/doctors/{id}',
  'doctors.reorder': '/doctors/reorder',
  'doctors.admin.settings': '/doctors-admin/settings',

  // ---- Admin: users / settings ----
  'users.index': '/users',
  'users.store': '/users',
  'users.update': '/users/{id}',
  'users.destroy': '/users/{id}',
  'settings.admin': '/settings-admin',
  'settings.admin.update': '/settings-admin',
  'settings.header-footer': '/settings/header-footer',
  'settings.header-footer.update': '/settings/header-footer',
  'settings.website-texts': '/settings/website-texts',
  'settings.website-texts.update': '/settings/website-texts',
  'menus.index': '/menus',
  'menus.store': '/menus',
  'menus.update': '/menus/{id}',
  'menus.destroy': '/menus/{id}',

  // ---- Admin: CMS modules ----
  'medicines.admin': '/medicines-admin',
  'medicines.admin.create': '/medicines-admin/create',
  'medicines.admin.store': '/medicines-admin',
  'medicines.admin.edit': '/medicines-admin/{id}/edit',
  'medicines.admin.update': '/medicines-admin/{id}',
  'medicines.admin.destroy': '/medicines-admin/{id}',
  'medicines.admin.reorder': '/medicines-admin/reorder',
  'services.admin': '/services-admin',
  'services.admin.create': '/services-admin/create',
  'services.admin.store': '/services-admin',
  'services.admin.edit': '/services-admin/{id}/edit',
  'services.admin.update': '/services-admin/{id}',
  'services.admin.destroy': '/services-admin/{id}',
  'services.admin.reorder': '/services-admin/reorder',
  'about.admin': '/about-cms',
  'about.admin.update': '/about-cms/save',
  'team.admin': '/team-admin',
  'team.admin.create': '/team-admin/create',
  'team.admin.store': '/team-admin',
  'team.admin.edit': '/team-admin/{id}/edit',
  'team.admin.update': '/team-admin/{id}',
  'team.admin.toggle': '/team-admin/{id}/toggle-active',
  'team.admin.destroy': '/team-admin/{id}',
  'team.admin.reorder': '/team-admin/reorder',
  'pricelist.admin': '/price-list-admin',
  'pricelist.admin.save': '/price-list-admin/save',
  'branch.admin': '/branch-admin',
  'branch.admin.store': '/branch-admin',
  'branch.admin.update': '/branch-admin/{id}',
  'branch.admin.destroy': '/branch-admin/{id}',
  'branch.admin.reorder': '/branch-admin/reorder',
  'homepage.admin': '/homepage-cms',
  'homepage.admin.content': '/homepage-cms/content',
  'homepage.admin.gallery.create': '/homepage-cms/gallery',
  'homepage.admin.gallery.update': '/homepage-cms/gallery/{id}',
  'homepage.admin.gallery.destroy': '/homepage-cms/gallery/{id}',
  'homepage.admin.gallery.reorder': '/homepage-cms/gallery/reorder',
  'homepage.admin.videos.create': '/homepage-cms/videos',
  'homepage.admin.videos.update': '/homepage-cms/videos/{id}',
  'homepage.admin.videos.destroy': '/homepage-cms/videos/{id}',
  'homepage.admin.videos.reorder': '/homepage-cms/videos/reorder',
  'homepage.admin.branches.update': '/homepage-cms/branches/{id}',
  'homepage.admin.branches.reorder': '/homepage-cms/branches/reorder',
  'homepage.admin.doctors.update': '/homepage-cms/doctors/{id}',
  'homepage.admin.doctors.reorder': '/homepage-cms/doctors/reorder',
  'homepage.admin.services.update': '/homepage-cms/services/{id}',
  'homepage.admin.services.reorder': '/homepage-cms/services/reorder',
  'redirects.index': '/redirects-admin',
  'redirects.store': '/redirects-admin',
  'redirects.update': '/redirects-admin/{id}',
  'redirects.destroy': '/redirects-admin/{id}',
  'redirects.toggle': '/redirects-admin/{id}/toggle',
  'ai-assistant.admin': '/ai-assistant',
  'ai-assistant.settings.update': '/ai-assistant/settings',
  'ai-assistant.rules.store': '/ai-assistant/rules',
  'ai-assistant.rules.update': '/ai-assistant/rules/{id}',
  'ai-assistant.rules.destroy': '/ai-assistant/rules/{id}',
  'ai-assistant.rules.toggle': '/ai-assistant/rules/{id}/toggle',
  'ai-assistant.test': '/ai-assistant/test-gemini',
  'ai-assistant.models': '/ai-assistant/fetch-models',
  'complaints.admin': '/complaints-admin',
  'complaints.admin.update': '/complaints-admin/{id}',
  'complaints.admin.destroy': '/complaints-admin/{id}',
  'patient-rights.admin': '/patient-rights-cms',
  'patient-rights.admin.settings': '/patient-rights-cms/settings',
  'patient-rights.admin.rights.store': '/patient-rights-cms/rights',
  'patient-rights.admin.rights.update': '/patient-rights-cms/rights/{id}',
  'patient-rights.admin.rights.destroy': '/patient-rights-cms/rights/{id}',
  'patient-rights.admin.rights.reorder': '/patient-rights-cms/rights/reorder',
  'patient-rights.admin.responsibilities.store': '/patient-rights-cms/responsibilities',
  'patient-rights.admin.responsibilities.update': '/patient-rights-cms/responsibilities/{id}',
  'patient-rights.admin.responsibilities.destroy': '/patient-rights-cms/responsibilities/{id}',
  'patient-rights.admin.responsibilities.reorder': '/patient-rights-cms/responsibilities/reorder',
  'how-to-pay.admin': '/how-to-pay-cms',
  'how-to-pay.admin.settings': '/how-to-pay-cms/settings',
  'how-to-pay.admin.methods': '/how-to-pay-cms/methods',
  'how-to-pay.admin.branches': '/how-to-pay-cms/branches',
  'pricing.index': '/pricing',
  'locations.index': '/locations',
};

function currentPath(): string {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname || '/';
}

/** Turn `/posts/{id}/edit` into a regex that captures the parameters. */
function patternToRegex(pattern: string) {
  const names: string[] = [];
  const parts = pattern.replace(/\/+$/, '').split(/(\{[a-zA-Z0-9_]+\})/);
  const source = parts
    .map((part) => {
      const token = part.match(/^\{([a-zA-Z0-9_]+)\}$/);
      if (token) {
        names.push(token[1]);
        return '([^/]+)';
      }
      return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('');
  return { regex: new RegExp(`^${source || '/'}/?$`), names };
}

/** Best-effort name lookup for the current URL (used by route().current()). */
export function matchRouteName(pathname = currentPath()): string | null {
  const clean = pathname.replace(/\/+$/, '') || '/';
  let best: { name: string; score: number } | null = null;
  for (const [name, pattern] of Object.entries(ROUTES)) {
    const { regex } = patternToRegex(pattern);
    if (regex.test(clean)) {
      const literal = pattern.replace(/\{[^}]+\}/g, '');
      const score = literal.length;
      if (!best || score > best.score) best = { name, score };
    }
  }
  return best?.name || null;
}

function fillParams(pattern: string, params: Params): { path: string; rest: Array<[string, any]> } {
  const used = new Set<string>();
  const rest: Array<[string, any]> = [];
  const positional = Array.isArray(params) ? params : null;
  let index = 0;

  const path = pattern.replace(/\{([a-zA-Z0-9_]+)\}/g, (_m, key: string) => {
    if (positional) {
      const value = positional[index++];
      used.add(String(index - 1));
      return encodeURIComponent(String(value ?? ''));
    }
    if (params && typeof params === 'object' && key in params) {
      used.add(key);
      const value = (params as Record<string, any>)[key];
      return encodeURIComponent(String(value ?? ''));
    }
    return '';
  });

  if (params && typeof params === 'object' && !Array.isArray(params)) {
    for (const [key, value] of Object.entries(params)) {
      if (used.has(key) || value === undefined || value === null || value === '') continue;
      rest.push([key, value]);
    }
  } else if (positional) {
    for (; index < positional.length; index++) {
      const value = positional[index];
      if (value === undefined || value === null || value === '') continue;
      rest.push([String(index), value]);
    }
  }

  return { path, rest };
}

function appendQuery(path: string, rest: Array<[string, any]>): string {
  if (!rest.length) return path;
  const query = new URLSearchParams();
  for (const [key, value] of rest) {
    if (Array.isArray(value)) value.forEach((item) => query.append(`${key}[]`, String(item)));
    else if (typeof value === 'object' && value !== null) query.append(key, JSON.stringify(value));
    else query.append(key, String(value));
  }
  const qs = query.toString();
  if (!qs) return path;
  return `${path}${path.includes('?') ? '&' : '?'}${qs}`;
}

/** Ziggy-compatible `current()`: supports `posts.*` wildcards, names or paths. */
export function currentMatches(pattern?: string): boolean {
  const path = currentPath();
  if (!pattern) return false;
  const name = matchRouteName(path);
  if (pattern.includes('*')) {
    const prefix = pattern.replace(/\*$/, '');
    if (name && name.startsWith(prefix)) return true;
    return path.startsWith(prefix);
  }
  if (name === pattern) return true;
  const mapped = ROUTES[pattern];
  if (mapped) {
    const { regex } = patternToRegex(mapped);
    if (regex.test(path.replace(/\/+$/, '') || '/')) return true;
  }
  return path === pattern || path.startsWith(pattern.replace(/\/+$/, '') + '/');
}

export type RouteObject = {
  url: string;
  toString(): string;
  valueOf(): string;
  current(pattern?: string): string | false;
};

export function makeRouteObject(url: string): RouteObject {
  return {
    url,
    toString() {
      return url;
    },
    valueOf() {
      return url;
    },
    current(pattern?: string) {
      if (!pattern) return matchRouteName() || false;
      return currentMatches(pattern) ? matchRouteName() || false : false;
    },
  };
}

export function buildRoute(name: string, params?: Params): string {
  if (!name) return currentPath();
  if (name.startsWith('/')) return name;
  const pattern = ROUTES[name] ?? `/${name.replace(/\./g, '/')}`;
  const { path, rest } = fillParams(pattern, params);
  return appendQuery(path || '/', rest);
}

export function routeFunction(name?: string, params?: Params): any {
  if (!name) {
    return {
      url: currentPath(),
      current: (pattern?: string) => {
        if (!pattern) return matchRouteName() || currentPath();
        return currentMatches(pattern) ? matchRouteName() || currentPath() : false;
      },
      toString: () => currentPath(),
      valueOf: () => currentPath(),
    };
  }
  return makeRouteObject(buildRoute(name, params));
}

if (typeof globalThis !== 'undefined') {
  (globalThis as any).route = routeFunction;
}

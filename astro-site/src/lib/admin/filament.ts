/**
 * Laravel also ships a secondary Filament panel at `/admin`. The Astro port
 * reproduces the primary React/Inertia admin (from `/dashboard`), so the
 * Filament entry points are mapped onto the equivalent screens instead of
 * being left as 404s.
 */
export function filamentTarget(pathname: string): string {
  const path = '/' + String(pathname || '').replace(/^\/+/, '').replace(/\/+$/, '');

  const rules: Array<[RegExp, (match: RegExpMatchArray) => string]> = [
    [/^\/admin\/posts\/create$/, () => '/posts/create'],
    [/^\/admin\/posts\/(\d+)\/edit$/, (m) => `/posts/${m[1]}/edit`],
    [/^\/admin\/posts(?:\/.*)?$/, () => '/posts'],

    [/^\/admin\/pages\/create$/, () => '/pages/create'],
    [/^\/admin\/pages\/(\d+)\/edit$/, (m) => `/pages/${m[1]}/edit`],
    [/^\/admin\/pages(?:\/.*)?$/, () => '/pages'],

    [/^\/admin\/doctors\/create$/, () => '/doctors/create'],
    [/^\/admin\/doctors\/(\d+)\/edit$/, (m) => `/doctors/${m[1]}/edit`],
    [/^\/admin\/doctors(?:\/.*)?$/, () => '/doctors-admin'],

    [/^\/admin\/featured-images\/create$/, () => '/featured-images/create'],
    [/^\/admin\/featured-images\/(\d+)\/edit$/, (m) => `/featured-images/${m[1]}/edit`],
    [/^\/admin\/featured-images(?:\/.*)?$/, () => '/featured-images'],

    [/^\/admin\/appointments(?:\/.*)?$/, () => '/appointments'],
    [/^\/admin\/locations(?:\/.*)?$/, () => '/branch-admin'],
    [/^\/admin\/pricings(?:\/.*)?$/, () => '/price-list-admin'],
  ];

  for (const [pattern, target] of rules) {
    const match = path.match(pattern);
    if (match) return target(match);
  }

  return '/dashboard';
}

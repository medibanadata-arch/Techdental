import {
  all,
  get,
  insertRow,
  nowSql,
  readBody,
  successRedirect,
  updateRow,
  deleteRow,
  validationError,
  type Body,
} from '../http';

/**
 * Navigation menu builder, ported from NavMenuController. `items_json` is a
 * raw JSON string column (NavMenu has no casts).
 */

function slugify(value: string): string {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** PHP json_encode() escapes forward slashes by default. */
function phpJson(value: any): string {
  return JSON.stringify(value).replace(/\//g, '\\/');
}

const DEFAULT_ITEMS = [
  { id: '1', title: 'Home', url: '/', type: 'custom' },
  { id: '2', title: 'About Tech Dental', url: '/about-tech-dental', type: 'custom' },
  { id: '3', title: 'Branches & Schedules', url: '/mirpur-branch', type: 'custom' },
];

/** Seed the default header menu and backfill page_id references. */
export function prepareMenus(): any[] {
  let rows = all<any>('SELECT * FROM nav_menus ORDER BY created_at DESC');
  if (!rows.length) {
    const now = nowSql();
    const id = insertRow('nav_menus', {
      name: 'Primary Header Navigation',
      slug: 'primary-header-navigation',
      location: 'header',
      items_json: phpJson(DEFAULT_ITEMS),
      created_at: now,
      updated_at: now,
    });
    rows = all<any>('SELECT * FROM nav_menus WHERE id = ?', [id]);
  }

  const pages = all<any>('SELECT id, slug FROM pages');
  const bySlug: Record<string, any> = {};
  for (const page of pages) bySlug[page.slug] = page;

  for (const menu of rows) {
    let items: any[] = [];
    try {
      items = JSON.parse(menu.items_json || '[]') || [];
    } catch {
      items = [];
    }
    if (!Array.isArray(items)) items = [];

    let changed = false;
    for (const item of items) {
      if (!item || typeof item !== 'object') continue;
      if (!item.page_id && item.url) {
        if (String(item.url).startsWith('/page/')) {
          const slug = String(item.url).slice(6);
          if (bySlug[slug]) {
            item.page_id = bySlug[slug].id;
            changed = true;
          } else if (slug === 'mirpur' && bySlug['branch-mirpur']) {
            item.page_id = bySlug['branch-mirpur'].id;
            item.url = '/page/branch-mirpur';
            changed = true;
          }
        } else if (item.url === '/' && bySlug['home']) {
          item.page_id = bySlug['home'].id;
          changed = true;
        }
      }
    }

    if (changed) {
      // JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
      menu.items_json = JSON.stringify(items);
      updateRow('nav_menus', menu.id, { items_json: menu.items_json, updated_at: nowSql() });
    }
  }
  return rows;
}

export function menusPageProps() {
  const menus = prepareMenus();
  const postsList = all('SELECT id, title, slug FROM posts');
  const customPages = all<any>('SELECT id, title, slug FROM pages').map((page) => ({
    id: page.id,
    title: page.title,
    url: page.slug === 'home' ? '/' : '/page/' + page.slug,
  }));
  return { menus, postsList, customPages };
}

function validateMenu(body: Body): Record<string, string[]> | null {
  const errors: Record<string, string[]> = {};
  if (!body.name || typeof body.name === 'object') {
    errors.name = ['The name field is required.'];
  } else if (String(body.name).length > 255) {
    errors.name = ['The name field must not be greater than 255 characters.'];
  }
  for (const field of ['location', 'items_json']) {
    if (body[field] !== null && body[field] !== undefined && typeof body[field] === 'object') {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must be a string.`];
    }
  }
  return Object.keys(errors).length ? errors : null;
}

function uniqueSlug(name: string, excludeId?: number): string {
  const base = slugify(name) || 'menu';
  let slug = base;
  let count = 1;
  while (
    get('SELECT id FROM nav_menus WHERE slug = ?' + (excludeId ? ' AND id != ?' : ''), [
      slug,
      ...(excludeId ? [excludeId] : []),
    ])
  ) {
    slug = `${base}-${count++}`;
  }
  return slug;
}

export async function handleMenuStore(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors = validateMenu(body);
  if (errors) return validationError(errors);

  const name = String(body.name);
  const data: Record<string, any> = {
    name,
    slug: uniqueSlug(name),
    items_json: !body.items_json ? '[]' : String(body.items_json),
    created_at: nowSql(),
    updated_at: nowSql(),
  };
  if ('location' in body) {
    data.location = body.location === null || body.location === undefined ? null : String(body.location);
  }

  insertRow('nav_menus', data);
  return successRedirect('/menus', { message: 'Menu created successfully.' });
}

export async function handleMenuUpdate(request: Request, id: number): Promise<Response> {
  const menu = get<any>('SELECT * FROM nav_menus WHERE id = ?', [id]);
  if (!menu) return new Response('Not Found', { status: 404 });

  const body = await readBody(request);
  const errors = validateMenu(body);
  if (errors) return validationError(errors);

  const name = String(body.name);
  const data: Record<string, any> = {
    name,
    updated_at: nowSql(),
  };
  if ('location' in body) {
    data.location = body.location === null || body.location === undefined ? null : String(body.location);
  }
  if ('items_json' in body) {
    data.items_json =
      body.items_json === null || body.items_json === undefined ? null : String(body.items_json);
  }
  if (menu.name !== name) data.slug = uniqueSlug(name, id);

  updateRow('nav_menus', id, data);
  return successRedirect('/menus', { message: 'Menu updated successfully.' });
}

export async function handleMenuDestroy(_request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM nav_menus WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });
  deleteRow('nav_menus', id);
  return successRedirect('/menus', { message: 'Menu deleted successfully.' });
}

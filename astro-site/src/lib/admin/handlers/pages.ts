import {
  all,
  deleteRow,
  get,
  insertRow,
  jsonField,
  nowSql,
  optionalStr,
  readBody,
  run,
  str,
  successRedirect,
  updateRow,
  validationError,
  type Body,
} from '../http';

/**
 * Custom pages + visual builder, ported from PageController (including the
 * menu/link synchronisation and automatic 301 when the slug changes).
 */

function slugify(value: string): string {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

const REDIRECT_MAP: Record<string, string> = {
  home: '/',
  services: '/services',
  'price-list': '/price-list',
  doctors: '/doctors',
  medicines: '/medicines',
  branches: '/branches',
  'branch-mirpur': '/branch/mirpur',
  mirpur: '/branch/mirpur',
  'branch-uttara': '/branch/uttara',
  uttara: '/branch/uttara',
  'branch-badda': '/branch/badda',
  badda: '/branch/badda',
  'branch-jatrabari': '/branch/jatrabari',
  jatrabari: '/branch/jatrabari',
  about: '/about',
  team: '/team',
  blog: '/blog',
  appointment: '/appointment',
};

function normaliseSlug(title: string, slug: string): string {
  return slug ? slugify(slug) : slugify(title);
}

export async function handlePageStore(request: Request): Promise<Response> {
  const body = await readBody(request);
  const title = str(body.title).trim();
  const errors: Record<string, string[]> = {};
  if (!title) errors.title = ['The title field is required.'];
  if (title.length > 255) errors.title = ['The title field must not be greater than 255 characters.'];
  if (str(body.slug).length > 255) errors.slug = ['The slug field must not be greater than 255 characters.'];
  if (Object.keys(errors).length) return validationError(errors);

  const data: Record<string, any> = {
    title,
    slug: normaliseSlug(title, str(body.slug)),
    content: body.content === undefined || body.content === null ? '' : str(body.content),
    created_at: nowSql(),
    updated_at: nowSql(),
  };
  if ('blocks' in body) data.blocks = JSON.stringify(jsonField(body.blocks, []));

  insertRow('pages', data);
  return successRedirect('/pages', { message: 'Page created successfully' });
}

export async function handlePageQuickDraft(request: Request): Promise<Response> {
  const body = await readBody(request);
  let title = str(body.title).trim();
  if (!title) title = 'Untitled Page';

  const base = slugify(title);
  let slug = base;
  let count = 1;
  while (get('SELECT id FROM pages WHERE slug = ?', [slug])) {
    slug = `${base}-${count++}`;
  }

  const id = insertRow('pages', {
    title,
    slug,
    content: body.content === undefined ? '' : str(body.content),
    created_at: nowSql(),
    updated_at: nowSql(),
  });

  return successRedirect(`/pages/${id}/builder`, { message: 'Draft created.' });
}

/** Update menu entries and inline links after a page title/slug change. */
function syncPageToMenusAndLinks(pageId: number, oldTitle: string, oldSlug: string, newTitle: string, newSlug: string): void {
  let newUrl: string;
  if (newSlug === 'home') newUrl = '/';
  else if (REDIRECT_MAP[newSlug]) newUrl = REDIRECT_MAP[newSlug];
  else newUrl = `/page/${newSlug}`;

  const oldUrls = new Set<string>([`/page/${oldSlug}`, `/${oldSlug}`]);
  if (oldSlug === 'home') {
    oldUrls.add('/');
    oldUrls.add('/home');
  }
  if (REDIRECT_MAP[oldSlug]) oldUrls.add(REDIRECT_MAP[oldSlug]);
  if (oldSlug.startsWith('branch-')) {
    const short = oldSlug.replace('branch-', '');
    oldUrls.add(`/branch/${short}`);
    oldUrls.add(`/page/${short}`);
  }
  const oldList = Array.from(oldUrls).filter(Boolean);
  const clean = (value: string) => String(value || '').replace(/\/+$/, '').toLowerCase();

  // 1. Menus
  for (const menu of all<any>('SELECT * FROM nav_menus')) {
    const items = jsonField(menu.items_json, []) as any[];
    let changed = false;
    for (const item of items) {
      if (!item || typeof item !== 'object') continue;
      let isMatch = false;
      if (item.page_id && Number(item.page_id) === Number(pageId)) isMatch = true;
      if (!isMatch && item.url) {
        const itemUrl = clean(item.url);
        if (oldList.some((url) => clean(url) === itemUrl)) isMatch = true;
      }
      if (!isMatch && item.title) {
        if (String(item.title).trim().toLowerCase() === String(oldTitle).trim().toLowerCase()) isMatch = true;
      }
      if (isMatch) {
        item.page_id = pageId;
        item.title = newTitle;
        item.url = newUrl;
        changed = true;
      }
    }
    if (changed) {
      run('UPDATE nav_menus SET items_json = ?, updated_at = ? WHERE id = ?', [
        JSON.stringify(items),
        nowSql(),
        menu.id,
      ]);
    }
  }

  // 2. Inline links inside other pages and posts
  if (oldSlug !== newSlug || oldTitle !== newTitle) {
    const replaceLinks = (content: string): string => {
      let updated = content;
      for (const url of oldList) {
        updated = updated.split(`href="${url}"`).join(`href="${newUrl}"`);
        updated = updated.split(`href='${url}'`).join(`href='${newUrl}'`);
      }
      return updated;
    };

    for (const other of all<any>('SELECT id, content FROM pages WHERE id <> ?', [pageId])) {
      if (!other.content) continue;
      const updated = replaceLinks(String(other.content));
      if (updated !== other.content) {
        run('UPDATE pages SET content = ?, updated_at = ? WHERE id = ?', [updated, nowSql(), other.id]);
      }
    }

    for (const post of all<any>('SELECT id, content FROM posts')) {
      if (!post.content) continue;
      const updated = replaceLinks(String(post.content));
      if (updated !== post.content) {
        run('UPDATE posts SET content = ?, updated_at = ? WHERE id = ?', [updated, nowSql(), post.id]);
      }
    }
  }
}

export async function handlePageUpdate(request: Request, id: number): Promise<Response> {
  const existing = get<any>('SELECT * FROM pages WHERE id = ?', [id]);
  if (!existing) return new Response('Not Found', { status: 404 });

  const body = await readBody(request);
  const title = str(body.title).trim();
  const errors: Record<string, string[]> = {};
  if (!title) errors.title = ['The title field is required.'];
  if (title.length > 255) errors.title = ['The title field must not be greater than 255 characters.'];
  if (str(body.slug).length > 255) errors.slug = ['The slug field must not be greater than 255 characters.'];
  if (str(body.seo_title).length > 255) errors.seo_title = ['The seo title field must not be greater than 255 characters.'];
  if (Object.keys(errors).length) return validationError(errors);

  const slug = normaliseSlug(title, str(body.slug));
  const data: Record<string, any> = {
    title,
    slug,
    content: body.content === undefined || body.content === null ? '' : str(body.content),
    updated_at: nowSql(),
  };

  if ('blocks' in body) data.blocks = JSON.stringify(jsonField(body.blocks, []));
  for (const field of ['seo_title', 'meta_desc', 'canonical_url', 'schema_type', 'schema_json']) {
    if (field in body) data[field] = optionalStr(body[field]);
  }
  if ('faqs' in body) data.faqs = JSON.stringify(jsonField(body.faqs, []));
  for (const field of ['robots_index', 'robots_follow']) {
    if (field in body) {
      const value = body[field];
      data[field] = value === true || value === 1 || value === '1' || value === 'true' || value === 'on' ? 1 : 0;
    }
  }

  const oldTitle = String(existing.title || '');
  const oldSlug = String(existing.slug || '');

  updateRow('pages', id, data);

  if (oldSlug && oldSlug !== slug) {
    const source = `/page/${oldSlug}`;
    if (!get('SELECT id FROM redirects WHERE source_url = ?', [source])) {
      insertRow('redirects', {
        source_url: source,
        target_url: `/page/${slug}`,
        status_code: 301,
        is_active: 1,
        hits: 0,
        created_at: nowSql(),
        updated_at: nowSql(),
      });
    }
  }

  syncPageToMenusAndLinks(id, oldTitle, oldSlug, title, slug);
  return successRedirect('/pages', { message: 'Page and linked menus updated successfully' });
}

export async function handlePageDestroy(_request: Request, id: number): Promise<Response> {
  const page = get<any>('SELECT * FROM pages WHERE id = ?', [id]);
  if (!page) return new Response('Not Found', { status: 404 });

  for (const menu of all<any>('SELECT * FROM nav_menus')) {
    const items = (jsonField(menu.items_json, []) as any[]) || [];
    const filtered = items.filter((item) => {
      if (!item || typeof item !== 'object') return true;
      if (item.page_id && Number(item.page_id) === Number(page.id)) return false;
      const target = `/page/${page.slug}`;
      if (item.url && (item.url === target || item.url === `/${page.slug}`)) return false;
      return true;
    });
    if (filtered.length !== items.length) {
      run('UPDATE nav_menus SET items_json = ?, updated_at = ? WHERE id = ?', [
        JSON.stringify(filtered),
        nowSql(),
        menu.id,
      ]);
    }
  }

  deleteRow('pages', id);
  return successRedirect('/pages', { message: 'Page deleted and removed from menus' });
}

import {
  deleteRow,
  get,
  insertRow,
  jsonResponse,
  nowSql,
  optionalStr,
  readBody,
  str,
  successRedirect,
  updateRow,
  validationError,
  type Body,
} from '../http';

/** Featured slider images, ported from FeaturedImageController. */

function defaultBadge(branch: string): string {
  return branch === 'homepage' ? 'Homepage' : branch.charAt(0).toUpperCase() + branch.slice(1);
}

function digitsOnly(value: any): number {
  return Number(String(value ?? '').replace(/[^0-9]/g, '')) || 0;
}

function truthy(value: any): boolean {
  return value === true || value === 1 || value === '1' || value === 'true' || value === 'on' || value === 'yes';
}

export async function handleFeaturedImageStore(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors: Record<string, string[]> = {};
  if (!str(body.src)) errors.src = ['The src field is required.'];
  if (!str(body.branch)) errors.branch = ['The branch field is required.'];
  if (Object.keys(errors).length) return validationError(errors);

  const branch = str(body.branch);
  // Laravel's `empty(sort_order)` means both "missing" and 0 fall back to count+1.
  let sortOrder = body.sort_order === undefined || body.sort_order === null || body.sort_order === ''
    ? 0
    : Number(body.sort_order);
  if (!sortOrder) {
    const count = get<any>('SELECT COUNT(*) AS c FROM featured_images');
    sortOrder = Number(count?.c || 0) + 1;
  }

  const data: Record<string, any> = {
    title: optionalStr(body.title),
    src: str(body.src),
    badge: optionalStr(body.badge) || defaultBadge(branch),
    branch,
    alt: optionalStr(body.alt),
    sort_order: sortOrder,
    view_count: 'view_count' in body ? digitsOnly(body.view_count) : 1000,
    real_views: 0,
    created_at: nowSql(),
    updated_at: nowSql(),
  };
  if ('type' in body) data.type = optionalStr(body.type);
  if ('is_active' in body) data.is_active = truthy(body.is_active) ? 1 : 0;

  insertRow('featured_images', data);

  return successRedirect(`/featured-images?branch=${encodeURIComponent(branch)}`, {
    message: 'Slider image added successfully',
  });
}

export async function handleFeaturedImageUpdate(request: Request, id: number): Promise<Response> {
  const image = get('SELECT * FROM featured_images WHERE id = ?', [id]);
  if (!image) return new Response('Not Found', { status: 404 });
  const body = await readBody(request);

  const errors: Record<string, string[]> = {};
  if (!str(body.src)) errors.src = ['The src field is required.'];
  if (!str(body.branch)) errors.branch = ['The branch field is required.'];
  if (Object.keys(errors).length) return validationError(errors);

  const branch = str(body.branch);
  const data: Record<string, any> = {
    // badge is always recomputed when empty (Laravel's empty() also matches missing keys)
    badge: optionalStr(body.badge) || defaultBadge(branch),
    updated_at: nowSql(),
  };
  for (const field of ['title', 'src', 'branch', 'alt', 'type']) {
    if (field in body) data[field] = optionalStr(body[field]);
  }
  if ('sort_order' in body) {
    data.sort_order =
      body.sort_order === undefined || body.sort_order === null || body.sort_order === ''
        ? null
        : Number(body.sort_order);
  }
  if ('is_active' in body) data.is_active = truthy(body.is_active) ? 1 : 0;
  if ('view_count' in body) data.view_count = digitsOnly(body.view_count);

  updateRow('featured_images', id, data);

  return successRedirect(`/featured-images?branch=${encodeURIComponent(branch)}`, {
    message: 'Slider image updated successfully',
  });
}

export async function handleFeaturedImageDestroy(_request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM featured_images WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });
  deleteRow('featured_images', id);
  return successRedirect('/featured-images', { message: 'Featured image deleted successfully' });
}

export async function handleFeaturedImageReorder(request: Request): Promise<Response> {
  const body: Body = await readBody(request);
  const items = Array.isArray(body.items) ? body.items : [];
  for (const item of items) {
    if (item && item.id !== undefined && item.sort_order !== undefined) {
      updateRow('featured_images', Number(item.id), { sort_order: Number(item.sort_order), updated_at: nowSql() });
    }
  }
  return jsonResponse({ success: true, message: 'Slider order updated.' });
}

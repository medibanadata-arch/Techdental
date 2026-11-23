import {
  all,
  deleteRow,
  get,
  insertRow,
  jsonField,
  jsonResponse,
  nowSql,
  readBody,
  successRedirect,
  updateRow,
  validationError,
  type Body,
} from '../http';

/**
 * Homepage CMS, ported from HomeContentController. One page (`/homepage-cms`)
 * drives seven tabs: gallery/slider, YouTube videos, page texts, branches,
 * services, doctors and about/SEO. Gallery rows live in `featured_images`,
 * branches in `locations`, services in `pricing` (query builder, no timestamps)
 * and videos in `home_videos`.
 */

/* ------------------------------------------------------------------ helpers */

function isArrayLike(value: any): boolean {
  return Array.isArray(value) || (value !== null && typeof value === 'object');
}

function isBooleanLike(value: any): boolean {
  return value === true || value === false || value === 0 || value === 1 || value === '0' || value === '1';
}

function isIntegerLike(value: any): boolean {
  if (value === null || value === undefined || typeof value === 'boolean' || typeof value === 'object') {
    return false;
  }
  return /^[+-]?\d+$/.test(String(value).trim());
}

function flagValue(value: any): number {
  return value === true || value === 1 || value === '1' || value === 'true' ? 1 : 0;
}

/** `array_filter($validated, fn ($v) => $v !== null)` – nulls are dropped. */
function withoutNulls(data: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== null) out[key] = value;
  }
  return out;
}

/** Extract the 11-character YouTube id from a URL or raw id. */
export function extractYouTubeId(url: any): string | null {
  if (url === null || url === undefined || url === '') return null;
  const trimmed = String(url).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : null;
}

/* --------------------------------------------------------------- page props */

export function homepageContentRow(): any {
  let row = get<any>('SELECT * FROM home_content ORDER BY id LIMIT 1');
  if (!row) {
    const now = nowSql();
    const id = insertRow('home_content', { created_at: now, updated_at: now });
    row = get<any>('SELECT * FROM home_content WHERE id = ?', [id]);
  }
  return row;
}

export function homepagePageProps() {
  const content = homepageContentRow();

  // Initialise sort/rank orders when every row is still 0 (mirrors index()).
  let services = all<any>('SELECT * FROM pricing ORDER BY sort_order, id');
  if (!services.some((service) => Number(service.sort_order) > 0)) {
    services.forEach((service, index) => {
      updateRow('pricing', service.id, { sort_order: index + 1 });
    });
    services = all<any>('SELECT * FROM pricing ORDER BY sort_order, id');
  }

  let doctors = all<any>('SELECT * FROM doctors ORDER BY rank_order, id');
  if (!doctors.some((doctor) => Number(doctor.rank_order) > 0)) {
    doctors.forEach((doctor, index) => {
      updateRow('doctors', doctor.id, { rank_order: index + 1, updated_at: nowSql() });
    });
    doctors = all<any>('SELECT * FROM doctors ORDER BY rank_order, id');
  }

  let branches = all<any>('SELECT * FROM locations ORDER BY sort_order, id');
  if (!branches.some((branch) => Number(branch.sort_order) > 0)) {
    branches.forEach((branch, index) => {
      updateRow('locations', branch.id, { sort_order: index + 1, updated_at: nowSql() });
    });
    branches = all<any>('SELECT * FROM locations ORDER BY sort_order, id');
  }

  const gallery = all<any>(
    "SELECT * FROM featured_images WHERE (branch = 'homepage' OR branch = 'all' OR branch IS NULL OR branch = '') ORDER BY sort_order, id"
  );
  const videos = all<any>('SELECT * FROM home_videos ORDER BY sort_order, id');
  const posts = all<any>(
    "SELECT * FROM posts WHERE status IS NULL OR status != 'trash' ORDER BY id DESC LIMIT 12"
  );

  return { content, gallery, branches, doctors, services, videos, posts };
}

/* ---------------------------------------------------------------- save content */

const CONTENT_STRING_FIELDS = [
  'header_logo',
  'brand_name_line1',
  'brand_name_line2',
  'seo_title',
  'meta_desc',
  'canonical_url',
  'schema_type',
  'schema_json',
  'about_text',
  'about_image',
  'about_caption',
];

export async function handleHomepageContentSave(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors: Record<string, string[]> = {};

  for (const field of CONTENT_STRING_FIELDS) {
    if (field in body && body[field] !== null && body[field] !== undefined && typeof body[field] === 'object') {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must be a string.`];
    }
  }
  for (const field of ['robots_index', 'robots_follow']) {
    if (field in body && body[field] !== null && body[field] !== undefined && !isBooleanLike(body[field])) {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must be true or false.`];
    }
  }
  for (const field of ['faqs', 'homepage_texts']) {
    if (field in body && body[field] !== null && body[field] !== undefined && !isArrayLike(body[field])) {
      errors[field] = [`The ${field} field must be an array.`];
    }
  }
  if (Object.keys(errors).length) return validationError(errors);

  const content = homepageContentRow();
  const data: Record<string, any> = { updated_at: nowSql() };

  for (const field of CONTENT_STRING_FIELDS) {
    if (field in body) {
      const value = body[field];
      data[field] = value === undefined || value === null ? null : String(value);
    }
  }
  for (const field of ['robots_index', 'robots_follow']) {
    if (field in body) {
      data[field] = body[field] === null || body[field] === undefined ? null : flagValue(body[field]);
    }
  }
  for (const field of ['faqs', 'homepage_texts']) {
    if (field in body) {
      data[field] = body[field] === null || body[field] === undefined ? null : JSON.stringify(jsonField(body[field], []));
    }
  }

  updateRow('home_content', content.id, data);
  return successRedirect('/homepage-cms', {
    message: 'Homepage content & settings saved successfully!',
  });
}

/* ------------------------------------------------------------------- gallery */

function galleryPayload(body: Body): Record<string, any> {
  const data: Record<string, any> = {};
  for (const field of ['title', 'src', 'badge', 'alt', 'view_count']) {
    if (field in body) {
      const value = body[field];
      data[field] = value === undefined || value === null || typeof value === 'object' ? null : String(value);
    }
  }
  if ('is_active' in body) {
    data.is_active = body.is_active === null || body.is_active === undefined ? null : flagValue(body.is_active);
  }
  return data;
}

export async function handleHomepageGalleryStore(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors: Record<string, string[]> = {};
  for (const field of ['title', 'src', 'badge', 'alt', 'view_count']) {
    if (field in body && body[field] !== null && body[field] !== undefined && typeof body[field] === 'object') {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must be a string.`];
    }
  }
  if ('is_active' in body && body.is_active !== null && body.is_active !== undefined && !isBooleanLike(body.is_active)) {
    errors.is_active = ['The is active field must be true or false.'];
  }
  if (Object.keys(errors).length) return validationError(errors);

  const data = withoutNulls(galleryPayload(body));
  data.branch = 'homepage';
  data.badge = 'Homepage';
  data.sort_order = (Number(get<any>('SELECT MAX(sort_order) AS m FROM featured_images')?.m) || 0) + 1;
  if ('view_count' in data) {
    data.view_count = parseInt(String(data.view_count).replace(/[^\d]/g, ''), 10) || 0;
  }
  if (!data.src) data.src = '';

  insertRow('featured_images', {
    ...data,
    created_at: nowSql(),
    updated_at: nowSql(),
  });
  return successRedirect('/homepage-cms', { message: 'Gallery image added.' });
}

export async function handleHomepageGalleryUpdate(request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM featured_images WHERE id = ?', [id])) {
    return new Response('Not Found', { status: 404 });
  }

  const body = await readBody(request);
  const errors: Record<string, string[]> = {};
  for (const field of ['title', 'src', 'badge', 'alt', 'view_count']) {
    if (field in body && body[field] !== null && body[field] !== undefined && typeof body[field] === 'object') {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must be a string.`];
    }
  }
  if ('is_active' in body && body.is_active !== null && body.is_active !== undefined && !isBooleanLike(body.is_active)) {
    errors.is_active = ['The is active field must be true or false.'];
  }
  if ('sort_order' in body && body.sort_order !== null && body.sort_order !== undefined && !isIntegerLike(body.sort_order)) {
    errors.sort_order = ['The sort order must be an integer.'];
  }
  if (Object.keys(errors).length) return validationError(errors);

  const data = withoutNulls(galleryPayload(body));
  if ('sort_order' in body && body.sort_order !== null) data.sort_order = Math.trunc(Number(body.sort_order));
  if ('view_count' in data) {
    data.view_count = parseInt(String(data.view_count).replace(/[^\d]/g, ''), 10) || 0;
  }

  updateRow('featured_images', id, { ...data, updated_at: nowSql() });
  return successRedirect('/homepage-cms', { message: 'Gallery image updated.' });
}

export async function handleHomepageGalleryDestroy(_request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM featured_images WHERE id = ?', [id])) {
    return new Response('Not Found', { status: 404 });
  }
  deleteRow('featured_images', id);
  return successRedirect('/homepage-cms', { message: 'Gallery image deleted.' });
}

export async function handleHomepageGalleryReorder(request: Request): Promise<Response> {
  const body = await readBody(request);
  const items = Array.isArray(body.items) ? body.items : [];
  for (const item of items) {
    if (item && item.id !== undefined && item.id !== null && item.sort_order !== undefined && item.sort_order !== null) {
      updateRow('featured_images', item.id, { sort_order: Math.trunc(Number(item.sort_order)), updated_at: nowSql() });
    }
  }
  return successRedirect('/homepage-cms', { message: 'Gallery order updated.' });
}

/* -------------------------------------------------------------------- videos */

const VIDEO_STRING_FIELDS = ['title', 'youtube_url', 'branch'];

function videoStringPayload(body: Body): Record<string, any> {
  const data: Record<string, any> = {};
  for (const field of VIDEO_STRING_FIELDS) {
    if (field in body) {
      const value = body[field];
      data[field] = value === undefined || value === null || typeof value === 'object' ? null : String(value);
    }
  }
  if ('is_active' in body) {
    data.is_active = body.is_active === null || body.is_active === undefined ? null : flagValue(body.is_active);
  }
  return data;
}

function videoValidation(body: Body, requireUrl: boolean): Record<string, string[]> | null {
  const errors: Record<string, string[]> = {};
  for (const field of VIDEO_STRING_FIELDS) {
    if (field in body && body[field] !== null && body[field] !== undefined && typeof body[field] === 'object') {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must be a string.`];
    }
  }
  if ('is_active' in body && body.is_active !== null && body.is_active !== undefined && !isBooleanLike(body.is_active)) {
    errors.is_active = ['The is active field must be true or false.'];
  }
  if ('sort_order' in body && body.sort_order !== null && body.sort_order !== undefined && !isIntegerLike(body.sort_order)) {
    errors.sort_order = ['The sort order must be an integer.'];
  }
  if (requireUrl && (body.youtube_url === null || body.youtube_url === undefined || body.youtube_url === '')) {
    errors.youtube_url = ['The youtube url field is required.'];
  }
  return Object.keys(errors).length ? errors : null;
}

export async function handleHomepageVideoStore(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors = videoValidation(body, true);
  if (errors) return validationError(errors);

  const videoId = extractYouTubeId(body.youtube_url);
  if (!videoId) {
    return jsonResponse({
      success: false,
      redirect: '/homepage-cms',
      message: 'Please enter a valid YouTube video URL (e.g. https://www.youtube.com/watch?v=...)',
    });
  }

  const title = body.title === null || body.title === undefined ? null : String(body.title);
  const branch = body.branch === null || body.branch === undefined ? null : String(body.branch);
  const isActive =
    body.is_active === null || body.is_active === undefined ? 1 : flagValue(body.is_active);
  const sortOrder =
    body.sort_order === null || body.sort_order === undefined
      ? (Number(get<any>('SELECT MAX(sort_order) AS m FROM home_videos')?.m) || 0) + 1
      : Math.trunc(Number(body.sort_order));

  insertRow('home_videos', {
    title,
    youtube_url: String(body.youtube_url),
    video_id: videoId,
    branch,
    is_active: isActive,
    sort_order: sortOrder,
    created_at: nowSql(),
    updated_at: nowSql(),
  });
  return successRedirect('/homepage-cms', { message: 'Video added to the homepage gallery.' });
}

export async function handleHomepageVideoUpdate(request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM home_videos WHERE id = ?', [id])) {
    return new Response('Not Found', { status: 404 });
  }

  const body = await readBody(request);
  const errors = videoValidation(body, false);
  if (errors) return validationError(errors);

  const data = videoStringPayload(body);
  if (body.youtube_url !== null && body.youtube_url !== undefined && body.youtube_url !== '') {
    const videoId = extractYouTubeId(body.youtube_url);
    if (!videoId) {
      return jsonResponse({
        success: false,
        redirect: '/homepage-cms',
        message: 'Please enter a valid YouTube video URL.',
      });
    }
    data.video_id = videoId;
  }
  if ('sort_order' in body && body.sort_order !== null) data.sort_order = Math.trunc(Number(body.sort_order));

  updateRow('home_videos', id, { ...withoutNulls(data), updated_at: nowSql() });
  return successRedirect('/homepage-cms', { message: 'Video updated.' });
}

export async function handleHomepageVideoDestroy(_request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM home_videos WHERE id = ?', [id])) {
    return new Response('Not Found', { status: 404 });
  }
  deleteRow('home_videos', id);
  return successRedirect('/homepage-cms', { message: 'Video deleted.' });
}

export async function handleHomepageVideoReorder(request: Request): Promise<Response> {
  const body = await readBody(request);
  const items = Array.isArray(body.items) ? body.items : [];
  for (const item of items) {
    if (item && item.id !== undefined && item.id !== null && item.sort_order !== undefined && item.sort_order !== null) {
      updateRow('home_videos', item.id, { sort_order: Math.trunc(Number(item.sort_order)), updated_at: nowSql() });
    }
  }
  return successRedirect('/homepage-cms', { message: 'Video order updated.' });
}

/* ------------------------------------------------------------------ branches */

const BRANCH_FIELDS = [
  'name',
  'short_name',
  'address',
  'address_main',
  'address_sub',
  'landmark',
  'phone',
  'whatsapp',
  'time',
  'hours_text',
  'morning_hours',
  'evening_hours',
  'working_days',
  'off_days',
  'map_url',
  'booking_url',
  'call_label',
  'directions_label',
  'whatsapp_label',
  'book_label',
  'appointment_btn_label',
  'more_about_title',
  'seo_title',
  'seo_content',
];

export async function handleHomepageBranchUpdate(request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM locations WHERE id = ?', [id])) {
    return new Response('Not Found', { status: 404 });
  }

  const body = await readBody(request);
  const errors: Record<string, string[]> = {};
  for (const field of BRANCH_FIELDS) {
    if (field in body && body[field] !== null && body[field] !== undefined && typeof body[field] === 'object') {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must be a string.`];
    }
  }
  if ('sort_order' in body && body.sort_order !== null && body.sort_order !== undefined && !isIntegerLike(body.sort_order)) {
    errors.sort_order = ['The sort order must be an integer.'];
  }
  if (Object.keys(errors).length) return validationError(errors);

  const data: Record<string, any> = {};
  for (const field of BRANCH_FIELDS) {
    if (field in body) {
      const value = body[field];
      data[field] = value === undefined || value === null ? null : String(value);
    }
  }
  if ('sort_order' in body) data.sort_order = body.sort_order === null ? null : Math.trunc(Number(body.sort_order));

  updateRow('locations', id, { ...withoutNulls(data), updated_at: nowSql() });
  return successRedirect('/homepage-cms', { message: 'Branch details updated.' });
}

export async function handleHomepageBranchReorder(request: Request): Promise<Response> {
  const body = await readBody(request);
  const items = Array.isArray(body.items) ? body.items : [];
  for (const item of items) {
    if (item && item.id !== undefined && item.id !== null && item.sort_order !== undefined && item.sort_order !== null) {
      updateRow('locations', item.id, { sort_order: Math.trunc(Number(item.sort_order)), updated_at: nowSql() });
    }
  }
  return successRedirect('/homepage-cms', { message: 'Branch ranking updated.' });
}

/* ------------------------------------------------------------------- doctors */

const DOCTOR_FIELDS = ['name', 'designation', 'deg', 'branch', 'visiting_time', 'img'];

export async function handleHomepageDoctorUpdate(request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM doctors WHERE id = ?', [id])) {
    return new Response('Not Found', { status: 404 });
  }

  const body = await readBody(request);
  const errors: Record<string, string[]> = {};
  for (const field of DOCTOR_FIELDS) {
    if (field in body && body[field] !== null && body[field] !== undefined && typeof body[field] === 'object') {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must be a string.`];
    }
  }
  if ('rank_order' in body && body.rank_order !== null && body.rank_order !== undefined && !isIntegerLike(body.rank_order)) {
    errors.rank_order = ['The rank order must be an integer.'];
  }
  if (Object.keys(errors).length) return validationError(errors);

  const data: Record<string, any> = {};
  for (const field of DOCTOR_FIELDS) {
    if (field in body) {
      const value = body[field];
      data[field] = value === undefined || value === null ? null : String(value);
    }
  }
  if ('rank_order' in body) data.rank_order = body.rank_order === null ? null : Math.trunc(Number(body.rank_order));

  updateRow('doctors', id, { ...withoutNulls(data), updated_at: nowSql() });
  return successRedirect('/homepage-cms', { message: 'Doctor updated successfully.' });
}

export async function handleHomepageDoctorReorder(request: Request): Promise<Response> {
  const body = await readBody(request);
  const items = Array.isArray(body.items) ? body.items : [];
  for (const item of items) {
    if (item && item.id !== undefined && item.id !== null && item.rank_order !== undefined && item.rank_order !== null) {
      updateRow('doctors', item.id, { rank_order: Math.trunc(Number(item.rank_order)), updated_at: nowSql() });
    }
  }
  return successRedirect('/homepage-cms', { message: 'Doctors ranking updated.' });
}

/* ------------------------------------------------------------------ services */

const SERVICE_FIELDS = ['title', 'name', 'slug', 'image', 'category', 'price', 'desc'];

export async function handleHomepageServiceUpdate(request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM pricing WHERE id = ?', [id])) {
    return new Response('Not Found', { status: 404 });
  }

  const body = await readBody(request);
  const errors: Record<string, string[]> = {};
  for (const field of SERVICE_FIELDS) {
    if (field in body && body[field] !== null && body[field] !== undefined && typeof body[field] === 'object') {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must be a string.`];
    }
  }
  if ('popular' in body && body.popular !== null && body.popular !== undefined && !isBooleanLike(body.popular)) {
    errors.popular = ['The popular field must be true or false.'];
  }
  if ('sort_order' in body && body.sort_order !== null && body.sort_order !== undefined && !isIntegerLike(body.sort_order)) {
    errors.sort_order = ['The sort order must be an integer.'];
  }
  if (Object.keys(errors).length) return validationError(errors);

  const data: Record<string, any> = {};
  for (const field of SERVICE_FIELDS) {
    if (field in body) {
      const value = body[field];
      data[field] = value === undefined || value === null ? null : String(value);
    }
  }
  if ('popular' in body) data.popular = body.popular === null ? null : flagValue(body.popular);
  if ('sort_order' in body) data.sort_order = body.sort_order === null ? null : Math.trunc(Number(body.sort_order));

  // Query builder update: no timestamps touched (Laravel parity).
  const payload = withoutNulls(data);
  if (Object.keys(payload).length) updateRow('pricing', id, payload);
  return successRedirect('/homepage-cms', { message: 'Service updated successfully.' });
}

export async function handleHomepageServiceReorder(request: Request): Promise<Response> {
  const body = await readBody(request);
  const items = Array.isArray(body.items) ? body.items : [];
  for (const item of items) {
    if (item && item.id !== undefined && item.id !== null && item.sort_order !== undefined && item.sort_order !== null) {
      updateRow('pricing', item.id, { sort_order: Math.trunc(Number(item.sort_order)) });
    }
  }
  return successRedirect('/homepage-cms', { message: 'Services ranking updated.' });
}

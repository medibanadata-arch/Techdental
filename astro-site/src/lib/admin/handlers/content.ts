import {
  deleteRow,
  get,
  insertRow,
  jsonField,
  nowSql,
  optionalStr,
  readBody,
  str,
  successRedirect,
  updateRow,
  validationError,
  type Body,
} from '../http';
import { hashPassword } from '../../auth';

/**
 * Blog (posts/categories/tags) and user management mutations, ported from
 * PostController, CategoryController, TagController and UserController.
 */

function slugify(value: string): string {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

const POST_STRING_FIELDS = [
  'slug',
  'title',
  'title_bn',
  'excerpt',
  'excerpt_bn',
  'content',
  'content_bn',
  'img',
  'thumb_url',
  'author_name',
  'author_avatar',
  'category',
  'category_bn',
  'tags',
  'status',
  'focus_keyword',
  'seo_title',
  'meta_desc',
  'focus_keyword_bn',
  'seo_title_bn',
  'meta_desc_bn',
  'canonical_url',
  'breadcrumb_title',
  'schema_json',
  'redirect_url',
  'author_name_bn',
  'author_bio',
  'author_bio_bn',
];

const POST_JSON_FIELDS = ['faqs', 'section_titles', 'cta_box'];
const POST_BOOLEAN_FIELDS = ['robots_index', 'robots_follow', 'is_redirect'];

/** Build the column payload shared by store/update. */
function postPayload(body: Body, existing?: any): Record<string, any> {
  const data: Record<string, any> = {};

  for (const field of POST_STRING_FIELDS) {
    if (field in body) {
      const value = body[field];
      data[field] = value === undefined || value === null || typeof value === 'object' ? null : String(value);
    }
  }

  for (const field of POST_JSON_FIELDS) {
    if (field in body) data[field] = JSON.stringify(jsonField(body[field], []));
  }

  for (const field of POST_BOOLEAN_FIELDS) {
    if (field in body) {
      const value = body[field];
      data[field] =
        value === true || value === 1 || value === '1' || value === 'true' || value === 'on' ? 1 : 0;
    }
  }

  if (!body.slug && body.title) data.slug = slugify(str(body.title));

  if (!data.status) data.status = str(body.action) === 'draft' ? 'draft' : 'published';
  if (data.img && !data.thumb_url) data.thumb_url = data.img;

  if (!data.excerpt) {
    data.excerpt = String(str(body.content)).replace(/<[^>]+>/g, '').slice(0, 150);
  }
  if (data.author_name === undefined || data.author_name === null || data.author_name === '') {
    data.author_name = str(body.author_name) || 'Dr. Farhana Ahmed, BDS';
  }

  if (!existing) {
    data.created_at = nowSql();
    data.updated_at = nowSql();
  } else {
    data.updated_at = nowSql();
  }

  return data;
}

function validatePost(body: Body): Record<string, string[]> | null {
  const errors: Record<string, string[]> = {};
  const slug = str(body.slug) || (str(body.title) ? slugify(str(body.title)) : '');
  if (!slug) errors.slug = ['The slug field is required.'];
  if (!str(body.title)) errors.title = ['The title field is required.'];
  if (slug.length > 255) errors.slug = ['The slug field must not be greater than 255 characters.'];
  if (str(body.title).length > 255) errors.title = ['The title field must not be greater than 255 characters.'];
  if (str(body.title_bn).length > 255) errors.title_bn = ['The title bn field must not be greater than 255 characters.'];
  const status = str(body.status);
  if (status && !['published', 'draft', 'trash'].includes(status)) {
    errors.status = ['The selected status is invalid.'];
  }
  return Object.keys(errors).length ? errors : null;
}

export async function handlePostStore(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors = validatePost(body);
  if (errors) return validationError(errors);
  insertRow('posts', postPayload(body));
  return successRedirect('/posts', { message: 'Post created successfully.' });
}

export async function handlePostUpdate(request: Request, id: number): Promise<Response> {
  const existing = get('SELECT * FROM posts WHERE id = ?', [id]);
  if (!existing) return new Response('Not Found', { status: 404 });
  const body = await readBody(request);
  const errors = validatePost(body);
  if (errors) return validationError(errors);
  updateRow('posts', id, postPayload(body, existing));
  return successRedirect('/posts', { message: 'Post updated successfully.' });
}

export async function handlePostTrash(_request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM posts WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });
  updateRow('posts', id, { status: 'trash', updated_at: nowSql() });
  return successRedirect('/posts', { message: 'Post moved to trash.' });
}

export async function handlePostRestore(_request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM posts WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });
  updateRow('posts', id, { status: 'published', updated_at: nowSql() });
  return successRedirect('/posts', { message: 'Post restored successfully.' });
}

export async function handlePostForceDelete(_request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM posts WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });
  deleteRow('posts', id);
  return successRedirect('/posts', { message: 'Post deleted permanently.' });
}

/** Categories and tags share the same shape/validation. */
async function handleTaxonomyStore(table: 'categories' | 'tags', request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors: Record<string, string[]> = {};
  const name = str(body.name).trim();
  if (!name) errors.name = ['The name field is required.'];
  if (name.length > 255) errors.name = ['The name field must not be greater than 255 characters.'];
  if (str(body.slug).length > 255) errors.slug = ['The slug field must not be greater than 255 characters.'];
  if (Object.keys(errors).length) return validationError(errors);

  let slug = str(body.slug).trim();
  if (!slug) slug = slugify(name);

  insertRow(table, {
    name,
    slug,
    description: optionalStr(body.description),
    created_at: nowSql(),
    updated_at: nowSql(),
  });

  const path = table === 'categories' ? '/posts/categories' : '/posts/tags';
  return successRedirect(path, { message: `${table === 'categories' ? 'Category' : 'Tag'} added successfully` });
}

async function handleTaxonomyDestroy(table: 'categories' | 'tags', id: number): Promise<Response> {
  if (!get(`SELECT id FROM "${table}" WHERE id = ?`, [id])) return new Response('Not Found', { status: 404 });
  deleteRow(table, id);
  const path = table === 'categories' ? '/posts/categories' : '/posts/tags';
  return successRedirect(path, { message: `${table === 'categories' ? 'Category' : 'Tag'} deleted successfully` });
}

export const handleCategoryStore = (request: Request) => handleTaxonomyStore('categories', request);
export const handleCategoryDestroy = (_request: Request, id: number) => handleTaxonomyDestroy('categories', id);
export const handleTagStore = (request: Request) => handleTaxonomyStore('tags', request);
export const handleTagDestroy = (_request: Request, id: number) => handleTaxonomyDestroy('tags', id);

const ROLES = ['Administrator', 'Manager', 'Editor', 'Author'];

function validateUser(body: Body, id?: number): Record<string, string[]> | null {
  const errors: Record<string, string[]> = {};
  const name = str(body.name).trim();
  const email = str(body.email).trim().toLowerCase();
  const password = str(body.password);
  const role = str(body.role);

  if (!name) errors.name = ['The name field is required.'];
  else if (name.length > 255) errors.name = ['The name field must not be greater than 255 characters.'];

  if (!email) errors.email = ['The email field is required.'];
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = ['The email field must be a valid email address.'];
  else {
    const other = get('SELECT id FROM users WHERE lower(email) = ? AND id <> ?', [email, id ?? 0]);
    if (other) errors.email = ['The email has already been taken.'];
  }

  if (id === undefined) {
    if (!password) errors.password = ['The password field is required.'];
    else if (password.length < 6) errors.password = ['The password field must be at least 6 characters.'];
  } else if (password && password.length < 6) {
    errors.password = ['The password field must be at least 6 characters.'];
  }

  if (role && !ROLES.includes(role)) errors.role = ['The selected role is invalid.'];
  return Object.keys(errors).length ? errors : null;
}

export async function handleUserStore(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors = validateUser(body);
  if (errors) return validationError(errors);

  const name = str(body.name).trim();
  insertRow('users', {
    name,
    username: optionalStr(body.username),
    email: str(body.email).trim().toLowerCase(),
    password: await hashPassword(str(body.password)),
    role: str(body.role) || 'Editor',
    avatar:
      optionalStr(body.avatar) ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=800038&color=fff`,
    created_at: nowSql(),
    updated_at: nowSql(),
  });
  return successRedirect('/users', { message: 'User created successfully.' });
}

export async function handleUserUpdate(request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM users WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });
  const body = await readBody(request);
  const errors = validateUser(body, id);
  if (errors) return validationError(errors);

  const data: Record<string, any> = {
    name: str(body.name).trim(),
    username: optionalStr(body.username),
    email: str(body.email).trim().toLowerCase(),
    role: str(body.role) || null,
    avatar: optionalStr(body.avatar),
    updated_at: nowSql(),
  };
  if (str(body.password)) data.password = await hashPassword(str(body.password));
  updateRow('users', id, data);
  return successRedirect('/users', { message: 'User updated successfully.' });
}

export async function handleUserDestroy(_request: Request, id: number): Promise<Response> {
  const user = get('SELECT * FROM users WHERE id = ?', [id]);
  if (!user) return new Response('Not Found', { status: 404 });
  if (String(user.email) === 'info@techdentalcare.com' || Number(user.id) === 1) {
    return successRedirect('/users', { message: 'The primary administrator account cannot be deleted.' });
  }
  deleteRow('users', id);
  return successRedirect('/users', { message: 'User deleted successfully' });
}

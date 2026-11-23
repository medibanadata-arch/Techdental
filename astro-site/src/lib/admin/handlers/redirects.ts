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

/** 301/302 redirect manager, ported from RedirectController. */

const PER_PAGE = 20;

function paginate(request: Request, rows: any[]) {
  const url = new URL(request.url);
  const total = rows.length;
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));
  let currentPage = Number(url.searchParams.get('page') || 1);
  if (!Number.isFinite(currentPage) || currentPage < 1) currentPage = 1;
  if (currentPage > lastPage) currentPage = lastPage;

  const pageUrl = (page: number | null) => {
    if (page === null) return null;
    const params = new URLSearchParams(url.searchParams);
    if (page <= 1) params.delete('page');
    else params.set('page', String(page));
    const query = params.toString();
    return `${url.origin}${url.pathname}${query ? '?' + query : ''}`;
  };

  const data = rows.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const from = total ? (currentPage - 1) * PER_PAGE + 1 : null;
  const to = total ? Math.min(currentPage * PER_PAGE, total) : null;

  const links: Array<{ url: string | null; label: string; active: boolean }> = [
    { url: pageUrl(currentPage - 1), label: '&laquo; Previous', active: false },
  ];
  const windowStart = Math.max(1, Math.min(currentPage - 2, lastPage - 4));
  const windowEnd = Math.min(lastPage, Math.max(currentPage + 2, 5));
  for (let page = windowStart; page <= windowEnd; page++) {
    links.push({ url: pageUrl(page), label: String(page), active: page === currentPage });
  }
  links.push({ url: pageUrl(currentPage + 1), label: 'Next &raquo;', active: false });

  return {
    current_page: currentPage,
    data,
    first_page_url: pageUrl(1),
    from,
    last_page: lastPage,
    last_page_url: pageUrl(lastPage),
    links,
    next_page_url: pageUrl(currentPage < lastPage ? currentPage + 1 : null),
    path: `${url.origin}${url.pathname}`,
    per_page: PER_PAGE,
    prev_page_url: pageUrl(currentPage > 1 ? currentPage - 1 : null),
    to,
    total,
  };
}

export function redirectsPageProps(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';

  let rows: any[];
  if (search) {
    rows = all(
      'SELECT * FROM redirects WHERE source_url LIKE ? OR target_url LIKE ? ORDER BY created_at DESC',
      [`%${search}%`, `%${search}%`]
    );
  } else {
    rows = all('SELECT * FROM redirects ORDER BY created_at DESC');
  }

  const filters: Record<string, string> = {};
  if (url.searchParams.has('search')) filters.search = search;

  return { redirects: paginate(request, rows), filters };
}

function validate(body: Body): Record<string, string[]> | null {
  const errors: Record<string, string[]> = {};

  for (const field of ['source_url', 'target_url']) {
    const value = body[field];
    if (value === null || value === undefined || value === '') {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field is required.`];
    } else if (typeof value === 'object') {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must be a string.`];
    } else if (String(value).length > 500) {
      errors[field] = [`The ${field.replace(/_/g, ' ')} field must not be greater than 500 characters.`];
    }
  }

  const status = body.status_code;
  if (status === null || status === undefined || status === '') {
    errors.status_code = ['The status code field is required.'];
  } else if (
    typeof status === 'object' ||
    !/^-?\d+$/.test(String(status).trim()) ||
    ![301, 302].includes(Number(status))
  ) {
    errors.status_code = ['The selected status code is invalid.'];
  }

  if (body.is_active !== null && body.is_active !== undefined && typeof body.is_active === 'object') {
    errors.is_active = ['The is active field must be true or false.'];
  }

  return Object.keys(errors).length ? errors : null;
}

function normaliseSource(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return '/' + value.replace(/^\/+/, '');
}

function payload(body: Body): Record<string, any> {
  const data: Record<string, any> = {
    source_url: normaliseSource(String(body.source_url)),
    target_url: String(body.target_url),
    status_code: Math.trunc(Number(body.status_code)),
  };
  if ('is_active' in body) {
    const value = body.is_active;
    data.is_active =
      value === true || value === 1 || value === '1' || value === 'true' || value === 'on' ? 1 : 0;
  }
  return data;
}

export async function handleRedirectStore(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors = validate(body);
  if (errors) return validationError(errors);

  const data = payload(body);
  data.created_at = nowSql();
  data.updated_at = nowSql();

  insertRow('redirects', data);
  return successRedirect('/redirects-admin', { message: 'URL redirect rule added successfully.' });
}

export async function handleRedirectUpdate(request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM redirects WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });

  const body = await readBody(request);
  const errors = validate(body);
  if (errors) return validationError(errors);

  const data = payload(body);
  data.updated_at = nowSql();

  updateRow('redirects', id, data);
  return successRedirect('/redirects-admin', { message: 'Redirect rule updated successfully.' });
}

export async function handleRedirectDestroy(_request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM redirects WHERE id = ?', [id])) return new Response('Not Found', { status: 404 });
  deleteRow('redirects', id);
  return successRedirect('/redirects-admin', { message: 'Redirect rule deleted.' });
}

export async function handleRedirectToggle(_request: Request, id: number): Promise<Response> {
  const row = get<any>('SELECT id, is_active FROM redirects WHERE id = ?', [id]);
  if (!row) return new Response('Not Found', { status: 404 });
  const active = row.is_active === true || row.is_active === 1 || row.is_active === '1';
  updateRow('redirects', id, { is_active: active ? 0 : 1, updated_at: nowSql() });
  return successRedirect('/redirects-admin', { message: 'Redirect status updated.' });
}

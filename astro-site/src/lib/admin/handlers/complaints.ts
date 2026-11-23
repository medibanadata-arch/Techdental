import {
  all,
  deleteRow,
  get,
  nowSql,
  readBody,
  successRedirect,
  updateRow,
  validationError,
} from '../http';

/**
 * Complaint box admin, ported from ComplaintController (adminIndex/updateStatus/
 * destroy). The public submission endpoint already lives in the public port.
 */

export function complaintsPageProps() {
  return { complaints: all('SELECT * FROM complaints ORDER BY created_at DESC') };
}

const STATUSES = ['pending', 'under_review', 'resolved', 'dismissed'];

export async function handleComplaintUpdate(request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM complaints WHERE id = ?', [id])) {
    return new Response('Not Found', { status: 404 });
  }

  const body = await readBody(request);
  const errors: Record<string, string[]> = {};

  if (body.status === null || body.status === undefined || body.status === '') {
    errors.status = ['The status field is required.'];
  } else if (typeof body.status === 'object') {
    errors.status = ['The status field must be a string.'];
  } else if (!STATUSES.includes(String(body.status))) {
    errors.status = ['The selected status is invalid.'];
  }
  if (body.admin_notes !== null && body.admin_notes !== undefined && typeof body.admin_notes === 'object') {
    errors.admin_notes = ['The admin notes field must be a string.'];
  }
  if (Object.keys(errors).length) return validationError(errors);

  const data: Record<string, any> = { updated_at: nowSql() };
  data.status = String(body.status);
  if ('admin_notes' in body) {
    data.admin_notes = body.admin_notes === null || body.admin_notes === undefined ? null : String(body.admin_notes);
  }

  updateRow('complaints', id, data);
  return successRedirect('/complaints-admin', { message: 'Complaint updated successfully.' });
}

export async function handleComplaintDestroy(_request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM complaints WHERE id = ?', [id])) {
    return new Response('Not Found', { status: 404 });
  }
  deleteRow('complaints', id);
  return successRedirect('/complaints-admin', { message: 'Complaint deleted successfully.' });
}

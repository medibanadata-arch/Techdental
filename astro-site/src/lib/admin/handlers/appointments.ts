import {
  all,
  deleteRow,
  get,
  nowSql,
  readBody,
  successRedirect,
  updateRow,
  validationError,
  type Body,
} from '../http';

/**
 * Appointment requests admin, ported from AppointmentController::index/update/
 * destroy. The public booking page and store endpoint already live in the public
 * port.
 */

export function appointmentsPageProps() {
  return { appointments: all<any>('SELECT * FROM appointments ORDER BY created_at DESC') };
}

const UPDATE_FIELDS = ['status', 'notes', 'date', 'service'];

/** PHP `array_filter($validated)`: drops null, '', '0', 0 and false values. */
function withoutEmpty(data: Body): Body {
  const out: Body = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined || value === '' || value === false || value === 0 || value === '0') {
      continue;
    }
    out[key] = value;
  }
  return out;
}

export async function handleAppointmentUpdate(request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM appointments WHERE id = ?', [id])) {
    return new Response('Not Found', { status: 404 });
  }

  const body = await readBody(request);
  const errors: Record<string, string[]> = {};

  for (const field of UPDATE_FIELDS) {
    if (!(field in body) || body[field] === null || body[field] === undefined) continue;
    if (typeof body[field] === 'object') {
      errors[field] = [`The ${field} field must be a string.`];
    }
  }
  if (Object.keys(errors).length) return validationError(errors);

  const validated: Body = {};
  for (const field of UPDATE_FIELDS) {
    if (field in body) validated[field] = body[field];
  }

  const data = withoutEmpty(validated);
  if (Object.keys(data).length) {
    data.updated_at = nowSql();
    updateRow('appointments', id, data);
  }

  return successRedirect('/appointments', { message: 'Appointment updated successfully' });
}

export async function handleAppointmentDestroy(_request: Request, id: number): Promise<Response> {
  if (!get('SELECT id FROM appointments WHERE id = ?', [id])) {
    return new Response('Not Found', { status: 404 });
  }
  deleteRow('appointments', id);
  return successRedirect('/appointments', { message: 'Appointment deleted successfully' });
}

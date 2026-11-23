import { get, run } from '../db';

/** Public website form/API handlers (POST endpoints used by the React islands). */

function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

async function readPayload(request: Request): Promise<Record<string, any>> {
  const type = request.headers.get('content-type') || '';
  try {
    if (type.includes('application/json')) {
      return (await request.json()) as Record<string, any>;
    }
    if (type.includes('form')) {
      const form = await request.formData();
      const out: Record<string, any> = {};
      form.forEach((value, key) => {
        out[key] = typeof value === 'string' ? value : value.name;
      });
      return out;
    }
  } catch {
    // fall through
  }
  return {};
}

function str(value: any): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function nowSql(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

/** POST /appointments — AppointmentController::store */
export async function handleAppointmentStore(request: Request): Promise<Response> {
  const body = await readPayload(request);

  const errors: Record<string, string[]> = {};
  const add = (field: string, message: string) => {
    errors[field] = [message];
  };

  const patientName = str(body.patient_name);
  const altName = str(body.name);
  const phone = str(body.phone);
  const branch = str(body.branch);
  const service = str(body.service);
  const altService = str(body.service_or_doctor);
  const date = str(body.date);
  const altDate = str(body.preferred_date);
  const preferredTime = str(body.preferred_time);
  const address = str(body.address);
  const notes = str(body.notes);

  if (!patientName && !altName) {
    add('patient_name', 'রোগীর নাম লিখুন।');
    add('name', 'রোগীর নাম লিখুন।');
  }
  if (!phone) add('phone', 'মোবাইল নম্বর লিখুন।');
  if (!branch) add('branch', 'শাখা নির্বাচন করুন।');
  if (!service && !altService) {
    add('service', 'ট্রিটমেন্ট নির্বাচন করুন।');
    add('service_or_doctor', 'ট্রিটমেন্ট নির্বাচন করুন।');
  }
  if (!date && !altDate) {
    add('date', 'তারিখ নির্বাচন করুন।');
    add('preferred_date', 'তারিখ নির্বাচন করুন।');
  }
  if (!preferredTime) add('preferred_time', 'সময় নির্বাচন করুন।');
  if (!address) add('address', 'ঠিকানা লিখুন।');

  if (Object.keys(errors).length > 0) {
    return json({ message: 'The given data was invalid.', errors }, 422);
  }

  const name = patientName || altName;
  const chosenService = altService || service;
  const chosenDate = altDate || date;

  let meta = `Branch: ${branch}. Time: ${preferredTime}`;
  if (notes) meta += `. ${notes}`;

  const result = run(
    'INSERT INTO appointments (name, phone, service, date, preferred_time, address, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, phone, chosenService, chosenDate, preferredTime, address, 'Pending', meta, nowSql(), nowSql()]
  );

  return json({
    success: true,
    id: Number(result.lastInsertRowid),
    message: 'Appointment booked successfully',
  });
}

/** POST /complaint-box — ComplaintController::store */
export async function handleComplaintStore(request: Request): Promise<Response> {
  const body = await readPayload(request);

  const errors: Record<string, string[]> = {};
  const add = (field: string, message: string) => {
    errors[field] = [message];
  };

  const fullName = str(body.fullName);
  const email = str(body.email);
  const phone = str(body.phone);
  const visitDate = str(body.visitDate);
  const branch = str(body.branch);
  const category = str(body.category);
  const details = str(body.details);

  if (!fullName) add('fullName', 'The full name field is required.');
  if (!email) add('email', 'The email field is required.');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) add('email', 'The email must be a valid email address.');
  if (!phone) add('phone', 'The phone field is required.');
  if (!visitDate) add('visitDate', 'The visit date field is required.');
  if (!category) add('category', 'The category field is required.');
  if (!details) add('details', 'The details field is required.');

  if (Object.keys(errors).length > 0) {
    return json({ message: 'The given data was invalid.', errors }, 422);
  }

  run(
    'INSERT INTO complaints (full_name, email, phone, visit_date, branch, category, details, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [fullName, email, phone, visitDate, branch || null, category, details, 'pending', nowSql(), nowSql()]
  );

  return json({
    success: true,
    message: 'Your report has been submitted successfully.',
  });
}

/** POST /api/featured-images/{id}/view — FeaturedImageController::incrementRealView */
export function handleFeaturedImageView(id: number): Response {
  const image = get<any>('SELECT * FROM featured_images WHERE id = ?', [id]);
  if (!image) {
    return json({ success: false, message: 'Image not found' }, 404);
  }
  run('UPDATE featured_images SET real_views = COALESCE(real_views, 0) + 1 WHERE id = ?', [id]);
  const updated = get<any>('SELECT real_views FROM featured_images WHERE id = ?', [id]);
  return json({ success: true, real_views: updated?.real_views ?? (image.real_views || 0) + 1 });
}

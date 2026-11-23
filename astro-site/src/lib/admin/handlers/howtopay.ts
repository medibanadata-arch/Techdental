import {
  all,
  get,
  insertRow,
  nowSql,
  readBody,
  successRedirect,
  updateRow,
  validationError,
} from '../http';

/**
 * How to Pay CMS, ported from PaymentMethodsController. The singleton lives in
 * `payment_methods_settings` with `methods_data` / `branches_data` JSON columns.
 */

const DEFAULT_METHODS = [
  {
    id: 'cash',
    name: 'Cash',
    badge: '৳',
    color: '#2e7d57',
    image: '',
    steps: ['Pay at the billing counter', 'Collect your printed receipt'],
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'pos',
    name: 'Card (POS)',
    badge: 'POS',
    color: '#3a5ba0',
    image: '',
    steps: [
      'Tell the counter you will pay by card',
      'Tap, insert or swipe your debit/credit card',
      'Enter PIN if asked and keep the slip',
    ],
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'qr',
    name: 'Bangla QR',
    badge: 'QR',
    color: '#0b7a75',
    image: '',
    steps: [
      'Open any bank or wallet app with QR pay',
      'Scan the Bangla QR at the counter',
      'Enter the bill amount and confirm',
      'Show the success screen to staff',
    ],
    sort_order: 3,
    is_active: true,
  },
  {
    id: 'bkash',
    name: 'bKash',
    badge: 'bK',
    color: '#e2136e',
    image: '',
    steps: [
      'Open the bKash app and tap Payment',
      'Scan the QR or enter the merchant number',
      'Enter the bill amount and your PIN',
      'Show the confirmation to staff',
    ],
    sort_order: 4,
    is_active: true,
  },
  {
    id: 'nagad',
    name: 'Nagad',
    badge: 'Ng',
    color: '#f26a21',
    image: '',
    steps: [
      'Open the Nagad app and tap Merchant Pay',
      'Scan the QR or enter the merchant number',
      'Enter the bill amount and your PIN',
      'Show the confirmation to staff',
    ],
    sort_order: 5,
    is_active: true,
  },
  {
    id: 'rocket',
    name: 'Rocket',
    badge: 'Rk',
    color: '#8c3494',
    image: '',
    steps: [
      'Dial *322# or open the Rocket app',
      'Choose Payment and enter the merchant number',
      'Enter the amount and your PIN',
      'Show the confirmation to staff',
    ],
    sort_order: 6,
    is_active: true,
  },
];

const BRANCH_HOURS = 'Sat – Thu 10:00 am – 9:00 pm (Friday Closed)';

const DEFAULT_BRANCHES = [
  {
    id: 'mirpur',
    name: 'Mirpur',
    fullName: 'Mirpur Branch',
    addr: '827 (2nd Floor), Shewrapara, Begum Rokeya Sarani, Mirpur, Dhaka-1216 (Metro Rail Pillar 318)',
    hours: BRANCH_HOURS,
    phone: '09638-000505',
    has: { cash: 1, pos: 1, qr: 1, bkash: 1, nagad: 1, rocket: 1 },
    acct: { bkash: '01400786162', nagad: '01400786162', rocket: '01400786162-8' },
  },
  {
    id: 'uttara',
    name: 'Uttara',
    fullName: 'Uttara Branch',
    addr: 'House 18, Road 14, Sector 3, Uttara, Dhaka-1230',
    hours: BRANCH_HOURS,
    phone: '09638-000505',
    has: { cash: 1, pos: 1, qr: 1, bkash: 1, nagad: 1, rocket: 0 },
    acct: { bkash: '01400786162', nagad: '01400786162' },
  },
  {
    id: 'badda',
    name: 'Badda',
    fullName: 'Badda Branch',
    addr: 'Haji Abdur Rashid Mansion (3rd Floor), North Badda Bazar, Dhaka-1212',
    hours: BRANCH_HOURS,
    phone: '09638-000505',
    has: { cash: 1, pos: 1, qr: 1, bkash: 1, nagad: 1, rocket: 0 },
    acct: { bkash: '01400786162', nagad: '01400786162' },
  },
  {
    id: 'jatrabari',
    name: 'Jatrabari',
    fullName: 'Jatrabari Branch',
    addr: 'Shahid Faruk Road, South Jatrabari, Dhaka-1204',
    hours: BRANCH_HOURS,
    phone: '09638-000505',
    has: { cash: 1, pos: 1, qr: 1, bkash: 1, nagad: 0, rocket: 0 },
    acct: { bkash: '01400786162' },
  },
];

const SETTINGS_DEFAULTS = {
  tagline: 'Payment methods by branch',
  title_main: 'How to pay',
  title_highlight: 'at our clinic',
  lead_text: 'Choose your branch to see exactly which payment methods work there.',
  branches_section_title: 'Select your branch',
  branches_section_sub: 'Payment options differ from branch to branch.',
  matrix_section_title: 'All branches at a glance',
  matrix_section_sub: 'Tap a branch name to jump to its details.',
  notice_text:
    'Always keep your payment receipt or transaction ID. For mobile payments, show the success message at the counter before you leave. Need help? Ask the front desk at any branch.',
  seo_title: 'How to Pay | Payment Methods by Branch | Tech Dental Care',
  meta_desc:
    'Choose your branch to see accepted payment methods at Tech Dental Care: Cash, POS Debit/Credit Card, Bangla QR, bKash, Nagad, and Rocket.',
};

export function paymentSettingsRow(): any {
  let row = get<any>('SELECT * FROM payment_methods_settings ORDER BY id LIMIT 1');
  if (!row) {
    const now = nowSql();
    const id = insertRow('payment_methods_settings', {
      ...SETTINGS_DEFAULTS,
      methods_data: JSON.stringify(DEFAULT_METHODS),
      branches_data: JSON.stringify(DEFAULT_BRANCHES),
      created_at: now,
      updated_at: now,
    });
    row = get<any>('SELECT * FROM payment_methods_settings WHERE id = ?', [id]);
  }
  return row;
}

export function howToPayAdminProps() {
  return {
    settings: paymentSettingsRow(),
    locations: all('SELECT * FROM locations ORDER BY sort_order, id'),
  };
}

/* --------------------------------------------------------------- validation */

function isArrayLike(value: any): boolean {
  return Array.isArray(value) || (value !== null && typeof value === 'object');
}

function isIntegerLike(value: any): boolean {
  if (value === null || value === undefined || typeof value === 'boolean' || typeof value === 'object') return false;
  return /^[+-]?\d+$/.test(String(value).trim());
}

function isBooleanLike(value: any): boolean {
  return [true, false, 0, 1, '0', '1'].includes(value);
}

const LABEL = (path: string) => path.replace(/_/g, ' ');

function requireString(
  errors: Record<string, string[]>,
  value: any,
  path: string,
  max?: number
) {
  if (value === null || value === undefined || value === '') {
    errors[path] = [`The ${LABEL(path)} field is required.`];
  } else if (typeof value === 'object') {
    errors[path] = [`The ${LABEL(path)} field must be a string.`];
  } else if (max && String(value).length > max) {
    errors[path] = [`The ${LABEL(path)} field must not be greater than ${max} characters.`];
  }
}

function optionalString(
  errors: Record<string, string[]>,
  value: any,
  path: string,
  max?: number
) {
  if (value === null || value === undefined) return;
  if (typeof value === 'object') {
    errors[path] = [`The ${LABEL(path)} field must be a string.`];
  } else if (max && String(value).length > max) {
    errors[path] = [`The ${LABEL(path)} field must not be greater than ${max} characters.`];
  }
}

function optionalInteger(errors: Record<string, string[]>, value: any, path: string) {
  if (value === null || value === undefined) return;
  if (!isIntegerLike(value)) errors[path] = [`The ${LABEL(path)} field must be an integer.`];
}

function optionalBoolean(errors: Record<string, string[]>, value: any, path: string) {
  if (value === null || value === undefined) return;
  if (!isBooleanLike(value)) errors[path] = [`The ${LABEL(path)} field must be true or false.`];
}

function optionalArray(errors: Record<string, string[]>, value: any, path: string) {
  if (value === null || value === undefined) return;
  if (!isArrayLike(value)) errors[path] = [`The ${LABEL(path)} field must be an array.`];
}

function itemsOf(value: any): any[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return Object.values(value);
  return [];
}

function pick(item: any, keys: string[]): Record<string, any> {
  const out: Record<string, any> = {};
  if (!item || typeof item !== 'object') return out;
  for (const key of keys) {
    if (key in item && item[key] !== undefined) out[key] = item[key];
  }
  return out;
}

/* -------------------------------------------------------------- mutations */

const SETTINGS_FIELDS: Array<[string, number | null]> = [
  ['tagline', 255],
  ['title_main', 255],
  ['title_highlight', 255],
  ['lead_text', null],
  ['branches_section_title', 255],
  ['branches_section_sub', 255],
  ['matrix_section_title', 255],
  ['matrix_section_sub', 255],
  ['notice_text', null],
  ['seo_title', 255],
  ['meta_desc', null],
];

export async function handleHowToPaySettings(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors: Record<string, string[]> = {};
  for (const [field, max] of SETTINGS_FIELDS) optionalString(errors, body[field], field, max ?? undefined);
  if (Object.keys(errors).length) return validationError(errors);

  const setting = paymentSettingsRow();
  const data: Record<string, any> = { updated_at: nowSql() };
  for (const [field] of SETTINGS_FIELDS) {
    if (field in body) {
      data[field] = body[field] === null || body[field] === undefined ? null : String(body[field]);
    }
  }
  updateRow('payment_methods_settings', setting.id, data);

  return successRedirect('/how-to-pay-cms', { message: 'Page settings updated successfully!' });
}

export async function handleHowToPayMethods(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors: Record<string, string[]> = {};

  const methods = body.methods;
  const methodItems = itemsOf(methods);
  if (methods === null || methods === undefined || methods === '' || methodItems.length === 0) {
    errors.methods = ['The methods field is required.'];
  } else if (!isArrayLike(methods)) {
    errors.methods = ['The methods field must be an array.'];
  } else {
    methodItems.forEach((item, index) => {
      const base = `methods.${index}`;
      if (!item || typeof item !== 'object') {
        errors[`${base}.id`] = [`The ${LABEL(`${base}.id`)} field is required.`];
        errors[`${base}.name`] = [`The ${LABEL(`${base}.name`)} field is required.`];
        return;
      }
      requireString(errors, item.id, `${base}.id`);
      requireString(errors, item.name, `${base}.name`);
      optionalString(errors, item.badge, `${base}.badge`);
      optionalString(errors, item.color, `${base}.color`);
      optionalString(errors, item.image, `${base}.image`);
      optionalArray(errors, item.steps, `${base}.steps`);
      optionalInteger(errors, item.sort_order, `${base}.sort_order`);
      optionalBoolean(errors, item.is_active, `${base}.is_active`);
    });
  }
  if (Object.keys(errors).length) return validationError(errors);

  const setting = paymentSettingsRow();
  const cleaned = methodItems.map((item) =>
    pick(item, ['id', 'name', 'badge', 'color', 'image', 'steps', 'sort_order', 'is_active'])
  );
  updateRow('payment_methods_settings', setting.id, {
    methods_data: JSON.stringify(cleaned),
    updated_at: nowSql(),
  });

  return successRedirect('/how-to-pay-cms', { message: 'Payment methods and icons saved successfully!' });
}

export async function handleHowToPayBranches(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors: Record<string, string[]> = {};

  const branches = body.branches;
  const branchItems = itemsOf(branches);
  if (branches === null || branches === undefined || branches === '' || branchItems.length === 0) {
    errors.branches = ['The branches field is required.'];
  } else if (!isArrayLike(branches)) {
    errors.branches = ['The branches field must be an array.'];
  } else {
    branchItems.forEach((item, index) => {
      const base = `branches.${index}`;
      if (!item || typeof item !== 'object') {
        errors[`${base}.id`] = [`The ${LABEL(`${base}.id`)} field is required.`];
        errors[`${base}.name`] = [`The ${LABEL(`${base}.name`)} field is required.`];
        return;
      }
      requireString(errors, item.id, `${base}.id`);
      requireString(errors, item.name, `${base}.name`);
      for (const field of ['fullName', 'addr', 'hours', 'phone']) {
        optionalString(errors, item[field], `${base}.${field}`);
      }
      optionalArray(errors, item.has, `${base}.has`);
      optionalArray(errors, item.acct, `${base}.acct`);
    });
  }
  if (Object.keys(errors).length) return validationError(errors);

  const setting = paymentSettingsRow();
  const cleaned = branchItems.map((item) =>
    pick(item, ['id', 'name', 'fullName', 'addr', 'hours', 'phone', 'has', 'acct'])
  );
  updateRow('payment_methods_settings', setting.id, {
    branches_data: JSON.stringify(cleaned),
    updated_at: nowSql(),
  });

  return successRedirect('/how-to-pay-cms', {
    message: 'Branch availability and merchant accounts saved successfully!',
  });
}

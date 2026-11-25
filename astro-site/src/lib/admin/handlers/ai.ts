import fs from 'node:fs';
import path from 'node:path';
import {
  all,
  get,
  insertRow,
  jsonResponse,
  nowSql,
  readBody,
  run,
  successRedirect,
  updateRow,
  validationError,
  type Body,
} from '../http';

/**
 * AI chat assistant admin, ported from AiAssistantController. Settings and
 * keyword rules live in plain tables (DB::table, no Eloquent casts), so rows are
 * returned raw exactly like Laravel's query builder serialises them.
 */

const DEFAULT_FALLBACK_REPLY =
  'টেক ডেন্টালের দক্ষ স্পেশালিস্ট সার্জন ও কনসালট্যান্টগণ আপনাকে নির্ভুল সেবা প্রদান করবেন। বিস্তারিত জানতে আমাদের হটলাইনে (09638-000505) সরাসরি কথা বলুন অথবা অনলাইনে অ্যাপয়েন্টমেন্ট নিন।';

const DEFAULT_CHIPS = ['শাখার ঠিকানা কোথায়?', 'ফাঁকা দাঁতের চিকিৎসা', 'দাঁত ব্যথার চিকিৎসা'];

const DEFAULT_STARTER_QUESTIONS = [
  'ফিলিং চিকিৎসার খরচ কত?',
  'দাঁতে গর্ত হলে কি করা উচিৎ?',
  'রুট ক্যানেল করতে কত খরচ হয়?',
  'দাঁত সোজা করার উপায় কি?',
];

const SETTINGS_DEFAULTS = () => ({
  gemini_api_key: process.env.GEMINI_API_KEY || null,
  gemini_model: 'gemini-1.5-flash',
  gemini_enabled: 0,
  system_prompt: null,
  chips: jsonEncode(DEFAULT_CHIPS),
  fallback_reply: DEFAULT_FALLBACK_REPLY,
});

export function aiSettingsRow(): any {
  let row = get<any>('SELECT * FROM ai_chat_settings ORDER BY id LIMIT 1');
  if (!row) {
    const now = nowSql();
    const id = insertRow('ai_chat_settings', { ...SETTINGS_DEFAULTS(), created_at: now, updated_at: now });
    row = get<any>('SELECT * FROM ai_chat_settings WHERE id = ?', [id]);
  }
  return row;
}

export function aiAssistantAdminProps() {
  return {
    settings: aiSettingsRow(),
    rules: all<any>('SELECT * FROM ai_chat_replies ORDER BY priority DESC, id DESC'),
    logs: all<any>('SELECT * FROM ai_chat_logs ORDER BY id DESC LIMIT 50'),
  };
}

/** PHP json_encode(..., JSON_UNESCAPED_UNICODE). */
function jsonEncode(value: any): string {
  return JSON.stringify(value);
}

/* --------------------------------------------------------------- validation */

const STRING_FIELDS: Array<[string, number | null]> = [
  ['gemini_model', null],
  ['system_prompt', null],
  ['training_data', null],
  ['fallback_reply', null],
];

const cliName = (field: string) => field.replace(/_/g, ' ');

function optionalString(errors: Record<string, string[]>, value: any, field: string, max: number | null) {
  if (value === null || value === undefined) return;
  if (typeof value === 'object') {
    errors[field] = [`The ${cliName(field)} field must be a string.`];
  } else if (max !== null && String(value).length > max) {
    errors[field] = [`The ${cliName(field)} field must not be greater than ${max} characters.`];
  }
}

function requiredString(errors: Record<string, string[]>, value: any, field: string, max: number | null) {
  if (value === null || value === undefined || value === '') {
    errors[field] = [`The ${cliName(field)} field is required.`];
  } else {
    optionalString(errors, value, field, max);
  }
}

function isIntegerLike(value: any): boolean {
  if (value === null || value === undefined || typeof value === 'boolean' || typeof value === 'object') return false;
  return /^[+-]?\d+$/.test(String(value).trim());
}

function isBooleanLike(value: any): boolean {
  return [true, false, 0, 1, '0', '1'].includes(value);
}

/** PHP truthiness, as used by `$request->input($key) ?: $fallback`. */
function phpTruthy(value: any): boolean {
  if (value === null || value === undefined || value === false) return false;
  if (value === 0 || value === 0n) return false;
  if (typeof value === 'string') return value !== '' && value !== '0';
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/* ---------------------------------------------------------------- settings */

function publicRoot(): string {
  const candidates = [
    path.resolve(process.cwd(), '..', 'public'),
    path.resolve(process.cwd(), 'public'),
    path.resolve(process.cwd(), '..', '..', 'public'),
  ];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(path.join(candidate, 'uploads'))) return candidate;
    } catch {
      // ignore
    }
  }
  return candidates[0];
}

/** PHP `trim($value, $characters)`. */
function trimChars(value: string, characters: string): string {
  const set = new Set(characters.split(''));
  let start = 0;
  let end = value.length;
  while (start < end && set.has(value[start])) start += 1;
  while (end > start && set.has(value[end - 1])) end -= 1;
  return value.slice(start, end);
}

/** Port of AiAssistantController::normalizeStringList(). */
function normalizeStringList(value: any): string[] {
  if (typeof value === 'string') {
    let text = value.trim();
    if (text.startsWith('[')) {
      try {
        const decoded = JSON.parse(text);
        value = Array.isArray(decoded) ? decoded : text.split(',');
      } catch {
        value = text.split(',');
      }
    } else {
      value = text.split(/[\r\n,]+/).filter((item) => item !== '');
    }
  }

  if (!Array.isArray(value)) return [];

  const clean: string[] = [];
  for (const raw of value) {
    if (raw === null || raw === undefined || typeof raw === 'object') continue;
    let item = String(raw).trim();
    // Remove leftover JSON punctuation from previously corrupted rows.
    let previous: string;
    do {
      previous = item;
      item = trimChars(item, " \t\n\r\0\x0B\"'");
      item = trimChars(item, '[]');
      item = item.trim();
    } while (item !== previous);
    if (item !== '') clean.push(item);
  }

  return [...new Set(clean)];
}

export async function handleAiSettings(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors: Record<string, string[]> = {};

  for (const [field, max] of STRING_FIELDS) optionalString(errors, body[field], field, max);
  optionalString(errors, body.bot_name, 'bot_name', 100);
  if (Object.keys(errors).length) return validationError(errors);

  const updateData: Record<string, any> = { updated_at: nowSql() };

  if ('gemini_api_key' in body) updateData.gemini_api_key = scalarOrNull(body.gemini_api_key);
  if ('gemini_model' in body) updateData.gemini_model = scalarOrNull(body.gemini_model);
  if ('gemini_enabled' in body) updateData.gemini_enabled = phpTruthy(body.gemini_enabled) ? 1 : 0;
  if ('system_prompt' in body) updateData.system_prompt = scalarOrNull(body.system_prompt);
  if ('training_data' in body) updateData.training_data = scalarOrNull(body.training_data);
  if ('fallback_reply' in body) updateData.fallback_reply = scalarOrNull(body.fallback_reply);
  if ('bot_name' in body) updateData.bot_name = phpTruthy(body.bot_name) ? String(body.bot_name) : 'Tech Dental Agent';

  // Handle avatar upload or string path
  const avatar = body.bot_avatar;
  if (isFile(avatar)) {
    const extension = avatar.name.includes('.') ? avatar.name.split('.').pop() || '' : '';
    const filename = `${Math.floor(Date.now() / 1000)}_bot_avatar.${extension}`;
    const directory = path.join(publicRoot(), 'uploads', 'images');
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, filename), Buffer.from(await avatar.arrayBuffer()));
    updateData.bot_avatar = '/uploads/images/' + filename;
  } else if ('bot_avatar' in body && typeof avatar === 'string') {
    updateData.bot_avatar = avatar;
  }

  // Starter questions (shown sequentially before the chat starts)
  if ('starter_questions' in body) {
    const starterQuestions = normalizeStringList(body.starter_questions);
    updateData.starter_questions = jsonEncode(
      starterQuestions.length ? starterQuestions : DEFAULT_STARTER_QUESTIONS
    );
  }

  if ('chips' in body) {
    const chips = normalizeStringList(body.chips);
    updateData.chips = jsonEncode(chips.length ? chips : DEFAULT_CHIPS);
  }

  // Laravel updateOrInsert(['id' => 1], $updateData)
  if (get('SELECT id FROM ai_chat_settings WHERE id = 1')) {
    updateRow('ai_chat_settings', 1, updateData);
  } else {
    insertRow('ai_chat_settings', { id: 1, ...updateData });
  }

  return successRedirect('/ai-assistant', {
    message: 'AI Assistant সেটিংস ও ব্র্যান্ডিং সফলভাবে সংরক্ষিত হয়েছে।',
  });
}

function scalarOrNull(value: any): any {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object') return JSON.stringify(value);
  return value;
}

function isFile(value: any): boolean {
  return Boolean(value) && typeof value === 'object' && typeof value.arrayBuffer === 'function' && 'name' in value;
}

/* ------------------------------------------------------------------- rules */

export async function handleAiRuleStore(request: Request): Promise<Response> {
  const body = await readBody(request);
  const errors: Record<string, string[]> = {};

  requiredString(errors, body.title, 'title', 255);
  requiredString(errors, body.keywords, 'keywords', null);
  requiredString(errors, body.reply, 'reply', null);
  for (const field of ['icon', 'action_type', 'action_label', 'action_url']) {
    optionalString(errors, body[field], field, null);
  }
  if (body.priority !== null && body.priority !== undefined && !isIntegerLike(body.priority)) {
    errors.priority = ['The priority field must be an integer.'];
  }
  if (Object.keys(errors).length) return validationError(errors);

  const now = nowSql();
  insertRow('ai_chat_replies', {
    title: String(body.title),
    keywords: String(body.keywords),
    reply: String(body.reply),
    icon: body.icon ?? 'fa-tooth',
    icon_color: 'icon_color' in body ? body.icon_color : 'text-blue-600',
    icon_bg: 'icon_bg' in body ? body.icon_bg : 'bg-blue-100',
    action_type: body.action_type ?? 'none',
    action_label: body.action_label ?? null,
    action_url: body.action_url ?? null,
    priority: Number.parseInt(String(body.priority ?? 0), 10) || 0,
    is_active: 1,
    match_count: 0,
    created_at: now,
    updated_at: now,
  });

  return successRedirect('/ai-assistant', {
    message: 'নতুন কিওয়ার্ড রুল সফলভাবে যুক্ত হয়েছে।',
  });
}

export async function handleAiRuleUpdate(request: Request, id: number): Promise<Response> {
  const body = await readBody(request);
  const errors: Record<string, string[]> = {};

  requiredString(errors, body.title, 'title', 255);
  requiredString(errors, body.keywords, 'keywords', null);
  requiredString(errors, body.reply, 'reply', null);
  for (const field of ['icon', 'action_type', 'action_label', 'action_url']) {
    optionalString(errors, body[field], field, null);
  }
  if (body.priority !== null && body.priority !== undefined && !isIntegerLike(body.priority)) {
    errors.priority = ['The priority field must be an integer.'];
  }
  if ('is_active' in body && body.is_active !== null && body.is_active !== undefined) {
    if (!isBooleanLike(body.is_active)) errors.is_active = ['The is active field must be true or false.'];
  }
  if (Object.keys(errors).length) return validationError(errors);

  updateRow('ai_chat_replies', id, {
    title: String(body.title),
    keywords: String(body.keywords),
    reply: String(body.reply),
    icon: body.icon ?? 'fa-tooth',
    icon_color: 'icon_color' in body ? body.icon_color : 'text-blue-600',
    icon_bg: 'icon_bg' in body ? body.icon_bg : 'bg-blue-100',
    action_type: body.action_type ?? 'none',
    action_label: body.action_label ?? null,
    action_url: body.action_url ?? null,
    priority: Number.parseInt(String(body.priority ?? 0), 10) || 0,
    is_active: 'is_active' in body ? (phpTruthy(body.is_active) ? 1 : 0) : 1,
    updated_at: nowSql(),
  });

  return successRedirect('/ai-assistant', { message: 'কিওয়ার্ড রুল আপডেট করা হয়েছে।' });
}

export async function handleAiRuleDestroy(_request: Request, id: number): Promise<Response> {
  // The controller simply deletes by id (no existence check).
  run('DELETE FROM ai_chat_replies WHERE id = ?', [id]);
  return successRedirect('/ai-assistant', { message: 'কিওয়ার্ড রুল মুছে ফেলা হয়েছে।' });
}

export async function handleAiRuleToggle(_request: Request, id: number): Promise<Response> {
  const rule = get<any>('SELECT id, is_active FROM ai_chat_replies WHERE id = ?', [id]);
  if (rule) {
    updateRow('ai_chat_replies', id, {
      is_active: Number(rule.is_active) ? 0 : 1,
      updated_at: nowSql(),
    });
  }
  return successRedirect('/ai-assistant', { message: '' });
}

/* ------------------------------------------------------- Gemini API probes */

function resolveGeminiModelCandidates(model: any): string[] {
  let requested = String(model || '').trim();

  // Auto-migrate deprecated 1.5, 2.0 or invalid non-preview 3 models
  if (
    ['gemini-2.0-flash', 'gemini-2.0', 'gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-3-flash'].includes(
      requested
    )
  ) {
    requested = 'gemini-3.5-flash-lite';
  }
  if (['gemini-2.0-pro', 'gemini-2.0-pro-exp', 'gemini-3-pro'].includes(requested)) {
    requested = 'gemini-2.5-pro';
  }

  const candidates: string[] = [];
  if (requested) {
    candidates.push(requested);
    if (requested.includes('-preview')) candidates.push(requested.replace('-preview', ''));
  }
  for (const fallback of [
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
    'gemini-3.6-flash',
  ]) {
    candidates.push(fallback);
  }

  return [...new Set(candidates)];
}

type ApiResult = { status: number; ok: boolean; json: any; text: string };

async function apiPost(url: string, payload: any, timeoutMs: number): Promise<ApiResult> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await response.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { status: response.status, ok: response.status >= 200 && response.status < 300, json, text };
}

async function apiGet(url: string, timeoutMs: number): Promise<ApiResult> {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  const text = await response.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { status: response.status, ok: response.status >= 200 && response.status < 300, json, text };
}

function settingsApiKey(body: Body): string {
  const row = get<any>('SELECT gemini_api_key FROM ai_chat_settings ORDER BY id LIMIT 1');
  const raw = phpTruthy(body.gemini_api_key) ? body.gemini_api_key : row?.gemini_api_key ?? '';
  return String(raw ?? '').trim();
}

export async function handleAiFetchModels(request: Request): Promise<Response> {
  const body = await readBody(request);
  const apiKey = settingsApiKey(body);

  if (!apiKey) {
    return jsonResponse({ success: false, message: 'API Key প্রদান করুন', models: [] }, 422);
  }

  try {
    const result = await apiGet(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
      12000
    );

    if (result.ok && result.json) {
      const rawModels = Array.isArray(result.json.models) ? result.json.models : [];
      const filtered = rawModels
        .filter((model: any) => Array.isArray(model?.supportedGenerationMethods) && model.supportedGenerationMethods.includes('generateContent'))
        .map((model: any) => {
          const cleanId = String(model.name || '').replace('models/', '');
          return {
            id: cleanId,
            name: cleanId,
            displayName: model.displayName ?? cleanId,
            description: model.description ?? '',
          };
        });
      return jsonResponse({ success: true, models: filtered });
    }

    const errorMessage = result.json?.error?.message ?? result.text;
    return jsonResponse(
      { success: false, message: 'গুগল মডেল ফেচ ব্যর্থ: ' + errorMessage, models: [] },
      result.status
    );
  } catch (error: any) {
    return jsonResponse(
      { success: false, message: 'কানেকশন এরর: ' + (error?.message || String(error)), models: [] },
      500
    );
  }
}

export async function handleAiTestGemini(request: Request): Promise<Response> {
  const body = await readBody(request);
  const settings = get<any>('SELECT * FROM ai_chat_settings ORDER BY id LIMIT 1');
  const apiKey = settingsApiKey(body);
  const requestedModel = String(
    (phpTruthy(body.gemini_model) ? body.gemini_model : settings?.gemini_model) || 'gemini-3-flash'
  ).trim();
  const testPrompt = String(
    (phpTruthy(body.prompt)
      ? body.prompt
      : 'হ্যালো, আপনি কি টেক ডেন্টালের এআই অ্যাসিস্ট্যান্ট হিসেবে ঠিকমত কাজ করছেন? সংক্ষেপে ১-২ লাইনে মিষ্টি করে বাংলায় উত্তর দিন।') ?? ''
  ).trim();
  const trainingData = phpTruthy(body.training_data) ? body.training_data : settings?.training_data ?? '';

  if (!apiKey) {
    return jsonResponse(
      {
        success: false,
        message: 'কোনো Gemini API Key পাওয়া যায়নি! দয়া করে ইনপুট বক্সে আপনার Google Gemini API Key দিন।',
      },
      422
    );
  }

  let instructionText = "ROLE & INSTRUCTIONS: You are Tech Dental's official AI assistant in Dhaka, Bangladesh. Answer politely, accurately, and concisely in Bengali.";
  if (trainingData !== null && trainingData !== undefined && String(trainingData) !== '') {
    instructionText +=
      '\n\n### TECH DENTAL OFFICIAL TRAINING DATA:\n' + Array.from(String(trainingData)).slice(0, 3000).join('');
  }

  let candidateModels = [...new Set([requestedModel, ...resolveGeminiModelCandidates(requestedModel)])];

  // Also attempt to dynamically pull Google's exact active models as backup
  try {
    const listResult = await apiGet(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
      6000
    );
    if (listResult.ok && listResult.json) {
      const onlineModels = Array.isArray(listResult.json.models) ? listResult.json.models : [];
      for (const online of onlineModels) {
        if (Array.isArray(online?.supportedGenerationMethods) && online.supportedGenerationMethods.includes('generateContent')) {
          candidateModels.push(String(online.name || '').replace('models/', ''));
        }
      }
      candidateModels = [...new Set(candidateModels)];
    }
  } catch {
    // Ignore listModels error
  }

  let lastError: string | null = null;
  let lastErrorCode = 400;

  for (const model of candidateModels) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${instructionText}\n\nPATIENT TEST QUESTION: ${testPrompt}` }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 4096,
        responseModalities: ['TEXT'],
      },
    };

    const started = Date.now();
    try {
      const result = await apiPost(apiUrl, payload, 15000);
      const latencyMs = Math.round(Date.now() - started);

      if (result.ok && result.json) {
        const parts = result.json?.candidates?.[0]?.content?.parts ?? [];
        let aiText = '';
        for (const part of parts) {
          if (part?.text) aiText += part.text;
        }
        aiText = aiText.trim();

        // If audio/multimodal data was returned
        if (!aiText && parts.length) {
          for (const part of parts) {
            if (part?.inlineData) {
              aiText =
                'Gemini API সফলভাবে রেসপন্স করেছে (অডিও/মিডিয়া ডাটা)। আপনার এপিআই ও মডেল সঠিকভাবে সক্রিয় রয়েছে!';
              break;
            }
          }
        }

        if (aiText) {
          // If the model had to be auto-migrated from a deprecated one, persist it.
          if (model !== requestedModel) {
            updateRow('ai_chat_settings', 1, { gemini_model: model, updated_at: nowSql() });
          }

          const note =
            model !== requestedModel
              ? ` (অপ্রচলিত মডেলের বদলে অ্যাক্টিভ মডেল '${model}' সফলভাবে ব্যবহৃত হয়েছে)`
              : '';

          return jsonResponse({
            success: true,
            message: 'অভিনন্দন! আপনার Google Gemini API সফলভাবে সংযুক্ত এবং সক্রিয় রয়েছে' + note + '।',
            reply: aiText,
            model,
            latency_ms: latencyMs,
            status_code: result.status,
          });
        }
      }

      lastError = result.json?.error?.message ?? result.text;
      lastErrorCode = result.status;

      // If 404, 429 or 503, loop to the next candidate model
      if (![404, 429, 503].includes(result.status)) break;
    } catch (error: any) {
      lastError = error?.message || String(error);
      lastErrorCode = 500;
    }
  }

  return jsonResponse(
    {
      success: false,
      message: 'Gemini API এরর: ' + (lastError || 'মডেল রেসপন্স করছে না'),
      status_code: lastErrorCode,
      raw_error: lastError,
    },
    lastErrorCode || 400
  );
}

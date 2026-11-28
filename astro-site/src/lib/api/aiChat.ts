import { all, bool, get, run } from '../db';
import { DEFAULT_TRAINING_DATA } from '../aiTrainingData';

/**
 * Public AI chat endpoint (POST /api/ai-chat). This is a direct port of
 * AiAssistantController::chatApi so the Astro site answers exactly like the
 * Laravel site: Gemini first, then the training-data matcher, then keyword
 * rules, then the fallback reply.
 */

type ChatTurn = { role: 'user' | 'model'; parts: Array<{ text: string }> };

function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/** Mirror PHP's normalizeChatHistory(): last 10 turns, merged by role. */
export function normalizeChatHistory(raw: any): ChatTurn[] {
  if (!Array.isArray(raw)) return [];
  const turns: ChatTurn[] = [];
  for (const item of raw.slice(-10)) {
    if (!item || typeof item !== 'object') continue;
    const role: 'user' | 'model' = item.role === 'assistant' ? 'model' : 'user';
    let text = String(item.text ?? '').trim();
    if (text === '') continue;
    if ([...text].length > 1500) text = [...text].slice(0, 1500).join('');
    const last = turns[turns.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += '\n' + text;
    } else {
      turns.push({ role, parts: [{ text }] });
    }
  }
  while (turns.length && turns[0].role !== 'user') turns.shift();
  return turns;
}

/** Mirror PHP's resolveGeminiModelCandidates(). */
export function resolveGeminiModelCandidates(model?: string | null): string[] {
  let requested = String(model || '').trim();

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
  candidates.push('gemini-3.5-flash-lite');
  candidates.push('gemini-3.1-flash-lite');
  candidates.push('gemini-2.5-flash');
  candidates.push('gemini-flash-latest');
  candidates.push('gemini-flash-lite-latest');
  candidates.push('gemini-3.6-flash');

  return [...new Set(candidates)];
}

/**
 * Price chart shown under an answer when the reply itself quotes an amount for
 * closing gaps between teeth with composite veneers. It must NOT appear for
 * other priced treatments (chipped tooth, braces, whitening, etc.).
 */
export function chatReplyImage(query: string, reply = ''): { url: string; alt: string } | null {
  const haystack = `${query}\n${reply}`.toLowerCase();

  const gap =
    /ফাঁকা\s*দাঁত|দাঁতের\s*ফাঁকা|দাঁতে\s*ফাঁকা|ফাঁকা\s*অংশ|দাঁতের\s*ফাঁক|দাঁতের\s*গ্যাপ|গ্যাপ\s*ক্লোজার|faka\s*da+[nt]h?|\bgap\b|gap\s*teeth|tooth\s*gap|teeth\s*gap/iu.test(
      haystack
    );

  // Only show the chart when the answer text contains an actual amount.
  const amount = /[০-৯0-9]/u.test(reply) && /৳|টাকা|taka|\btk\b|\bbdt\b/iu.test(reply);

  // Braces / aligner pricing is not composite-veneer pricing.
  const ortho = /ব্রেসেস|braces|অ্যালাইনার|aligner|ইনভিজিবল|invisalign/iu.test(query);

  if (!gap || !amount || ortho) return null;

  return {
    url: '/uploads/ai/faka-dat-composite-veneer-cost.webp',
    alt: 'দাঁতের ফাঁকা অংশের চিকিৎসায় কম্পোজিট ভিনিয়ার খরচের চার্ট',
  };
}

/** Mirror PHP's matchTrainingDataAnswer(). */
export function matchTrainingDataAnswer(trainingData: string | null | undefined, query: string): { title: string; reply: string } | null {
  if (!trainingData) return null;

  const qLower = query.toLowerCase();
  const lines = trainingData.split('\n');
  const matchedLines: string[] = [];

  const topics: Record<string, string[]> = {
    স্কেলিং: ['স্কেলিং', 'scaling', 'পরিষ্কার', 'ওয়াশ', 'wash'],
    'রুট ক্যানেল': ['রুট ক্যানেল', 'rct', 'root canal', 'ব্যথা'],
    ক্যাপ: ['ক্যাপ', 'cap', 'ক্রাউন', 'crown'],
    ইমপ্ল্যান্ট: ['ইমপ্ল্যান্ট', 'implant', 'স্থায়ী কৃত্রিম দাঁত', 'স্থায়ী দাঁত', 'দাঁত বাঁধ'],
    ব্রেসেস: ['ব্রেসেস', 'braces', 'বাঁকা', 'ফাঁকা', 'aligner', 'ক্লিপ', 'সোজা'],
    ফিলিং: ['ফিলিং', 'filling'],
    তোলা: ['তোলা', 'extraction', 'তুলে'],
    সাদা: ['সাদা', 'whitening'],
    শিশু: ['শিশু', 'বাচ্চা', 'kids', 'child'],
    মিরপুর: ['মিরপুর', 'mirpur', 'শেওড়াপাড়া'],
    উত্তরা: ['উত্তরা', 'uttara'],
    বাড্ডা: ['বাড্ডা', 'badda'],
    যাত্রাবাড়ী: ['যাত্রাবাড়ী', 'jatrabari', 'যাত্রাবাড়ি'],
    ঠিকানা: ['ঠিকানা', 'শাখা', 'লোকেশন', 'location', 'branch', 'কোথায়', 'kothay'],
    সময়: ['সময়', 'সময়', 'timing', 'time', 'কখন', 'খোলা'],
    খরচ: ['খরচ', 'ফি', 'প্রাইস', 'price', 'cost', 'টাকা'],
  };

  const matchedTopics = new Set<string>();
  for (const [topic, words] of Object.entries(topics)) {
    for (const word of words) {
      if (qLower.includes(word.toLowerCase())) {
        matchedTopics.add(topic);
        break;
      }
    }
  }

  if (matchedTopics.size === 0) return null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    for (const topic of matchedTopics) {
      if (trimmed.toLowerCase().includes(topic.toLowerCase()) && !trimmed.startsWith('[')) {
        matchedLines.push(trimmed);
        break;
      }
    }
  }

  // If user asked generally about cost/price
  if (matchedLines.length === 0 && matchedTopics.has('খরচ')) {
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('•')) matchedLines.push(trimmed);
    }
  }

  // If user asked generally about branch / locations
  if (matchedLines.length === 0 && matchedTopics.has('ঠিকানা')) {
    for (const line of lines) {
      const trimmed = line.trim();
      if (/^[১-৪1-4]\./u.test(trimmed)) matchedLines.push(trimmed);
    }
  }

  if (matchedLines.length === 0) return null;

  const unique = [...new Set(matchedLines)];
  const extractedText = unique.join('\n');
  const reply =
    'টেক ডেন্টালের ট্রেনিং ডাটা অনুযায়ী আপনার প্রশ্নের তথ্য নিচে দেওয়া হলো:\n\n' +
    extractedText +
    '\n\nআমাদের ৪টি শাখা (মিরপুর, উত্তরা, বাড্ডা, যাত্রাবাড়ী)-তে প্রতিদিন সকাল ১০টা থেকে রাত ৯টা পর্যন্ত বিশেষজ্ঞ ডাক্তার উপস্থিত থাকেন। সিরিয়াল বা যেকোনো তথ্যের জন্য সরাসরি কল করুন: 09638-000505।';

  return { title: 'টেক ডেন্টাল', reply };
}

function logChat(query: string, reply: string, matchedRuleId: number | null, source: string, ip: string | null) {
  try {
    run(
      'INSERT INTO ai_chat_logs (user_query, reply, matched_rule_id, source, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [query, reply, matchedRuleId, source, ip, nowSql()]
    );
  } catch (error) {
    console.error('AI chat log insert failed', error);
  }
}

function nowSql(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

export async function handleAiChat(request: Request, ip: string | null = null): Promise<Response> {
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const query = String(body?.query || body?.message || '').trim();
  if (!query) {
    return json({ success: false, message: 'অনুগ্রহ করে প্রশ্ন লিখুন।' }, 422);
  }

  const history = normalizeChatHistory(body?.history);
  const settings = get<any>('SELECT * FROM ai_chat_settings LIMIT 1');
  const apiKey = String(settings?.gemini_api_key || process.env.GEMINI_API_KEY || '').trim();

  // STEP 1: Google Gemini AI with company training data (primary engine).
  if (settings && bool(settings.gemini_enabled) && apiKey) {
    // The single training-data field carries both the persona/context and the
    // clinic knowledge base, so no separate system prompt is needed.
    const trainingData = settings.training_data ? String(settings.training_data) : DEFAULT_TRAINING_DATA;

    const instructionText = `ROLE & INSTRUCTIONS FOR TECH DENTAL AI ASSISTANT:\n${trainingData}\n\nSTRICT GUIDELINES:
1. Always answer the patient's questions using the above official company training data.
2. For treatment costs (e.g. scaling, root canal, dental caps, implants), quote the exact prices from the training data.
3. Mention our relevant branch locations (মিরপুর, উত্তরা, বাড্ডা, যাত্রাবাড়ী) and official hotline 09638-000505 when helpful.
4. STRICT WHATSAPP RULE: NEVER provide the WhatsApp number (01400-786162) in normal replies. Only provide WhatsApp if the patient specifically asks for WhatsApp or mobile number.
5. Keep the answer warm and concise, and reply in the patient's own language: Bangla or Banglish questions get a polite Bangla answer; English questions get an English answer (prices and facts stay exactly the same).
6. YOUTUBE VIDEOS: If the training data contains a YouTube video link (e.g. https://youtu.be/... or https://www.youtube.com/watch?v=...) related to the treatment, procedure, or topic the patient is inquiring about, include the full YouTube link on its own line so the patient can watch the video directly in the chat box.
7. CRITICAL: Output ONLY the final polite message to the patient. NEVER output internal thoughts, checklists, reasoning, or self-verifications (such as '(2-4 bullet points)? Yes' or 'Checked').
8. DOCTOR & SCHEDULE RULE: For any question about doctor names, duty times or branch schedules, use ONLY the information given in the training data above. NEVER guess or invent a doctor name, duty time or schedule. If a detail is not confirmed there, say it should be confirmed on hotline 09638-000505.
9. BOOKING RULE: If the patient wants an appointment or serial - including how-to questions such as 'সিরিয়াল কিভাবে নেব', 'serial nibo kivabe', 'serial nite chai' - there are exactly TWO options: (a) call the official hotline 09638-000505, or (b) fill the online booking form on the appointment page (the 'অনলাইন বুকিং' button shown with the reply). NEVER provide any booking format or fill-in-the-blank template. NEVER ask for or accept name, phone, branch, date, time, service or address in the chat. NEVER claim a booking is confirmed and NEVER say the patient's details have been 'noted', 'recorded' or 'saved in the system' - the chat cannot save bookings.
10. NO-GUESS RULE: If a fact is not explicitly written in the training data above (for example payment methods such as bKash/Nagad/card/EMI/instalments, discounts or offers, insurance, parking, doctor lists, or any price), do NOT confirm it, do NOT say 'yes we have it', and do NOT guess. Politely say that this information is not available to you and request the patient to call the hotline 09638-000505 for confirmation. Only state a facility or price if it appears word-for-word in the training data.`;

    const requestedModel = settings.gemini_model || 'gemini-3.1-flash-lite';
    const candidateModels = [...new Set([requestedModel, ...resolveGeminiModelCandidates(requestedModel)])];

    for (const model of candidateModels) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const genConfig: Record<string, any> = {
          temperature: 0.3,
          maxOutputTokens: 4096,
        };
        if (model.includes('3.6') || model.includes('thinking')) {
          genConfig.thinkingConfig = { thinkingBudget: 0 };
        }

        const payload = {
          system_instruction: { parts: [{ text: instructionText }] },
          contents: [...history, { role: 'user', parts: [{ text: query }] }],
          generationConfig: genConfig,
        };

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(18000),
        });

        if (response.ok) {
          const resData: any = await response.json().catch(() => ({}));
          const parts = resData?.candidates?.[0]?.content?.parts || [];
          let aiText = '';
          for (const part of parts) {
            if (part?.thought) continue;
            if (part?.text) aiText += part.text;
          }
          aiText = aiText.trim();

          // Strip any potential internal reasoning / checklist leakage.
          aiText = aiText.replace(/^\s*\(?\d+[- ]?\d*\s*bullet points\)?\??.*$/gimu, '');
          aiText = aiText.replace(/^\s*\*?\s*No WhatsApp number mentioned\??.*$/gimu, '');
          aiText = aiText.replace(/^\s*\*?\s*No [৳Tk\/]+.*$/gimu, '');
          aiText = aiText.replace(/^\s*\*?\s*Checked\s*$/gimu, '');
          aiText = aiText.replace(/\n{3,}/g, '\n\n').trim();

          // If user did NOT explicitly ask for WhatsApp, strip the number.
          const isAskingWhatsapp = /whatsapp|হোয়াটসঅ্যাপ|হোয়াটসএপ|হোয়াটসঅ্যাপ|watsapp|what's app/iu.test(query);
          if (!isAskingWhatsapp && aiText) {
            aiText = aiText.replace(/01400[- ]?786162\s*(?:\/|বা|,)\s*/gu, '');
            aiText = aiText.replace(/\s*(?:\/|বা|,)?\s*(?:WhatsApp:\s*)?01400[- ]?786162/giu, '');
            aiText = aiText.replace(/কল করুন:\s*$/gu, 'কল করুন: 09638-000505');
            aiText = aiText.trim();
          }

          if (aiText && [...aiText].length >= 3) {
            logChat(query, aiText, null, 'gemini', ip);
            return json({
              success: true,
              source: 'gemini',
              title: 'টেক ডেন্টাল',
              reply: aiText,
              image: chatReplyImage(query, aiText),
              icon: 'fa-sparkles',
              icon_color: 'text-blue-600',
              icon_bg: 'bg-blue-100',
              action_type: 'appointment',
              action_label: 'অনলাইন সিরিয়াল নিন',
              action_url: '/book-an-appointment',
            });
          }
        }

        const errorBody = await response.text().catch(() => '');
        console.warn(`Gemini model ${model} returned status ${response.status}: ${errorBody.slice(0, 150)}`);
      } catch (error: any) {
        console.error(`Gemini API Exception for ${model}: ${error?.message || error}`);
      }
    }
  }

  // STEP 1.5: Direct knowledge base / training data matcher.
  const trainingData = settings?.training_data ? String(settings.training_data) : DEFAULT_TRAINING_DATA;
  const kbReply = matchTrainingDataAnswer(trainingData, query);
  if (kbReply) {
    logChat(query, kbReply.reply, null, 'gemini', ip);
    return json({
      success: true,
      source: 'gemini',
      title: kbReply.title,
      reply: kbReply.reply,
      image: chatReplyImage(query, kbReply.reply),
      icon: 'fa-sparkles',
      icon_color: 'text-blue-600',
      icon_bg: 'bg-blue-100',
      action_type: 'appointment',
      action_label: 'অনলাইন সিরিয়াল নিন',
      action_url: '/book-an-appointment',
    });
  }

  // STEP 2: Keyword-based rules fallback.
  const cleanQuery = query.toLowerCase();
  const rules = all<any>(
    'SELECT * FROM ai_chat_replies WHERE is_active = 1 ORDER BY priority DESC, id ASC'
  );

  for (const rule of rules) {
    const keywords = String(rule.keywords || '').split(',');
    for (const keyword of keywords) {
      const needle = keyword.trim().toLowerCase();
      if (needle && cleanQuery.includes(needle)) {
        try {
          run('UPDATE ai_chat_replies SET match_count = COALESCE(match_count, 0) + 1 WHERE id = ?', [rule.id]);
        } catch {
          // best effort
        }

        logChat(query, rule.reply, rule.id, 'keyword', ip);

        return json({
          success: true,
          source: 'keyword',
          title: rule.title,
          reply: rule.reply,
          image: chatReplyImage(query, rule.reply),
          icon: rule.icon || 'fa-tooth',
          icon_color: rule.icon_color || 'text-blue-600',
          icon_bg: rule.icon_bg || 'bg-blue-100',
          action_type: rule.action_type || 'none',
          action_label: rule.action_label,
          action_url: rule.action_url,
        });
      }
    }
  }

  // STEP 3: Fallback reply.
  const fallback =
    settings?.fallback_reply ||
    'টেক ডেন্টালের অভিজ্ঞ সার্জনগণ আপনাকে নির্ভুল সেবা প্রদান করবেন। খরচ, ভিজিট সময় বা চিকিৎসকের সাথে কথা বলতে আমাদের হটলাইনে সরাসরি ডায়াল করুন অথবা অনলাইনে সিরিয়াল বুক করুন।';

  logChat(query, fallback, null, 'fallback', ip);

  return json({
    success: true,
    source: 'fallback',
    title: 'টেক ডেন্টাল',
    reply: fallback,
    image: chatReplyImage(query, fallback),
    icon: 'fa-circle-question',
    icon_color: 'text-blue-600',
    icon_bg: 'bg-blue-100',
    action_type: 'appointment',
    action_label: 'অনলাইন অ্যাপয়েন্টমেন্ট',
    action_url: '/book-an-appointment',
  });
}

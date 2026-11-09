<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AiAssistantController extends Controller
{
    const DEFAULT_TRAINING_DATA = "
[প্রতিষ্ঠান পরিচিতি]
প্রতিষ্ঠান: টেক ডেন্টাল কেয়ার (Tech Dental Care)
হটলাইন (কল করার জন্য): 09638-000505
হোয়াটসঅ্যাপ নম্বর (শুধুমাত্র রোগী চাইলে): 01400-786162
ওয়েবসাইট: techdentalcare.com
রোগী দেখার সময়সূচী: প্রতিদিন সকাল ১০:০০ টা থেকে রাত ৯:০০ টা পর্যন্ত (শুক্রবার সাপ্তাহিক ছুটি)।

[শাখাসমূহ ও লোকেশন]
১. মিরপুর শাখা: ৮২৭ (২য় তলা), শেওড়াপাড়া, বেগম রোকেয়া সরণি, ঢাকা (মেট্রোরেল ৩১৮ নং পিলারের পূর্ব পাশে)। হটলাইন: 09638-000505
২. উত্তরা শাখা: আকাশ প্লাজা (২য় তলা), প্লট-২১, রোড-৭/ডি, সেক্টর-০৯, উত্তরা, ঢাকা। হটলাইন: 09638-000505
৩. বাড্ডা শাখা: হাজী আব্দুর রশিদ ম্যানশন (৩য় তলা), উত্তর বাড্ডা বাজার, ঢাকা। হটলাইন: 09638-000505
৪. যাত্রাবাড়ী শাখা: ৩১/সি (৩য় তলা), শহীদ ফারুক রোড, দক্ষিণ যাত্রাবাড়ী, ঢাকা। হটলাইন: 09638-000505

[যোগাযোগের নীতি (STRICT)]
• সাধারণ যেকোনো প্রশ্নের উত্তরে শুধুমাত্র হটলাইন নম্বর 09638-000505 প্রদান করতে হবে।
• সাধারণ উত্তরে কখনোই হোয়াটসঅ্যাপ নম্বর দেওয়া যাবে না।
• শুধুমাত্র যদি রোগী সুনির্দিষ্টভাবে WhatsApp বা মোবাইল নম্বর জানতে চান, তখনই WhatsApp নম্বর 01400-786162 জানাতে হবে।
";
    /**
     * Admin Dashboard view for AI Assistant
     */
    public function adminIndex()
    {
        $settings = DB::table('ai_chat_settings')->first();
        if (!$settings) {
            DB::table('ai_chat_settings')->insert([
                'gemini_api_key' => env('GEMINI_API_KEY', null),
                'gemini_model' => 'gemini-1.5-flash',
                'gemini_enabled' => false,
                'system_prompt' => "You are Tech Dental's smart, warm, and helpful AI assistant for patients in Dhaka, Bangladesh. Answer patient inquiries politely and concisely in clear Bengali. Branches: Mirpur, Uttara, Badda, Jatrabari. Hotline: 01400786162.",
                'chips' => json_encode(["শাখার ঠিকানা কোথায়?", "ফাঁকা দাঁতের চিকিৎসা", "দাঁত ব্যথার চিকিৎসা"], JSON_UNESCAPED_UNICODE),
                'fallback_reply' => "টেক ডেন্টালের দক্ষ স্পেশালিস্ট সার্জন ও কনসালট্যান্টগণ আপনাকে নির্ভুল সেবা প্রদান করবেন। বিস্তারিত জানতে আমাদের হটলাইনে (01400786162) সরাসরি কথা বলুন অথবা অনলাইনে অ্যাপয়েন্টমেন্ট নিন।",
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $settings = DB::table('ai_chat_settings')->first();
        }

        $rules = DB::table('ai_chat_replies')
            ->orderBy('priority', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        $logs = DB::table('ai_chat_logs')
            ->orderBy('id', 'desc')
            ->limit(50)
            ->get();

        return Inertia::render('AiAssistant/AdminIndex', [
            'settings' => $settings,
            'rules' => $rules,
            'logs' => $logs,
        ]);
    }

    /**
     * Update Gemini API & Chat settings
     */
    public function updateSettings(Request $request)
    {
        $request->validate([
            'gemini_model' => 'nullable|string',
            'system_prompt' => 'nullable|string',
            'training_data' => 'nullable|string',
            'fallback_reply' => 'nullable|string',
            'bot_name' => 'nullable|string|max:100',
            'bot_avatar' => 'nullable',
        ]);

        $updateData = [
            'updated_at' => now(),
        ];

        if ($request->has('gemini_api_key')) {
            $updateData['gemini_api_key'] = $request->input('gemini_api_key');
        }
        if ($request->has('gemini_model')) {
            $updateData['gemini_model'] = $request->input('gemini_model', 'gemini-1.5-flash');
        }
        if ($request->has('gemini_enabled')) {
            $updateData['gemini_enabled'] = (bool)$request->input('gemini_enabled', false);
        }
        if ($request->has('system_prompt')) {
            $updateData['system_prompt'] = $request->input('system_prompt');
        }
        if ($request->has('training_data')) {
            $updateData['training_data'] = $request->input('training_data');
        }
        if ($request->has('fallback_reply')) {
            $updateData['fallback_reply'] = $request->input('fallback_reply');
        }
        if ($request->has('bot_name')) {
            $updateData['bot_name'] = $request->input('bot_name') ?: 'Tech Dental Agent';
        }

        // Handle Avatar upload or string path
        if ($request->hasFile('bot_avatar')) {
            $file = $request->file('bot_avatar');
            $filename = time() . '_bot_avatar.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/images');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $file->move($destinationPath, $filename);
            $updateData['bot_avatar'] = '/uploads/images/' . $filename;
        } elseif ($request->has('bot_avatar') && is_string($request->input('bot_avatar'))) {
            $updateData['bot_avatar'] = $request->input('bot_avatar');
        }

        // Handle Starter questions (appearing sequentially before chat starts)
        if ($request->has('starter_questions')) {
            $starterQuestions = $request->input('starter_questions');
            if (is_string($starterQuestions)) {
                if (str_starts_with(trim($starterQuestions), '[')) {
                    $starterQuestions = json_decode($starterQuestions, true);
                } else {
                    $lines = preg_split('/[\r\n]+/', $starterQuestions);
                    if (count($lines) <= 1 && str_contains($starterQuestions, ',')) {
                        $lines = explode(',', $starterQuestions);
                    }
                    $starterQuestions = array_values(array_filter(array_map('trim', $lines)));
                }
            }
            $updateData['starter_questions'] = json_encode($starterQuestions ?: [
                'ফিলিং চিকিৎসার খরচ কত?',
                'দাঁতে গর্ত হলে কি করা উচিৎ?',
                'রুট ক্যানেল করতে কত খরচ হয়?',
                'দাঁত সোজা করার উপায় কি?'
            ], JSON_UNESCAPED_UNICODE);
        }

        if ($request->has('chips')) {
            $chips = $request->input('chips');
            if (is_string($chips)) {
                $chips = array_values(array_filter(array_map('trim', explode(',', $chips))));
            }
            $updateData['chips'] = json_encode($chips ?: ["শাখার ঠিকানা কোথায়?", "ফাঁকা দাঁতের চিকিৎসা", "দাঁত ব্যথার চিকিৎসা"], JSON_UNESCAPED_UNICODE);
        }

        DB::table('ai_chat_settings')->updateOrInsert(
            ['id' => 1],
            $updateData
        );

        return back()->with('success', 'AI Assistant সেটিংস ও ব্র্যান্ডিং সফলভাবে সংরক্ষিত হয়েছে।');
    }

    /**
     * Add new Keyword Rule
     */
    public function storeRule(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'keywords' => 'required|string',
            'reply' => 'required|string',
            'icon' => 'nullable|string',
            'action_type' => 'nullable|string',
            'action_label' => 'nullable|string',
            'action_url' => 'nullable|string',
            'priority' => 'nullable|integer',
        ]);

        DB::table('ai_chat_replies')->insert([
            'title' => $validated['title'],
            'keywords' => $validated['keywords'],
            'reply' => $validated['reply'],
            'icon' => $validated['icon'] ?? 'fa-tooth',
            'icon_color' => $request->input('icon_color', 'text-blue-600'),
            'icon_bg' => $request->input('icon_bg', 'bg-blue-100'),
            'action_type' => $validated['action_type'] ?? 'none',
            'action_label' => $validated['action_label'] ?? null,
            'action_url' => $validated['action_url'] ?? null,
            'priority' => (int)($validated['priority'] ?? 0),
            'is_active' => true,
            'match_count' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'নতুন কিওয়ার্ড রুল সফলভাবে যুক্ত হয়েছে।');
    }

    /**
     * Update Keyword Rule
     */
    public function updateRule(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'keywords' => 'required|string',
            'reply' => 'required|string',
            'icon' => 'nullable|string',
            'action_type' => 'nullable|string',
            'action_label' => 'nullable|string',
            'action_url' => 'nullable|string',
            'priority' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        DB::table('ai_chat_replies')->where('id', $id)->update([
            'title' => $validated['title'],
            'keywords' => $validated['keywords'],
            'reply' => $validated['reply'],
            'icon' => $validated['icon'] ?? 'fa-tooth',
            'icon_color' => $request->input('icon_color', 'text-blue-600'),
            'icon_bg' => $request->input('icon_bg', 'bg-blue-100'),
            'action_type' => $validated['action_type'] ?? 'none',
            'action_label' => $validated['action_label'] ?? null,
            'action_url' => $validated['action_url'] ?? null,
            'priority' => (int)($validated['priority'] ?? 0),
            'is_active' => $request->has('is_active') ? (bool)$request->input('is_active') : true,
            'updated_at' => now(),
        ]);

        return back()->with('success', 'কিওয়ার্ড রুল আপডেট করা হয়েছে।');
    }

    /**
     * Delete Keyword Rule
     */
    public function deleteRule($id)
    {
        DB::table('ai_chat_replies')->where('id', $id)->delete();
        return back()->with('success', 'কিওয়ার্ড রুল মুছে ফেলা হয়েছে।');
    }

    /**
     * Toggle Rule Status
     */
    public function toggleRule($id)
    {
        $rule = DB::table('ai_chat_replies')->where('id', $id)->first();
        if ($rule) {
            DB::table('ai_chat_replies')->where('id', $id)->update([
                'is_active' => !$rule->is_active,
                'updated_at' => now(),
            ]);
        }
        return back();
    }

    /**
     * Public AI Chat Streaming API Endpoint (POST /api/ai-chat/stream)
     * Real-time streaming response using Google Gemini streamGenerateContent (SSE)
     */
    public function streamChatApi(Request $request)
    {
        $query = trim($request->input('query') ?: $request->input('message') ?: '');
        if (empty($query)) {
            return response()->json([
                'error' => 'অনুগ্রহ করে প্রশ্ন লিখুন।',
            ], 422);
        }

        $settings = DB::table('ai_chat_settings')->first();
        $apiKey = trim($settings->gemini_api_key ?? env('GEMINI_API_KEY', ''));

        return response()->stream(function () use ($request, $query, $settings, $apiKey) {
            // Disable output buffering for instant flushing
            while (ob_get_level() > 0) {
                @ob_end_flush();
            }

            $sendEvent = function ($payload) {
                echo "data: " . json_encode($payload, JSON_UNESCAPED_UNICODE) . "\n\n";
                if (ob_get_level() > 0) {
                    @ob_flush();
                }
                flush();
            };

            $isAskingWhatsapp = (bool)preg_match('/whatsapp|হোয়াটসঅ্যাপ|হোয়াটসএপ|হোয়াটসঅ্যাপ|watsapp|what\'s app/ui', $query);

            // 1. Google Gemini AI Streaming
            if ($settings && $settings->gemini_enabled && !empty($apiKey)) {
                $systemPrompt = $settings->system_prompt ?: "You are Tech Dental's smart, warm, and helpful AI assistant for patients in Dhaka, Bangladesh. Answer patient inquiries politely and concisely in clear Bengali. Always prioritize Tech Dental's branches and pricing from the training data.";
                $trainingData = !empty($settings->training_data) ? $settings->training_data : self::DEFAULT_TRAINING_DATA;

                $instructionText = "ROLE & INSTRUCTIONS FOR TECH DENTAL AI ASSISTANT:\n{$systemPrompt}\n\n### TECH DENTAL OFFICIAL COMPANY TRAINING DATA & KNOWLEDGE BASE:\n{$trainingData}\n\nSTRICT GUIDELINES:
1. Always answer the patient's questions using the above official company training data.
2. For treatment costs (e.g. scaling, root canal, dental caps, implants), quote the exact prices from the training data.
3. Mention our relevant branch locations (মিরপুর, উত্তরা, বাড্ডা, যাত্রাবাড়ী) and official hotline 09638-000505 when helpful.
4. STRICT WHATSAPP RULE: NEVER provide the WhatsApp number (01400-786162) in normal replies. Only provide WhatsApp if the patient specifically asks for WhatsApp or mobile number.
5. Keep the answer warm, concise (2-4 bullet points), and in polite Bengali text format only.
6. YOUTUBE VIDEOS: If the training data contains a YouTube video link (e.g. https://youtu.be/... or https://www.youtube.com/watch?v=...) related to the treatment, procedure, or topic the patient is inquiring about, include the full YouTube link on its own line so the patient can watch the video directly in the chat box.
7. CRITICAL: Output ONLY the final polite Bengali message to the patient. NEVER output internal thoughts, checklists, reasoning, or self-verifications (such as '(2-4 bullet points)? Yes' or 'Checked').";

                $candidateModels = array_values(array_unique(array_merge(
                    [$settings->gemini_model ?? 'gemini-3.1-flash-lite'],
                    $this->resolveGeminiModelCandidates($settings->gemini_model ?? 'gemini-3.1-flash-lite')
                )));

                foreach ($candidateModels as $model) {
                    try {
                        $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:streamGenerateContent?alt=sse&key={$apiKey}";
                        $genConfig = [
                            'temperature' => 0.3,
                            'maxOutputTokens' => 4096,
                        ];
                        if (str_contains($model, '3.6') || str_contains($model, 'thinking')) {
                            $genConfig['thinkingConfig'] = ['thinkingBudget' => 0];
                        }

                        $payload = [
                            'system_instruction' => [
                                'parts' => [
                                    ['text' => $instructionText]
                                ]
                            ],
                            'contents' => [
                                [
                                    'role' => 'user',
                                    'parts' => [
                                        ['text' => $query]
                                    ]
                                ]
                            ],
                            'generationConfig' => $genConfig
                        ];

                        $lineBuffer = '';
                        $fullAiText = '';

                        $ch = curl_init($apiUrl);
                        curl_setopt($ch, CURLOPT_POST, true);
                        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
                        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
                        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                        curl_setopt($ch, CURLOPT_TIMEOUT, 35);
                        curl_setopt($ch, CURLOPT_WRITEFUNCTION, function ($chRef, $chunk) use (&$lineBuffer, &$fullAiText, $sendEvent) {
                            $lineBuffer .= $chunk;
                            while (($newlinePos = strpos($lineBuffer, "\n")) !== false) {
                                $line = substr($lineBuffer, 0, $newlinePos);
                                $lineBuffer = substr($lineBuffer, $newlinePos + 1);
                                $line = trim($line);
                                if (str_starts_with($line, 'data: ')) {
                                    $jsonStr = substr($line, 6);
                                    $data = json_decode($jsonStr, true);
                                    if ($data && isset($data['candidates'][0]['content']['parts'])) {
                                        $segment = '';
                                        foreach ($data['candidates'][0]['content']['parts'] as $p) {
                                            if (empty($p['thought']) && !empty($p['text'])) {
                                                $segment .= $p['text'];
                                            }
                                        }
                                        if ($segment !== '') {
                                            $fullAiText .= $segment;
                                            $sendEvent(['chunk' => $segment]);
                                        }
                                    }
                                }
                            }
                            return strlen($chunk);
                        });

                        curl_exec($ch);
                        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                        curl_close($ch);

                        if ($httpCode === 200 && mb_strlen(trim($fullAiText)) >= 10) {
                            $cleanFull = trim($fullAiText);
                            $cleanFull = preg_replace('/^\s*\(?\d+[- ]?\d*\s*bullet points\)?\??.*$/umi', '', $cleanFull);
                            $cleanFull = preg_replace('/^\s*\*?\s*No WhatsApp number mentioned\??.*$/umi', '', $cleanFull);
                            $cleanFull = preg_replace('/^\s*\*?\s*No [৳Tk\/]+.*$/umi', '', $cleanFull);
                            $cleanFull = preg_replace('/^\s*\*?\s*Checked\s*$/umi', '', $cleanFull);
                            $cleanFull = trim(preg_replace('/\n{3,}/', "\n\n", $cleanFull));

                            if (!$isAskingWhatsapp) {
                                $cleanFull = preg_replace('/01400[- ]?786162\s*(?:\/|বা|,)\s*/u', '', $cleanFull);
                                $cleanFull = preg_replace('/\s*(?:\/|বা|,)?\s*(?:WhatsApp:\s*)?01400[- ]?786162/ui', '', $cleanFull);
                                $cleanFull = preg_replace('/কল করুন:\s*$/u', 'কল করুন: 09638-000505', $cleanFull);
                                $cleanFull = trim($cleanFull);
                            }

                            // Log query to database
                            DB::table('ai_chat_logs')->insert([
                                'user_query' => $query,
                                'reply' => $cleanFull,
                                'matched_rule_id' => null,
                                'source' => 'gemini',
                                'ip_address' => $request->ip(),
                                'created_at' => now(),
                            ]);

                            $sendEvent([
                                'done' => true,
                                'full_text' => $cleanFull,
                                'source' => 'gemini',
                                'title' => 'টেক ডেন্টাল',
                                'icon' => 'fa-sparkles',
                                'icon_color' => 'text-blue-600',
                                'icon_bg' => 'bg-blue-100',
                                'action_type' => 'appointment',
                                'action_label' => 'অনলাইন সিরিয়াল নিন',
                                'action_url' => '/appointment',
                            ]);
                            return;
                        }

                        // Try next candidate model if this one failed
                        continue;
                    } catch (\Throwable $e) {
                        Log::error("Gemini Stream Exception for {$model}: " . $e->getMessage());
                    }
                }
            }

            // 2. Training Data Matcher Fallback (Stream smoothly)
            $trainingData = !empty($settings->training_data) ? $settings->training_data : self::DEFAULT_TRAINING_DATA;
            $kbReply = $this->matchTrainingDataAnswer($trainingData, $query);
            if ($kbReply) {
                $replyText = $kbReply['reply'];
                if (!$isAskingWhatsapp) {
                    $replyText = preg_replace('/01400[- ]?786162\s*(?:\/|বা|,)\s*/u', '', $replyText);
                    $replyText = preg_replace('/\s*(?:\/|বা|,)?\s*(?:WhatsApp:\s*)?01400[- ]?786162/ui', '', $replyText);
                    $replyText = preg_replace('/কল করুন:\s*$/u', 'কল করুন: 09638-000505', $replyText);
                    $replyText = trim($replyText);
                }

                $segments = mb_str_split($replyText, 6);
                foreach ($segments as $seg) {
                    $sendEvent(['chunk' => $seg]);
                    usleep(15000);
                }

                DB::table('ai_chat_logs')->insert([
                    'user_query' => $query,
                    'reply' => $replyText,
                    'matched_rule_id' => null,
                    'source' => 'gemini',
                    'ip_address' => $request->ip(),
                    'created_at' => now(),
                ]);

                $sendEvent([
                    'done' => true,
                    'full_text' => $replyText,
                    'source' => 'gemini',
                    'title' => $kbReply['title'],
                    'icon' => 'fa-sparkles',
                    'icon_color' => 'text-blue-600',
                    'icon_bg' => 'bg-blue-100',
                    'action_type' => 'appointment',
                    'action_label' => 'অনলাইন সিরিয়াল নিন',
                    'action_url' => '/appointment',
                ]);
                return;
            }

            // 3. Keyword-based rules fallback
            $cleanQuery = mb_strtolower($query, 'UTF-8');
            $rules = DB::table('ai_chat_replies')
                ->where('is_active', 1)
                ->orderBy('priority', 'desc')
                ->orderBy('id', 'asc')
                ->get();

            foreach ($rules as $rule) {
                $keywords = explode(',', $rule->keywords);
                foreach ($keywords as $kw) {
                    $kw = trim(mb_strtolower($kw, 'UTF-8'));
                    if (!empty($kw) && mb_strpos($cleanQuery, $kw) !== false) {
                        DB::table('ai_chat_replies')->where('id', $rule->id)->increment('match_count');

                        $segments = mb_str_split($rule->reply, 6);
                        foreach ($segments as $seg) {
                            $sendEvent(['chunk' => $seg]);
                            usleep(15000);
                        }

                        DB::table('ai_chat_logs')->insert([
                            'user_query' => $query,
                            'reply' => $rule->reply,
                            'matched_rule_id' => $rule->id,
                            'source' => 'keyword',
                            'ip_address' => $request->ip(),
                            'created_at' => now(),
                        ]);

                        $sendEvent([
                            'done' => true,
                            'full_text' => $rule->reply,
                            'source' => 'keyword',
                            'title' => $rule->title,
                            'icon' => $rule->icon ?: 'fa-tooth',
                            'icon_color' => $rule->icon_color ?: 'text-blue-600',
                            'icon_bg' => $rule->icon_bg ?: 'bg-blue-100',
                            'action_type' => $rule->action_type ?: 'none',
                            'action_label' => $rule->action_label,
                            'action_url' => $rule->action_url,
                        ]);
                        return;
                    }
                }
            }

            // 4. Default Fallback
            $fallback = $settings->fallback_reply ?? "টেক ডেন্টালের অভিজ্ঞ সার্জনগণ আপনাকে নির্ভুল সেবা প্রদান করবেন। খরচ, ভিজিট সময় বা চিকিৎসকের সাথে কথা বলতে আমাদের হটলাইনে সরাসরি ডায়াল করুন অথবা অনলাইনে সিরিয়াল বুক করুন।";

            $segments = mb_str_split($fallback, 6);
            foreach ($segments as $seg) {
                $sendEvent(['chunk' => $seg]);
                usleep(15000);
            }

            DB::table('ai_chat_logs')->insert([
                'user_query' => $query,
                'reply' => $fallback,
                'matched_rule_id' => null,
                'source' => 'fallback',
                'ip_address' => $request->ip(),
                'created_at' => now(),
            ]);

            $sendEvent([
                'done' => true,
                'full_text' => $fallback,
                'source' => 'fallback',
                'title' => 'টেক ডেন্টাল',
                'icon' => 'fa-circle-question',
                'icon_color' => 'text-blue-600',
                'icon_bg' => 'bg-blue-100',
                'action_type' => 'appointment',
                'action_label' => 'অনলাইন অ্যাপয়েন্টমেন্ট',
                'action_url' => '/appointment',
            ]);
        }, 200, [
            'Content-Type' => 'text/event-stream; charset=UTF-8',
            'Cache-Control' => 'no-cache, no-transform',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    /**
     * Public AI Chat API Endpoint (POST /api/ai-chat)
     */
    public function chatApi(Request $request)
    {
        $query = trim($request->input('query') ?: $request->input('message') ?: '');
        if (empty($query)) {
            return response()->json([
                'success' => false,
                'message' => 'অনুগ্রহ করে প্রশ্ন লিখুন।',
            ], 422);
        }

        $settings = DB::table('ai_chat_settings')->first();
        $apiKey = trim($settings->gemini_api_key ?? env('GEMINI_API_KEY', ''));

        // STEP 1: Google Gemini AI with Company Training Data (PRIMARY ENGINE)
        // If Gemini is enabled, every patient question is answered directly by Gemini using your company training data!
        if ($settings && $settings->gemini_enabled && !empty($apiKey)) {
            $systemPrompt = $settings->system_prompt ?: "You are Tech Dental's smart, warm, and helpful AI assistant for patients in Dhaka, Bangladesh. Answer patient inquiries politely and concisely in clear Bengali. Always prioritize Tech Dental's branches and pricing from the training data.";
            $trainingData = !empty($settings->training_data) ? $settings->training_data : self::DEFAULT_TRAINING_DATA;

            $instructionText = "ROLE & INSTRUCTIONS FOR TECH DENTAL AI ASSISTANT:\n{$systemPrompt}\n\n### TECH DENTAL OFFICIAL COMPANY TRAINING DATA & KNOWLEDGE BASE:\n{$trainingData}\n\nSTRICT GUIDELINES:
1. Always answer the patient's questions using the above official company training data.
2. For treatment costs (e.g. scaling, root canal, dental caps, implants), quote the exact prices from the training data.
3. Mention our relevant branch locations (মিরপুর, উত্তরা, বাড্ডা, যাত্রাবাড়ী) and official hotline 09638-000505 when helpful.
4. STRICT WHATSAPP RULE: NEVER provide the WhatsApp number (01400-786162) in normal replies. Only provide WhatsApp if the patient specifically asks for WhatsApp or mobile number.
5. Keep the answer warm, concise (2-4 bullet points), and in polite Bengali text format only.
6. YOUTUBE VIDEOS: If the training data contains a YouTube video link (e.g. https://youtu.be/... or https://www.youtube.com/watch?v=...) related to the treatment, procedure, or topic the patient is inquiring about, include the full YouTube link on its own line so the patient can watch the video directly in the chat box.
7. CRITICAL: Output ONLY the final polite Bengali message to the patient. NEVER output internal thoughts, checklists, reasoning, or self-verifications (such as '(2-4 bullet points)? Yes' or 'Checked').";

            $candidateModels = array_values(array_unique(array_merge(
                [$settings->gemini_model ?? 'gemini-3.1-flash-lite'],
                $this->resolveGeminiModelCandidates($settings->gemini_model ?? 'gemini-3.1-flash-lite')
            )));

            foreach ($candidateModels as $model) {
                try {
                    $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

                    $genConfig = [
                        'temperature' => 0.3,
                        'maxOutputTokens' => 4096,
                    ];
                    if (str_contains($model, '3.6') || str_contains($model, 'thinking')) {
                        $genConfig['thinkingConfig'] = ['thinkingBudget' => 0];
                    }

                    $payload = [
                        'system_instruction' => [
                            'parts' => [
                                ['text' => $instructionText]
                            ]
                        ],
                        'contents' => [
                            [
                                'role' => 'user',
                                'parts' => [
                                    ['text' => $query]
                                ]
                            ]
                        ],
                        'generationConfig' => $genConfig
                    ];

                    $response = Http::withoutVerifying()->timeout(18)->post($apiUrl, $payload);

                    if ($response->successful()) {
                        $resData = $response->json();
                        $parts = $resData['candidates'][0]['content']['parts'] ?? [];
                        $aiText = '';
                        foreach ($parts as $part) {
                            if (!empty($part['thought'])) {
                                continue;
                            }
                            if (!empty($part['text'])) {
                                $aiText .= $part['text'];
                            }
                        }
                        $aiText = trim($aiText);

                        // Strip any potential internal reasoning / checklist leakage
                        $aiText = preg_replace('/^\s*\(?\d+[- ]?\d*\s*bullet points\)?\??.*$/umi', '', $aiText);
                        $aiText = preg_replace('/^\s*\*?\s*No WhatsApp number mentioned\??.*$/umi', '', $aiText);
                        $aiText = preg_replace('/^\s*\*?\s*No [৳Tk\/]+.*$/umi', '', $aiText);
                        $aiText = preg_replace('/^\s*\*?\s*Checked\s*$/umi', '', $aiText);
                        $aiText = trim(preg_replace('/\n{3,}/', "\n\n", $aiText));

                        // If user did NOT explicitly ask for WhatsApp, strip WhatsApp number from normal responses
                        $isAskingWhatsapp = (bool)preg_match('/whatsapp|হোয়াটসঅ্যাপ|হোয়াটসএপ|হোয়াটসঅ্যাপ|watsapp|what\'s app/ui', $query);
                        if (!$isAskingWhatsapp && !empty($aiText)) {
                            $aiText = preg_replace('/01400[- ]?786162\s*(?:\/|বা|,)\s*/u', '', $aiText);
                            $aiText = preg_replace('/\s*(?:\/|বা|,)?\s*(?:WhatsApp:\s*)?01400[- ]?786162/ui', '', $aiText);
                            $aiText = preg_replace('/কল করুন:\s*$/u', 'কল করুন: 09638-000505', $aiText);
                            $aiText = trim($aiText);
                        }

                        if (!empty($aiText) && mb_strlen($aiText) >= 3) {
                            DB::table('ai_chat_logs')->insert([
                                'user_query' => $query,
                                'reply' => $aiText,
                                'matched_rule_id' => null,
                                'source' => 'gemini',
                                'ip_address' => $request->ip(),
                                'created_at' => now(),
                            ]);

                            return response()->json([
                                'success' => true,
                                'source' => 'gemini',
                                'title' => 'টেক ডেন্টাল',
                                'reply' => $aiText,
                                'icon' => 'fa-sparkles',
                                'icon_color' => 'text-blue-600',
                                'icon_bg' => 'bg-blue-100',
                                'action_type' => 'appointment',
                                'action_label' => 'অনলাইন সিরিয়াল নিন',
                                'action_url' => '/appointment',
                            ]);
                        }
                    }

                    Log::warning("Gemini model {$model} returned status {$response->status()}: " . substr($response->body(), 0, 150));
                    continue;
                } catch (\Exception $e) {
                    Log::error("Gemini API Exception for {$model}: " . $e->getMessage());
                }
            }
        }

        // STEP 1.5: Direct Knowledge Base / Training Data Matcher
        // Matches questions directly from the clinic's official training data (costs, branches, timings)
        $trainingData = !empty($settings->training_data) ? $settings->training_data : self::DEFAULT_TRAINING_DATA;
        $kbReply = $this->matchTrainingDataAnswer($trainingData, $query);
        if ($kbReply) {
            DB::table('ai_chat_logs')->insert([
                'user_query' => $query,
                'reply' => $kbReply['reply'],
                'matched_rule_id' => null,
                'source' => 'gemini',
                'ip_address' => $request->ip(),
                'created_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'source' => 'gemini',
                'title' => $kbReply['title'],
                'reply' => $kbReply['reply'],
                'icon' => 'fa-sparkles',
                'icon_color' => 'text-blue-600',
                'icon_bg' => 'bg-blue-100',
                'action_type' => 'appointment',
                'action_label' => 'অনলাইন সিরিয়াল নিন',
                'action_url' => '/appointment',
            ]);
        }

        // STEP 2: Keyword-based rules fallback (if Gemini is offline, disabled or no API key)
        $cleanQuery = mb_strtolower($query, 'UTF-8');
        $rules = DB::table('ai_chat_replies')
            ->where('is_active', 1)
            ->orderBy('priority', 'desc')
            ->orderBy('id', 'asc')
            ->get();

        foreach ($rules as $rule) {
            $keywords = explode(',', $rule->keywords);
            foreach ($keywords as $kw) {
                $kw = trim(mb_strtolower($kw, 'UTF-8'));
                if (!empty($kw) && mb_strpos($cleanQuery, $kw) !== false) {
                    // Match found!
                    DB::table('ai_chat_replies')->where('id', $rule->id)->increment('match_count');

                    // Log query
                    DB::table('ai_chat_logs')->insert([
                        'user_query' => $query,
                        'reply' => $rule->reply,
                        'matched_rule_id' => $rule->id,
                        'source' => 'keyword',
                        'ip_address' => $request->ip(),
                        'created_at' => now(),
                    ]);

                    return response()->json([
                        'success' => true,
                        'source' => 'keyword',
                        'title' => $rule->title,
                        'reply' => $rule->reply,
                        'icon' => $rule->icon ?: 'fa-tooth',
                        'icon_color' => $rule->icon_color ?: 'text-blue-600',
                        'icon_bg' => $rule->icon_bg ?: 'bg-blue-100',
                        'action_type' => $rule->action_type ?: 'none',
                        'action_label' => $rule->action_label,
                        'action_url' => $rule->action_url,
                    ]);
                }
            }
        }

        // STEP 3: Fallback Reply
        $fallback = $settings->fallback_reply ?? "টেক ডেন্টালের অভিজ্ঞ সার্জনগণ আপনাকে নির্ভুল সেবা প্রদান করবেন। খরচ, ভিজিট সময় বা চিকিৎসকের সাথে কথা বলতে আমাদের হটলাইনে সরাসরি ডায়াল করুন অথবা অনলাইনে সিরিয়াল বুক করুন।";

        DB::table('ai_chat_logs')->insert([
            'user_query' => $query,
            'reply' => $fallback,
            'matched_rule_id' => null,
            'source' => 'fallback',
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'source' => 'fallback',
            'title' => 'টেক ডেন্টাল',
            'reply' => $fallback,
            'icon' => 'fa-circle-question',
            'icon_color' => 'text-blue-600',
            'icon_bg' => 'bg-blue-100',
            'action_type' => 'appointment',
            'action_label' => 'অনলাইন অ্যাপয়েন্টমেন্ট',
            'action_url' => '/appointment',
        ]);
    }

    /**
     * Match queries directly against clinic training data knowledge base
     */
    protected function matchTrainingDataAnswer(?string $trainingData, string $query): ?array
    {
        if (empty($trainingData)) {
            return null;
        }

        $qLower = mb_strtolower($query, 'UTF-8');
        $lines = explode("\n", $trainingData);
        $matchedLines = [];

        $topics = [
            'স্কেলিং' => ['স্কেলিং', 'scaling', 'পরিষ্কার', 'ওয়াশ', 'wash'],
            'রুট ক্যানেল' => ['রুট ক্যানেল', 'rct', 'root canal', 'ব্যথা'],
            'ক্যাপ' => ['ক্যাপ', 'cap', 'ক্রাউন', 'crown'],
            'ইমপ্ল্যান্ট' => ['ইমপ্ল্যান্ট', 'implant', 'স্থায়ী কৃত্রিম দাঁত', 'স্থায়ী দাঁত', 'দাঁত বাঁধ'],
            'ব্রেসেস' => ['ব্রেসেস', 'braces', 'বাঁকা', 'ফাঁকা', 'aligner', 'ক্লিপ', 'সোজা'],
            'ফিলিং' => ['ফিলিং', 'filling'],
            'তোলা' => ['তোলা', 'extraction', 'তুলে'],
            'সাদা' => ['সাদা', 'whitening'],
            'শিশু' => ['শিশু', 'বাচ্চা', 'kids', 'child'],
            'মিরপুর' => ['মিরপুর', 'mirpur', 'শেওড়াপাড়া'],
            'উত্তরা' => ['উত্তরা', 'uttara'],
            'বাড্ডা' => ['বাড্ডা', 'badda'],
            'যাত্রাবাড়ী' => ['যাত্রাবাড়ী', 'jatrabari', 'যাত্রাবাড়ি'],
            'ঠিকানা' => ['ঠিকানা', 'শাখা', 'লোকেশন', 'location', 'branch', 'কোথায়', 'kothay'],
            'সময়' => ['সময়', 'সময়', 'timing', 'time', 'কখন', 'খোলা'],
            'খরচ' => ['খরচ', 'ফি', 'প্রাইস', 'price', 'cost', 'টাকা'],
        ];

        $matchedTopics = [];
        foreach ($topics as $topic => $words) {
            foreach ($words as $w) {
                if (mb_strpos($qLower, $w) !== false) {
                    $matchedTopics[$topic] = true;
                    break;
                }
            }
        }

        if (empty($matchedTopics)) {
            return null;
        }

        foreach ($lines as $line) {
            $lineTrim = trim($line);
            if (empty($lineTrim)) continue;

            foreach ($matchedTopics as $top => $_) {
                if (mb_stripos($lineTrim, $top) !== false && !str_starts_with($lineTrim, '[')) {
                    $matchedLines[] = $lineTrim;
                    break;
                }
            }
        }

        // If user asked generally about cost/price
        if (empty($matchedLines) && isset($matchedTopics['খরচ'])) {
            foreach ($lines as $line) {
                $lineTrim = trim($line);
                if (str_starts_with($lineTrim, '•')) {
                    $matchedLines[] = $lineTrim;
                }
            }
        }

        // If user asked generally about branch / locations
        if (empty($matchedLines) && isset($matchedTopics['ঠিকানা'])) {
            foreach ($lines as $line) {
                $lineTrim = trim($line);
                if (preg_match('/^[১-৪1-4]\./u', $lineTrim)) {
                    $matchedLines[] = $lineTrim;
                }
            }
        }

        if (empty($matchedLines)) {
            return null;
        }

        $matchedLines = array_unique($matchedLines);
        $extractedText = implode("\n", $matchedLines);

        $reply = "টেক ডেন্টালের ট্রেনিং ডাটা অনুযায়ী আপনার প্রশ্নের তথ্য নিচে দেওয়া হলো:\n\n" . $extractedText . "\n\nআমাদের ৪টি শাখা (মিরপুর, উত্তরা, বাড্ডা, যাত্রাবাড়ী)-তে প্রতিদিন সকাল ১০টা থেকে রাত ৯টা পর্যন্ত বিশেষজ্ঞ ডাক্তার উপস্থিত থাকেন। সিরিয়াল বা যেকোনো তথ্যের জন্য সরাসরি কল করুন: 09638-000505।";

        return [
            'title' => 'টেক ডেন্টাল',
            'reply' => $reply,
        ];
    }

    /**
     * Resolve candidate Gemini models in order of priority, auto-migrating deprecated models
     */
    private function resolveGeminiModelCandidates(?string $model): array
    {
        $requested = trim($model ?: '');

        // Auto-migrate deprecated 1.5, 2.0 or invalid non-preview 3 models
        if (in_array($requested, ['gemini-2.0-flash', 'gemini-2.0', 'gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-3-flash'])) {
            $requested = 'gemini-3.5-flash-lite';
        }
        if (in_array($requested, ['gemini-2.0-pro', 'gemini-2.0-pro-exp', 'gemini-3-pro'])) {
            $requested = 'gemini-2.5-pro';
        }

        $candidates = [];
        if (!empty($requested)) {
            $candidates[] = $requested;
            if (str_contains($requested, '-preview')) {
                $candidates[] = str_replace('-preview', '', $requested);
            }
        }
        // Verified high-quota & active models supported by Google AI Studio
        $candidates[] = 'gemini-3.5-flash-lite';
        $candidates[] = 'gemini-3.1-flash-lite';
        $candidates[] = 'gemini-2.5-flash';
        $candidates[] = 'gemini-flash-latest';
        $candidates[] = 'gemini-flash-lite-latest';
        $candidates[] = 'gemini-3.6-flash';

        return array_values(array_unique($candidates));
    }

    /**
     * Fetch Live Available Models directly from Google Gemini API
     */
    public function fetchModels(Request $request)
    {
        $settings = DB::table('ai_chat_settings')->first();
        $apiKey = trim($request->input('gemini_api_key') ?: ($settings->gemini_api_key ?? ''));

        if (empty($apiKey)) {
            return response()->json([
                'success' => false,
                'message' => 'API Key প্রদান করুন',
                'models' => [],
            ], 422);
        }

        try {
            $response = Http::withoutVerifying()->timeout(12)->get("https://generativelanguage.googleapis.com/v1beta/models?key={$apiKey}");

            if ($response->successful()) {
                $data = $response->json();
                $rawModels = $data['models'] ?? [];
                $filtered = [];

                foreach ($rawModels as $m) {
                    $methods = $m['supportedGenerationMethods'] ?? [];
                    if (in_array('generateContent', $methods)) {
                        $cleanId = str_replace('models/', '', $m['name']);
                        $filtered[] = [
                            'id' => $cleanId,
                            'name' => $cleanId,
                            'displayName' => $m['displayName'] ?? $cleanId,
                            'description' => $m['description'] ?? '',
                        ];
                    }
                }

                return response()->json([
                    'success' => true,
                    'models' => $filtered,
                ]);
            }

            $errorData = $response->json();
            return response()->json([
                'success' => false,
                'message' => 'গুগল মডেল ফেচ ব্যর্থ: ' . ($errorData['error']['message'] ?? $response->body()),
                'models' => [],
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'কানেকশন এরর: ' . $e->getMessage(),
                'models' => [],
            ], 500);
        }
    }

    /**
     * Test Gemini API Connection directly from Admin Panel with auto-retry and model migration
     */
    public function testGemini(Request $request)
    {
        $settings = DB::table('ai_chat_settings')->first();
        $apiKey = trim($request->input('gemini_api_key') ?: ($settings->gemini_api_key ?? ''));
        $requestedModel = trim($request->input('gemini_model') ?: ($settings->gemini_model ?? 'gemini-3-flash'));
        $testPrompt = trim($request->input('prompt') ?: 'হ্যালো, আপনি কি টেক ডেন্টালের এআই অ্যাসিস্ট্যান্ট হিসেবে ঠিকমত কাজ করছেন? সংক্ষেপে ১-২ লাইনে মিষ্টি করে বাংলায় উত্তর দিন।');
        $trainingData = $request->input('training_data') ?: ($settings->training_data ?? '');

        if (empty($apiKey)) {
            return response()->json([
                'success' => false,
                'message' => 'কোনো Gemini API Key পাওয়া যায়নি! দয়া করে ইনপুট বক্সে আপনার Google Gemini API Key দিন।',
            ], 422);
        }

        $instructionText = "ROLE & INSTRUCTIONS: You are Tech Dental's official AI assistant in Dhaka, Bangladesh. Answer politely, accurately, and concisely in Bengali.";
        if (!empty($trainingData)) {
            $instructionText .= "\n\n### TECH DENTAL OFFICIAL TRAINING DATA:\n" . mb_substr($trainingData, 0, 3000);
        }

        $candidateModels = array_values(array_unique(array_merge([$requestedModel], $this->resolveGeminiModelCandidates($requestedModel))));

        // Also attempt to dynamically pull Google's exact active models as backup
        try {
            $listRes = Http::withoutVerifying()->timeout(6)->get("https://generativelanguage.googleapis.com/v1beta/models?key={$apiKey}");
            if ($listRes->successful()) {
                $onlineModels = $listRes->json()['models'] ?? [];
                foreach ($onlineModels as $om) {
                    if (in_array('generateContent', $om['supportedGenerationMethods'] ?? [])) {
                        $candidateModels[] = str_replace('models/', '', $om['name']);
                    }
                }
                $candidateModels = array_values(array_unique($candidateModels));
            }
        } catch (\Exception $e) {
            // Ignore listModels error
        }

        $lastError = null;
        $lastErrorCode = 400;

        foreach ($candidateModels as $model) {
            $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

            $payload = [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => "{$instructionText}\n\nPATIENT TEST QUESTION: {$testPrompt}"]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.4,
                    'maxOutputTokens' => 4096,
                    'responseModalities' => ['TEXT'],
                ]
            ];

            try {
                $startTime = microtime(true);
                $response = Http::withoutVerifying()->timeout(15)->post($apiUrl, $payload);
                $latencyMs = round((microtime(true) - $startTime) * 1000);

                if ($response->successful()) {
                    $resData = $response->json();
                    $parts = $resData['candidates'][0]['content']['parts'] ?? [];
                    $aiText = '';
                    foreach ($parts as $part) {
                        if (!empty($part['text'])) {
                            $aiText .= $part['text'];
                        }
                    }
                    $aiText = trim($aiText);

                    // If audio/multimodal data was returned
                    if (empty($aiText) && !empty($parts)) {
                        foreach ($parts as $part) {
                            if (!empty($part['inlineData'])) {
                                $aiText = "Gemini API সফলভাবে রেসপন্স করেছে (অডিও/মিডিয়া ডাটা)। আপনার এপিআই ও মডেল সঠিকভাবে সক্রিয় রয়েছে!";
                                break;
                            }
                        }
                    }

                    if (!empty($aiText)) {
                        // If model had to be auto-migrated from deprecated, update settings in DB
                        if ($model !== $requestedModel) {
                            DB::table('ai_chat_settings')->where('id', 1)->update([
                                'gemini_model' => $model,
                                'updated_at' => now(),
                            ]);
                        }

                        $note = ($model !== $requestedModel)
                            ? " (অপ্রচলিত মডেলের বদলে অ্যাক্টিভ মডেল '{$model}' সফলভাবে ব্যবহৃত হয়েছে)"
                            : "";

                        return response()->json([
                            'success' => true,
                            'message' => 'অভিনন্দন! আপনার Google Gemini API সফলভাবে সংযুক্ত এবং সক্রিয় রয়েছে' . $note . '।',
                            'reply' => $aiText,
                            'model' => $model,
                            'latency_ms' => $latencyMs,
                            'status_code' => $response->status(),
                        ]);
                    }
                }

                $errorData = $response->json();
                $lastError = $errorData['error']['message'] ?? $response->body();
                $lastErrorCode = $response->status();

                // If 404, 429, or 503, loop to next candidate model
                if (!in_array($response->status(), [404, 429, 503])) {
                    break;
                }
            } catch (\Exception $e) {
                $lastError = $e->getMessage();
                $lastErrorCode = 500;
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Gemini API এরর: ' . ($lastError ?: 'মডেল রেসপন্স করছে না'),
            'status_code' => $lastErrorCode,
            'raw_error' => $lastError,
        ], $lastErrorCode ?: 400);
    }
}


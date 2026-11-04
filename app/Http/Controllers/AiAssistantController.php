<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AiAssistantController extends Controller
{
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
            'gemini_model' => 'required|string',
            'system_prompt' => 'nullable|string',
            'training_data' => 'nullable|string',
            'fallback_reply' => 'nullable|string',
        ]);

        $chips = $request->input('chips');
        if (is_string($chips)) {
            $chips = array_values(array_filter(array_map('trim', explode(',', $chips))));
        }

        DB::table('ai_chat_settings')->updateOrInsert(
            ['id' => 1],
            [
                'gemini_api_key' => $request->input('gemini_api_key'),
                'gemini_model' => $request->input('gemini_model', 'gemini-1.5-flash'),
                'gemini_enabled' => (bool)$request->input('gemini_enabled', false),
                'system_prompt' => $request->input('system_prompt'),
                'training_data' => $request->input('training_data'),
                'chips' => json_encode($chips ?: ["শাখার ঠিকানা কোথায়?", "ফাঁকা দাঁতের চিকিৎসা", "দাঁত ব্যথার চিকিৎসা"], JSON_UNESCAPED_UNICODE),
                'fallback_reply' => $request->input('fallback_reply'),
                'updated_at' => now(),
            ]
        );

        return back()->with('success', 'AI Assistant সেটিংস ও ট্রেনিং ডাটা সফলভাবে সংরক্ষিত হয়েছে।');
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
        $cleanQuery = mb_strtolower($query, 'UTF-8');

        // STEP 1: Search keyword-based rules
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

        // STEP 2: If no keyword matched, try Google Gemini API with smart model fallback
        if ($settings && $settings->gemini_enabled && !empty($settings->gemini_api_key)) {
            $apiKey = $settings->gemini_api_key;
            $systemPrompt = $settings->system_prompt ?: "You are Tech Dental's helpful Bengali AI assistant for patients in Dhaka. Answer clearly and concisely in Bengali. Branches: Mirpur, Uttara, Badda, Jatrabari. Hotline: 01400786162.";
            $trainingData = $settings->training_data ?? '';

            $instructionText = "ROLE & INSTRUCTIONS FOR DENTAL AI ASSISTANT:\n{$systemPrompt}";
            if (!empty($trainingData)) {
                $instructionText .= "\n\n### TECH DENTAL OFFICIAL COMPANY TRAINING DATA & KNOWLEDGE BASE:\n{$trainingData}\n\nSTRICT GUIDELINE: Always prioritize the above official company training data when answering questions about branches, services, doctor availability, costs, and clinic policies. Answer in clear, polite Bengali.";
            }

            $candidateModels = $this->resolveGeminiModelCandidates($settings->gemini_model ?? 'gemini-2.5-flash');

            foreach ($candidateModels as $model) {
                try {
                    $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

                    $payload = [
                        'contents' => [
                            [
                                'role' => 'user',
                                'parts' => [
                                    ['text' => "{$instructionText}\n\nPATIENT QUERY: {$query}"]
                                ]
                            ]
                        ],
                        'generationConfig' => [
                            'temperature' => 0.4,
                            'maxOutputTokens' => 700,
                        ]
                    ];

                    $response = Http::timeout(10)->post($apiUrl, $payload);

                    if ($response->successful()) {
                        $resData = $response->json();
                        $aiText = $resData['candidates'][0]['content']['parts'][0]['text'] ?? null;

                        if (!empty($aiText)) {
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
                                'title' => 'টেক ডেন্টাল এআই অ্যাসিস্ট্যান্ট (Gemini)',
                                'reply' => $aiText,
                                'icon' => 'fa-robot',
                                'icon_color' => 'text-indigo-600',
                                'icon_bg' => 'bg-indigo-100',
                                'action_type' => 'appointment',
                                'action_label' => 'অনলাইন সিরিয়াল নিন',
                                'action_url' => '/appointment',
                            ]);
                        }
                    }

                    // If not 404 (model deprecated/not found), break and stop trying
                    if ($response->status() !== 404) {
                        Log::error("Gemini API Error for {$model}: " . $response->body());
                        break;
                    }
                } catch (\Exception $e) {
                    Log::error("Gemini API Exception for {$model}: " . $e->getMessage());
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
            'title' => 'টেক ডেন্টাল এআই হেল্পডেস্ক',
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
     * Resolve candidate Gemini models in order of priority, auto-migrating deprecated models
     */
    private function resolveGeminiModelCandidates(?string $model): array
    {
        $requested = trim($model ?: '');

        // Auto-migrate deprecated 1.5 or 2.0 models to 3.x / 2.5
        if (in_array($requested, ['gemini-2.0-flash', 'gemini-2.0', 'gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-pro'])) {
            $requested = 'gemini-3-flash';
        }
        if (in_array($requested, ['gemini-2.0-pro', 'gemini-2.0-pro-exp'])) {
            $requested = 'gemini-3.1-pro';
        }

        $candidates = [];
        if (!empty($requested)) {
            $candidates[] = $requested;
            if (str_contains($requested, '-preview')) {
                $candidates[] = str_replace('-preview', '', $requested);
            }
        }
        // Exact models supported by Google AI Studio
        $candidates[] = 'gemini-3.1-flash-lite';
        $candidates[] = 'gemini-3.6-flash';
        $candidates[] = 'gemini-3.5-flash';
        $candidates[] = 'gemini-3.5-flash-lite';
        $candidates[] = 'gemini-3.1-pro-preview';
        $candidates[] = 'gemini-3.1-pro';
        $candidates[] = 'gemini-3-flash-preview';
        $candidates[] = 'gemini-3-flash';
        $candidates[] = 'gemini-2.5-flash';
        $candidates[] = 'gemini-2.5-flash-lite';
        $candidates[] = 'gemini-2.5-pro';

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
            $response = Http::timeout(12)->get("https://generativelanguage.googleapis.com/v1beta/models?key={$apiKey}");

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

        $candidateModels = $this->resolveGeminiModelCandidates($requestedModel);

        // Also attempt to dynamically pull Google's exact active models if needed
        try {
            $listRes = Http::timeout(8)->get("https://generativelanguage.googleapis.com/v1beta/models?key={$apiKey}");
            if ($listRes->successful()) {
                $onlineModels = $listRes->json()['models'] ?? [];
                foreach ($onlineModels as $om) {
                    if (in_array('generateContent', $om['supportedGenerationMethods'] ?? [])) {
                        $cId = str_replace('models/', '', $om['name']);
                        // Prioritize flash models
                        if (str_contains($cId, 'flash')) {
                            array_unshift($candidateModels, $cId);
                        } else {
                            $candidateModels[] = $cId;
                        }
                    }
                }
                $candidateModels = array_values(array_unique($candidateModels));
            }
        } catch (\Exception $e) {
            // Ignore listModels error and proceed with candidate array
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
                    'maxOutputTokens' => 300,
                ]
            ];

            try {
                $startTime = microtime(true);
                $response = Http::timeout(15)->post($apiUrl, $payload);
                $latencyMs = round((microtime(true) - $startTime) * 1000);

                if ($response->successful()) {
                    $resData = $response->json();
                    $aiText = $resData['candidates'][0]['content']['parts'][0]['text'] ?? null;

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

                // If 404 (model deprecated / NOT_FOUND), loop to next candidate model
                if ($response->status() !== 404) {
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


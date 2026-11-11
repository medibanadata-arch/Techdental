<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Bangla SEO for the real medicine catalogue.
     *
     * Every medicine page used the hard-coded drawer heading
     * "{name} সম্পর্কে আরো", had no Bangla meta description and, because the
     * FAQ rows only carried English `q`/`a`, rendered no Bangla FAQs or FAQ
     * schema at all.
     *
     * This migration builds a unique Bangla SEO title suffix, meta description
     * and "More About" article from the real Bangla fields (`name_bn`,
     * `intro_bn`, `uses_items[].label_bn/text_bn`, `dosage_bn`,
     * `side_effects_items[].text_bn`) and adds Bangla versions of the seven
     * safety FAQs on each row.
     *
     * Blog articles imported into the medicines table are skipped: they are
     * redirected to /blog/{slug} and never render as medicine pages.
     */
    public function up(): void
    {
        $postSlugs = DB::table('posts')->whereNotNull('slug')->pluck('slug')->all();

        $medicines = DB::table('medicines')
            ->where('is_active', 1)
            ->when($postSlugs, fn ($q) => $q->whereNotIn('slug', $postSlugs))
            ->orderBy('id')
            ->get();

        $now = now();

        foreach ($medicines as $medicine) {
            $name = trim((string) ($medicine->name_bn ?: $medicine->name));
            if ($name === '') {
                continue;
            }

            $esc = fn ($value) => htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');

            $intro = $this->plainText($medicine->intro_bn);
            $introSentences = $this->sentences($intro);
            $introLead = trim(implode(' ', array_slice($introSentences, 0, 2)));
            if ($introLead === '') {
                $introLead = $name . ' ডেন্টাল চিকিৎসায় ব্যবহৃত একটি ঔষধ। সঠিক মাত্রা ও ব্যবহারের জন্য চিকিৎসকের পরামর্শ নিন।';
            }

            $uses = json_decode((string) $medicine->uses_items, true) ?: [];
            $usePairs = [];
            foreach ($uses as $use) {
                $label = trim((string) ($use['label_bn'] ?? ''));
                $text = trim((string) ($use['text_bn'] ?? ''));
                if ($label === '' && $text === '') {
                    continue;
                }
                $usePairs[] = ['label' => $label, 'text' => $text];
            }
            $useLabels = array_values(array_filter(array_map(fn ($pair) => $pair['label'], $usePairs)));
            $topUse = $useLabels[0] ?? 'দাঁত ও মুখের সংক্রমণ';
            $topUses = implode(', ', array_slice($useLabels, 0, 3)) ?: 'ডেন্টাল ব্যথা ও সংক্রমণ';

            $sideEffects = [];
            foreach (json_decode((string) $medicine->side_effects_items, true) ?: [] as $effect) {
                $text = is_array($effect) ? trim((string) ($effect['text_bn'] ?? '')) : '';
                if ($text !== '') {
                    $sideEffects[] = $text;
                }
            }

            $doseSentences = $this->sentences($this->plainText($medicine->dosage_bn));
            $doseLead = trim(implode(' ', array_slice($doseSentences, 0, 2)));
            if ($doseLead === '') {
                $doseLead = 'মাত্রা বয়স, ওজন ও রোগের তীব্রতা অনুযায়ী নির্ধারিত হয়। চিকিৎসকের নির্দেশিত মাত্রাই মেনে চলুন।';
            }

            // Page title suffix. The medicine name is prepended by the page, so
            // this stays keyword-first without repeating the brand. Drop the
            // English gloss in brackets so the title never ends mid-word.
            $titleTopic = $this->topic($topUse);
            $seoTitleBn = $this->cutWords($titleTopic, 42) . ': ডোজ, ব্যবহার ও দাম';

            // Meta description: unique medicine + top use, followed by one
            // shared, useful tail. Avoid cutting the intro mid-sentence.
            $metaTail = 'ইত্যাদি ক্ষেত্রে ব্যবহৃত হয়। ডোজ, পার্শ্বপ্রতিক্রিয়া ও দাম জেনে নিন।';
            $metaLead = $name . ' সাধারণত ';
            $budget = 158 - mb_strlen($metaLead) - mb_strlen($metaTail) - 1;
            $metaDescBn = $metaLead . $this->cutWords($titleTopic, max(18, $budget)) . ' ' . $metaTail;

            // Unique Bangla "More About" article.
            $html = '<h2>' . $esc($name) . " কী কী কাজে ব্যবহৃত হয়?</h2>\n";
            $html .= '<p>' . $esc($introLead) . "</p>\n";
            if ($usePairs) {
                $html .= "<ul>\n";
                foreach (array_slice($usePairs, 0, 4) as $pair) {
                    $line = '';
                    if ($pair['label'] !== '') {
                        $line .= '<strong>' . $esc($pair['label']) . ':</strong> ';
                    }
                    if ($pair['text'] !== '') {
                        $line .= $esc($this->cut($pair['text'], 190));
                    }
                    if ($line !== '') {
                        $html .= '  <li>' . $line . "</li>\n";
                    }
                }
                $html .= "</ul>\n";
            }

            $html .= '<h2>' . $esc($name) . " — সেবনবিধি ও স্বাভাবিক মাত্রা</h2>\n";
            $html .= '<p>' . $esc($doseLead) . "</p>\n";
            $html .= '<p>মাত্রা বয়স, ওজন, কিডনি ও লিভারের অবস্থা এবং রোগের তীব্রতা অনুযায়ী বদলাতে পারে। তাই নিজে মাত্রা ঠিক না করে রেজিস্টার্ড ডেন্টিস্ট বা চিকিৎসকের পরামর্শ নিন।</p>' . "\n";

            $html .= "<h2>পার্শ্বপ্রতিক্রিয়া ও নিরাপত্তা</h2>\n";
            if ($sideEffects) {
                $html .= "<ul>\n";
                foreach (array_slice($sideEffects, 0, 3) as $effect) {
                    $html .= '  <li>' . $esc($this->cut($effect, 170)) . "</li>\n";
                }
                $html .= "</ul>\n";
            }
            $html .= '<p>' . $esc($name) . " সেবনের আগে গর্ভাবস্থা, ব্রেস্টফিডিং, ওষুধে অ্যালার্জি, কিডনি বা লিভারের সমস্যা এবং অন্য ওষুধের কথা চিকিৎসককে জানান। কোনো পার্শ্বপ্রতিক্রিয়া দীর্ঘস্থায়ী হলে বা তীব্র হলে দ্রুত চিকিৎসা সহায়তা নিন।</p>\n";
            $html .= '<p>ঢাকার মিরপুর, উত্তরা, বাদ্দা ও যাতরাবাড়ি শাখায় টেক ডেন্টাল কেয়ারের বিশেষজ্ঞ ডেন্টিস্টরা প্রেসক্রিপশন অনুযায়ী ঔষধ নির্বাচনে সহায়তা করেন। বিস্তারিত খরচ দেখুন <a href="/price-list">ডেন্টাল ট্রিটমেন্ট প্রাইস লিস্ট</a> পেজে, অথবা <a href="/appointment">অনলাইন অ্যাপয়েন্টমেন্ট</a> নিন।</p>';

            // Bangla versions of the seven safety FAQs. Attach them to the
            // existing English FAQ rows so both languages stay in one array.
            $faqs = json_decode((string) $medicine->faqs, true) ?: [];
            $translations = [
                'used for' => [
                    'q_bn' => $name . ' কী কী কাজে ব্যবহৃত হয়?',
                    'a_bn' => $name . ' সাধারণত ' . $topUses . ' ইত্যাদি ক্ষেত্রে ব্যবহৃত হয়। এটি শুধু রেজিস্টার্ড ডেন্টিস্ট বা চিকিৎসকের পরামর্শে নির্ধারিত মাত্রায় ও নির্দিষ্ট সময় পর্যন্ত সেবন করা উচিত।',
                ],
                'usual dose' => [
                    'q_bn' => $name . ' — স্বাভাবিক মাত্রা কত?',
                    'a_bn' => $doseLead . ' চিকিৎসকের নির্দেশিত মাত্রা ও সময়ই মেনে চলুন; নিজে থেকে মাত্রা বাড়াবেন না।',
                ],
                'store' => [
                    'q_bn' => $name . ' কীভাবে সংরক্ষণ করবেন?',
                    'a_bn' => 'শুষ্ক, ঠান্ডা ও সরাসরি আলো থেকে দূরে, শিশুদের নাগালের বাইরে রাখুন। মেয়াদ শেষ হওয়ার পর ঔষধ সেবন করবেন না।',
                ],
                'miss a dose' => [
                    'q_bn' => $name . ' — একটি ডোজ মিস হলে কী করবেন?',
                    'a_bn' => 'ডোজ মিস হলে মনে পড়ামাত্র সেবন করুন; তবে পরের ডোজের সময় কাছাকাছি হলে সেটি বাদ দিন। কখনোই দুই ডোজ একসঙ্গে নেবেন না।',
                ],
                'other medicines' => [
                    'q_bn' => $name . ' অন্য ওষুধের সঙ্গে সেবন করা যাবে?',
                    'a_bn' => 'অন্য কোনো ওষুধ, ভিটামিন বা হারবাল প্রোডাক্ট সেবন করলে চিকিৎসককে জানান। কিছু ওষুধের সঙ্গে মিলিয়ে সেবনে পার্শ্বপ্রতিক্রিয়া বাড়তে বা কার্যকারিতা কমতে পারে।',
                ],
                'too much' => [
                    'q_bn' => $name . ' বেশি মাত্রায় সেবন করলে কী করবেন?',
                    'a_bn' => 'নির্ধারিত মাত্রার বেশি সেবন করলে সঙ্গে সঙ্গে চিকিৎসা সহায়তা নিন। অতিরিক্ত মাত্রায় বমি, মাথা ঘোরা বা অন্য উপসর্গ দেখা দিতে পারে।',
                ],
                'stop taking' => [
                    'q_bn' => $name . ' ভালো লাগলে নিজে থেকে বন্ধ করা যাবে?',
                    'a_bn' => 'উপসর্গ কমে গেলেও নিজে থেকে কোর্স বন্ধ করবেন না—বিশেষ করে অ্যান্টিবায়োটিকের ক্ষেত্রে। চিকিৎসকের পরামর্শ অনুযায়ী সম্পূর্ণ কোর্স শেষ করুন।',
                ],
            ];

            foreach ($faqs as &$faq) {
                $question = mb_strtolower((string) ($faq['q'] ?? ''));
                if ($question === '') {
                    continue;
                }
                foreach ($translations as $needle => $pair) {
                    if (str_contains($question, $needle)) {
                        $faq['q_bn'] = $pair['q_bn'];
                        $faq['a_bn'] = $pair['a_bn'];
                        unset($translations[$needle]);
                        break;
                    }
                }
            }
            unset($faq);

            // Fallback for rows without matching English FAQs: keep at least
            // one bilingual medical-use FAQ so the Bangla accordion is never empty.
            if (!collect($faqs)->contains(fn ($faq) => trim((string) ($faq['q_bn'] ?? '')) !== '')) {
                $faqs[] = [
                    'q' => 'What is ' . $medicine->name . ' used for?',
                    'a' => $medicine->name . ' is commonly prescribed for ' . $topUses . '. Take it only on the advice of a registered dentist or physician.',
                    'q_bn' => $name . ' কী কী কাজে ব্যবহৃত হয়?',
                    'a_bn' => $name . ' সাধারণত ' . $topUses . ' ইত্যাদি ক্ষেত্রে ব্যবহৃত হয়। শুধু রেজিস্টার্ড ডেন্টিস্ট বা চিকিৎসকের পরামর্শে সেবন করুন।',
                ];
            }

            DB::table('medicines')->where('id', $medicine->id)->update([
                'seo_title_bn' => $seoTitleBn,
                'meta_desc_bn' => $metaDescBn,
                'seo_content_bn' => $html,
                'faqs' => json_encode($faqs, JSON_UNESCAPED_UNICODE),
                'updated_at' => $now,
            ]);
        }
    }

    /**
     * Strip markup, entities and repeated whitespace from an admin field.
     */
    private function plainText(?string $value): string
    {
        $text = strip_tags((string) $value);
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = preg_replace('/\s+/u', ' ', $text);

        return trim((string) $text);
    }

    /**
     * Split Bangla/English prose into sentences without breaking
     * abbreviations such as "মি.গ্রা.".
     *
     * @return string[]
     */
    private function sentences(string $text): array
    {
        if ($text === '') {
            return [];
        }

        $parts = preg_split('/(?<=।)\s+|\n+/u', $text) ?: [$text];

        return array_values(array_filter(array_map('trim', $parts), fn ($line) => $line !== ''));
    }

    /**
     * Turn a raw use label into a short Bangla topic for titles/metas.
     */
    private function topic(string $topUse): string
    {
        $topic = preg_replace('/\s*\([^)]*\)\s*/u', ' ', $topUse) ?? $topUse;
        $topic = trim(preg_replace('/\s+/u', ' ', $topic) ?? $topic);
        $topic = rtrim($topic, " \t\n\r\0\x0B.,;:।—–-&");

        if (mb_strlen($topic) > 42) {
            $topic = $this->cutWords($topic, 42);
        }

        return $topic !== '' ? $topic : 'দাঁত ও মুখের সংক্রমণ';
    }

    /**
     * Trim to a character budget on a word boundary, without adding "…".
     */
    private function cutWords(string $text, int $max): string
    {
        $text = trim($text);
        if ($max <= 0 || mb_strlen($text) <= $max) {
            return $text;
        }

        $slice = mb_substr($text, 0, $max);
        $space = mb_strrpos($slice, ' ');
        if ($space !== false && $space > (int) ($max * 0.5)) {
            $slice = mb_substr($slice, 0, $space);
        }

        return rtrim($slice, " \t\n\r\0\x0B.,;:।—–-&");
    }

    /**
     * Trim to a character budget without cutting a word in half.
     */
    private function cut(string $text, int $max): string
    {
        $text = trim($text);
        if ($max <= 0 || mb_strlen($text) <= $max) {
            return $text;
        }

        $slice = mb_substr($text, 0, $max);
        $space = mb_strrpos($slice, ' ');
        if ($space !== false && $space > (int) ($max * 0.55)) {
            $slice = mb_substr($slice, 0, $space);
        }

        return rtrim($slice, " \t\n\r\0\x0B.,;:।—–-") . '…';
    }

    /**
     * Content migration — intentionally irreversible.
     */
    public function down(): void
    {
        //
    }
};

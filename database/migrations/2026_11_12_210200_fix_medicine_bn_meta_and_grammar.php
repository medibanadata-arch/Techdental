<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Correct the Bangla SEO values produced by the first pass (210100).
     *
     * The first run cut the medicine `intro_bn` mid-sentence for the meta
     * description and left "…{name} এর …" grammar inside the article headings
     * and FAQ questions. This pass:
     *
     *  - rebuilds `meta_desc_bn` from the medicine name + one clean, short use
     *    topic, so every description is unique, readable and fits 158 chars;
     *  - rebuilds `seo_title_bn` without the mid-word "…" ellipsis;
     *  - replaces the possessive "{name} এর " with "{name} — " in the article
     *    and FAQ questions.
     *
     * Idempotent: it recomputes from `uses_items`/`name_bn`, so re-running is
     * safe and future medicine edits still flow through the admin screen.
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

            $uses = json_decode((string) $medicine->uses_items, true) ?: [];
            $labels = [];
            foreach ($uses as $use) {
                $label = trim((string) ($use['label_bn'] ?? ''));
                if ($label !== '') {
                    $labels[] = $label;
                }
            }

            $topic = $this->topic($labels[0] ?? 'দাঁত ও মুখের সংক্রমণ');

            $metaTail = 'ইত্যাদি ক্ষেত্রে ব্যবহৃত হয়। ডোজ, পার্শ্বপ্রতিক্রিয়া ও দাম জেনে নিন।';
            $metaLead = $name . ' সাধারণত ';
            $budget = 158 - mb_strlen($metaLead) - mb_strlen($metaTail) - 1;
            $metaDescBn = $metaLead . $this->cutWords($topic, max(18, $budget)) . ' ' . $metaTail;

            $seoTitleBn = $this->cutWords($topic, 42) . ': ডোজ, ব্যবহার ও দাম';

            // Fix "{name} এর " -> "{name} — " in the generated article.
            $html = (string) $medicine->seo_content_bn;
            if ($html !== '') {
                $html = str_replace($name . ' এর ', $name . ' — ', $html);
            }

            $faqs = json_decode((string) $medicine->faqs, true) ?: [];
            foreach ($faqs as &$faq) {
                foreach (['q_bn', 'a_bn'] as $key) {
                    if (!empty($faq[$key]) && is_string($faq[$key])) {
                        $faq[$key] = str_replace($name . ' এর ', $name . ' — ', $faq[$key]);
                    }
                }
            }
            unset($faq);

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
     * Turn a raw use label into a short Bangla topic.
     *
     * Drops the English gloss in brackets ("আমাশয় এবং ডায়রিয়া (Amebiasis &
     * Giardiasis)" -> "আমাশয় এবং ডায়রিয়া") and trims trailing punctuation so
     * the value reads naturally inside a sentence and a title.
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
     * Content migration — intentionally irreversible.
     */
    public function down(): void
    {
        //
    }
};

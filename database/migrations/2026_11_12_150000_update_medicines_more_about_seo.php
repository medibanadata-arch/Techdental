<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Rewrite the 82 medicine "More about" blocks.
     *
     * Every row previously shared the exact same meta description pattern and
     * the same storage/missed-dose article with only the drug name swapped —
     * near-duplicate content across 82 URLs. This migration keeps that safety
     * copy but puts a unique, drug-specific section in front of it, built from
     * each medicine's real `uses_items`, `intro` and `dosage` fields, plus two
     * unique FAQs ("what is it used for", "how should I take it").
     */
    public function up(): void
    {
        $now = now();

        $medicines = DB::table('medicines')->orderBy('id')->get();

        foreach ($medicines as $medicine) {
            $name = trim((string) $medicine->name);
            if ($name === '') {
                continue;
            }

            $uses = json_decode((string) $medicine->uses_items, true) ?: [];
            $intro = trim(preg_replace('/\s+/', ' ', strip_tags((string) $medicine->intro)));
            $dosage = trim(preg_replace('/\n{2,}/', "\n", strip_tags((string) $medicine->dosage)));
            $existingContent = (string) $medicine->seo_content;

            // First sentence of the intro, kept short enough for a meta description.
            $firstSentence = trim(preg_split('/(?<=[.!?])\s+/', $intro)[0] ?? '');
            $firstSentence = rtrim($firstSentence, '.') . '.';

            // Unique meta description (~150 characters).
            $metaDesc = $firstSentence;
            if (mb_strlen($metaDesc) > 110) {
                $metaDesc = mb_substr($metaDesc, 0, 107);
                $metaDesc = mb_substr($metaDesc, 0, mb_strrpos($metaDesc, ' ')) . '…';
            }
            $metaDesc .= ' Uses, dosage, side effects and price in Bangladesh, reviewed by Tech Dental Care, Dhaka.';
            if (mb_strlen($metaDesc) > 158) {
                $metaDesc = mb_substr($metaDesc, 0, 155);
                $metaDesc = mb_substr($metaDesc, 0, mb_strrpos($metaDesc, ' ')) . '.';
            }

            // Unique opening section for the accordion.
            $esc = fn ($value) => htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');

            $useItemsHtml = '';
            $useLabels = [];
            foreach (array_slice($uses, 0, 4) as $use) {
                $label = trim((string) ($use['label'] ?? ''));
                $text = trim((string) ($use['text'] ?? ''));
                if ($label === '' && $text === '') {
                    continue;
                }
                if ($label !== '') {
                    $useLabels[] = $label;
                }
                if (mb_strlen($text) > 180) {
                    $text = mb_substr($text, 0, 177);
                    $text = mb_substr($text, 0, mb_strrpos($text, ' ')) . '…';
                }
                $useItemsHtml .= '    <li><strong>' . $esc($label) . ':</strong> ' . $esc($text) . "</li>\n";
            }

            $doseLines = array_values(array_filter(array_map('trim', explode("\n", $dosage)), fn ($line) => $line !== ''));
            $doseParagraph = $esc(implode(' ', array_slice($doseLines, 0, 2)));

            $uniqueHtml = "<h3>About {$esc($name)}: Uses, Dosage and Dental Care</h3>\n";
            if ($firstSentence !== '.') {
                $uniqueHtml .= '<p>' . $esc($firstSentence) . "</p>\n";
            }
            if ($useItemsHtml !== '') {
                $uniqueHtml .= "<h4>What is {$esc($name)} used for?</h4>\n<ul>\n" . $useItemsHtml . "</ul>\n";
            }
            if ($doseParagraph !== '') {
                $uniqueHtml .= "<h4>How should you take {$esc($name)}?</h4>\n<p>{$doseParagraph}</p>\n";
            }
            $uniqueHtml .= "<p>Buying or taking {$esc($name)} without a prescription is not recommended. A dentist or physician should confirm the strength, the number of days and whether it is safe with your other medicines — especially for children, pregnancy, kidney or liver problems.</p>\n";

            // Keep the original safety article, minus a duplicated opening paragraph.
            $safetyHtml = $existingContent;
            if (!str_contains($safetyHtml, '<h3>')) {
                $safetyHtml = '<h3>Taking ' . $esc($name) . " Safely</h3>\n" . $safetyHtml;
            }

            $seoContent = $uniqueHtml . "\n" . $safetyHtml;

            // Drug-specific FAQs prepended to the existing safety FAQs.
            $faqs = json_decode((string) $medicine->faqs, true) ?: [];
            $newFaqs = [];

            if ($useLabels) {
                $topUses = implode(', ', array_slice($useLabels, 0, 3));
                $newFaqs[] = [
                    'q' => "What is {$name} used for?",
                    'a' => "{$name} is commonly prescribed for {$topUses}. It should only be taken on the advice of a registered dentist or physician, at the dose and duration written on your prescription.",
                ];
            }

            if ($doseLines) {
                $newFaqs[] = [
                    'q' => "What is the usual dose of {$name}?",
                    'a' => implode(' ', array_slice($doseLines, 0, 2)) . ' Always follow the dose your dentist or physician prescribed, and finish the full course if an antibiotic was given.',
                ];
            }

            $seen = [];
            $mergedFaqs = [];
            foreach (array_merge($newFaqs, is_array($faqs) ? $faqs : []) as $faq) {
                $question = trim((string) ($faq['q'] ?? ''));
                if ($question === '' || isset($seen[mb_strtolower($question)])) {
                    continue;
                }
                $seen[mb_strtolower($question)] = true;
                $mergedFaqs[] = $faq;
            }

            DB::table('medicines')->where('id', $medicine->id)->update([
                'seo_title' => 'Uses, Dosage & Price in Bangladesh',
                'meta_desc' => $metaDesc,
                'seo_content' => $seoContent,
                'faqs' => json_encode($mergedFaqs, JSON_UNESCAPED_UNICODE),
                'canonical_url' => 'https://techdentalcare.com/medicines/' . $medicine->slug,
                'robots_index' => 1,
                'robots_follow' => 1,
                'schema_type' => 'MedicalWebPage',
                'updated_at' => $now,
            ]);
        }
    }

    /**
     * Content migration — intentionally irreversible.
     */
    public function down(): void
    {
        //
    }
};

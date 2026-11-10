<?php
/**
 * Removes an FAQ section from post content when the structured `faqs` array already
 * renders the same questions and answers (avoiding duplicated content on the page).
 *
 * Usage:
 *   php scripts/strip_post_faq_dupes.php           (dry run)
 *   php scripts/strip_post_faq_dupes.php --apply
 */
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Post;

$APPLY = in_array('--apply', $argv, true);

function sq(string $s): string
{
    $s = html_entity_decode($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return preg_replace('/[^\p{L}\p{N}]+/u', '', mb_strtolower($s, 'UTF-8'));
}

function stripNumbering(string $s): string
{
    return preg_replace('/^\s*(?:\d+|[০-৯]+)[.)।]\s*/u', '', $s);
}

$log = '';
$changed = 0;

foreach (Post::orderBy('id')->get() as $post) {
    foreach (['en' => 'content', 'bn' => 'content_bn'] as $lang => $col) {
        $html = (string) $post->$col;
        if (trim($html) === '') continue;

        $faqs = is_array($post->faqs) ? $post->faqs : [];
        if (!$faqs) continue;

        // does this language have question text at all?
        $pairs = [];
        foreach ($faqs as $f) {
            $q = $lang === 'bn' ? (string) ($f['q_bn'] ?? '') : (string) ($f['q'] ?? '');
            $a = $lang === 'bn' ? (string) ($f['a_bn'] ?? '') : (string) ($f['a'] ?? '');
            if (trim($q) === '' || trim($a) === '') continue;
            $pairs[] = [stripNumbering($q), $a];
        }
        if (count($pairs) < 3) continue;

        // locate FAQ section by heading
        if (!preg_match_all('/<h2\b[^>]*>(.*?)<\/h2>/is', $html, $hm, PREG_OFFSET_CAPTURE | PREG_SET_ORDER)) continue;
        $start = null;
        foreach ($hm as $m) {
            $text = trim(strip_tags($m[1][0]));
            if (preg_match('/faq|frequently|প্রশ্ন|সচরাচর|জিজ্ঞাসিত|প্রশ্নোত্তর/iu', $text)) {
                $start = $m[0][1];
                break;
            }
        }
        if ($start === null) continue;

        // section ends at the next h2 (or end of document)
        $rest = substr($html, $start);
        $end = strlen($html);
        if (preg_match('/<h2\b/i', $rest, $nm, PREG_OFFSET_CAPTURE, 4)) {
            $end = $start + $nm[0][1];
        }
        $chunk = substr($html, $start, $end - $start);
        $chunkText = sq(strip_tags($chunk));

        $missing = [];
        foreach ($pairs as [$q, $a]) {
            $nq = mb_substr(sq($q), 0, 40);
            $na = mb_substr(sq($a), 0, 60);
            $qOk = $nq !== '' && mb_strpos($chunkText, $nq) !== false;
            $aOk = $na !== '' && mb_strpos($chunkText, $na) !== false;
            if (!$qOk || !$aOk) $missing[] = mb_substr($q, 0, 60);
        }

        $log .= "ID {$post->id} {$post->slug} [$lang] section=" . mb_substr(trim(strip_tags($chunk)), 0, 60) . " chars=" . strlen($chunk) . " pairs=" . count($pairs) . " missing=" . count($missing);
        if ($missing) {
            $log .= ' SKIP :: ' . implode(' | ', array_slice($missing, 0, 3)) . "\n";
            continue;
        }

        $newHtml = rtrim(substr($html, 0, $start)) . "\n" . ltrim(substr($html, $end));
        $log .= " REMOVE -> new len=" . strlen($newHtml) . "\n";
        $changed++;
        if ($APPLY) {
            $post->$col = $newHtml;
            $post->save();
        }
    }
}

file_put_contents(__DIR__ . '/../scratch/post_faq_strip_report.txt', $log);
echo "changed=$changed apply=" . ($APPLY ? 'yes' : 'no') . "\n";

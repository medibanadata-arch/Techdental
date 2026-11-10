<?php
/**
 * Remove the duplicate content that the restructuring passes left behind, without
 * deleting a single word from the page:
 *
 *  1. author disclaimer: rebuilt from the article's own disclaimer blockquote
 *     (some rows had a warning pasted into it during import).
 *  2. body paragraphs: if the same paragraph (or its full sentence) already exists in an
 *     earlier field of the same language, the later copy is dropped.
 *  3. FAQs: an answer that merely repeats a body paragraph is cleared for that language,
 *     so the pair is not rendered twice (the words stay in the article body).
 *
 * Usage:
 *   php scripts/fix_duplicate_content.php            (dry run)
 *   php scripts/fix_duplicate_content.php --apply
 *   php scripts/fix_duplicate_content.php --slug=napa-extra --debug
 */
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Medicine;
use App\Models\Post;

// parser helpers
$src = file_get_contents(__DIR__ . '/restructure_medicine_content.php');
$cut = strpos($src, '$stats = [');
$funcs = substr($src, 0, $cut);
$funcs = preg_replace('/^<\?php\s*/', '', $funcs);
$funcs = preg_replace('/^require .*?;\s*/m', '', $funcs);
$funcs = preg_replace('/^\$app = .*?;\s*/m', '', $funcs);
$funcs = preg_replace('/^\$app->make\(.*?;\s*/m', '', $funcs);
$funcs = preg_replace('/^use App\\\\Models\\\\Medicine;\s*/m', '', $funcs);
$funcs = preg_replace('/^use App\\\\Models\\\\Post;\s*/m', '', $funcs);
eval($funcs);

$APPLY = in_array('--apply', $argv, true);
$DEBUG = in_array('--debug', $argv, true);
$ONLY = null;
foreach ($argv as $a) {
    if (str_starts_with($a, '--slug=')) $ONLY = substr($a, 7);
}

$BACKUP = __DIR__ . '/../database/database.sqlite.bak-20261110-124011';
$oldDb = new PDO('sqlite:' . $BACKUP);
$postSlugs = Post::pluck('slug')->flip()->all();

function paragraphs(string $s): array
{
    $s = str_replace(["\r\n", "\r"], "\n", $s);
    return array_values(array_filter(array_map('trim', preg_split('/\n\s*\n/u', $s)), fn($x) => $x !== ''));
}

/** Replace $drop with '' but keep the rest of the field intact. */
function dropParagraph(string $value, string $para): string
{
    $out = [];
    foreach (paragraphs($value) as $p) {
        if ($p === $para) continue;
        $out[] = $p;
    }
    return implode("\n\n", $out);
}

$stats = ['rows' => 0, 'changed' => 0, 'disclaimer' => 0, 'para_dupes' => 0, 'faq_dupes' => 0];
$log = '';

foreach (Medicine::orderBy('id')->get() as $m) {
    if (isset($postSlugs[$m->slug])) continue;
    if ($ONLY !== null && $m->slug !== $ONLY) continue;
    $stats['rows']++;

    $q = $oldDb->prepare('SELECT seo_content, seo_content_bn FROM medicines WHERE slug = ?');
    $q->execute([$m->slug]);
    $old = $q->fetch(PDO::FETCH_ASSOC) ?: ['seo_content' => '', 'seo_content_bn' => ''];
    $srcHtml = (string) $old['seo_content'] . "\n" . (string) $old['seo_content_bn'];

    $update = [];
    $rowLog = [];

    /* ---------- 1. disclaimer ---------- */
    $author = is_array($m->author) ? $m->author : [];
    $authorChanged = false;
    foreach (['en' => '', 'bn' => '_bn'] as $lang => $sfx) {
        $html = $lang === 'bn' ? (string) $old['seo_content_bn'] : (string) $old['seo_content'];
        if ($html === '') continue;
        // find the disclaimer-ish blockquote (or last paragraph)
        $text = '';
        if (preg_match_all('/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/i', $html, $bm)) {
            foreach ($bm[1] as $frag) {
                $t = trim(preg_replace('/\s+/u', ' ', strip_tags($frag)));
                if (preg_match('/শিক্ষামূলক তথ্য|educational information|disclaimer/i', $t)) $text = $t;
            }
        }
        if ($text === '') continue; // nothing authoritative in the source: leave as-is

        $clean = preg_replace('/^(?:Disclaimer|সতর্কীকরণ|সতর্কবার্তা|সতর্কতা)\s*[:：]\s*/u', '', $text);
        $key = 'disclaimer' . $sfx;
        if (trim((string) ($author[$key] ?? '')) !== trim($clean)) {
            $author[$key] = $clean;
            $authorChanged = true;
            $stats['disclaimer']++;
            $rowLog[] = "[$lang] disclaimer replaced";
        }
    }
    if ($authorChanged) $update['author'] = $author;

    /* ---------- 2. body paragraph duplicates ---------- */
    $fields = ['intro', 'uses_text', 'side_effects', 'dosage', 'dosage_admin', 'dosage_timing'];
    foreach (['en' => '', 'bn' => '_bn'] as $lang => $sfx) {
        $seen = [];      // squashed paragraph => true
        $seenShort = []; // squashed sentences of already-kept paragraphs
        $seenSent = [];  // exact squashed sentences
        foreach ($fields as $f) {
            $name = $f . $sfx;
            $value = (string) $m->$name;
            if (trim($value) === '') continue;
            $newParas = [];
            foreach (paragraphs($value) as $p) {
                $pn = squash($p);
                $isDup = false;
                if ($pn !== '' && isset($seen[$pn])) $isDup = true;
                if (!$isDup && $pn !== '' && mb_strlen($pn) >= 30 && isset($seenSent[$pn])) $isDup = true;
                if (!$isDup && $pn !== '') {
                    foreach ($seenShort as $sn) {
                        if ($sn !== '' && mb_strlen($sn) >= 40 && mb_strpos($sn, $pn) !== false) { $isDup = true; break; }
                    }
                }
                if ($isDup) {
                    $stats['para_dupes']++;
                    $rowLog[] = "[$lang] $name duplicate para dropped: " . mb_substr($p, 0, 60);
                    continue;
                }
                $newParas[] = $p;
                $seen[$pn] = true;
                foreach (preg_split('/(?<=[.!?।])\s+/u', $p) as $sentence) {
                    $sn = squash($sentence);
                    if ($sn !== '') { $seenShort[] = $sn; if (mb_strlen($sn) >= 30) $seenSent[$sn] = true; }
                }
            }
            $newValue = implode("\n\n", $newParas);
            if ($newValue !== trim($value)) {
                $update[$name] = $newValue;
            }
        }
    }

    /* ---------- 3. FAQ answers that repeat a body paragraph ---------- */
    $faqList = is_array($m->faqs) ? $m->faqs : [];
    $faqChanged = false;
    if ($faqList) {
        $bodyHay = [];
        foreach (['en' => '', 'bn' => '_bn'] as $lang => $sfx) {
            $hay = '';
            foreach (['intro', 'uses_text', 'side_effects', 'dosage', 'dosage_admin', 'dosage_timing'] as $f) {
                $hay .= ' ' . squash((string) $m->{$f . $sfx});
            }
            $bodyHay[$lang] = $hay;
        }
        foreach ($faqList as $i => $f) {
            foreach (['en' => ['q', 'a'], 'bn' => ['q_bn', 'a_bn']] as $lang => $keys) {
                [$qk, $ak] = $keys;
                $a = trim((string) ($f[$ak] ?? ''));
                if ($a === '') continue;
                $an = squash($a);
                if ($an === '') continue;
                $dup = mb_strlen($an) >= 30 && mb_strpos($bodyHay[$lang], $an) !== false;
                if ($dup) {
                    $faqList[$i][$qk] = '';
                    $faqList[$i][$ak] = '';
                    $faqChanged = true;
                    $stats['faq_dupes']++;
                    $rowLog[] = "[$lang] faq[$i] dropped (repeats body text)";
                }
            }
        }
    }
    if ($faqChanged) $update['faqs'] = $faqList;

    if ($DEBUG) {
        echo $m->slug . ' ' . (count($update) ? implode(',', array_keys($update)) : '-') . PHP_EOL;
        foreach ($rowLog as $l) echo '    ' . $l . PHP_EOL;
    }

    if (!$update) continue;
    $stats['changed']++;
    $log .= $m->slug . PHP_EOL . '  ' . implode(PHP_EOL . '  ', $rowLog) . PHP_EOL;
    if ($APPLY) $m->update($update);
}

echo json_encode($stats) . ' apply=' . ($APPLY ? 'yes' : 'no') . PHP_EOL;
file_put_contents(__DIR__ . '/../scratch/fix_duplicates_report.txt', $log);
echo 'report: scratch/fix_duplicates_report.txt' . PHP_EOL;

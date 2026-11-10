<?php
/**
 * Backfill `price_note` / `price_note_bn` with the article's own price lines, verbatim,
 * and drop the helper blocks that the restructuring pass had added to "More about"
 * ("Price notes" + "References") so nothing is shown twice.
 *
 * Nothing is written unless --apply is passed.
 *
 * Usage:
 *   php scripts/backfill_price_notes.php            (dry run)
 *   php scripts/backfill_price_notes.php --apply
 *   php scripts/backfill_price_notes.php --slug=napa-extra --debug
 */
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Medicine;
use App\Models\Post;

// reuse parser helpers from the restructuring script
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

/** Remove the helper blocks the restructuring pass added to "More about". */
function stripHelperBlocks(string $html): string
{
    $html = preg_replace('/<h3>\s*(?:Price notes|References)\s*<\/h3>\s*<ul>[\s\S]*?<\/ul>/u', '', $html);
    $html = preg_replace('/<h3>\s*(?:মূল্য নোট|তথ্যসূত্র)\s*<\/h3>\s*<ul>[\s\S]*?<\/ul>/u', '', $html);
    $html = preg_replace('/<hr\b[^>]*\/?>/iu', '', $html);
    $html = preg_replace('/<(p|div|span|strong|em)\b[^>]*>\s*<\/\1>/iu', '', $html);
    $html = trim(preg_replace('/\n{2,}/u', "\n", $html));
    // nothing but empty markup left?
    if (trim(strip_tags($html)) === '') return '';
    return $html;
}

$stats = ['rows' => 0, 'changed' => 0, 'price_rows' => 0, 'notes_removed' => 0, 'refs_removed' => 0];
$log = '';

foreach (Medicine::orderBy('id')->get() as $m) {
    if (isset($postSlugs[$m->slug])) continue;
    if ($ONLY !== null && $m->slug !== $ONLY) continue;
    $stats['rows']++;

    $q = $oldDb->prepare('SELECT seo_content, seo_content_bn FROM medicines WHERE slug = ?');
    $q->execute([$m->slug]);
    $old = $q->fetch(PDO::FETCH_ASSOC);
    if (!$old) continue;

    $update = [];
    foreach (['en' => 'seo_content', 'bn' => 'seo_content_bn'] as $lang => $col) {
        $srcHtml = trim((string) $old[$col]);
        if ($srcHtml === '') continue;
        $parsed = parseArticle(cleanHtml($srcHtml));
        if (!$parsed['ok']) continue;

        $rows = [];
        foreach ($parsed['sections'] as $s) {
            if (classifyHeading($s['heading']) !== 'price') continue;
            [$bullets, $paras, $extraHtml] = sectionParts($s['body']);
            foreach (array_merge($bullets, $paras) as $line) {
                $line = trim(preg_replace('/\s+/u', ' ', strip_tags($line)));
                if ($line === '') continue;
                [$label, $text] = splitLabel($line);
                $rows[] = ['label' => $label, 'text' => $text];
            }
        }
        // de-duplicate identical lines, keep order
        $seen = [];
        $rows = array_values(array_filter($rows, function ($r) use (&$seen) {
            $k = squash($r['label'] . ' ' . $r['text']);
            if (isset($seen[$k])) return false;
            $seen[$k] = true;
            return true;
        }));

        if ($rows) {
            $update['price_note' . ($lang === 'bn' ? '_bn' : '')] = $rows;
            $stats['price_rows'] += count($rows);
        }

        $field = $lang === 'bn' ? 'seo_content_bn' : 'seo_content';
        $before = (string) $m->$field;
        $after = stripHelperBlocks($before);
        if ($after !== $before) {
            $update[$field] = $after;
            if (preg_match('/Price notes|মূল্য নোট/u', $before)) $stats['notes_removed']++;
            if (preg_match('/<h3>\s*(?:References|তথ্যসূত্র)/u', $before)) $stats['refs_removed']++;
        }

        if ($DEBUG) {
            echo "  [$lang] price rows=" . count($rows) . ' more-about=' . mb_strlen($after) . PHP_EOL;
            foreach ($rows as $r) echo '      · ' . mb_substr($r['label'] . ': ' . $r['text'], 0, 90) . PHP_EOL;
        }
    }

    if (!$update) continue;
    $stats['changed']++;
    $log .= $m->slug . ' ' . implode(',', array_keys($update)) . PHP_EOL;
    if ($APPLY) $m->update($update);
}

echo json_encode($stats) . ' apply=' . ($APPLY ? 'yes' : 'no') . PHP_EOL;
file_put_contents(__DIR__ . '/../scratch/backfill_price_notes_report.txt', $log);
echo 'report: scratch/backfill_price_notes_report.txt' . PHP_EOL;

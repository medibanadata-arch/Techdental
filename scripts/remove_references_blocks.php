<?php
/**
 * Remove the standalone "References" / "তথ্যসূত্র" block that the restructuring pass
 * created inside "More about".
 *
 * On the live site those citation links sit INLINE in the article sentences
 * (e.g. "...you can review the pharmacology and clinical applications of Montelukast
 * on DrugBank."). The restructuring pass pulled them out of the sentence and grouped them
 * under a References heading, which does not exist on the real site and repeats the same
 * labels twice on the page.
 *
 * This script deletes the block, but only after checking that each link label is still
 * present somewhere else in the row (inline in the article text). Any label that would
 * disappear is reported and the row is left untouched, so no text is lost.
 *
 * Usage:
 *   php scripts/remove_references_blocks.php             (dry run)
 *   php scripts/remove_references_blocks.php --apply
 *   php scripts/remove_references_blocks.php --slug=napa-extra --debug
 */
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Medicine;

$APPLY = in_array('--apply', $argv, true);
$DEBUG = in_array('--debug', $argv, true);
$ONLY = null;
foreach ($argv as $a) {
    if (str_starts_with($a, '--slug=')) $ONLY = substr($a, 7);
}

function rsq(string $s): string
{
    $s = html_entity_decode($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return preg_replace('/[^\p{L}\p{N}]+/u', '', mb_strtolower($s, 'UTF-8'));
}

/** Every string leaf of the row, except the two fields we are editing. */
function rowText($row): string
{
    $skip = ['id', 'slug', 'created_at', 'updated_at', 'image', 'gallery', 'sort_order', 'is_active', 'seo_content', 'seo_content_bn'];
    $parts = [];
    $walk = function ($n) use (&$walk, &$parts) {
        if (is_string($n)) { $parts[] = $n; return; }
        if (is_array($n)) { foreach ($n as $x) $walk($x); }
    };
    foreach ((array) $row as $k => $v) {
        if (in_array($k, $skip, true)) continue;
        $walk($v);
    }
    return rsq(implode(' ', $parts));
}

$headings = ['en' => 'References', 'bn' => 'তথ্যসূত্র'];
$postSlugs = [];
foreach (App\Models\Post::pluck('slug') as $s) $postSlugs[$s] = true;

$stats = ['rows' => 0, 'changed' => 0, 'blocks' => 0, 'kept' => 0, 'links' => 0];
$blocked = [];
$log = '';

foreach (Medicine::orderBy('id')->get() as $m) {
    if (isset($postSlugs[$m->slug])) continue;
    if ($ONLY !== null && $m->slug !== $ONLY) continue;
    $stats['rows']++;

    $update = [];
    foreach (['en' => 'seo_content', 'bn' => 'seo_content_bn'] as $lang => $field) {
        $html = (string) $m->$field;
        if ($html === '') continue;
        $h = preg_quote($headings[$lang], '/');
        $re = '/<h3>\s*' . $h . '\s*<\/h3>\s*<ul>[\s\S]*?<\/ul>/u';
        if (!preg_match($re, $html)) continue;

        // labels of the links inside the block
        preg_match_all($re, $html, $bm);
        $labels = [];
        foreach ($bm[0] as $block) {
            if (preg_match_all('/<li>[\s\S]*?<\/li>/u', $block, $lis)) {
                foreach ($lis[0] as $li) {
                    $label = trim(preg_replace('/\s+/u', ' ', strip_tags($li)));
                    if ($label !== '') $labels[] = $label;
                }
            }
        }

        // everything except this block + the other language's seo_content
        $rest = preg_replace($re, '', $html);
        $hay = rsq(strip_tags($rest) . ' ' . rowText($m));

        $missing = [];
        foreach ($labels as $label) {
            $n = rsq($label);
            if ($n === '') continue;
            if (mb_strpos($hay, mb_substr($n, 0, 40)) === false) $missing[] = $label;
        }

        if ($DEBUG) {
            echo "  [$lang] block(s)=" . count($bm[0]) . ' labels=' . count($labels) . ' missing=' . count($missing) . PHP_EOL;
            foreach ($missing as $x) echo "      MISSING: " . mb_substr($x, 0, 70) . PHP_EOL;
        }

        if ($missing) {
            $blocked[] = $m->slug . " [$lang] " . mb_substr($missing[0], 0, 60);
            $stats['kept']++;
            continue;
        }

        $clean = trim(preg_replace('/\n{2,}/u', "\n", preg_replace($re, '', $html)));
        $update[$field] = $clean;
        $stats['blocks'] += count($bm[0]);
        $stats['links'] += count($labels);
        $log .= $m->slug . " [$lang] -" . count($bm[0]) . ' block, ' . count($labels) . ' links' . PHP_EOL;
    }

    if (!$update) continue;
    $stats['changed']++;
    if ($APPLY) $m->update($update);
}

echo json_encode($stats) . ' apply=' . ($APPLY ? 'yes' : 'no') . PHP_EOL;
if ($blocked) {
    echo "KEPT (label would be lost):" . PHP_EOL;
    foreach ($blocked as $b) echo '  ' . $b . PHP_EOL;
}
file_put_contents(__DIR__ . '/../scratch/remove_references_report.txt', $log);
echo 'report: scratch/remove_references_report.txt' . PHP_EOL;

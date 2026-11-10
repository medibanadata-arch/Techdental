<?php
/**
 * The leftover patch appended a second "Price notes" / "মূল্য নোট" block to a few
 * medicines. Merge every such block into a single list so the page has one heading.
 *
 * Usage: php scripts/merge_price_notes.php [--apply]
 */
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Medicine;

$APPLY = in_array('--apply', $argv, true);
$changed = 0;

foreach (Medicine::orderBy('id')->get() as $m) {
    $update = [];
    foreach (['seo_content' => 'Price notes', 'seo_content_bn' => 'মূল্য নোট'] as $field => $heading) {
        $html = (string) $m->$field;
        if ($html === '') continue;
        $quoted = preg_quote($heading, '/');
        if (!preg_match_all('/<h3>\s*' . $quoted . '\s*<\/h3>\s*<ul>([\s\S]*?)<\/ul>/u', $html, $blocks, PREG_SET_ORDER | PREG_OFFSET_CAPTURE)) continue;
        if (count($blocks) < 2) continue;

        $items = [];
        foreach ($blocks as $b) {
            preg_match_all('/<li>[\s\S]*?<\/li>/u', $b[1][0], $lis);
            foreach ($lis[0] as $li) {
                $key = mb_strtolower(preg_replace('/\s+/u', ' ', strip_tags($li)));
                if (!isset($items[$key])) $items[$key] = $li;
            }
        }
        $merged = '<h3>' . $heading . '</h3><ul>' . implode('', array_values($items)) . '</ul>';

        // remove every block, then re-insert the merged one at the first position
        $offset = $blocks[0][0][1];
        $out = $html;
        foreach (array_reverse($blocks) as $b) {
            $out = substr($out, 0, $b[0][1]) . substr($out, $b[0][1] + strlen($b[0][0]));
        }
        $out = substr($out, 0, $offset) . $merged . substr($out, $offset);
        $out = preg_replace("/\n{2,}/u", "\n", trim($out));
        $update[$field] = $out;
    }
    if (!$update) continue;
    $changed++;
    echo $m->slug . ' : ' . implode(', ', array_keys($update)) . PHP_EOL;
    if ($APPLY) $m->update($update);
}

echo "merged: $changed apply=" . ($APPLY ? 'yes' : 'no') . PHP_EOL;

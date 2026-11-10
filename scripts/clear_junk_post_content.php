<?php
/**
 * Clears post bodies that only contain a scraped "related articles" card instead of
 * real article content (the live site publishes these posts without a body).
 *
 * Usage: php scripts/clear_junk_post_content.php [--apply]
 */
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Post;

$APPLY = in_array('--apply', $argv, true);
$changed = 0;
$log = '';
foreach (Post::orderBy('id')->get() as $p) {
    foreach (['content' => 'en', 'content_bn' => 'bn'] as $col => $lang) {
        $html = trim((string) $p->$col);
        if ($html === '') continue;
        $text = trim(preg_replace('/\s+/u', ' ', strip_tags($html)));
        $isCard = preg_match('/^<article class="elementor-post elementor-grid-item/', $html) === 1;
        if (!$isCard || strlen($text) > 500) continue;
        $log .= "ID {$p->id} {$p->slug} [$lang] len=" . strlen($html) . " -> cleared (" . mb_substr($text, 0, 70) . ")\n";
        $changed++;
        if ($APPLY) { $p->$col = ''; $p->save(); }
    }
}
file_put_contents(__DIR__ . '/../scratch/junk_content_report.txt', $log);
echo "cleared=$changed apply=" . ($APPLY ? 'yes' : 'no') . "\n" . $log;

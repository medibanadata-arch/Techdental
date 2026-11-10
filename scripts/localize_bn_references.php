<?php
/**
 * Localises the "References" heading inside the Bangla "More about" block.
 * Usage: php scripts/localize_bn_references.php [--apply]
 */
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Medicine;

$APPLY = in_array('--apply', $argv, true);
$n = 0;
foreach (Medicine::orderBy('id')->get() as $m) {
    $html = (string) $m->seo_content_bn;
    if ($html === '' || !str_contains($html, '<h3>References</h3>')) continue;
    $new = str_replace('<h3>References</h3>', '<h3>তথ্যসূত্র</h3>', $html);
    $n++;
    if ($APPLY) { $m->seo_content_bn = $new; $m->save(); }
}
echo "localized=$n apply=" . ($APPLY ? 'yes' : 'no') . "\n";

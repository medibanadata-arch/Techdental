<?php
/**
 * Cleans medicine SEO titles that were imported from the "More about" widget heading.
 * Usage: php scripts/fix_medicine_seo_titles.php [--apply]
 */
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Medicine;

$APPLY = in_array('--apply', $argv, true);
$log = '';
$n = 0;
foreach (Medicine::orderBy('id')->get() as $m) {
    $t = trim((string) $m->seo_title);
    if (!preg_match('/^more about\b/i', $t)) continue;
    $new = 'Uses, Dosage, Side Effects & Price in Bangladesh';
    $log .= "ID {$m->id} {$m->slug}: [{$t}] -> [{$new}]\n";
    $n++;
    if ($APPLY) { $m->seo_title = $new; $m->save(); }
}
file_put_contents(__DIR__ . '/../scratch/seo_title_report.txt', $log);
echo "updated=$n apply=" . ($APPLY ? 'yes' : 'no') . "\n";

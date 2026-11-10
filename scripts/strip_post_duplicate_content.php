<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use App\Models\Post;
$APPLY = in_array('--apply', $argv, true);
$sources = [];
foreach (Post::orderBy('id')->get() as $p) {
    foreach (['content' => 'en', 'content_bn' => 'bn'] as $col => $lang) {
        $h = trim((string) $p->$col);
        if ($h === '') continue;
        $sources[$col === 'content' ? 'en' : 'bn'][$p->id] = md5($h);
    }
}
$log = '';
$n = 0;
foreach (Post::orderBy('id')->get() as $p) {
    foreach (['content_bn' => 'bn'] as $col => $lang) {
        $h = trim((string) $p->$col);
        if ($h === '') continue;
        $hash = md5($h);
        $others = [];
        foreach ($sources[$lang] as $id => $h2) if ($id !== $p->id && $h2 === $hash) $others[] = $id;
        if (!$others) continue;
        // keep the record that first carried this content; clear the copies
        if (min($others) < $p->id) {
            $log .= "ID {$p->id} {$p->slug} [$lang] duplicates " . implode(',', $others) . " -> cleared\n";
            $n++;
            if ($APPLY) { $p->$col = ''; $p->save(); }
        } else {
            $log .= "ID {$p->id} {$p->slug} [$lang] duplicates " . implode(',', $others) . " -> kept (original)\n";
        }
    }
}
file_put_contents(__DIR__ . '/../scratch/post_dup_report.txt', $log);
echo "duplicates=$n apply=" . ($APPLY ? 'yes' : 'no') . "\n";
echo $log;

<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$medController = new App\Http\Controllers\MedicineController();
$req = Illuminate\Http\Request::create('/medicines', 'GET');
$resp = $medController->publicIndex();
$page = $resp->toResponse($req)->getOriginalContent()['page'] ?? [];
$meds = $page['props']['medicines'] ?? [];

echo "Active medicines in index: " . count($meds) . "\n";
echo "First 5:\n";
foreach (array_slice($meds->toArray(), 0, 5) as $m) {
    echo "  [{$m['id']}] {$m['slug']} | {$m['name']} | FAQs: " . (is_array($m['faqs']) ? count($m['faqs']) : 0) . "\n";
}
echo "Sample from >= 61:\n";
foreach (array_slice($meds->toArray(), 60, 5) as $m) {
    echo "  [{$m['id']}] {$m['slug']} | {$m['name']} | FAQs: " . (is_array($m['faqs']) ? count($m['faqs']) : 0) . "\n";
}


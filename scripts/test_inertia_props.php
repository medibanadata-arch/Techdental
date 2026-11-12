<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$req = Illuminate\Http\Request::create('/blog', 'GET');
$res = $kernel->handle($req);

// Inertia renders JSON on X-Inertia requests
$reqInertia = Illuminate\Http\Request::create('/blog', 'GET', [], [], [], [
    'HTTP_X_INERTIA' => 'true',
    'HTTP_X_INERTIA_VERSION' => '1.0',
]);
$resInertia = $kernel->handle($reqInertia);
$data = json_decode($resInertia->getContent(), true);

echo "=== BLOG POSTS COUNT ===\n";
echo "Count: " . count($data['props']['posts'] ?? []) . "\n";
foreach ($data['props']['posts'] ?? [] as $p) {
    echo "  Post: [{$p['id']}] {$p['slug']} | EN: {$p['title']} | BN: {$p['title_bn']}\n";
}

// Now check Napa 500mg
$reqMed = Illuminate\Http\Request::create('/medicines/napa-500mg', 'GET', [], [], [], [
    'HTTP_X_INERTIA' => 'true',
    'HTTP_X_INERTIA_VERSION' => '1.0',
]);
$resMed = $kernel->handle($reqMed);
$medData = json_decode($resMed->getContent(), true);
$item = $medData['props']['item'] ?? [];

echo "\n=== NAPA 500MG INERTIA PROPS ===\n";
echo "Name: {$item['name']} | BN: {$item['name_bn']}\n";
echo "Image: {$item['image']}\n";
echo "FAQs count: " . count($item['faqs'] ?? []) . "\n";
foreach ($item['faqs'] ?? [] as $f) {
    echo "  Q (EN): {$f['q']}\n";
    echo "  Q (BN): " . ($f['q_bn'] ?? 'None') . "\n";
}
echo "Disclaimer (EN): " . ($item['author']['disclaimer'] ?? 'None') . "\n";
echo "Disclaimer (BN): " . ($item['author']['disclaimer_bn'] ?? 'None') . "\n";


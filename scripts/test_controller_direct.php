<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$controller = new App\Http\Controllers\BlogController();
$req = Illuminate\Http\Request::create('/blog', 'GET');
$resp = $controller->publicIndex($req);
$page = $resp->toResponse($req)->getOriginalContent()['page'] ?? [];
$posts = $page['props']['posts'] ?? [];

echo "=== DENTAL BLOG POSTS LISTED ON /blog ===\n";
echo "Count: " . count($posts) . "\n";
foreach ($posts as $p) {
    $id = $p['id'] ?? $p->id;
    $slug = $p['slug'] ?? $p->slug;
    $cat = $p['category'] ?? $p->category;
    $title = $p['title'] ?? $p->title;
    $title_bn = $p['title_bn'] ?? $p->title_bn;
    echo "  [{$id}] {$slug} | category: {$cat} | EN: {$title} | BN: {$title_bn}\n";
}

$medController = new App\Http\Controllers\MedicineController();
$reqMed = Illuminate\Http\Request::create('/medicines/napa-500mg', 'GET');
$respMed = $medController->publicShow($reqMed, 'napa-500mg');
$medPage = $respMed->toResponse($reqMed)->getOriginalContent()['page'] ?? [];
$item = $medPage['props']['item'] ?? [];

echo "\n=== NAPA 500MG ITEM ===\n";
$name = $item['name'] ?? $item->name ?? '';
$name_bn = $item['name_bn'] ?? $item->name_bn ?? '';
$image = $item['image'] ?? $item->image ?? '';
$faqs = $item['faqs'] ?? $item->faqs ?? [];

echo "Name: {$name}\n";
echo "Name BN: {$name_bn}\n";
echo "Image: {$image}\n";
echo "FAQs count: " . count($faqs) . "\n";
foreach ($faqs as $f) {
    echo "  Q (EN): " . ($f['q'] ?? '') . "\n";
    echo "  Q (BN): " . ($f['q_bn'] ?? '') . "\n";
}

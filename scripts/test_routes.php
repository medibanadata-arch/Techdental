<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$routes = ['/blog', '/bn/blog', '/medicines/napa-500mg', '/bn/medicines/napa-500mg'];

foreach ($routes as $uri) {
    $req = Illuminate\Http\Request::create($uri, 'GET');
    $res = $kernel->handle($req);
    echo "URI: {$uri} => Status: " . $res->getStatusCode() . "\n";
}


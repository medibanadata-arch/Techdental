<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
        ]);
        $middleware->trustProxies(at: '*');
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
        $middleware->web(append: [
            \App\Http\Middleware\TrailingSlashAndRedirectMiddleware::class,
            \App\Http\Middleware\SetLocale::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // Serve an archived old URL when a current entity route (doctor, service,
        // blog, medicine...) no longer resolves for that slug. This keeps the old
        // permalink alive at its exact path instead of returning 404.
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, Request $request) {
            if (!$request->isMethod('GET') && !$request->isMethod('HEAD')) {
                return null;
            }
            if ($request->is('api/*')) {
                return null;
            }

            return \App\Http\Controllers\LegacyPageController::serveIfExists($request->getPathInfo());
        });
    })->create();

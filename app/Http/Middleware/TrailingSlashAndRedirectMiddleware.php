<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Redirect;

class TrailingSlashAndRedirectMiddleware
{
    /**
     * Handle an incoming request for SEO trailing slash consistency & custom 301/302 redirects.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only inspect GET / HEAD requests
        if (!$request->isMethodSafe()) {
            return $next($request);
        }

        $uri = $request->getRequestUri();
        $path = '/' . trim($request->getPathInfo(), '/');

        // Ignore API, assets, Vite, storage, debug, and admin mutation endpoints
        if (
            str_starts_with($path, '/api/') ||
            str_starts_with($path, '/build/') ||
            str_starts_with($path, '/uploads/') ||
            str_starts_with($path, '/@vite') ||
            str_starts_with($path, '/_debugbar')
        ) {
            return $next($request);
        }

        // 1. Trailing Slash Consistency Check
        // If URI path ends with a slash (e.g. /services/ or /mirpur/), 301 redirect to non-trailing slash version
        $rawPath = $request->getPathInfo();
        if (strlen($rawPath) > 1 && str_ends_with($rawPath, '/')) {
            $cleanPath = rtrim($rawPath, '/');
            $queryString = $request->getQueryString();
            $targetUrl = $cleanPath . ($queryString ? '?' . $queryString : '');
            return redirect($targetUrl, 301);
        }

        // 2. Custom 301 / 302 Redirect Manager Check
        try {
            $redirect = Redirect::where('is_active', true)
                ->where(function ($query) use ($path, $rawPath) {
                    $query->where('source_url', $path)
                        ->orWhere('source_url', $rawPath)
                        ->orWhere('source_url', rtrim($path, '/'))
                        ->orWhere('source_url', ltrim($path, '/'));
                })
                ->first();

            if ($redirect && !empty($redirect->target_url)) {
                // Prevent infinite redirect loops
                if (rtrim($redirect->target_url, '/') !== rtrim($path, '/')) {
                    $redirect->increment('hits');
                    $code = in_array((int)$redirect->status_code, [301, 302]) ? (int)$redirect->status_code : 301;
                    return redirect($redirect->target_url, $code);
                }
            }
        } catch (\Throwable $e) {
            // Silently proceed if database not yet migrated
        }

        return $next($request);
    }
}

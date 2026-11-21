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
        // If URI path ends with a slash (e.g. /services/ or /mirpur/), 301 redirect to non-trailing slash version.
        // Archived legacy pages keep the exact URL they were published with (slash included).
        $rawPath = $request->getPathInfo();
        if (strlen($rawPath) > 1 && str_ends_with($rawPath, '/')) {
            $cleanPath = rtrim($rawPath, '/');
            $decodedRaw = rawurldecode($rawPath);
            $decodedClean = rtrim($decodedRaw, '/');
            $isLegacyPage = false;
            try {
                $isLegacyPage = \App\Models\LegacyPage::where('is_active', true)
                    ->where(function ($q) use ($rawPath, $cleanPath, $decodedRaw, $decodedClean) {
                        $q->where('path', $rawPath)
                            ->orWhere('path', $cleanPath)
                            ->orWhere('path', $decodedRaw)
                            ->orWhere('path', $decodedClean);
                    })
                    ->exists();
            } catch (\Throwable $e) {
                // Table not migrated yet.
            }

            if (!$isLegacyPage) {
                // If a managed redirect exists for this path, let the redirect
                // manager below send the visitor straight to the final target
                // instead of chaining through a trailing-slash hop.
                $hasManagedRedirect = false;
                try {
                    $hasManagedRedirect = \App\Models\Redirect::where('is_active', true)
                        ->where(function ($q) use ($cleanPath, $rawPath) {
                            $q->where('source_url', $cleanPath)->orWhere('source_url', $rawPath);
                        })
                        ->exists();
                } catch (\Throwable $e) {
                    // Table not migrated yet.
                }

                if (!$hasManagedRedirect) {
                    $queryString = $request->getQueryString();
                    $targetUrl = $cleanPath . ($queryString ? '?' . $queryString : '');
                    return redirect($targetUrl, 301);
                }
            }
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
                // An archived legacy page wins over a fallback redirect so the
                // old URL keeps resolving at the exact same path.
                $hasLegacy = false;
                try {
                    $hasLegacy = \App\Models\LegacyPage::where('is_active', true)
                        ->where(function ($q) use ($path, $rawPath) {
                            $q->where('path', $path)
                                ->orWhere('path', $rawPath)
                                ->orWhere('path', $path . '/');
                        })
                        ->exists();
                } catch (\Throwable $e) {
                    // Table not migrated yet.
                }

                // Prevent infinite redirect loops
                if (!$hasLegacy && rtrim($redirect->target_url, '/') !== rtrim($path, '/')) {
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

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Bangla URLs (/bn/...) are rendered with lang="bn" so search engines and
     * screen readers treat them as the Bangla version of the page.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = ($request->is('bn') || $request->is('bn/*')) ? 'bn' : 'en';

        app()->setLocale($locale);
        $request->attributes->set('page_locale', $locale);

        return $next($request);
    }
}

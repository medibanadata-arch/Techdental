<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Allow only backend staff with the Administrator role.
     * Editors, authors and normal registered users get a 403.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $request->expectsJson()
                ? response()->json(['message' => 'Unauthenticated.'], 401)
                : redirect()->guest(route('login'));
        }

        if (! $user->isAdmin()) {
            abort(403, 'You do not have permission to access the admin area.');
        }

        return $next($request);
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Super admin doesn't need school access
        if ($user && $user->hasRole('super-admin')) {
            return $next($request);
        }

        // School admin must have school assigned
        if ($user && $user->hasRole('school-admin')) {
            if (!$user->school_id) {
                return response()->json(['message' => 'School not assigned'], 403);
            }
        }

        // Parent must have students
        if ($user && $user->hasRole('parent')) {
            if (!$user->students()->exists()) {
                return response()->json(['message' => 'No students assigned'], 403);
            }
        }

        return $next($request);
    }
}
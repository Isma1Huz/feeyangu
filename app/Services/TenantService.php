<?php

namespace App\Services;

use App\Models\School;
use Illuminate\Support\Facades\Auth;

class TenantService
{
    /**
     * Get current tenant (school)
     */
    public static function current(): ?School
    {
        $user = Auth::user();

        if (!$user) {
            return null;
        }

        if ($user->hasRole('super-admin')) {
            return null; // No tenant restriction
        }

        return $user->school;
    }

    /**
     * Verify user has access to school
     */
    public static function verify(int $schoolId): bool
    {
        $user = Auth::user();

        if (!$user) {
            return false;
        }

        if ($user->hasRole('super-admin')) {
            return true;
        }

        return $user->school_id === $schoolId;
    }

    /**
     * Get accessible schools for user
     */
    public static function accessibleSchools()
    {
        $user = Auth::user();

        if (!$user) {
            return collect([]);
        }

        if ($user->hasRole('super-admin')) {
            return School::all();
        }

        if ($user->school_id) {
            return School::where('id', $user->school_id)->get();
        }

        return collect([]);
    }
}
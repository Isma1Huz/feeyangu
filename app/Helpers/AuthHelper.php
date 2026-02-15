<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Auth;

class AuthHelper
{
    /**
     * Check if user is super admin
     */
    public static function isSuperAdmin(): bool
    {
        return Auth::check() && Auth::user()->hasRole('super-admin');
    }

    /**
     * Check if user is school admin
     */
    public static function isSchoolAdmin(): bool
    {
        return Auth::check() && Auth::user()->hasRole('school-admin');
    }

    /**
     * Check if user is parent
     */
    public static function isParent(): bool
    {
        return Auth::check() && Auth::user()->hasRole('parent');
    }

    /**
     * Check if user belongs to school
     */
    public static function belongsToSchool(int $schoolId): bool
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
}
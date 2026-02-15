<?php

namespace App\Helpers;

use App\Models\School;
use Illuminate\Support\Facades\Auth;

class SchoolAccessValidator
{
    /**
     * Validate user has access to school and throw if not
     */
    public static function validateOrFail(int $schoolId): void
    {
        $user = Auth::user();

        if (!$user) {
            abort(403, 'Unauthenticated');
        }

        if ($user->hasRole('super-admin')) {
            return; // Super admin can access any school
        }

        if ($user->hasRole('school-admin') && $user->school_id === $schoolId) {
            return; // School admin can access their own school
        }

        abort(403, 'Unauthorized school access');
    }

    /**
     * Validate and get the school
     */
    public static function getSchoolOrFail(int $schoolId): School
    {
        self::validateOrFail($schoolId);
        return School::findOrFail($schoolId);
    }
}
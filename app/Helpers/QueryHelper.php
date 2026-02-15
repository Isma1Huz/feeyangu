<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class QueryHelper
{
    /**
     * Scope query to current school (for school admins)
     */
    public static function scopeToCurrentSchool(Builder $query): Builder
    {
        $user = Auth::user();

        if ($user && $user->hasRole('school-admin') && $user->school_id) {
            return $query->where('school_id', $user->school_id);
        }

        return $query;
    }

    /**
     * Scope query to specific school (with permission check)
     */
    public static function scopeToSchool(Builder $query, int $schoolId): Builder
    {
        // Validates access
        SchoolAccessValidator::validateOrFail($schoolId);
        
        return $query->where('school_id', $schoolId);
    }
}
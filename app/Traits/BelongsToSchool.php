<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;
use App\Models\School;

trait BelongsToSchool
{
    /**
     * Boot the trait - add global scope
     */
    public static function bootBelongsToSchool()
    {
        static::addGlobalScope('school', function (Builder $builder) {
            $user = Auth::user();

            // Super admin can see all records
            if ($user && $user->hasRole('super-admin')) {
                return;
            }

            // School admin only sees their school's records
            if ($user && $user->hasRole('school-admin') && $user->school_id) {
                $builder->where('school_id', $user->school_id);
            }
        });
    }

    /**
     * Get the school relationship
     */
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
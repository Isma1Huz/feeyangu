<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SchoolCustomization extends Model
{
    protected $fillable = [
        'school_id',
        'key',
        'value',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    // Keys: logo_path, school_motto, primary_color, secondary_color, etc.
}
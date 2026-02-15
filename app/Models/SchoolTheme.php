<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SchoolTheme extends Model
{
    protected $fillable = [
        'name',
        'primary_color',
        'secondary_color',
        'accent_color',
        'font_family',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function schools(): HasMany
    {
        return $this->hasMany(School::class, 'theme_id');
    }
}
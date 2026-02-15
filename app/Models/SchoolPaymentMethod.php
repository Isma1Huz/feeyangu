<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\BelongsToSchool;

class SchoolPaymentMethod extends Model
{
    use BelongsToSchool;
    protected $fillable = [
        'school_id',
        'method_name',
        'method_type',
        'account_holder_name',
        'account_number',
        'bank_name',
        'branch_code',
        'mpesa_number',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
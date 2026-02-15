<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\BelongsToSchool;

class Payment extends Model
{
    use BelongsToSchool;
    protected $fillable = [
        'school_id',
        'student_fee_id',
        'amount',
        'payment_method',
        'reference',
        'payment_status',
        'notes',
        'paid_at',
        'receipt_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    // Payment methods
    const PAYMENT_METHODS = [
        'mpesa' => 'M-Pesa',
        'bank_transfer' => 'Bank Transfer',
        'bank_check' => 'Check',
        'cash' => 'Cash',
        'card' => 'Card',
        'paypal' => 'PayPal',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function studentFee(): BelongsTo
    {
        return $this->belongsTo(StudentFee::class);
    }

    public function receipt(): BelongsTo
    {
        return $this->belongsTo(Receipt::class);
    }
}
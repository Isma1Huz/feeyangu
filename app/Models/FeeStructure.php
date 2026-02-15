<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FeeStructure extends Model
{
    use BelongsToSchool, HasFactory;
    protected $fillable = [
        'school_id',
        'grade_id',
        'term_id',
        'total_amount',
        'due_date',
        'is_active'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'due_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function grade(): BelongsTo
    {
        return $this->belongsTo(Grade::class);
    }

    public function term(): BelongsTo
    {
        return $this->belongsTo(Term::class);
    }

    public function breakdowns(): HasMany
    {
        return $this->hasMany(FeeBreakdown::class);
    }

    public function studentFees(): HasMany
    {
        return $this->hasMany(StudentFee::class);
    }

    // Helper: Get total amount from breakdowns
    public function recalculateTotalAmount(): float
    {
        $total = $this->breakdowns()->sum('amount');
        $this->update(['total_amount' => $total]);
        return $total;
    }
}
<?php

namespace App\Models;

use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Student extends Model
{
    use BelongsToSchool, SoftDeletes, HasFactory;

    protected $fillable = [
        'school_id',
        'parent_id',
        'grade_id',
        'class_id',
        'admission_no',
        'first_name',
        'last_name',
        'email',
        'date_of_birth',
        'is_active',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'is_active' => 'boolean',
    ];


    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    public function grade(): BelongsTo
    {
        return $this->belongsTo(Grade::class);
    }

    public function class(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function studentFees(): HasMany
    {
        return $this->hasMany(StudentFee::class);
    }

    public function receipts(): HasMany
    {
        return $this->hasMany(Receipt::class);
    }

    // ===== ACCESSORS & HELPERS =====

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Get grade name through relationship (instead of string column)
     */
    public function getGradeNameAttribute(): string
    {
        return $this->grade?->name ?? 'N/A';
    }

    /**
     * Get class name through relationship
     */
    public function getClassNameAttribute(): string
    {
        return $this->class?->name ?? 'N/A';
    }

    public function getTotalFeesDue(): float
    {
        return $this->studentFees()
            ->whereIn('status', ['unpaid', 'partially_paid', 'overdue'])
            ->sum('balance');
    }

    public function getTotalFeesPaid(): float
    {
        return $this->studentFees()
            ->where('status', 'paid')
            ->sum('amount_paid');
    }

    public function getTotalFeesAssigned(): float
    {
        return $this->studentFees()->sum('amount_due');
    }
}
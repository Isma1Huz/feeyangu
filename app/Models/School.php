<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class School extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
        'owner_id',
        'logo_path',
        'is_active',
        'subscription_status',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    
    // Relations
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }

    public function terms(): HasMany
    {
        return $this->hasMany(Term::class);
    }

    public function feeStructures(): HasMany
    {
        return $this->hasMany(FeeStructure::class);
    }

    public function studentFees(): HasMany
    {
        return $this->hasMany(StudentFee::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function customization(): HasMany
    {
        return $this->hasMany(SchoolCustomization::class);
    }

    public function paymentMethods(): HasMany
    {
        return $this->hasMany(SchoolPaymentMethod::class);
    }

    public function receiptTemplates(): HasMany
    {
        return $this->hasMany(ReceiptTemplate::class);
    }

    public function receipts(): HasMany
    {
        return $this->hasMany(Receipt::class);
    }

    public function theme(): BelongsTo
    {
        return $this->belongsTo(SchoolTheme::class, 'theme_id');
    }

    // Helper Methods
    public function getTotalStudentsCount(): int
    {
        return $this->students()->count();
    }

    public function getTotalFeesCollected(): float
    {
        return $this->payments()->sum('amount');
    }

    public function getTotalFeesPending(): float
    {
        return $this->studentFees()
            ->whereIn('status', ['unpaid', 'partially_paid', 'overdue'])
            ->sum('balance');
    }
}
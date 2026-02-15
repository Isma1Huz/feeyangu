<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\BelongsToSchool;

class StudentFee extends Model
{
    use BelongsToSchool;
    protected $table = 'student_fees';

    protected $fillable = [
        'student_id',
        'fee_structure_id',
        'amount_due',
        'amount_paid',
        'balance',
        'due_date',
        'status',
        'is_overdue',
        'notes',
    ];

    protected $casts = [
        'amount_due' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'balance' => 'decimal:2',
        'due_date' => 'date',
        'is_overdue' => 'boolean',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function feeStructure(): BelongsTo
    {
        return $this->belongsTo(FeeStructure::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // Helper: Update balance and status
    public function updateBalance(): void
    {
        $this->balance = $this->amount_due - $this->amount_paid;

        if ($this->amount_paid == 0) {
            $this->status = 'unpaid';
        } elseif ($this->amount_paid >= $this->amount_due) {
            $this->status = 'paid';
        } else {
            $this->status = 'partially_paid';
        }

        // Check if overdue
        if ($this->due_date && $this->due_date < now() && $this->status !== 'paid') {
            $this->is_overdue = true;
        }

        $this->save();
    }

    // Helper: Process payment
    public function recordPayment(float $amount, string $method, string $reference = null): Payment
    {
        $payment = new Payment([
            'school_id' => $this->student->school_id,
            'amount' => $amount,
            'payment_method' => $method,
            'reference' => $reference,
        ]);

        $this->payments()->save($payment);

        $this->amount_paid += $amount;
        $this->updateBalance();

        return $payment;
    }
}
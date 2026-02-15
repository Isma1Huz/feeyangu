<?php

namespace App\Services;

use App\Models\StudentFee;
use Exception;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Support\Facades\DB;

class StudentFeeService
{
    /**
     * Get student fees with pagination
     */
    public function getStudentFees(int $studentId, int $perPage = 15, array $filters = []): Paginator
    {
        $query = StudentFee::where('student_id', $studentId)
            ->with(['feeStructure.breakdowns', 'payments']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['is_overdue'])) {
            $query->where('is_overdue', (bool)$filters['is_overdue']);
        }

        if (!empty($filters['term'])) {
            $query->whereHas('feeStructure', function ($q) use ($filters) {
                $q->where('term', $filters['term']);
            });
        }

        return $query->orderBy('due_date', 'desc')->paginate($perPage);
    }

    /**
     * Get student fee by ID
     */
    public function getStudentFeeById(int $id): ?StudentFee
    {
        return StudentFee::with([
            'student',
            'feeStructure.breakdowns',
            'payments.receipt',
        ])->find($id);
    }

    /**
     * Create student fee
     */
    public function createStudentFee(array $data): StudentFee
    {
        try {
            DB::beginTransaction();

            // Check if already exists
            if (StudentFee::where('student_id', $data['student_id'])
                ->where('fee_structure_id', $data['fee_structure_id'])
                ->exists()) {
                throw new Exception('Fee already assigned to this student');
            }

            $studentFee = StudentFee::create([
                'student_id' => $data['student_id'],
                'fee_structure_id' => $data['fee_structure_id'],
                'amount_due' => $data['amount_due'],
                'amount_paid' => 0,
                'balance' => $data['amount_due'],
                'due_date' => $data['due_date'] ?? null,
                'status' => 'unpaid',
                'is_overdue' => false,
                'notes' => $data['notes'] ?? null,
            ]);

            DB::commit();

            return $studentFee;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update student fee
     */
    public function updateStudentFee(StudentFee $studentFee, array $data): StudentFee
    {
        try {
            DB::beginTransaction();

            $studentFee->update([
                'amount_due' => $data['amount_due'] ?? $studentFee->amount_due,
                'due_date' => $data['due_date'] ?? $studentFee->due_date,
                'notes' => $data['notes'] ?? $studentFee->notes,
            ]);

            $studentFee->updateBalance();

            DB::commit();

            return $studentFee;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get fee details with breakdown
     */
    public function getFeeDetails(StudentFee $studentFee): array
    {
        $feeStructure = $studentFee->feeStructure;

        return [
            'fee_id' => $studentFee->id,
            'student' => [
                'id' => $studentFee->student->id,
                'name' => $studentFee->student->full_name,
                'admission_no' => $studentFee->student->admission_no,
                'email' => $studentFee->student->email,
            ],
            'grade' => $feeStructure->grade,
            'term' => $feeStructure->term,
            'period' => $feeStructure->period,
            'due_date' => $studentFee->due_date?->format('Y-m-d'),
            'status' => $studentFee->status,
            'is_overdue' => $studentFee->is_overdue,
            'amount_due' => (float) $studentFee->amount_due,
            'amount_paid' => (float) $studentFee->amount_paid,
            'balance' => (float) $studentFee->balance,
            'breakdowns' => $feeStructure->breakdowns->map(fn($breakdown) => [
                'item_name' => $breakdown->item_name,
                'amount' => (float) $breakdown->amount,
                'description' => $breakdown->description,
            ])->toArray(),
            'payments' => $studentFee->payments->map(fn($payment) => [
                'id' => $payment->id,
                'amount' => (float) $payment->amount,
                'method' => $payment->payment_method,
                'reference' => $payment->reference,
                'date' => $payment->paid_at->format('Y-m-d H:i:s'),
            ])->toArray(),
        ];
    }

    /**
     * Mark fee as overdue
     */
    public function markAsOverdue(StudentFee $studentFee): void
    {
        if ($studentFee->due_date && $studentFee->due_date < now() && $studentFee->status !== 'paid') {
            $studentFee->update(['is_overdue' => true]);
        }
    }

    /**
     * Get fees summary for student
     */
    public function getStudentFeesSummary(int $studentId): array
    {
        $fees = StudentFee::where('student_id', $studentId)->get();

        $totalDue = (float) $fees->sum('amount_due');
        $totalPaid = (float) $fees->sum('amount_paid');
        $totalBalance = (float) $fees->sum('balance');

        return [
            'total_fees_assigned' => $fees->count(),
            'total_amount_due' => $totalDue,
            'total_amount_paid' => $totalPaid,
            'total_balance' => $totalBalance,
            'payment_completion_rate' => $totalDue > 0 ? round(($totalPaid / $totalDue) * 100, 2) : 0,
            'status_breakdown' => [
                'paid' => $fees->where('status', 'paid')->count(),
                'unpaid' => $fees->where('status', 'unpaid')->count(),
                'partially_paid' => $fees->where('status', 'partially_paid')->count(),
                'overdue' => $fees->where('is_overdue', true)->count(),
            ],
        ];
    }

    /**
     * Get fees by status
     */
    public function getFeesByStatus(int $studentId, string $status): array
    {
        return StudentFee::where('student_id', $studentId)
            ->where('status', $status)
            ->with(['feeStructure', 'payments'])
            ->get()
            ->toArray();
    }
}
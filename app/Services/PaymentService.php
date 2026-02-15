<?php

namespace App\Services;

use App\Jobs\GenerateReceipt;
use App\Models\Payment;
use App\Models\StudentFee;
use App\Models\School;
use App\Models\Receipt;
use Exception;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Events\PaymentReceived;

class PaymentService
{
    /**
     * Get school payments with pagination
     */
    public function getSchoolPayments(School $school, int $perPage = 15, array $filters = []): Paginator
    {
        $query = Payment::where('school_id', $school->id)
            ->with(['studentFee.student', 'receipt']);

        if (!empty($filters['search'])) {
            $query->whereHas('studentFee.student', function ($q) use ($filters) {
                $q->where('first_name', 'like', "%{$filters['search']}%")
                    ->orWhere('last_name', 'like', "%{$filters['search']}%")
                    ->orWhere('admission_no', 'like', "%{$filters['search']}%");
            });
        }

        if (!empty($filters['payment_method'])) {
            $query->where('payment_method', $filters['payment_method']);
        }

        if (!empty($filters['payment_status'])) {
            $query->where('payment_status', $filters['payment_status']);
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('paid_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('paid_at', '<=', $filters['date_to']);
        }

        if (!empty($filters['student_id'])) {
            $query->whereHas('studentFee', function ($q) use ($filters) {
                $q->where('student_id', $filters['student_id']);
            });
        }

        return $query->orderBy('paid_at', 'desc')->paginate($perPage);
    }

    /**
     * Get payment by ID
     */
    public function getPaymentById(int $id): ?Payment
    {
        return Payment::with([
            'school',
            'studentFee.student',
            'studentFee.feeStructure.breakdowns',
            'receipt',
        ])->find($id);
    }

    /**
     * Record payment
     */
    public function recordPayment(StudentFee $studentFee, array $data): Payment
    {
        try {
            DB::beginTransaction();

            $amount = (float) $data['amount'];

            if ($amount <= 0) {
                throw new Exception('Payment amount must be greater than zero');
            }

            if ($amount > $studentFee->balance) {
                throw new Exception("Payment amount cannot exceed balance of {$studentFee->balance}");
            }

            $payment = Payment::create([
                'school_id' => $studentFee->student->school_id,
                'student_fee_id' => $studentFee->id,
                'amount' => $amount,
                'payment_method' => $data['payment_method'],
                'reference' => $data['reference'] ?? null,
                'payment_status' => $data['payment_status'] ?? 'completed',
                'notes' => $data['notes'] ?? null,
                'paid_at' => $data['paid_at'] ?? now(),
            ]);

            $studentFee->amount_paid += $amount;
            $studentFee->updateBalance();

            // Dispatch event
            PaymentReceived::dispatch($payment);

            // Generate receipt asynchronously
            dispatch(new GenerateReceipt($payment->id));

            DB::commit();

            return $payment;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Process payment from parent
     */
    public function processParentPayment(StudentFee $studentFee, array $data): Payment
    {
        try {
            DB::beginTransaction();

            $amount = (float) $data['amount'];

            // Validate amount
            if ($amount <= 0) {
                throw new Exception('Payment amount must be greater than zero');
            }

            if ($amount > $studentFee->balance) {
                throw new Exception("Payment amount cannot exceed balance of {$studentFee->balance}");
            }

            // Verify payment method is active for school
            $paymentMethod = $studentFee->student->school->paymentMethods()
                ->where('method_type', $data['payment_method'])
                ->where('is_active', true)
                ->firstOrFail();

            // Create payment
            $payment = Payment::create([
                'school_id' => $studentFee->student->school_id,
                'student_fee_id' => $studentFee->id,
                'amount' => $amount,
                'payment_method' => $data['payment_method'],
                'reference' => $data['reference'] ?? null,
                'payment_status' => 'pending', // Pending verification
                'notes' => $data['notes'] ?? null,
                'paid_at' => now(),
            ]);

            // Update student fee tentatively
            $studentFee->amount_paid += $amount;
            $studentFee->updateBalance();

            DB::commit();

            Log::info("Parent payment recorded - pending verification", [
                'payment_id' => $payment->id,
                'student_fee_id' => $studentFee->id,
                'amount' => $amount,
            ]);

            return $payment;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Approve payment
     */
    public function approvePayment(Payment $payment): Payment
    {
        try {
            DB::beginTransaction();

            $payment->update(['payment_status' => 'completed']);

            // Generate receipt
            dispatch(new GenerateReceipt($payment->id));

            DB::commit();

            Log::info("Payment approved", ['payment_id' => $payment->id]);

            return $payment;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Reject payment
     */
    public function rejectPayment(Payment $payment, string $reason = null): Payment
    {
        try {
            DB::beginTransaction();

            $payment->update([
                'payment_status' => 'failed',
                'notes' => $reason ?? 'Payment rejected',
            ]);

            // Revert student fee amounts
            $studentFee = $payment->studentFee;
            $studentFee->amount_paid -= $payment->amount;
            $studentFee->updateBalance();

            DB::commit();

            Log::info("Payment rejected", [
                'payment_id' => $payment->id,
                'reason' => $reason,
            ]);

            return $payment;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get payment statistics
     */
    public function getPaymentStatistics(School $school, array $filters = []): array
    {
        $query = Payment::where('school_id', $school->id)
            ->where('payment_status', 'completed');

        if (!empty($filters['date_from'])) {
            $query->whereDate('paid_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('paid_at', '<=', $filters['date_to']);
        }

        $totalPayments = $query->count();
        $totalAmount = (float) $query->sum('amount');

        // Method breakdown
        $methodBreakdown = Payment::where('school_id', $school->id)
            ->where('payment_status', 'completed')
            ->selectRaw('payment_method, COUNT(*) as count, SUM(amount) as total')
            ->groupBy('payment_method')
            ->get()
            ->map(function ($item) {
                return [
                    'method' => $item->payment_method,
                    'count' => $item->count,
                    'total' => (float) $item->total,
                ];
            })
            ->toArray();

        // Status breakdown
        $statusBreakdown = Payment::where('school_id', $school->id)
            ->selectRaw('payment_status, COUNT(*) as count, SUM(amount) as total')
            ->groupBy('payment_status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => $item->status,
                    'count' => $item->count,
                    'total' => (float) $item->total,
                ];
            })
            ->toArray();

        return [
            'total_payments' => $totalPayments,
            'total_amount' => $totalAmount,
            'average_payment' => $totalPayments > 0 ? $totalAmount / $totalPayments : 0,
            'method_breakdown' => $methodBreakdown,
            'status_breakdown' => $statusBreakdown,
        ];
    }

    /**
     * Get student payment history
     */
    public function getStudentPaymentHistory(int $studentId, int $perPage = 15): Paginator
    {
        return Payment::whereHas('studentFee', function ($q) use ($studentId) {
            $q->where('student_id', $studentId);
        })
        ->with(['studentFee.feeStructure', 'receipt'])
        ->orderBy('paid_at', 'desc')
        ->paginate($perPage);
    }

    /**
     * Export payments to CSV
     */
    public function exportPayments(School $school, array $filters = []): string
    {
        try {
            $query = Payment::where('school_id', $school->id)
                ->with(['studentFee.student', 'studentFee.feeStructure']);

            if (!empty($filters['date_from'])) {
                $query->whereDate('paid_at', '>=', $filters['date_from']);
            }

            if (!empty($filters['date_to'])) {
                $query->whereDate('paid_at', '<=', $filters['date_to']);
            }

            $payments = $query->get();

            $filename = "payments_export_" . $school->id . "_" . now()->format('Y-m-d_H-i-s') . ".csv";
            $handle = fopen("php://temp", 'w');

            // Header
            fputcsv($handle, [
                'Payment ID',
                'Student Name',
                'Admission No',
                'Amount',
                'Method',
                'Reference',
                'Status',
                'Date',
            ]);

            // Data
            foreach ($payments as $payment) {
                fputcsv($handle, [
                    $payment->id,
                    $payment->studentFee->student->full_name,
                    $payment->studentFee->student->admission_no,
                    $payment->amount,
                    $payment->payment_method,
                    $payment->reference,
                    $payment->payment_status,
                    $payment->paid_at->format('Y-m-d H:i:s'),
                ]);
            }

            rewind($handle);
            return stream_get_contents($handle);
        } catch (Exception $e) {
            Log::error("Payment export failed", ['error' => $e->getMessage()]);
            throw $e;
        }
    }
}
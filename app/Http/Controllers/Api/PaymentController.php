<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\School;
use App\Models\StudentFee;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * List payments
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('view payments');

        $school = Auth::user()->school;
        $filters = $request->only(['search', 'payment_method', 'payment_status', 'date_from', 'date_to', 'student_id']);
        $perPage = $request->get('per_page', 15);

        $payments = $this->paymentService->getSchoolPayments($school, $perPage, $filters);

        return response()->json([
            'data' => $payments->items(),
            'pagination' => [
                'current_page' => $payments->currentPage(),
                'per_page' => $payments->perPage(),
                'total' => $payments->total(),
                'last_page' => $payments->lastPage(),
            ],
        ]);
    }

    /**
     * Show payment
     */
    public function show(Payment $payment): JsonResponse
    {
        $this->authorize('view payments');

        $paymentData = $this->paymentService->getPaymentById($payment->id);

        return response()->json([
            'data' => $paymentData,
        ]);
    }

    /**
     * Record payment
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('record payment');

        $validated = $request->validate([
            'student_fee_id' => 'required|exists:student_fees,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|string|in:mpesa,bank_transfer,bank_check,cash,card,paypal',
            'reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        try {
            $studentFee = StudentFee::findOrFail($validated['student_fee_id']);

            $payment = $this->paymentService->recordPayment($studentFee, $validated);

            return response()->json([
                'message' => 'Payment recorded successfully',
                'data' => $payment,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Approve payment
     */
    public function approve(Payment $payment): JsonResponse
    {
        $this->authorize('record payment');

        try {
            $this->paymentService->approvePayment($payment);

            return response()->json([
                'message' => 'Payment approved successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Reject payment
     */
    public function reject(Request $request, Payment $payment): JsonResponse
    {
        $this->authorize('record payment');

        $validated = $request->validate([
            'reason' => 'nullable|string',
        ]);

        try {
            $this->paymentService->rejectPayment($payment, $validated['reason'] ?? null);

            return response()->json([
                'message' => 'Payment rejected successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get statistics
     */
    public function statistics(Request $request): JsonResponse
    {
        $this->authorize('view payments');

        $school = Auth::user()->school;
        $filters = $request->only(['date_from', 'date_to']);

        $statistics = $this->paymentService->getPaymentStatistics($school, $filters);

        return response()->json([
            'data' => $statistics,
        ]);
    }

    /**
     * Get student payment history
     */
    public function studentHistory(int $studentId): JsonResponse
    {
        $this->authorize('view payments');

        $payments = $this->paymentService->getStudentPaymentHistory($studentId, 10);

        return response()->json([
            'data' => $payments->items(),
        ]);
    }
}
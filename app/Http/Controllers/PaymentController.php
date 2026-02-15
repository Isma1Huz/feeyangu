<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\School;
use App\Models\StudentFee;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
        $this->middleware('auth');
    }

    /**
     * Get authenticated user's school
     */
    private function getSchool(): School
    {
        $school = Auth::user()->school;

        if (!$school) {
            abort(403, 'School not found');
        }

        return $school;
    }

    /**
     * Display payments list for school admin
     */
    public function index(Request $request): Response
    {
        $this->authorize('view payments');

        $school = $this->getSchool();
        $filters = $request->only(['search', 'payment_method', 'payment_status', 'date_from', 'date_to', 'student_id']);

        $payments = $this->paymentService->getSchoolPayments($school, 15, $filters);

        return Inertia::render('School/Payments/Index', [
            'payments' => $payments,
            'filters' => $filters,
        ]);
    }

    /**
     * Show payment details for school admin
     */
    public function show(Payment $payment): Response
    {
        $this->authorize('view payments');

        $paymentData = $this->paymentService->getPaymentById($payment->id);

        return Inertia::render('School/Payments/Show', [
            'payment' => $paymentData,
        ]);
    }

    /**
     * Record payment (school admin)
     */
    public function store(Request $request)
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

            return redirect()
                ->route('payments.show', $payment)
                ->with('success', 'Payment recorded successfully');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Approve pending payment
     */
    public function approve(Payment $payment)
    {
        $this->authorize('record payment');

        try {
            $this->paymentService->approvePayment($payment);

            return back()->with('success', 'Payment approved successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Reject payment
     */
    public function reject(Request $request, Payment $payment)
    {
        $this->authorize('record payment');

        $validated = $request->validate([
            'reason' => 'nullable|string',
        ]);

        try {
            $this->paymentService->rejectPayment($payment, $validated['reason'] ?? null);

            return back()->with('success', 'Payment rejected successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Export payments
     */
    public function export(Request $request)
    {
        $this->authorize('view payments');

        $school = $this->getSchool();
        $filters = $request->only(['date_from', 'date_to']);

        try {
            $csv = $this->paymentService->exportPayments($school, $filters);

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="payments_' . now()->format('Y-m-d') . '.csv"',
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Get payment statistics
     */
    public function statistics(Request $request): Response
    {
        $this->authorize('view payments');

        $school = $this->getSchool();
        $filters = $request->only(['date_from', 'date_to']);

        $statistics = $this->paymentService->getPaymentStatistics($school, $filters);

        return Inertia::render('school/Payments/Statistics', [
            'statistics' => $statistics,
            'filters' => $filters,
        ]);
    }

   
}
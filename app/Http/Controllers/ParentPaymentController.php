<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentFee;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ParentPaymentController extends Controller
{
    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
        $this->middleware('auth');
        $this->middleware('role:parent');
    }

    /**
     * Show payment options for student fee
     */
    public function show(StudentFee $studentFee): Response
    {
        $student = $studentFee->student;

        // Verify parent owns this student
        if (Auth::user()->id !== $student->parent_id) {
            abort(403, 'Unauthorized access');
        }

        $paymentMethods = $student->school->paymentMethods()
            ->where('is_active', true)
            ->orderBy('display_order')
            ->get();

        return Inertia::render('parent/Payments/Pay', [
            'studentFee' => $studentFee,
            'feeDetails' => $studentFee,
            'paymentMethods' => $paymentMethods,
        ]);
    }

    /**
     * Process payment from parent
     */
    public function process(Request $request, StudentFee $studentFee)
    {
        $this->authorize('make payment');

        $student = $studentFee->student;

        // Verify parent owns this student
        if (Auth::user()->id !== $student->parent_id) {
            abort(403, 'Unauthorized access');
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|string|in:mpesa,bank_transfer,bank_check,cash,card,paypal',
            'reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        try {
            $payment = $this->paymentService->processParentPayment($studentFee, $validated);

            return redirect()
                ->route('parent.payment-confirmation', $payment)
                ->with('success', 'Payment submitted successfully. Please wait for confirmation from the school.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Show payment confirmation
     */
    public function confirmation(Request $request): Response
    {
        return Inertia::render('Parent/Payments/Confirmation', [
            'message' => 'Your payment has been submitted successfully. The school will verify and confirm your payment shortly.',
        ]);
    }

    /**
     * Get student payment history (parent view)
     */
    public function history(Student $student): Response
    {
        $this->authorize('view own payments');

        // Verify parent owns this student
        if (Auth::user()->id !== $student->parent_id) {
            abort(403, 'Unauthorized access');
        }

        $payments = $this->paymentService->getStudentPaymentHistory($student->id, 10);

        return Inertia::render('Parent/Payments/History', [
            'student' => $student,
            'payments' => $payments,
        ]);
    }
}
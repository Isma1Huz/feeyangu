<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\SchoolPaymentMethod;
use App\Services\PaymentMethodService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PaymentMethodController extends Controller
{
    protected PaymentMethodService $paymentMethodService;

    public function __construct(PaymentMethodService $paymentMethodService)
    {
        $this->paymentMethodService = $paymentMethodService;
        $this->middleware('auth');
        $this->middleware('role:school-admin');
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
     * Display payment methods
     */
    public function index(): Response
    {
        $this->authorize('manage payment methods');

        $school = $this->getSchool();
        $paymentMethods = $this->paymentMethodService->getPaymentMethods($school);

        return Inertia::render('School/PaymentMethods/Index', [
            'paymentMethods' => $paymentMethods,
        ]);
    }

    /**
     * Create payment method
     */
    public function create(): Response
    {
        $this->authorize('manage payment methods');

        $methodTypes = [
            'mpesa' => 'M-Pesa',
            'bank_transfer' => 'Bank Transfer',
            'bank_check' => 'Check',
            'cash' => 'Cash',
            'card' => 'Card',
            'paypal' => 'PayPal',
        ];

        return Inertia::render('School/PaymentMethods/Create', [
            'methodTypes' => $methodTypes,
        ]);
    }

    /**
     * Store payment method
     */
    public function store(Request $request)
    {
        $this->authorize('manage payment methods');

        $validated = $request->validate([
            'method_type' => 'required|string|in:mpesa,bank_transfer,bank_check,cash,card,paypal',
            'account_holder_name' => 'nullable|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'branch_code' => 'nullable|string|max:255',
            'mpesa_number' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        try {
            $school = $this->getSchool();
            $method = $this->paymentMethodService->createPaymentMethod($school, $validated);

            return redirect()
                ->route('payment-methods.index')
                ->with('success', 'Payment method added successfully');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Edit payment method
     */
    public function edit(SchoolPaymentMethod $paymentMethod): Response
    {
        $this->authorize('manage payment methods');

        $methodTypes = [
            'mpesa' => 'M-Pesa',
            'bank_transfer' => 'Bank Transfer',
            'bank_check' => 'Check',
            'cash' => 'Cash',
            'card' => 'Card',
            'paypal' => 'PayPal',
        ];

        return Inertia::render('School/PaymentMethods/Edit', [
            'paymentMethod' => $paymentMethod,
            'methodTypes' => $methodTypes,
        ]);
    }

    /**
     * Update payment method
     */
    public function update(Request $request, SchoolPaymentMethod $paymentMethod)
    {
        $this->authorize('manage payment methods');

        $validated = $request->validate([
            'account_holder_name' => 'nullable|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'branch_code' => 'nullable|string|max:255',
            'mpesa_number' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'display_order' => 'nullable|integer|min:0',
        ]);

        try {
            $this->paymentMethodService->updatePaymentMethod($paymentMethod, $validated);

            return redirect()
                ->route('payment-methods.index')
                ->with('success', 'Payment method updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Delete payment method
     */
    public function destroy(SchoolPaymentMethod $paymentMethod)
    {
        $this->authorize('manage payment methods');

        try {
            $this->paymentMethodService->deletePaymentMethod($paymentMethod);

            return redirect()
                ->route('payment-methods.index')
                ->with('success', 'Payment method deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Toggle payment method status
     */
    public function toggle(SchoolPaymentMethod $paymentMethod)
    {
        $this->authorize('manage payment methods');

        $this->paymentMethodService->toggleStatus($paymentMethod);

        return back()->with('success', 'Payment method status updated');
    }

    /**
     * Reorder payment methods
     */
    public function reorder(Request $request)
    {
        $this->authorize('manage payment methods');

        $validated = $request->validate([
            'method_ids' => 'required|array',
            'method_ids.*' => 'exists:school_payment_methods,id',
        ]);

        try {
            $school = $this->getSchool();
            $this->paymentMethodService->reorderMethods($school, $validated['method_ids']);

            return back()->with('success', 'Payment methods reordered successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

}
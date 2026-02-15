<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\SchoolPaymentMethod;
use App\Services\PaymentMethodService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentMethodController extends Controller
{
    protected PaymentMethodService $paymentMethodService;

    public function __construct(PaymentMethodService $paymentMethodService)
    {
        $this->paymentMethodService = $paymentMethodService;
        $this->middleware('auth:sanctum');
    }

    /**
     * List payment methods
     */
    public function index(): JsonResponse
    {
        $this->authorize('manage payment methods');

        $school = Auth::user()->school;
        $methods = $this->paymentMethodService->getPaymentMethods($school);

        return response()->json([
            'data' => $methods,
        ]);
    }

    /**
     * Get active payment methods (for parents)
     */
    public function active(): JsonResponse
    {
        $school = Auth::user()->school;
        $methods = $this->paymentMethodService->getActivePaymentMethods($school);

        return response()->json([
            'data' => $methods,
        ]);
    }

    /**
     * Store payment method
     */
    public function store(Request $request): JsonResponse
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
            'display_order' => 'nullable|integer|min:0',
        ]);

        try {
            $school = Auth::user()->school;
            $method = $this->paymentMethodService->createPaymentMethod($school, $validated);

            return response()->json([
                'message' => 'Payment method created successfully',
                'data' => $method,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Update payment method
     */
    public function update(Request $request, SchoolPaymentMethod $paymentMethod): JsonResponse
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

            return response()->json([
                'message' => 'Payment method updated successfully',
                'data' => $paymentMethod->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Delete payment method
     */
    public function destroy(SchoolPaymentMethod $paymentMethod): JsonResponse
    {
        $this->authorize('manage payment methods');

        try {
            $this->paymentMethodService->deletePaymentMethod($paymentMethod);

            return response()->json([
                'message' => 'Payment method deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Toggle payment method status
     */
    public function toggle(SchoolPaymentMethod $paymentMethod): JsonResponse
    {
        $this->authorize('manage payment methods');

        $this->paymentMethodService->toggleStatus($paymentMethod);

        return response()->json([
            'message' => 'Payment method status updated',
            'data' => $paymentMethod,
        ]);
    }

    /**
     * Reorder payment methods
     */
    public function reorder(Request $request): JsonResponse
    {
        $this->authorize('manage payment methods');

        $validated = $request->validate([
            'method_ids' => 'required|array',
            'method_ids.*' => 'exists:school_payment_methods,id',
        ]);

        try {
            $school = Auth::user()->school;
            $this->paymentMethodService->reorderMethods($school, $validated['method_ids']);

            return response()->json([
                'message' => 'Payment methods reordered successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
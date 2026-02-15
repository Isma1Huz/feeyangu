<?php

namespace App\Services;

use App\Models\SchoolPaymentMethod;
use App\Models\School;
use Exception;
use Illuminate\Support\Facades\DB;

class PaymentMethodService
{
    /**
     * Get active payment methods for school
     */
    public function getActivePaymentMethods(School $school): array
    {
        return SchoolPaymentMethod::where('school_id', $school->id)
            ->where('is_active', true)
            ->orderBy('display_order')
            ->get()
            ->toArray();
    }

    /**
     * Get all payment methods for school
     */
    public function getPaymentMethods(School $school): array
    {
        return SchoolPaymentMethod::where('school_id', $school->id)
            ->orderBy('display_order')
            ->get()
            ->toArray();
    }

    /**
     * Create payment method
     */
    public function createPaymentMethod(School $school, array $data): SchoolPaymentMethod
    {
        try {
            DB::beginTransaction();

            $method = SchoolPaymentMethod::create([
                'school_id' => $school->id,
                'method_type' => $data['method_type'],
                'account_holder_name' => $data['account_holder_name'] ?? null,
                'account_number' => $data['account_number'] ?? null,
                'bank_name' => $data['bank_name'] ?? null,
                'branch_code' => $data['branch_code'] ?? null,
                'mpesa_number' => $data['mpesa_number'] ?? null,
                'is_active' => $data['is_active'] ?? true,
                'display_order' => $data['display_order'] ?? 0,
            ]);

            DB::commit();

            return $method;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update payment method
     */
    public function updatePaymentMethod(SchoolPaymentMethod $method, array $data): SchoolPaymentMethod
    {
        try {
            DB::beginTransaction();

            $method->update([
                'account_holder_name' => $data['account_holder_name'] ?? $method->account_holder_name,
                'account_number' => $data['account_number'] ?? $method->account_number,
                'bank_name' => $data['bank_name'] ?? $method->bank_name,
                'branch_code' => $data['branch_code'] ?? $method->branch_code,
                'mpesa_number' => $data['mpesa_number'] ?? $method->mpesa_number,
                'is_active' => $data['is_active'] ?? $method->is_active,
                'display_order' => $data['display_order'] ?? $method->display_order,
            ]);

            DB::commit();

            return $method;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete payment method
     */
    public function deletePaymentMethod(SchoolPaymentMethod $method): bool
    {
        try {
            DB::beginTransaction();

            $method->delete();

            DB::commit();

            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Toggle payment method active status
     */
    public function toggleStatus(SchoolPaymentMethod $method): SchoolPaymentMethod
    {
        $method->update(['is_active' => !$method->is_active]);

        return $method;
    }

    /**
     * Reorder payment methods
     */
    public function reorderMethods(School $school, array $methodIds): void
    {
        try {
            DB::beginTransaction();

            foreach ($methodIds as $index => $methodId) {
                SchoolPaymentMethod::where('id', $methodId)
                    ->where('school_id', $school->id)
                    ->update(['display_order' => $index]);
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
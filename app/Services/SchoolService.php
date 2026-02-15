<?php

namespace App\Services;

use App\Models\School;
use App\Models\SchoolCustomization;
use App\Models\SchoolPaymentMethod;
use App\Models\User;
use Exception;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Support\Facades\DB;

class SchoolService
{
    /**
     * Get all schools with pagination
     */
    public function getAllSchools(int $perPage = 15, array $filters = []): Paginator
    {
        $query = School::query()
            ->with(['owner', 'students', 'users']);

        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%")
                ->orWhere('email', 'like', "%{$filters['search']}%");
        }

        if (!empty($filters['status'])) {
            $query->where('subscription_status', $filters['status']);
        }

        if (!empty($filters['is_active'])) {
            $query->where('is_active', (bool)$filters['is_active']);
        }

        return $query->orderBy('name')->paginate($perPage);
    }

    /**
     * Get school by ID
     */
    public function getSchoolById(int $id): ?School
    {
        return School::with([
            'owner',
            'users',
            'students',
            'feeStructures',
            'payments',
        ])->find($id);
    }

    /**
     * Create new school
     */
    public function createSchool(array $data): School
    {
        try {
            DB::beginTransaction();

            // Create user (School Owner)
            $owner = User::create([
                'name' => $data['owner_name'],
                'email' => $data['owner_email'],
                'password' => bcrypt($data['owner_password']),
                'phone' => $data['owner_phone'] ?? null,
            ]);

            $owner->assignRole('school-admin');

            // Create school
            $school = School::create([
                'name' => $data['name'],
                'address' => $data['address'] ?? null,
                'phone' => $data['phone'] ?? null,
                'email' => $data['email'] ?? null,
                'owner_id' => $owner->id,
                'theme_id' => $data['theme_id'] ?? 1, // Default theme
                'is_active' => true,
            ]);

            // Assign school to owner
            $owner->update(['school_id' => $school->id]);

            // Set default customization
            $this->initializeSchoolCustomization($school);

            DB::commit();

            return $school;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update school
     */
    public function updateSchool(School $school, array $data): School
    {
        $school->update([
            'name' => $data['name'] ?? $school->name,
            'address' => $data['address'] ?? $school->address,
            'phone' => $data['phone'] ?? $school->phone,
            'email' => $data['email'] ?? $school->email,
            'logo_path' => $data['logo_path'] ?? $school->logo_path,
            'theme_id' => $data['theme_id'] ?? $school->theme_id,
            'subscription_status' => $data['subscription_status'] ?? $school->subscription_status,
        ]);

        return $school;
    }

    /**
     * Delete school
     */
    public function deleteSchool(School $school): bool
    {
        try {
            DB::beginTransaction();

            // Soft delete approach - set inactive
            $school->update(['is_active' => false, 'subscription_status' => 'suspended']);

            DB::commit();

            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Initialize school customization
     */
    public function initializeSchoolCustomization(School $school): void
    {
        $defaults = [
            'school_motto' => 'Excellence in Education',
            'primary_color' => '#3b82f6',
            'secondary_color' => '#10b981',
            'receipt_footer_text' => 'Thank you for choosing ' . $school->name,
        ];

        foreach ($defaults as $key => $value) {
            SchoolCustomization::firstOrCreate(
                ['school_id' => $school->id, 'key' => $key],
                ['value' => $value]
            );
        }
    }

    /**
     * Get school statistics
     */
    public function getSchoolStatistics(School $school): array
    {
        return [
            'total_students' => $school->students()->count(),
            'total_users' => $school->users()->count(),
            'total_fees_assigned' => $school->studentFees()->count(),
            'total_fees_paid' => (float) $school->payments()->sum('amount'),
            'total_fees_pending' => (float) $school->studentFees()
                ->whereIn('status', ['unpaid', 'partially_paid', 'overdue'])
                ->sum('balance'),
            'total_overdue_fees' => (float) $school->studentFees()
                ->where('is_overdue', true)
                ->sum('balance'),
            'payment_completion_rate' => $this->calculatePaymentCompletionRate($school),
        ];
    }

    /**
     * Calculate payment completion rate
     */
    private function calculatePaymentCompletionRate(School $school): float
    {
        $total = $school->studentFees()->count();
        
        if ($total === 0) {
            return 0;
        }

        $paid = $school->studentFees()->where('status', 'paid')->count();
        
        return round(($paid / $total) * 100, 2);
    }

    /**
     * Get school payment methods
     */
    public function getSchoolPaymentMethods(School $school): array
    {
        return $school->paymentMethods()
            ->where('is_active', true)
            ->orderBy('display_order')
            ->get()
            ->toArray();
    }

    /**
     * Update school payment methods
     */
    public function updatePaymentMethods(School $school, array $methods): void
    {
        $school->paymentMethods()->delete();

        foreach ($methods as $method) {
            $school->paymentMethods()->create($method);
        }
    }

    /**
     * Get school customization
     */
    public function getSchoolCustomization(School $school): array
    {
        $customizations = $school->customization()->pluck('value', 'key');
        
        return $customizations->toArray();
    }

    /**
     * Update school customization
     */
    public function updateSchoolCustomization(School $school, array $data): void
    {
        foreach ($data as $key => $value) {
            SchoolCustomization::updateOrCreate(
                ['school_id' => $school->id, 'key' => $key],
                ['value' => $value]
            );
        }
    }
}
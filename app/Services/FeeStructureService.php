<?php

namespace App\Services;

use App\Jobs\AssignFeesToStudents;
use App\Models\FeeBreakdown;
use App\Models\FeeStructure;
use App\Models\Grade;
use App\Models\School;
use App\Models\Student;
use App\Models\StudentFee;
use App\Models\Term;
use Exception;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Support\Facades\DB;

class FeeStructureService
{
    /**
     * Get all fee structures for a school with pagination
     */
    public function getSchoolFeeStructures(School $school, int $perPage = 15, array $filters = []): Paginator
    {
        $query = FeeStructure::where('school_id', $school->id)
            ->with(['grade', 'term', 'breakdowns']);

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->whereHas('grade', function ($g) use ($filters) {
                    $g->where('name', 'like', "%{$filters['search']}%");
                })
                ->orWhereHas('term', function ($t) use ($filters) {
                    $t->where('name', 'like', "%{$filters['search']}%");
                });
            });
        }

        if (!empty($filters['grade_id'])) {
            $query->where('grade_id', $filters['grade_id']);
        }

        if (!empty($filters['term_id'])) {
            $query->where('term_id', $filters['term_id']);
        }

        if (!empty($filters['is_active'])) {
            $query->where('is_active', (bool)$filters['is_active']);
        }

        return $query->orderBy('grade_id')->paginate($perPage);
    }

    /**
     * Get fee structure by ID
     */
    public function getFeeStructureById(int $id): ?FeeStructure
    {
        return FeeStructure::with(['grade', 'term', 'breakdowns', 'school', 'studentFees'])->find($id);
    }

    /**
     * Create new fee structure
     */
    public function createFeeStructure(School $school, array $data): FeeStructure
    {
        try {
            DB::beginTransaction();

            // Validate grade exists in school
            $grade = Grade::where('school_id', $school->id)
                ->where('id', $data['grade_id'])
                ->firstOrFail();

            // Validate term exists in school
            $term = Term::where('school_id', $school->id)
                ->where('id', $data['term_id'])
                ->firstOrFail();

            // Check for duplicate
            if (FeeStructure::where('school_id', $school->id)
                ->where('grade_id', $data['grade_id'])
                ->where('term_id', $data['term_id'])
                ->exists()) {
                throw new Exception('Fee structure already exists for this grade and term');
            }

            // Calculate total amount from breakdowns
            $totalAmount = 0;
            if (!empty($data['breakdowns'])) {
                $totalAmount = array_sum(array_column($data['breakdowns'], 'amount'));
            }

            $feeStructure = FeeStructure::create([
                'school_id' => $school->id,
                'grade_id' => $data['grade_id'],
                'term_id' => $data['term_id'],
                'total_amount' => $totalAmount,
                'due_date' => $data['due_date'] ?? null,
                'is_active' => $data['is_active'] ?? true,
            ]);

            // Create breakdowns if provided
            if (!empty($data['breakdowns'])) {
                foreach ($data['breakdowns'] as $index => $breakdown) {
                    FeeBreakdown::create([
                        'fee_structure_id' => $feeStructure->id,
                        'item_name' => $breakdown['item_name'],
                        'amount' => $breakdown['amount'],
                        'description' => $breakdown['description'] ?? null,
                        'order' => $index,
                    ]);
                }
            }

            DB::commit();

            return $feeStructure;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update fee structure
     */
    public function updateFeeStructure(FeeStructure $feeStructure, array $data): FeeStructure
    {
        try {
            DB::beginTransaction();

            // Validate grade if changing
            if (!empty($data['grade_id']) && $data['grade_id'] !== $feeStructure->grade_id) {
                Grade::where('school_id', $feeStructure->school_id)
                    ->where('id', $data['grade_id'])
                    ->firstOrFail();
            }

            // Validate term if changing
            if (!empty($data['term_id']) && $data['term_id'] !== $feeStructure->term_id) {
                Term::where('school_id', $feeStructure->school_id)
                    ->where('id', $data['term_id'])
                    ->firstOrFail();
            }

            // Calculate total amount
            $totalAmount = $feeStructure->total_amount;
            if (!empty($data['breakdowns'])) {
                $totalAmount = array_sum(array_column($data['breakdowns'], 'amount'));
            }

            $feeStructure->update([
                'grade_id' => $data['grade_id'] ?? $feeStructure->grade_id,
                'term_id' => $data['term_id'] ?? $feeStructure->term_id,
                'total_amount' => $totalAmount,
                'due_date' => $data['due_date'] ?? $feeStructure->due_date,
                'is_active' => $data['is_active'] ?? $feeStructure->is_active,
            ]);

            // Update breakdowns if provided
            if (!empty($data['breakdowns'])) {
                $feeStructure->breakdowns()->delete();

                foreach ($data['breakdowns'] as $index => $breakdown) {
                    FeeBreakdown::create([
                        'fee_structure_id' => $feeStructure->id,
                        'item_name' => $breakdown['item_name'],
                        'amount' => $breakdown['amount'],
                        'description' => $breakdown['description'] ?? null,
                        'order' => $index,
                    ]);
                }
            }

            DB::commit();

            return $feeStructure;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete fee structure
     */
    public function deleteFeeStructure(FeeStructure $feeStructure): bool
    {
        try {
            DB::beginTransaction();

            $assignedCount = $feeStructure->studentFees()->count();
            
            if ($assignedCount > 0) {
                throw new Exception("Cannot delete: Fee structure is assigned to {$assignedCount} students");
            }

            $feeStructure->breakdowns()->delete();
            $feeStructure->delete();

            DB::commit();

            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get available grades for school
     */
    public function getAvailableGrades(School $school): array
    {
        return Grade::where('school_id', $school->id)
            ->where('is_active', true)
            ->select('id', 'name')
            ->get()
            ->toArray();
    }

    /**
     * Get available terms for school
     */
    public function getAvailableTerms(School $school): array
    {
        return Term::where('school_id', $school->id)
            ->where('is_active', true)
            ->select('id', 'name', 'year')
            ->get()
            ->toArray();
    }

    /**
     * Get fee structure statistics
     */
    public function getFeeStructureStatistics(FeeStructure $feeStructure): array
    {
        $totalAssigned = $feeStructure->studentFees()->count();
        $totalPaid = $feeStructure->studentFees()->where('status', 'paid')->count();
        $totalUnpaid = $feeStructure->studentFees()->where('status', 'unpaid')->count();
        $totalPartial = $feeStructure->studentFees()->where('status', 'partially_paid')->count();
        $totalOverdue = $feeStructure->studentFees()->where('is_overdue', true)->count();

        $totalCollected = (float) $feeStructure->studentFees()->sum('amount_paid');
        $totalDue = (float) $feeStructure->studentFees()->sum('amount_due');
        $totalBalance = (float) $feeStructure->studentFees()->sum('balance');

        return [
            'total_assigned' => $totalAssigned,
            'total_collected' => $totalCollected,
            'total_due' => $totalDue,
            'total_balance' => $totalBalance,
            'status_breakdown' => [
                'paid' => $totalPaid,
                'unpaid' => $totalUnpaid,
                'partially_paid' => $totalPartial,
                'overdue' => $totalOverdue,
            ],
            'collection_rate' => $totalDue > 0 ? round(($totalCollected / $totalDue) * 100, 2) : 0,
        ];
    }

    /**
     * Assign fee structure to students
     */
    public function assignFeeToStudents(FeeStructure $feeStructure, array $studentIds): void
    {
        dispatch(new AssignFeesToStudents($feeStructure->id, $studentIds));
    }

    /**
     * Assign fee structure to all students of a grade
     */
    public function assignFeeToGrade(FeeStructure $feeStructure): void
    {
        $studentIds = Student::where('school_id', $feeStructure->school_id)
            ->where('grade_id', $feeStructure->grade_id)
            ->where('is_active', true)
            ->pluck('id')
            ->toArray();

        if (!empty($studentIds)) {
            dispatch(new AssignFeesToStudents($feeStructure->id, $studentIds));
        }
    }
}
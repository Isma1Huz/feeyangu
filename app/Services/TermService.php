<?php

namespace App\Services;

use App\Models\School;
use App\Models\Term;
use Exception;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Support\Facades\DB;

class TermService
{
    /**
     * Get all terms for a school with pagination
     */
    public function getSchoolTerms(School $school, int $perPage = 15, array $filters = []): Paginator
    {
        $query = Term::where('school_id', $school->id)
            ->with(['feeStructures']);

        if (!empty($filters['year'])) {
            $query->where('year', $filters['year']);
        }

        if (!empty($filters['is_active'])) {
            $query->where('is_active', (bool)$filters['is_active']);
        }

        return $query->orderByDesc('year')->orderBy('term_number')->paginate($perPage);
    }

    /**
     * Get term by ID
     */
    public function getTermById(int $id): ?Term
    {
        return Term::with(['feeStructures', 'school'])->find($id);
    }

    /**
     * Create new term
     */
    public function createTerm(School $school, array $data): Term
    {
        try {
            DB::beginTransaction();

            // Check for duplicate
            if (Term::where('school_id', $school->id)
                ->where('year', $data['year'])
                ->where('term_number', $data['term_number'])
                ->exists()) {
                throw new Exception('Term already exists for this year and term number');
            }

            // Validate dates
            if ($data['start_date'] >= $data['end_date']) {
                throw new Exception('Start date must be before end date');
            }

            $term = Term::create([
                'school_id' => $school->id,
                'name' => $data['name'],
                'year' => $data['year'],
                'term_number' => $data['term_number'],
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'description' => $data['description'] ?? null,
                'is_active' => $data['is_active'] ?? true,
            ]);

            DB::commit();

            return $term;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update term
     */
    public function updateTerm(Term $term, array $data): Term
    {
        try {
            DB::beginTransaction();

            // Validate dates if changed
            $startDate = $data['start_date'] ?? $term->start_date;
            $endDate = $data['end_date'] ?? $term->end_date;

            if ($startDate >= $endDate) {
                throw new Exception('Start date must be before end date');
            }

            $term->update([
                'name' => $data['name'] ?? $term->name,
                'year' => $data['year'] ?? $term->year,
                'term_number' => $data['term_number'] ?? $term->term_number,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'description' => $data['description'] ?? $term->description,
                'is_active' => $data['is_active'] ?? $term->is_active,
            ]);

            DB::commit();

            return $term;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete term
     */
    public function deleteTerm(Term $term): bool
    {
        try {
            DB::beginTransaction();

            // Check if term has fee structures
            if ($term->feeStructures()->exists()) {
                throw new Exception('Cannot delete term with existing fee structures');
            }

            $term->delete();

            DB::commit();

            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get current term for school
     */
    public function getCurrentTerm(School $school): ?Term
    {
        return Term::where('school_id', $school->id)
            ->where('is_active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->first();
    }

    /**
     * Get all active years
     */
    public function getActiveYears(School $school): array
    {
        return Term::where('school_id', $school->id)
            ->distinct()
            ->pluck('year')
            ->sort()
            ->reverse()
            ->values()
            ->toArray();
    }

    /**
     * Get term statistics
     */
    public function getTermStatistics(Term $term): array
    {
        $totalFeeStructures = $term->feeStructures()->count();
        $totalStudentFees = $term->feeStructures()
            ->get()
            ->sum(fn($fee) => $fee->studentFees()->count());

        $totalCollected = $term->feeStructures()
            ->get()
            ->sum(fn($fee) => $fee->studentFees()
                ->where('status', 'paid')
                ->sum('amount_paid'));

        return [
            'total_fee_structures' => $totalFeeStructures,
            'total_student_fees' => $totalStudentFees,
            'total_collected' => (float) $totalCollected,
        ];
    }
}
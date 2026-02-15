<?php

namespace App\Services;

use App\Models\Grade;
use App\Models\School;
use Exception;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Support\Facades\DB;

class GradeService
{
    /**
     * Get all grades for a school with pagination
     */
    public function getSchoolGrades(School $school, int $perPage = 15, array $filters = []): Paginator
    {
        $query = Grade::where('school_id', $school->id)
            ->with(['classes', 'students']);

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                    ->orWhere('code', 'like', "%{$filters['search']}%");
            });
        }

        if (!empty($filters['is_active'])) {
            $query->where('is_active', (bool)$filters['is_active']);
        }

        return $query->orderBy('level')->paginate($perPage);
    }

    /**
     * Get grade by ID
     */
    public function getGradeById(int $id): ?Grade
    {
        return Grade::with(['classes', 'students', 'feeStructures'])->find($id);
    }

    /**
     * Create new grade
     */
    public function createGrade(School $school, array $data): Grade
    {
        try {
            DB::beginTransaction();

            // Check for duplicate code
            if (Grade::where('school_id', $school->id)
                ->where('code', $data['code'])
                ->exists()) {
                throw new Exception('Grade code already exists in this school');
            }

            $grade = Grade::create([
                'school_id' => $school->id,
                'name' => $data['name'],
                'code' => $data['code'],
                'description' => $data['description'] ?? null,
                'level' => $data['level'] ?? null,
                'is_active' => $data['is_active'] ?? true,
            ]);

            DB::commit();

            return $grade;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update grade
     */
    public function updateGrade(Grade $grade, array $data): Grade
    {
        try {
            DB::beginTransaction();

            // Check if code is changing
            if (!empty($data['code']) && $data['code'] !== $grade->code) {
                if (Grade::where('school_id', $grade->school_id)
                    ->where('code', $data['code'])
                    ->where('id', '!=', $grade->id)
                    ->exists()) {
                    throw new Exception('Grade code already exists in this school');
                }
            }

            $grade->update([
                'name' => $data['name'] ?? $grade->name,
                'code' => $data['code'] ?? $grade->code,
                'description' => $data['description'] ?? $grade->description,
                'level' => $data['level'] ?? $grade->level,
                'is_active' => $data['is_active'] ?? $grade->is_active,
            ]);

            DB::commit();

            return $grade;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete grade
     */
    public function deleteGrade(Grade $grade): bool
    {
        try {
            DB::beginTransaction();

            // Check if grade has classes or students
            if ($grade->classes()->exists() || $grade->students()->exists()) {
                throw new Exception('Cannot delete grade with existing classes or students');
            }

            $grade->delete();

            DB::commit();

            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get grade statistics
     */
    public function getGradeStatistics(Grade $grade): array
    {
        $totalClasses = $grade->classes()->count();
        $totalStudents = $grade->students()->count();
        $totalCapacity = $grade->classes()->sum('capacity');

        $totalFeesAssigned = $grade->students()
            ->get()
            ->sum(fn($student) => $student->studentFees()->sum('amount_due'));

        $totalFeesCollected = $grade->students()
            ->get()
            ->sum(fn($student) => $student->studentFees()->where('status', 'paid')->sum('amount_paid'));

        return [
            'total_classes' => $totalClasses,
            'total_students' => $totalStudents,
            'total_capacity' => $totalCapacity ?? 0,
            'average_class_size' => $totalClasses > 0 ? round($totalStudents / $totalClasses, 2) : 0,
            'total_fees_assigned' => (float) $totalFeesAssigned,
            'total_fees_collected' => (float) $totalFeesCollected,
        ];
    }
}
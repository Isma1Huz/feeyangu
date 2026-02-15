<?php

namespace App\Services;

use App\Models\SchoolClass;
use App\Models\Grade;
use Exception;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Support\Facades\DB;

class ClassService
{
    /**
     * Get all classes for a grade with pagination
     */
    public function getGradeClasses(Grade $grade, int $perPage = 15, array $filters = []): Paginator
    {
        $query = SchoolClass::where('grade_id', $grade->id)
            ->with(['classTeacher', 'students']);

        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        if (!empty($filters['is_active'])) {
            $query->where('is_active', (bool)$filters['is_active']);
        }

        return $query->orderBy('name')->paginate($perPage);
    }

    /**
     * Get class by ID
     */
    public function getClassById(int $id): ?SchoolClass
    {
        return SchoolClass::with(['grade', 'classTeacher', 'students'])->find($id);
    }

    /**
     * Create new class
     */
    public function createClass(Grade $grade, array $data): SchoolClass
    {
        try {
            DB::beginTransaction();

            // Check for duplicate name
            if (SchoolClass::where('grade_id', $grade->id)
                ->where('name', $data['name'])
                ->exists()) {
                throw new Exception('Class name already exists for this grade');
            }

            $class = SchoolClass::create([
                'school_id' => $grade->school_id,
                'grade_id' => $grade->id,
                'name' => $data['name'],
                'class_teacher_id' => $data['class_teacher_id'] ?? null,
                'capacity' => $data['capacity'] ?? null,
                'description' => $data['description'] ?? null,
                'is_active' => $data['is_active'] ?? true,
            ]);

            DB::commit();

            return $class;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update class
     */
    public function updateClass(SchoolClass $class, array $data): SchoolClass
    {
        try {
            DB::beginTransaction();

            // Check if name is changing
            if (!empty($data['name']) && $data['name'] !== $class->name) {
                if (SchoolClass::where('grade_id', $class->grade_id)
                    ->where('name', $data['name'])
                    ->where('id', '!=', $class->id)
                    ->exists()) {
                    throw new Exception('Class name already exists for this grade');
                }
            }

            // Validate capacity
            if (!empty($data['capacity'])) {
                $studentCount = $class->students()->count();
                if ($data['capacity'] < $studentCount) {
                    throw new Exception("Capacity cannot be less than current student count ({$studentCount})");
                }
            }

            $class->update([
                'name' => $data['name'] ?? $class->name,
                'class_teacher_id' => $data['class_teacher_id'] ?? $class->class_teacher_id,
                'capacity' => $data['capacity'] ?? $class->capacity,
                'description' => $data['description'] ?? $class->description,
                'is_active' => $data['is_active'] ?? $class->is_active,
            ]);

            DB::commit();

            return $class;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete class
     */
    public function deleteClass(SchoolClass $class): bool
    {
        try {
            DB::beginTransaction();

            // Check if class has students
            if ($class->students()->exists()) {
                throw new Exception('Cannot delete class with existing students');
            }

            $class->delete();

            DB::commit();

            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get class statistics
     */
    public function getClassStatistics(SchoolClass $class): array
    {
        $studentCount = $class->students()->count();
        $capacity = $class->capacity ?? PHP_INT_MAX;
        $occupancyRate = $capacity > 0 ? round(($studentCount / $capacity) * 100, 2) : 0;

        $totalFeesAssigned = $class->students()
            ->get()
            ->sum(fn($student) => $student->studentFees()->sum('amount_due'));

        $totalFeesCollected = $class->students()
            ->get()
            ->sum(fn($student) => $student->studentFees()
                ->where('status', 'paid')
                ->sum('amount_paid'));

        return [
            'student_count' => $studentCount,
            'capacity' => $capacity,
            'available_capacity' => max(0, $capacity - $studentCount),
            'occupancy_rate' => $occupancyRate,
            'total_fees_assigned' => (float) $totalFeesAssigned,
            'total_fees_collected' => (float) $totalFeesCollected,
        ];
    }

    /**
     * Assign student to class
     */
    public function assignStudentToClass(SchoolClass $class, int $studentId): void
    {
        try {
            DB::beginTransaction();

            if ($class->isFull()) {
                throw new Exception('Class is at full capacity');
            }

            $student = $class->school->students()->findOrFail($studentId);

            $student->update([
                'grade_id' => $class->grade_id,
                'class_id' => $class->id,
            ]);

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
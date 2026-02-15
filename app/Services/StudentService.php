<?php

namespace App\Services;

use App\Jobs\BulkImportStudents;
use App\Jobs\ExportStudents;
use App\Models\School;
use App\Models\Student;
use App\Models\User;
use Exception;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class StudentService
{
    /**
     * Get all students for a school with pagination
     */
    public function getSchoolStudents(School $school, int $perPage = 15, array $filters = []): Paginator
    {
        $query = Student::where('school_id', $school->id)
            ->with(['parent', 'studentFees']);

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('first_name', 'like', "%{$filters['search']}%")
                    ->orWhere('last_name', 'like', "%{$filters['search']}%")
                    ->orWhere('admission_no', 'like', "%{$filters['search']}%")
                    ->orWhere('email', 'like', "%{$filters['search']}%");
            });
        }

        if (!empty($filters['grade'])) {
            $query->where('grade', $filters['grade']);
        }

        if (!empty($filters['parent_linked'])) {
            if ($filters['parent_linked'] === 'yes') {
                $query->whereNotNull('parent_id');
            } else {
                $query->whereNull('parent_id');
            }
        }

        if (!empty($filters['is_active'])) {
            $query->where('is_active', (bool)$filters['is_active']);
        }

        return $query->orderBy('last_name')->paginate($perPage);
    }

    /**
     * Get student by ID
     */
    public function getStudentById(int $id): ?Student
    {
        return Student::with([
            'school',
            'parent',
            'studentFees.feeStructure.breakdowns',
            'studentFees.payments',
        ])->find($id);
    }

    /**
     * Create new student
     */
    public function createStudent(School $school, array $data): Student
    {
        try {
            DB::beginTransaction();

            // Validate unique admission number
            if (Student::where('school_id', $school->id)
                ->where('admission_no', $data['admission_no'])
                ->exists()) {
                throw new Exception('Admission number already exists in this school');
            }

            $student = Student::create([
                'school_id' => $school->id,
                'parent_id' => $data['parent_id'] ?? null,
                'admission_no' => $data['admission_no'],
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'] ?? null,
                'date_of_birth' => $data['date_of_birth'] ?? null,
                'grade' => $data['grade'] ?? null,
                'is_active' => $data['is_active'] ?? true,
            ]);

            DB::commit();

            return $student;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update student
     */
    public function updateStudent(Student $student, array $data): Student
    {
        try {
            DB::beginTransaction();

            // Check if admission number is changing
            if (!empty($data['admission_no']) && $data['admission_no'] !== $student->admission_no) {
                if (Student::where('school_id', $student->school_id)
                    ->where('admission_no', $data['admission_no'])
                    ->where('id', '!=', $student->id)
                    ->exists()) {
                    throw new Exception('Admission number already exists in this school');
                }
            }

            $student->update([
                'parent_id' => $data['parent_id'] ?? $student->parent_id,
                'admission_no' => $data['admission_no'] ?? $student->admission_no,
                'first_name' => $data['first_name'] ?? $student->first_name,
                'last_name' => $data['last_name'] ?? $student->last_name,
                'email' => $data['email'] ?? $student->email,
                'date_of_birth' => $data['date_of_birth'] ?? $student->date_of_birth,
                'grade' => $data['grade'] ?? $student->grade,
                'is_active' => $data['is_active'] ?? $student->is_active,
            ]);

            DB::commit();

            return $student;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete student
     */
    public function deleteStudent(Student $student): bool
    {
        try {
            DB::beginTransaction();

            // Soft delete - set inactive
            $student->update(['is_active' => false]);

            DB::commit();

            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Link parent to student
     */
    public function linkParentToStudent(Student $student, int $parentId): Student
    {
        try {
            DB::beginTransaction();

            $parent = User::where('school_id', $student->school_id)
                ->where('id', $parentId)
                ->whereHas('roles', function ($q) {
                    $q->where('name', 'parent');
                })
                ->firstOrFail();

            $student->update(['parent_id' => $parent->id]);

            DB::commit();

            return $student;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Bulk import students from CSV
     */
    public function bulkImportStudents(School $school, string $filePath, bool $autoNotifyParents = false): array
    {
        try {
            $job = new BulkImportStudents($school->id, $filePath, $autoNotifyParents);
            dispatch($job);

            return [
                'success' => true,
                'message' => 'Students import job queued successfully',
                'job_id' => $job->getJobId(),
            ];
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Export students to CSV
     */
    public function exportStudents(School $school, array $filters = []): array
    {
        try {
            $job = new ExportStudents($school->id, $filters);
            dispatch($job);

            return [
                'success' => true,
                'message' => 'Students export job queued successfully',
            ];
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Get student statistics
     */
    public function getStudentStatistics(Student $student): array
    {
        $totalFees = $student->studentFees()->sum('amount_due');
        $paidFees = $student->studentFees()->sum('amount_paid');
        $balanceFees = $totalFees - $paidFees;

        $unpaidFees = $student->studentFees()
            ->whereIn('status', ['unpaid', 'partially_paid', 'overdue'])
            ->count();

        $overdueFees = $student->studentFees()
            ->where('is_overdue', true)
            ->sum('balance');

        return [
            'total_fees_assigned' => $student->studentFees()->count(),
            'total_fees_amount' => (float) $totalFees,
            'total_fees_paid' => (float) $paidFees,
            'total_balance' => (float) $balanceFees,
            'fees_status' => [
                'paid' => $student->studentFees()->where('status', 'paid')->count(),
                'unpaid' => $student->studentFees()->where('status', 'unpaid')->count(),
                'partially_paid' => $student->studentFees()->where('status', 'partially_paid')->count(),
                'overdue' => $student->studentFees()->where('is_overdue', true)->count(),
            ],
            'unpaid_count' => $unpaidFees,
            'overdue_amount' => (float) $overdueFees,
            'payment_completion_rate' => $totalFees > 0 ? round(($paidFees / $totalFees) * 100, 2) : 0,
        ];
    }

    /**
     * Get list of available grades
     */
    public function getSchoolGrades(School $school): array
    {
        return Student::where('school_id', $school->id)
            ->distinct()
            ->pluck('grade')
            ->filter()
            ->sort()
            ->values()
            ->toArray();
    }

    /**
     * Get available parents for linking
     */
    public function getAvailableParents(School $school): array
    {
        return User::where('school_id', $school->id)
            ->whereHas('roles', function ($q) {
                $q->where('name', 'parent');
            })
            ->select('id', 'name', 'email')
            ->get()
            ->toArray();
    }

    /**
     * Get students by grade
     */
    public function getStudentsByGrade(School $school, string $grade): array
    {
        return Student::where('school_id', $school->id)
            ->where('grade', $grade)
            ->where('is_active', true)
            ->select('id', 'admission_no', 'first_name', 'last_name', 'email')
            ->get()
            ->toArray();
    }
}
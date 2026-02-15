<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\Student;
use App\Services\StudentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    protected StudentService $studentService;

    public function __construct(StudentService $studentService)
    {
        $this->studentService = $studentService;
    }

    /**
     * List students for school admin
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('view students');

        $school = Auth::user()->school;
        $filters = $request->only(['search', 'grade', 'parent_linked', 'is_active']);
        $perPage = $request->get('per_page', 15);

        $students = $this->studentService->getSchoolStudents($school, $perPage, $filters);

        return response()->json([
            'data' => $students->items(),
            'pagination' => [
                'current_page' => $students->currentPage(),
                'per_page' => $students->perPage(),
                'total' => $students->total(),
                'last_page' => $students->lastPage(),
            ],
        ]);
    }

    /**
     * Get student details
     */
    public function show(Student $student): JsonResponse
    {
        $this->authorize('view students');

        $studentData = $this->studentService->getStudentById($student->id);
        $statistics = $this->studentService->getStudentStatistics($student);

        return response()->json([
            'data' => $studentData,
            'statistics' => $statistics,
        ]);
    }

    /**
     * Get student statistics
     */
    public function statistics(Student $student): JsonResponse
    {
        $this->authorize('view students');

        $statistics = $this->studentService->getStudentStatistics($student);

        return response()->json([
            'data' => $statistics,
        ]);
    }

    /**
     * Get available grades
     */
    public function grades(): JsonResponse
    {
        $school = Auth::user()->school;
        $grades = $this->studentService->getSchoolGrades($school);

        return response()->json([
            'data' => $grades,
        ]);
    }

    /**
     * Get available parents
     */
    public function availableParents(): JsonResponse
    {
        $school = Auth::user()->school;
        $parents = $this->studentService->getAvailableParents($school);

        return response()->json([
            'data' => $parents,
        ]);
    }

    /**
     * Get students by grade
     */
    public function byGrade(Request $request): JsonResponse
    {
        $validated = $request->validate(['grade' => 'required|string']);

        $school = Auth::user()->school;
        $students = $this->studentService->getStudentsByGrade($school, $validated['grade']);

        return response()->json([
            'data' => $students,
        ]);
    }
}
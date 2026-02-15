<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use App\Models\SchoolClass;
use App\Models\User;
use App\Services\ClassService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClassController extends Controller
{
    protected ClassService $classService;

    public function __construct(ClassService $classService)
    {
        $this->classService = $classService;
    }

    /**
     * List all classes for a grade
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('manage students');

        $school = Auth::user()->school;
        
        if (!$school) {
            return response()->json(['message' => 'School not assigned'], 403);
        }

        $gradeId = $request->get('grade_id');
        
        if (!$gradeId) {
            return response()->json([
                'message' => 'Grade ID is required',
            ], 400);
        }

        $grade = Grade::where('school_id', $school->id)
            ->where('id', $gradeId)
            ->first();

        if (!$grade) {
            return response()->json([
                'message' => 'Grade not found',
            ], 404);
        }

        $filters = $request->only(['search', 'is_active']);
        $perPage = $request->get('per_page', 15);

        $classes = $this->classService->getGradeClasses($grade, $perPage, $filters);

        return response()->json([
            'data' => $classes->items(),
            'pagination' => [
                'current_page' => $classes->currentPage(),
                'per_page' => $classes->perPage(),
                'total' => $classes->total(),
                'last_page' => $classes->lastPage(),
            ],
        ]);
    }

    /**
     * Store new class
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('manage students');

        $school = Auth::user()->school;
        
        if (!$school) {
            return response()->json(['message' => 'School not assigned'], 403);
        }

        $validated = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'name' => 'required|string|max:255',
            'class_teacher_id' => 'nullable|exists:users,id',
            'capacity' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
        ]);

        try {
            // Verify grade belongs to school
            $grade = Grade::where('school_id', $school->id)
                ->where('id', $validated['grade_id'])
                ->firstOrFail();

            // Verify teacher belongs to school (if provided)
            if (!empty($validated['class_teacher_id'])) {
                User::where('school_id', $school->id)
                    ->where('id', $validated['class_teacher_id'])
                    ->firstOrFail();
            }

            $class = $this->classService->createClass($grade, $validated);

            return response()->json([
                'message' => 'Class created successfully',
                'data' => $class,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get single class
     */
    public function show(SchoolClass $class): JsonResponse
    {
        $this->authorize('manage students');

        // Verify school access via global scope
        if ($class->school_id !== Auth::user()->school_id) {
            abort(403, 'Unauthorized access');
        }

        $classData = $this->classService->getClassById($class->id);
        $statistics = $this->classService->getClassStatistics($class);

        return response()->json([
            'data' => $classData,
            'statistics' => $statistics,
        ]);
    }

    /**
     * Update class
     */
    public function update(Request $request, SchoolClass $class): JsonResponse
    {
        $this->authorize('manage students');

        // Verify school access via global scope
        if ($class->school_id !== Auth::user()->school_id) {
            abort(403, 'Unauthorized access');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'class_teacher_id' => 'nullable|exists:users,id',
            'capacity' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        try {
            // Verify teacher belongs to school (if provided)
            if (!empty($validated['class_teacher_id'])) {
                User::where('school_id', Auth::user()->school_id)
                    ->where('id', $validated['class_teacher_id'])
                    ->firstOrFail();
            }

            $this->classService->updateClass($class, $validated);

            return response()->json([
                'message' => 'Class updated successfully',
                'data' => $class->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Delete class
     */
    public function destroy(SchoolClass $class): JsonResponse
    {
        $this->authorize('manage students');

        // Verify school access via global scope
        if ($class->school_id !== Auth::user()->school_id) {
            abort(403, 'Unauthorized access');
        }

        try {
            $this->classService->deleteClass($class);

            return response()->json([
                'message' => 'Class deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get class statistics
     */
    public function statistics(SchoolClass $class): JsonResponse
    {
        $this->authorize('manage students');

        // Verify school access via global scope
        if ($class->school_id !== Auth::user()->school_id) {
            abort(403, 'Unauthorized access');
        }

        $statistics = $this->classService->getClassStatistics($class);

        return response()->json([
            'data' => $statistics,
        ]);
    }

    /**
     * Get available teachers for class
     */
    public function teachers(): JsonResponse
    {
        $this->authorize('manage students');

        $school = Auth::user()->school;
        
        if (!$school) {
            return response()->json(['message' => 'School not assigned'], 403);
        }

        $teachers = User::where('school_id', $school->id)
            ->select('id', 'name', 'email')
            ->get();

        return response()->json([
            'data' => $teachers,
        ]);
    }

    /**
     * Get students in class
     */
    public function students(SchoolClass $class): JsonResponse
    {
        $this->authorize('manage students');

        // Verify school access via global scope
        if ($class->school_id !== Auth::user()->school_id) {
            abort(403, 'Unauthorized access');
        }

        $students = $class->students()
            ->with(['parent'])
            ->select('id', 'admission_no', 'first_name', 'last_name', 'email', 'parent_id')
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'admission_no' => $student->admission_no,
                    'name' => $student->full_name,
                    'email' => $student->email,
                    'parent' => $student->parent ? [
                        'id' => $student->parent->id,
                        'name' => $student->parent->name,
                        'email' => $student->parent->email,
                    ] : null,
                ];
            });

        return response()->json([
            'data' => $students,
        ]);
    }

    /**
     * Assign student to class
     */
    public function assignStudent(Request $request, SchoolClass $class): JsonResponse
    {
        $this->authorize('manage students');

        // Verify school access via global scope
        if ($class->school_id !== Auth::user()->school_id) {
            abort(403, 'Unauthorized access');
        }

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
        ]);

        try {
            $this->classService->assignStudentToClass($class, $validated['student_id']);

            return response()->json([
                'message' => 'Student assigned to class successfully',
                'data' => $class->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Remove student from class
     */
    public function removeStudent(Request $request, SchoolClass $class): JsonResponse
    {
        $this->authorize('manage students');

        // Verify school access via global scope
        if ($class->school_id !== Auth::user()->school_id) {
            abort(403, 'Unauthorized access');
        }

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
        ]);

        try {
            $student = $class->students()->findOrFail($validated['student_id']);
            $student->update(['class_id' => null]);

            return response()->json([
                'message' => 'Student removed from class successfully',
                'data' => $student,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get classes by grade
     */
    public function byGrade(Request $request): JsonResponse
    {
        $this->authorize('manage students');

        $school = Auth::user()->school;
        
        if (!$school) {
            return response()->json(['message' => 'School not assigned'], 403);
        }

        $gradeId = $request->get('grade_id');
        
        if (!$gradeId) {
            return response()->json([
                'message' => 'Grade ID is required',
            ], 400);
        }

        $grade = Grade::where('school_id', $school->id)
            ->where('id', $gradeId)
            ->firstOrFail();

        $classes = SchoolClass::where('grade_id', $grade->id)
            ->where('is_active', true)
            ->select('id', 'name', 'capacity')
            ->get()
            ->map(function ($class) {
                return [
                    'id' => $class->id,
                    'name' => $class->name,
                    'capacity' => $class->capacity,
                    'student_count' => $class->students()->count(),
                    'available_capacity' => $class->available_capacity,
                ];
            });

        return response()->json([
            'data' => $classes,
        ]);
    }
}
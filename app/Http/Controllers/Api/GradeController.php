<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use App\Services\GradeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GradeController extends Controller
{
    protected GradeService $gradeService;

    public function __construct(GradeService $gradeService)
    {
        $this->gradeService = $gradeService;
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('manage students');

        $school = Auth::user()->school;
        $filters = $request->only(['search', 'is_active']);
        $perPage = $request->get('per_page', 15);

        $grades = $this->gradeService->getSchoolGrades($school, $perPage, $filters);

        return response()->json([
            'data' => $grades->items(),
            'pagination' => [
                'current_page' => $grades->currentPage(),
                'per_page' => $grades->perPage(),
                'total' => $grades->total(),
                'last_page' => $grades->lastPage(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('manage students');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
            'description' => 'nullable|string',
            'level' => 'nullable|integer',
        ]);

        try {
            $school = Auth::user()->school;
            $grade = $this->gradeService->createGrade($school, $validated);

            return response()->json([
                'message' => 'Grade created successfully',
                'data' => $grade,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show(Grade $grade): JsonResponse
    {
        $this->authorize('manage students');

        $gradeData = $this->gradeService->getGradeById($grade->id);
        $statistics = $this->gradeService->getGradeStatistics($grade);

        return response()->json([
            'data' => $gradeData,
            'statistics' => $statistics,
        ]);
    }

    public function update(Request $request, Grade $grade): JsonResponse
    {
        $this->authorize('manage students');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
            'description' => 'nullable|string',
            'level' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        try {
            $this->gradeService->updateGrade($grade, $validated);

            return response()->json([
                'message' => 'Grade updated successfully',
                'data' => $grade->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function destroy(Grade $grade): JsonResponse
    {
        $this->authorize('manage students');

        try {
            $this->gradeService->deleteGrade($grade);

            return response()->json(['message' => 'Grade deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
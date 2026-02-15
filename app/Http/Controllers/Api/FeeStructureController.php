<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeeStructure;
use App\Models\School;
use App\Services\FeeStructureService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeeStructureController extends Controller
{
    protected FeeStructureService $feeStructureService;

    public function __construct(FeeStructureService $feeStructureService)
    {
        $this->feeStructureService = $feeStructureService;
    }

    /**
     * List fee structures
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('view fees');

        $school = Auth::user()->school;
        $filters = $request->only(['search', 'grade_id', 'term_id', 'is_active']);
        $perPage = $request->get('per_page', 15);

        $feeStructures = $this->feeStructureService->getSchoolFeeStructures($school, $perPage, $filters);

        return response()->json([
            'data' => $feeStructures->items(),
            'pagination' => [
                'current_page' => $feeStructures->currentPage(),
                'per_page' => $feeStructures->perPage(),
                'total' => $feeStructures->total(),
                'last_page' => $feeStructures->lastPage(),
            ],
        ]);
    }

    /**
     * Store fee structure
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create fee structure');

        $school = Auth::user()->school;

        $validated = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'term_id' => 'required|exists:terms,id',
            'due_date' => 'nullable|date',
            'is_active' => 'boolean',
            'breakdowns' => 'required|array|min:1',
            'breakdowns.*.item_name' => 'required|string|max:255',
            'breakdowns.*.amount' => 'required|numeric|min:0',
            'breakdowns.*.description' => 'nullable|string',
        ]);

        try {
            $feeStructure = $this->feeStructureService->createFeeStructure($school, $validated);

            return response()->json([
                'message' => 'Fee structure created successfully',
                'data' => $feeStructure,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Show fee structure details
     */
    public function show(FeeStructure $feeStructure): JsonResponse
    {
        $this->authorize('view fees');

        $feeStructureData = $this->feeStructureService->getFeeStructureById($feeStructure->id);
        $statistics = $this->feeStructureService->getFeeStructureStatistics($feeStructure);

        return response()->json([
            'data' => $feeStructureData,
            'statistics' => $statistics,
        ]);
    }

    /**
     * Update fee structure
     */
    public function update(Request $request, FeeStructure $feeStructure): JsonResponse
    {
        $this->authorize('edit fee structure');

        $validated = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'term_id' => 'required|exists:terms,id',
            'due_date' => 'nullable|date',
            'is_active' => 'boolean',
            'breakdowns' => 'required|array|min:1',
            'breakdowns.*.item_name' => 'required|string|max:255',
            'breakdowns.*.amount' => 'required|numeric|min:0',
            'breakdowns.*.description' => 'nullable|string',
        ]);

        try {
            $this->feeStructureService->updateFeeStructure($feeStructure, $validated);

            return response()->json([
                'message' => 'Fee structure updated successfully',
                'data' => $feeStructure->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Delete fee structure
     */
    public function destroy(FeeStructure $feeStructure): JsonResponse
    {
        $this->authorize('delete fee structure');

        try {
            $this->feeStructureService->deleteFeeStructure($feeStructure);

            return response()->json([
                'message' => 'Fee structure deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get statistics
     */
    public function statistics(FeeStructure $feeStructure): JsonResponse
    {
        $this->authorize('view fees');

        $statistics = $this->feeStructureService->getFeeStructureStatistics($feeStructure);

        return response()->json([
            'data' => $statistics,
        ]);
    }

    /**
     * Get available grades
     */
    public function grades(): JsonResponse
    {
        $this->authorize('view fees');

        $school = Auth::user()->school;

        $grades = $this->feeStructureService->getAvailableGrades($school);

        return response()->json([
            'data' => $grades,
        ]);
    }

    /**
     * Get available terms
     */
    public function terms(): JsonResponse
    {
        $this->authorize('view fees');

        $school = Auth::user()->school;

        $terms = $this->feeStructureService->getAvailableTerms($school);

        return response()->json([
            'data' => $terms,
        ]);
    }

    /**
     * Assign fee to students
     */
    public function assignToStudents(Request $request, FeeStructure $feeStructure): JsonResponse
    {
        $this->authorize('assign fees');

        $validated = $request->validate([
            'student_ids' => 'required|array|min:1',
            'student_ids.*' => 'exists:students,id',
        ]);

        try {
            $this->feeStructureService->assignFeeToStudents($feeStructure, $validated['student_ids']);

            return response()->json([
                'message' => 'Fee assignment job queued successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Assign fee to entire grade
     */
    public function assignToGrade(FeeStructure $feeStructure): JsonResponse
    {
        $this->authorize('assign fees');

        try {
            $this->feeStructureService->assignFeeToGrade($feeStructure);

            return response()->json([
                'message' => 'Fee assignment to grade job queued successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
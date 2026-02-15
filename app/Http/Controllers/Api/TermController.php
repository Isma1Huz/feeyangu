<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Term;
use App\Services\TermService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TermController extends Controller
{
    protected TermService $termService;

    public function __construct(TermService $termService)
    {
        $this->termService = $termService;
        $this->middleware('auth:sanctum');
    }

    /**
     * List all terms for school
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('manage students');

        $school = Auth::user()->school;
        
        if (!$school) {
            return response()->json(['message' => 'School not assigned'], 403);
        }

        $filters = $request->only(['year', 'is_active']);
        $perPage = $request->get('per_page', 15);

        $terms = $this->termService->getSchoolTerms($school, $perPage, $filters);
        $years = $this->termService->getActiveYears($school);

        return response()->json([
            'data' => $terms->items(),
            'years' => $years,
            'pagination' => [
                'current_page' => $terms->currentPage(),
                'per_page' => $terms->perPage(),
                'total' => $terms->total(),
                'last_page' => $terms->lastPage(),
            ],
        ]);
    }

    /**
     * Store new term
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('manage students');

        $school = Auth::user()->school;
        
        if (!$school) {
            return response()->json(['message' => 'School not assigned'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'year' => 'required|integer|min:2000|max:2100',
            'term_number' => 'required|integer|in:1,2,3',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'description' => 'nullable|string',
        ]);

        try {
            $term = $this->termService->createTerm($school, $validated);

            return response()->json([
                'message' => 'Term created successfully',
                'data' => $term,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get single term
     */
    public function show(Term $term): JsonResponse
    {
        $this->authorize('manage students');

        // Verify school access via global scope
        if ($term->school_id !== Auth::user()->school_id) {
            abort(403, 'Unauthorized access');
        }

        $termData = $this->termService->getTermById($term->id);
        $statistics = $this->termService->getTermStatistics($term);

        return response()->json([
            'data' => $termData,
            'statistics' => $statistics,
        ]);
    }

    /**
     * Update term
     */
    public function update(Request $request, Term $term): JsonResponse
    {
        $this->authorize('manage students');

        // Verify school access via global scope
        if ($term->school_id !== Auth::user()->school_id) {
            abort(403, 'Unauthorized access');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'year' => 'required|integer|min:2000|max:2100',
            'term_number' => 'required|integer|in:1,2,3',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        try {
            $this->termService->updateTerm($term, $validated);

            return response()->json([
                'message' => 'Term updated successfully',
                'data' => $term->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Delete term
     */
    public function destroy(Term $term): JsonResponse
    {
        $this->authorize('manage students');

        // Verify school access via global scope
        if ($term->school_id !== Auth::user()->school_id) {
            abort(403, 'Unauthorized access');
        }

        try {
            $this->termService->deleteTerm($term);

            return response()->json([
                'message' => 'Term deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get current term for school
     */
    public function current(): JsonResponse
    {
        $this->authorize('manage students');

        $school = Auth::user()->school;
        
        if (!$school) {
            return response()->json(['message' => 'School not assigned'], 403);
        }

        $currentTerm = $this->termService->getCurrentTerm($school);

        if (!$currentTerm) {
            return response()->json([
                'message' => 'No active term found',
                'data' => null,
            ]);
        }

        return response()->json([
            'data' => $currentTerm,
        ]);
    }

    /**
     * Get all active years
     */
    public function years(): JsonResponse
    {
        $this->authorize('manage students');

        $school = Auth::user()->school;
        
        if (!$school) {
            return response()->json(['message' => 'School not assigned'], 403);
        }

        $years = $this->termService->getActiveYears($school);

        return response()->json([
            'data' => $years,
        ]);
    }

    /**
     * Get term statistics
     */
    public function statistics(Term $term): JsonResponse
    {
        $this->authorize('manage students');

        // Verify school access via global scope
        if ($term->school_id !== Auth::user()->school_id) {
            abort(403, 'Unauthorized access');
        }

        $statistics = $this->termService->getTermStatistics($term);

        return response()->json([
            'data' => $statistics,
        ]);
    }
}
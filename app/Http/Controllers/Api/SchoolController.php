<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\SchoolTheme;
use App\Services\SchoolService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SchoolController extends Controller
{
    protected SchoolService $schoolService;

    public function __construct(SchoolService $schoolService)
    {
        $this->schoolService = $schoolService;
    }

    /**
     * List all schools (Super Admin)
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('view schools');

        $filters = $request->only(['search', 'status', 'is_active']);
        $perPage = $request->get('per_page', 15);

        $schools = $this->schoolService->getAllSchools($perPage, $filters);

        return response()->json([
            'data' => $schools->items(),
            'pagination' => [
                'current_page' => $schools->currentPage(),
                'per_page' => $schools->perPage(),
                'total' => $schools->total(),
                'last_page' => $schools->lastPage(),
            ],
        ]);
    }

    /**
     * Create school
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create school');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'owner_name' => 'required|string|max:255',
            'owner_email' => 'required|email|unique:users',
            'owner_phone' => 'nullable|string',
            'owner_password' => 'required|string|min:8',
            'theme_id' => 'nullable|exists:school_themes,id',
        ]);

        try {
            $school = $this->schoolService->createSchool($validated);

            return response()->json([
                'message' => 'School created successfully',
                'data' => $school,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get school
     */
    public function show(School $school): JsonResponse
    {
        $this->authorize('view schools');

        $schoolData = $this->schoolService->getSchoolById($school->id);
        $statistics = $this->schoolService->getSchoolStatistics($school);

        return response()->json([
            'data' => $schoolData,
            'statistics' => $statistics,
        ]);
    }

    /**
     * Update school
     */
    public function update(Request $request, School $school): JsonResponse
    {
        $this->authorize('edit school');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'logo_path' => 'nullable|string',
            'theme_id' => 'nullable|exists:school_themes,id',
            'subscription_status' => 'nullable|in:active,inactive,suspended',
        ]);

        try {
            $this->schoolService->updateSchool($school, $validated);

            return response()->json([
                'message' => 'School updated successfully',
                'data' => $school->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Delete school
     */
    public function destroy(School $school): JsonResponse
    {
        $this->authorize('delete school');

        try {
            $this->schoolService->deleteSchool($school);

            return response()->json([
                'message' => 'School deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get school statistics
     */
    public function statistics(School $school): JsonResponse
    {
        $this->authorize('view schools');

        $stats = $this->schoolService->getSchoolStatistics($school);

        return response()->json([
            'data' => $stats,
        ]);
    }

    /**
     * Get school payment methods
     */
    public function paymentMethods(School $school): JsonResponse
    {
        $this->authorize('view schools');

        $methods = $this->schoolService->getSchoolPaymentMethods($school);

        return response()->json([
            'data' => $methods,
        ]);
    }

    /**
     * Get school customization
     */
    public function customization(School $school): JsonResponse
    {
        $this->authorize('view schools');

        $customization = $this->schoolService->getSchoolCustomization($school);

        return response()->json([
            'data' => $customization,
        ]);
    }

    /**
     * Get available themes
     */
    public function themes(): JsonResponse
    {
        $themes = SchoolTheme::all();

        return response()->json([
            'data' => $themes,
        ]);
    }
}
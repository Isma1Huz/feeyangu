<?php

namespace App\Http\Controllers;

use App\Models\FeeStructure;
use App\Models\School;
use App\Services\FeeStructureService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class FeeStructureController extends Controller
{
    protected FeeStructureService $feeStructureService;

    public function __construct(FeeStructureService $feeStructureService)
    {
        $this->feeStructureService = $feeStructureService;
        $this->middleware('auth');
        $this->middleware('role:school-admin');
    }

    /**
     * Get authenticated user's school
     */
    private function getSchool(): School
    {
        $school = Auth::user()->school;
        
        if (!$school) {
            abort(403, 'School not found');
        }

        return $school;
    }

    /**
     * Display fee structures list
     */
    public function index(Request $request): Response
    {
        $this->authorize('view fees');

        $school = $this->getSchool();
        $filters = $request->only(['search', 'grade_id', 'term_id', 'is_active']);
        
        $feeStructures = $this->feeStructureService->getSchoolFeeStructures($school, 15, $filters);
        $grades = $this->feeStructureService->getAvailableGrades($school);
        $terms = $this->feeStructureService->getAvailableTerms($school);

        return Inertia::render('School/FeeStructures/Index', [
            'feeStructures' => $feeStructures,
            'filters' => $filters,
            'grades' => $grades,
            'terms' => $terms,
        ]);
    }

    /**
     * Show create fee structure form
     */
    public function create(): Response
    {
        $this->authorize('create fee structure');

        $school = $this->getSchool();
        $grades = $this->feeStructureService->getAvailableGrades($school);
        $terms = $this->feeStructureService->getAvailableTerms($school);

        return Inertia::render('School/FeeStructures/Create', [
            'grades' => $grades,
            'terms' => $terms,
        ]);
    }

    /**
     * Store fee structure
     */
    public function store(Request $request)
    {
        $this->authorize('create fee structure');

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
            $school = $this->getSchool();
            $feeStructure = $this->feeStructureService->createFeeStructure($school, $validated);

            return redirect()
                ->route('school.fee-structures.show', $feeStructure)
                ->with('success', 'Fee structure created successfully');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Show fee structure details
     */
    public function show(FeeStructure $feeStructure): Response
    {
        $this->authorize('view fees');

        $feeStructureData = $this->feeStructureService->getFeeStructureById($feeStructure->id);
        $statistics = $this->feeStructureService->getFeeStructureStatistics($feeStructure);

        return Inertia::render('School/FeeStructures/Show', [
            'feeStructure' => $feeStructureData,
            'statistics' => $statistics,
        ]);
    }

    /**
     * Show edit fee structure form
     */
    public function edit(FeeStructure $feeStructure): Response
    {
        $this->authorize('edit fee structure');


        $school = $this->getSchool();
        $grades = $this->feeStructureService->getAvailableGrades($school);
        $terms = $this->feeStructureService->getAvailableTerms($school);

        return Inertia::render('School/FeeStructures/Edit', [
            'feeStructure' => $feeStructure,
            'grades' => $grades,
            'terms' => $terms,
        ]);
    }

    /**
     * Update fee structure
     */
    public function update(Request $request, FeeStructure $feeStructure)
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

            return redirect()
                ->route('school.fee-structures.show', $feeStructure)
                ->with('success', 'Fee structure updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Delete fee structure
     */
    public function destroy(FeeStructure $feeStructure)
    {
        $this->authorize('delete fee structure');     

        try {
            $this->feeStructureService->deleteFeeStructure($feeStructure);

            return redirect()
                ->route('school.fee-structures.index')
                ->with('success', 'Fee structure deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Assign fee to selected students
     */
    public function assignToStudents(Request $request, FeeStructure $feeStructure)
    {
        $this->authorize('assign fees');

        $validated = $request->validate([
            'student_ids' => 'required|array|min:1',
            'student_ids.*' => 'exists:students,id',
        ]);

        try {
            $this->feeStructureService->assignFeeToStudents($feeStructure, $validated['student_ids']);

            return back()->with('success', 'Fee assignment job queued. Students will be assigned shortly.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Assign fee to entire grade
     * FIXED: Removed grade parameter since fee structure already has grade_id
     */
    public function assignToGrade(FeeStructure $feeStructure)
    {
        $this->authorize('assign fees');

        try {
            $this->feeStructureService->assignFeeToGrade($feeStructure);

            return back()->with('success', 'Fee assignment job queued. All students in grade will be assigned shortly.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }


}
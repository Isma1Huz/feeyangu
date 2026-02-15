<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\School;
use App\Services\GradeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class GradeController extends Controller
{
    protected GradeService $gradeService;

    public function __construct(GradeService $gradeService)
    {
        $this->gradeService = $gradeService;
        $this->middleware('auth');
        $this->middleware('role:school-admin');
    }

    private function getSchool(): School
    {
        $school = Auth::user()->school;
        
        if (!$school) {
            abort(403, 'School not found');
        }

        return $school;
    }

    public function index(Request $request): Response
    {
        $this->authorize('manage students');

        $school = $this->getSchool();
        $filters = $request->only(['search', 'is_active']);
        
        $grades = $this->gradeService->getSchoolGrades($school, 15, $filters);

        return Inertia::render('School/Grades/Index', [
            'grades' => $grades,
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('manage students');

        return Inertia::render('School/Grades/Create');
    }

    public function store(Request $request)
    {
        $this->authorize('manage students');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
            'description' => 'nullable|string',
            'level' => 'nullable|integer',
        ]);

        try {
            $school = $this->getSchool();
            $grade = $this->gradeService->createGrade($school, $validated);

            return redirect()
                ->route('school.grades.show', $grade)
                ->with('success', 'Grade created successfully');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function show(Grade $grade): Response
    {
        $this->authorize('manage students');

        $gradeData = $this->gradeService->getGradeById($grade->id);
        $statistics = $this->gradeService->getGradeStatistics($grade);

        return Inertia::render('School/Grades/Show', [
            'grade' => $gradeData,
            'statistics' => $statistics,
        ]);
    }

    public function edit(Grade $grade): Response
    {
        $this->authorize('manage students');

        return Inertia::render('School/Grades/Edit', [
            'grade' => $grade,
        ]);
    }

    public function update(Request $request, Grade $grade)
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

            return redirect()
                ->route('school.grades.show', $grade)
                ->with('success', 'Grade updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy(Grade $grade)
    {
        $this->authorize('manage students');

        try {
            $this->gradeService->deleteGrade($grade);

            return redirect()
                ->route('school.grades.index')
                ->with('success', 'Grade deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
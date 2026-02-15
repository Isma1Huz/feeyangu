<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\Term;
use App\Services\TermService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TermController extends Controller
{
    protected TermService $termService;

    public function __construct(TermService $termService)
    {
        $this->termService = $termService;
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
        $filters = $request->only(['year', 'is_active']);
        
        $terms = $this->termService->getSchoolTerms($school, 15, $filters);
        $years = $this->termService->getActiveYears($school);

        return Inertia::render('School/Terms/Index', [
            'terms' => $terms,
            'filters' => $filters,
            'years' => $years,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('manage students');

        return Inertia::render('School/Terms/Create');
    }

    public function store(Request $request)
    {
        $this->authorize('manage students');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'year' => 'required|integer|min:2000|max:2100',
            'term_number' => 'required|integer|in:1,2,3',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'description' => 'nullable|string',
        ]);

        try {
            $school = $this->getSchool();
            $term = $this->termService->createTerm($school, $validated);

            return redirect()
                ->route('school.terms.show', $term)
                ->with('success', 'Term created successfully');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function show(Term $term): Response
    {
        $this->authorize('manage students');

        $termData = $this->termService->getTermById($term->id);
        $statistics = $this->termService->getTermStatistics($term);

        return Inertia::render('School/Terms/Show', [
            'term' => $termData,
            'statistics' => $statistics,
        ]);
    }

    public function edit(Term $term): Response
    {
        $this->authorize('manage students');

        return Inertia::render('school/Terms/Edit', [
            'term' => $term,
        ]);
    }

    public function update(Request $request, Term $term)
    {
        $this->authorize('manage students');

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

            return redirect()
                ->route('school.terms.show', $term)
                ->with('success', 'Term updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy(Term $term)
    {
        $this->authorize('manage students');

        try {
            $this->termService->deleteTerm($term);

            return redirect()
                ->route('school.terms.index')
                ->with('success', 'Term deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
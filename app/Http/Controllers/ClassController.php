<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\SchoolClass;
use App\Models\User;
use App\Services\ClassService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ClassController extends Controller
{
    protected ClassService $classService;

    public function __construct(ClassService $classService)
    {
        $this->classService = $classService;
        $this->middleware('auth');
        $this->middleware('role:school-admin');
    }

    public function index(Grade $grade): Response
    {
        $this->authorize('manage students');

        $filters = request()->only(['search', 'is_active']);
        
        $classes = $this->classService->getGradeClasses($grade, 15, $filters);

        return Inertia::render('school/Classes/Index', [
            'grade' => $grade,
            'classes' => $classes,
            'filters' => $filters,
        ]);
    }

    public function create(Grade $grade): Response
    {
        $this->authorize('manage students');

        $teachers = User::where('school_id', Auth::user()->school_id)
            ->get(['id', 'name']);

        return Inertia::render('school/Classes/Create', [
            'grade' => $grade,
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request, Grade $grade)
    {
        $this->authorize('manage students');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'class_teacher_id' => 'nullable|exists:users,id',
            'capacity' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
        ]);

        try {
            $class = $this->classService->createClass($grade, $validated);

            return redirect()
                ->route('school.classes.show', ['grade' => $grade->id, 'class' => $class->id])
                ->with('success', 'Class created successfully');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function show(Grade $grade, SchoolClass $class): Response
    {
        $this->authorize('manage students');

        $classData = $this->classService->getClassById($class->id);
        $statistics = $this->classService->getClassStatistics($class);

        return Inertia::render('school/Classes/Show', [
            'grade' => $grade,
            'class' => $classData,
            'statistics' => $statistics,
        ]);
    }

    public function edit(Grade $grade, SchoolClass $class): Response
    {
        $this->authorize('manage students');

        $teachers = User::where('school_id', Auth::user()->school_id)
            ->get(['id', 'name']);

        return Inertia::render('school/Classes/Edit', [
            'grade' => $grade,
            'class' => $class,
            'teachers' => $teachers,
        ]);
    }

    public function update(Request $request, Grade $grade, SchoolClass $class)
    {
        $this->authorize('manage students');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'class_teacher_id' => 'nullable|exists:users,id',
            'capacity' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        try {
            $this->classService->updateClass($class, $validated);

            return redirect()
                ->route('school.classes.show', ['grade' => $grade->id, 'class' => $class->id])
                ->with('success', 'Class updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function destroy(Grade $grade, SchoolClass $class)
    {
        $this->authorize('manage students');

        try {
            $this->classService->deleteClass($class);

            return redirect()
                ->route('school.classes.index', $grade->id)
                ->with('success', 'Class deleted successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
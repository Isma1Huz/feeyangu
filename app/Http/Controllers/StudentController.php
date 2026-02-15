<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\Student;
use App\Services\StudentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    protected StudentService $studentService;

    public function __construct(StudentService $studentService)
    {
        $this->studentService = $studentService;
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
     * Display students list
    */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Student::class);

        $school = $this->getSchool();
        $filters = $request->only(['search', 'grade', 'class', 'parent_linked', 'is_active']);

        $students = $this->studentService->getSchoolStudents($school, 15, $filters);
        $grades = $this->studentService->getSchoolGrades($school);
        $availableParents = $this->studentService->getAvailableParents($school);

        return Inertia::render('school/Students/Index', [
            'students' => $students,
            'filters' => $filters,
            'grades' => $grades,
            'availableParents' => $availableParents,
        ]);
    }

    /**
     * Show create student form
     */
    public function create(): Response
    {
        $school = $this->getSchool();
        $grades = $this->studentService->getSchoolGrades($school);
        $availableParents = $this->studentService->getAvailableParents($school);

        return Inertia::render('school/Students/Create', [
            'grades' => $grades,
            'availableParents' => $availableParents,
        ]);
    }

    /**
     * Store student
     */
    public function store(Request $request)
    {
        $school = $this->getSchool();

        $validated = $request->validate([
            'admission_no' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'date_of_birth' => 'nullable|date',
            'grade_id' => 'required|exists:grades,id',
            'class_id' => 'nullable|exists:classes,id',
            'parent_id' => 'nullable|exists:users,id',
        ]);

        try {
            $student = $this->studentService->createStudent($school, $validated);

            return redirect()
                ->route('school.students.show', $student)
                ->with('success', 'Student created successfully');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Show student details
     */
    public function show(Student $student): Response
    {
        $this->authorize('view students');

        $studentData = $this->studentService->getStudentById($student->id);
        $statistics = $this->studentService->getStudentStatistics($student);
        $availableParents = $this->studentService->getAvailableParents($student->school);

        return Inertia::render('school/Students/Show', [
            'student' => $studentData,
            'statistics' => $statistics,
            'availableParents' => $availableParents,
        ]);
    }

    /**
     * Show edit student form
     */
    public function edit(Student $student): Response
    {
        $this->authorize('edit student');

        $grades = $this->studentService->getSchoolGrades($student->school);
        $availableParents = $this->studentService->getAvailableParents($student->school);

        return Inertia::render('school/Students/Edit', [
            'student' => $student,
            'grades' => $grades,
            'availableParents' => $availableParents,
        ]);
    }

    /**
     * Update student
     */
    public function update(Request $request, Student $student)
    {
        $this->authorize('edit student');

        $validated = $request->validate([
            'admission_no' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'date_of_birth' => 'nullable|date',
            'grade_id' => 'required|exists:grades,id',
            'class_id' => 'nullable|exists:classes,id',
            'parent_id' => 'nullable|exists:users,id',
            'is_active' => 'boolean',
        ]);

        try {
            $this->studentService->updateStudent($student, $validated);

            return redirect()
                ->route('school.students.show', $student)
                ->with('success', 'Student updated successfully');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Delete student
     */
    public function destroy(Student $student)
    {
        $this->authorize('delete student');

        $this->studentService->deleteStudent($student);

        return redirect()
            ->route('school.students.index')
            ->with('success', 'Student deleted successfully');
    }

    /**
     * Link parent to student
     */
    public function linkParent(Request $request, Student $student)
    {
        $this->authorize('edit student');

        $validated = $request->validate([
            'parent_id' => 'required|exists:users,id',
        ]);

        try {
            $this->studentService->linkParentToStudent($student, $validated['parent_id']);

            return back()->with('success', 'Parent linked successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Bulk import students
     */
    public function bulkImport(Request $request)
    {
        $this->authorize('bulk import students');

        $validated = $request->validate([
            'file' => 'required|file|mimes:csv,txt',
            'auto_notify_parents' => 'boolean',
        ]);

        try {
            $file = $request->file('file');
            $path = $file->store('imports', 'local');

            $result = $this->studentService->bulkImportStudents(
                $this->getSchool(),
                $path,
                $validated['auto_notify_parents'] ?? false
            );

            return back()->with('success', $result['message']);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Export students
     */
    public function export(Request $request)
    {
        $this->authorize('bulk export students');

        $school = $this->getSchool();
        $filters = $request->only(['grade', 'is_active']);

        try {
            $result = $this->studentService->exportStudents($school, $filters);

            return back()->with('success', $result['message']);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Show student fees
     */
    public function showFees(Student $student): Response
    {
        $this->authorize('view fees');

        $studentData = $this->studentService->getStudentById($student->id);
        $statistics = $this->studentService->getStudentStatistics($student);

        return Inertia::render('school/Students/Fees', [
            'student' => $studentData,
            'statistics' => $statistics,
        ]);
    }

   
}
<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\SchoolTheme;
use App\Services\SchoolService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SchoolController extends Controller
{
    protected SchoolService $schoolService;

    public function __construct(SchoolService $schoolService)
    {
        $this->schoolService = $schoolService;
        $this->middleware('auth');
        $this->middleware('role:super-admin');
    }

    /**
     * Display schools list
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'is_active']);
        $schools = $this->schoolService->getAllSchools(15, $filters);

        return Inertia::render('admin/Schools/Index', [
            'schools' => $schools,
            'filters' => $filters,
        ]);
    }

    /**
     * Show create school form
     */
    public function create(): Response
    {
        $themes = SchoolTheme::all();

        return Inertia::render('admin/Schools/Create', [
            'themes' => $themes,
        ]);
    }

    
    /**
     * Store school
     */
    public function store(Request $request)
    {
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

        $school = $this->schoolService->createSchool($validated);

        return redirect()
            ->route('schools.show', $school)
            ->with('success', 'School created successfully');
    }

    /**
     * Show school details
     */
    public function show(School $school): Response
    {
        $this->authorize('view schools');

        $schoolData = $this->schoolService->getSchoolById($school->id);
        $statistics = $this->schoolService->getSchoolStatistics($school);
        $paymentMethods = $this->schoolService->getSchoolPaymentMethods($school);
        $customization = $this->schoolService->getSchoolCustomization($school);
        $themes = SchoolTheme::all();

        return Inertia::render('admin/Schools/Show', [
            'school' => $schoolData,
            'statistics' => $statistics,
            'paymentMethods' => $paymentMethods,
            'customization' => $customization,
            'themes' => $themes,
        ]);
    }

    /**
     * Show edit school form
     */
    public function edit(School $school): Response
    {
        $this->authorize('edit school');

        $themes = SchoolTheme::all();

        return Inertia::render('admin/Schools/Edit', [
            'school' => $school,
            'themes' => $themes,
        ]);
    }

    /**
     * Update school
     */
    public function update(Request $request, School $school)
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

        $this->schoolService->updateSchool($school, $validated);

        return redirect()
            ->route('schools.show', $school)
            ->with('success', 'School updated successfully');
    }

    /**
     * Delete school
     */
    public function destroy(School $school)
    {
        $this->authorize('delete school');

        $this->schoolService->deleteSchool($school);

        return redirect()
            ->route('schools.index')
            ->with('success', 'School deleted successfully');
    }

    /**
     * Update payment methods
     */
    public function updatePaymentMethods(Request $request, School $school)
    {
        $this->authorize('manage payment methods');

        $validated = $request->validate([
            'methods' => 'required|array',
            'methods.*.method_type' => 'required|string',
            'methods.*.account_holder_name' => 'nullable|string',
            'methods.*.account_number' => 'nullable|string',
            'methods.*.bank_name' => 'nullable|string',
            'methods.*.mpesa_number' => 'nullable|string',
            'methods.*.is_active' => 'boolean',
        ]);

        $this->schoolService->updatePaymentMethods($school, $validated['methods']);

        return back()->with('success', 'Payment methods updated successfully');
    }

    /**
     * Update customization
     */
    public function updateCustomization(Request $request, School $school)
    {
        $this->authorize('customize school profile');

        $validated = $request->validate([
            'school_motto' => 'nullable|string',
            'receipt_footer_text' => 'nullable|string',
            'primary_color' => 'nullable|string',
            'secondary_color' => 'nullable|string',
        ]);

        $this->schoolService->updateSchoolCustomization($school, $validated);

        return back()->with('success', 'School customization updated successfully');
    }
}
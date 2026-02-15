<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentFee;
use App\Services\StudentFeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentFeeController extends Controller
{
    protected StudentFeeService $studentFeeService;

    public function __construct(StudentFeeService $studentFeeService)
    {
        $this->studentFeeService = $studentFeeService;
    }

    /**
     * List student fees
     */
    public function index(Student $student): JsonResponse
    {
        $this->authorize('view fees');

        $filters = request()->only(['status', 'is_overdue', 'term']);
        $perPage = request()->get('per_page', 15);

        $studentFees = $this->studentFeeService->getStudentFees($student->id, $perPage, $filters);
        $summary = $this->studentFeeService->getStudentFeesSummary($student->id);

        return response()->json([
            'data' => $studentFees->items(),
            'summary' => $summary,
            'pagination' => [
                'current_page' => $studentFees->currentPage(),
                'per_page' => $studentFees->perPage(),
                'total' => $studentFees->total(),
                'last_page' => $studentFees->lastPage(),
            ],
        ]);
    }

    /**
     * Get fee details
     */
    public function show(StudentFee $studentFee): JsonResponse
    {
        $this->authorize('view fees');

        $feeDetails = $this->studentFeeService->getFeeDetails($studentFee);

        return response()->json([
            'data' => $feeDetails,
        ]);
    }

    /**
     * Get fees summary
     */
    public function summary(Student $student): JsonResponse
    {
        $summary = $this->studentFeeService->getStudentFeesSummary($student->id);

        return response()->json([
            'data' => $summary,
        ]);
    }

    /**
     * Get fees by status
     */
    public function byStatus(Student $student, string $status): JsonResponse
    {
        $fees = $this->studentFeeService->getFeesByStatus($student->id, $status);

        return response()->json([
            'data' => $fees,
        ]);
    }
}
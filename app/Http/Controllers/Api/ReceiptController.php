<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Receipt;
use App\Models\School;
use App\Services\ReceiptService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReceiptController extends Controller
{
    protected ReceiptService $receiptService;

    public function __construct(ReceiptService $receiptService)
    {
        $this->receiptService = $receiptService;
    }

    /**
     * List receipts
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('generate receipt');

        $school = Auth::user()->school;
        $filters = $request->only(['student_id', 'date_from', 'date_to']);
        $perPage = $request->get('per_page', 15);

        $receipts = $this->receiptService->getSchoolReceipts($school, $perPage, $filters);

        return response()->json([
            'data' => $receipts->items(),
            'pagination' => [
                'current_page' => $receipts->currentPage(),
                'per_page' => $receipts->perPage(),
                'total' => $receipts->total(),
                'last_page' => $receipts->lastPage(),
            ],
        ]);
    }

    /**
     * Get receipt
     */
    public function show(Receipt $receipt): JsonResponse
    {
        $this->authorize('generate receipt');

        $receiptData = $this->receiptService->getReceiptById($receipt->id);

        return response()->json([
            'data' => $receiptData,
        ]);
    }

    /**
     * Get student receipts (parent)
     */
    public function studentReceipts(Request $request): JsonResponse
    {
        $this->authorize('download receipt');

        $user = Auth::user();
        $student = $user->students()->first();

        if (!$student) {
            return response()->json([
                'message' => 'No students found',
            ], 404);
        }

        $perPage = $request->get('per_page', 10);
        $receipts = $this->receiptService->getStudentReceipts($student->id, $perPage);

        return response()->json([
            'data' => $receipts->items(),
            'pagination' => [
                'current_page' => $receipts->currentPage(),
                'per_page' => $receipts->perPage(),
                'total' => $receipts->total(),
                'last_page' => $receipts->lastPage(),
            ],
        ]);
    }
}
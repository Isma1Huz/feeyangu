<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use App\Models\School;
use App\Models\ReceiptTemplate;
use App\Services\ReceiptService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReceiptController extends Controller
{
    protected ReceiptService $receiptService;

    public function __construct(ReceiptService $receiptService)
    {
        $this->receiptService = $receiptService;
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
     * View receipt (school admin)
     */
    public function show(Receipt $receipt): Response
    {
        $this->authorize('generate receipt');

        $receiptData = $this->receiptService->getReceiptById($receipt->id);

        return Inertia::render('school/Receipts/Show', [
            'receipt' => $receiptData,
        ]);
    }

    /**
     * View receipt (parent)
     */
    public function parentView(Receipt $receipt): Response
    {
        $this->authorize('download receipt');

        // Verify parent owns the student
        if (Auth::user()->id !== $receipt->student->parent_id) {
            abort(403, 'Unauthorized access');
        }

        $receiptData = $this->receiptService->getReceiptById($receipt->id);

        return Inertia::render('parent/Receipts/Show', [
            'receipt' => $receiptData,
        ]);
    }

    /**
     * Download receipt as PDF
     */
    public function download(Receipt $receipt)
    {
        $this->authorize('download receipt');

        // Verify access
        if (Auth::user()->hasRole('parent')) {
            if (Auth::user()->id !== $receipt->student->parent_id) {
                abort(403, 'Unauthorized access');
            }
        } elseif (Auth::user()->hasRole('school-admin')) {
            if (Auth::user()->school_id !== $receipt->school_id) {
                abort(403, 'Unauthorized access');
            }
        }

        // Use mPDF or similar library to convert HTML to PDF
        $pdf = \PDF::loadHTML($receipt->receipt_html);

        return $pdf->download('receipt_' . $receipt->receipt_number . '.pdf');
    }

    /**
     * List receipts (school admin)
     */
    public function index(Request $request): Response
    {
        $this->authorize('generate receipt');

        $school = $this->getSchool();
        $filters = $request->only(['student_id', 'date_from', 'date_to']);

        $receipts = $this->receiptService->getSchoolReceipts($school, 15, $filters);

        return Inertia::render('school/Receipts/Index', [
            'receipts' => $receipts,
            'filters' => $filters,
        ]);
    }

    /**
     * List receipts (parent)
     */
    public function parentList(Request $request): Response
    {
        $this->authorize('download receipt');

        $user = Auth::user();
        $student = $user->students()->first();

        if (!$student) {
            abort(404, 'No students found');
        }

        $receipts = $this->receiptService->getStudentReceipts($student->id, 10);

        return Inertia::render('parent/Receipts/Index', [
            'student' => $student,
            'receipts' => $receipts,
        ]);
    }

    /**
     * Manage receipt templates
     */
    public function templates(): Response
    {
        $this->authorize('manage receipt templates');

        $school = $this->getSchool();
        $templates = ReceiptTemplate::where('school_id', $school->id)->get();

        return Inertia::render('school/ReceiptTemplates/Index', [
            'templates' => $templates,
        ]);
    }

    /**
     * Create receipt template
     */
    public function createTemplate(): Response
    {
        $this->authorize('manage receipt templates');

        return Inertia::render('school/ReceiptTemplates/Create', [
            'defaultHTML' => $this->getDefaultTemplateHTML(),
        ]);
    }

    /**
     * Store receipt template
     */
    public function storeTemplate(Request $request)
    {
        $this->authorize('manage receipt templates');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'template_html' => 'required|string',
            'is_default' => 'boolean',
        ]);

        try {
            $school = $this->getSchool();

            // If setting as default, unset other defaults
            if ($validated['is_default']) {
                ReceiptTemplate::where('school_id', $school->id)
                    ->update(['is_default' => false]);
            }

            ReceiptTemplate::create([
                'school_id' => $school->id,
                'name' => $validated['name'],
                'template_html' => $validated['template_html'],
                'is_default' => $validated['is_default'] ?? false,
                'is_active' => true,
            ]);

            return redirect()
                ->route('receipt-templates')
                ->with('success', 'Receipt template created successfully');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Get default template HTML
     */
    private function getDefaultTemplateHTML(): string
    {
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .container { width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
        .school-name { font-size: 20px; font-weight: bold; }
        .receipt-title { font-size: 16px; font-weight: bold; margin-top: 20px; margin-bottom: 10px; }
        .receipt-number { text-align: right; margin-bottom: 20px; }
        .info-section { margin-bottom: 20px; }
        .info-row { display: flex; margin-bottom: 8px; }
        .info-label { width: 150px; font-weight: bold; }
        .info-value { flex: 1; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table th { background-color: #f5f5f5; padding: 10px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold; }
        .table td { padding: 10px; border-bottom: 1px solid #ddd; }
        .total-section { text-align: right; margin-bottom: 20px; }
        .total-row { font-size: 14px; font-weight: bold; margin-bottom: 10px; }
        .footer { text-align: center; border-top: 2px solid #000; padding-top: 15px; margin-top: 30px; font-size: 11px; }
        .stamp-area { text-align: center; margin-top: 30px; min-height: 50px; border: 1px dashed #ccc; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="school-name">{{SCHOOL_NAME}}</div>
            <div style="margin-top: 5px;">{{SCHOOL_ADDRESS}}</div>
            <div style="margin-top: 5px;">Phone: {{SCHOOL_PHONE}} | Email: {{SCHOOL_EMAIL}}</div>
        </div>

        <div class="receipt-title">PAYMENT RECEIPT</div>
        <div class="receipt-number">Receipt #: {{RECEIPT_NUMBER}}</div>

        <div class="info-section">
            <div class="info-row">
                <div class="info-label">Date:</div>
                <div class="info-value">{{PAYMENT_DATE}}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Student Name:</div>
                <div class="info-value">{{STUDENT_NAME}}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Admission No:</div>
                <div class="info-value">{{ADMISSION_NO}}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Grade:</div>
                <div class="info-value">{{GRADE}}</div>
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                {{FEE_BREAKDOWN}}
                <tr>
                    <td style="text-align: right; font-weight: bold;">Total Payment:</td>
                    <td style="text-align: right; font-weight: bold;">{{TOTAL_AMOUNT}}</td>
                </tr>
            </tbody>
        </table>

        <div class="total-section">
            <div class="total-row">Amount Paid: KSH {{AMOUNT_PAID}}</div>
            <div class="total-row">Balance: KSH {{BALANCE}}</div>
        </div>

        <div class="stamp-area">
            School Stamp & Signature
        </div>

        <div class="footer">
            <p>{{FOOTER_TEXT}}</p>
            <p style="margin-top: 10px;">Thank you for your payment. Please keep this receipt for your records.</p>
        </div>
    </div>
</body>
</html>
HTML;
    }

    
}
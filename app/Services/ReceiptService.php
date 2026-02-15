<?php

namespace App\Services;

use App\Models\Receipt;
use App\Models\ReceiptTemplate;
use App\Models\Payment;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReceiptService
{
    /**
     * Generate receipt
     */
    public function generateReceipt(Payment $payment): Receipt
    {
        try {
            DB::beginTransaction();

            $school = $payment->school;
            $student = $payment->studentFee->student;

            // Get default template
            $template = ReceiptTemplate::where('school_id', $school->id)
                ->where('is_default', true)
                ->first();

            if (!$template) {
                $template = $this->createDefaultTemplate($school);
            }

            // Generate receipt number
            $receiptNumber = $this->generateReceiptNumber($school);

            // Render HTML
            $html = $this->renderReceiptHTML($template, $payment, $receiptNumber);

            // Create receipt
            $receipt = Receipt::create([
                'school_id' => $school->id,
                'student_id' => $student->id,
                'payment_id' => $payment->id,
                'receipt_template_id' => $template->id,
                'receipt_number' => $receiptNumber,
                'receipt_html' => $html,
                'generated_at' => now(),
            ]);

            // Link receipt to payment
            $payment->update(['receipt_id' => $receipt->id]);

            DB::commit();

            Log::info("Receipt generated", [
                'receipt_id' => $receipt->id,
                'payment_id' => $payment->id,
                'receipt_number' => $receiptNumber,
            ]);

            return $receipt;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Receipt generation failed", [
                'payment_id' => $payment->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Get receipt by ID
     */
    public function getReceiptById(int $id): ?Receipt
    {
        return Receipt::with([
            'school',
            'student',
            'payment.studentFee.feeStructure.breakdowns',
            'template',
        ])->find($id);
    }

    /**
     * Create default template
     */
    public function createDefaultTemplate(\App\Models\School $school): ReceiptTemplate
    {
        $html = $this->getDefaultTemplateHTML($school);

        return ReceiptTemplate::create([
            'school_id' => $school->id,
            'name' => 'Default Receipt Template',
            'template_html' => $html,
            'is_default' => true,
            'is_active' => true,
        ]);
    }

    /**
     * Get default template HTML
     */
    private function getDefaultTemplateHTML(\App\Models\School $school): string
    {
        $customization = $school->customization()->pluck('value', 'key')->toArray();

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

    /**
     * Render receipt HTML
     */
    private function renderReceiptHTML(ReceiptTemplate $template, Payment $payment, string $receiptNumber): string
    {
        $school = $payment->school;
        $student = $payment->studentFee->student;
        $studentFee = $payment->studentFee;
        $feeStructure = $studentFee->feeStructure;

        $customization = $school->customization()->pluck('value', 'key')->toArray();

        // Build fee breakdown HTML
        $breakdownHTML = '';
        foreach ($feeStructure->breakdowns as $breakdown) {
            $breakdownHTML .= sprintf(
                '<tr><td>%s</td><td style="text-align: right;">KSH %s</td></tr>',
                $breakdown->item_name,
                number_format($breakdown->amount, 2)
            );
        }

        // Replace placeholders
        $html = $template->template_html;
        $html = str_replace('{{SCHOOL_NAME}}', $school->name, $html);
        $html = str_replace('{{SCHOOL_ADDRESS}}', $school->address ?? '', $html);
        $html = str_replace('{{SCHOOL_PHONE}}', $school->phone ?? '', $html);
        $html = str_replace('{{SCHOOL_EMAIL}}', $school->email ?? '', $html);
        $html = str_replace('{{RECEIPT_NUMBER}}', $receiptNumber, $html);
        $html = str_replace('{{PAYMENT_DATE}}', $payment->paid_at->format('d/m/Y'), $html);
        $html = str_replace('{{STUDENT_NAME}}', $student->full_name, $html);
        $html = str_replace('{{ADMISSION_NO}}', $student->admission_no, $html);
        $html = str_replace('{{GRADE}}', $student->grade ?? '', $html);
        $html = str_replace('{{FEE_BREAKDOWN}}', $breakdownHTML, $html);
        $html = str_replace('{{TOTAL_AMOUNT}}', 'KSH ' . number_format($feeStructure->total_amount, 2), $html);
        $html = str_replace('{{AMOUNT_PAID}}', number_format($payment->amount, 2), $html);
        $html = str_replace('{{BALANCE}}', number_format($studentFee->balance, 2), $html);
        $html = str_replace('{{FOOTER_TEXT}}', $customization['receipt_footer_text'] ?? 'Thank you for your payment', $html);

        return $html;
    }

    /**
     * Generate unique receipt number
     */
    private function generateReceiptNumber(\App\Models\School $school): string
    {
        $year = now()->format('Y');
        $month = now()->format('m');
        $count = Receipt::where('school_id', $school->id)
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->count();

        return sprintf('%s%s%s%04d', $school->id, $year, $month, $count + 1);
    }

    /**
     * Get receipts for school
     */
    public function getSchoolReceipts(\App\Models\School $school, int $perPage = 15, array $filters = []): \Illuminate\Contracts\Pagination\Paginator
    {
        $query = Receipt::where('school_id', $school->id)
            ->with(['student', 'payment']);

        if (!empty($filters['student_id'])) {
            $query->where('student_id', $filters['student_id']);
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('generated_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('generated_at', '<=', $filters['date_to']);
        }

        return $query->orderBy('generated_at', 'desc')->paginate($perPage);
    }

    /**
     * Get student receipts
     */
    public function getStudentReceipts(int $studentId, int $perPage = 15): \Illuminate\Contracts\Pagination\Paginator
    {
        return Receipt::where('student_id', $studentId)
            ->with(['payment', 'template'])
            ->orderBy('generated_at', 'desc')
            ->paginate($perPage);
    }
}
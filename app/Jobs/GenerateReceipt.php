<?php

namespace App\Jobs;

use App\Models\Payment;
use App\Services\ReceiptService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateReceipt implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected int $paymentId;

    public function __construct(int $paymentId)
    {
        $this->paymentId = $paymentId;
    }

    public function handle(ReceiptService $receiptService): void
    {
        try {
            $payment = Payment::findOrFail($this->paymentId);

            $receiptService->generateReceipt($payment);

            Log::info("Receipt generated successfully", ['payment_id' => $this->paymentId]);
        } catch (\Exception $e) {
            Log::error("Failed to generate receipt", [
                'payment_id' => $this->paymentId,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
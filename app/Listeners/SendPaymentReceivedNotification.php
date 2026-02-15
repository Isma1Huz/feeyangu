<?php

namespace App\Listeners;

use App\Events\PaymentReceived;
use App\Models\Notification;
use App\Services\NotificationService;

class SendPaymentReceivedNotification
{
    public function __construct(protected NotificationService $notificationService)
    {
    }

    public function handle(PaymentReceived $event): void
    {
        $payment = $event->payment;
        $student = $payment->studentFee->student;
        $parent = $student->parent;

        if (!$parent) {
            return;
        }

        // Send to parent
        $this->notificationService->sendNotification(
            $parent,
            Notification::TYPE_PAYMENT_RECEIVED,
            [
                'student_name' => $student->full_name,
                'amount' => number_format($payment->amount, 2),
                'date' => $payment->paid_at->format('M d, Y'),
            ],
            'Payment',
            $payment->id
        );

        // Send to school admin
        $schoolAdmin = $student->school->owner;
        
        if ($schoolAdmin) {
            $this->notificationService->sendNotification(
                $schoolAdmin,
                Notification::TYPE_PAYMENT_RECEIVED,
                [
                    'student_name' => $student->full_name,
                    'parent_name' => $parent->name,
                    'amount' => number_format($payment->amount, 2),
                    'date' => $payment->paid_at->format('M d, Y'),
                ],
                'Payment',
                $payment->id
            );
        }
    }
}
<?php

namespace App\Listeners;

use App\Events\PaymentOverdue;
use App\Models\Notification;
use App\Services\NotificationService;

class SendPaymentOverdueNotification
{
    public function __construct(protected NotificationService $notificationService)
    {
    }

    public function handle(PaymentOverdue $event): void
    {
        $studentFee = $event->studentFee;
        $student = $studentFee->student;
        $parent = $student->parent;

        if (!$parent) {
            return;
        }

        // Send to parent
        $this->notificationService->sendNotification(
            $parent,
            Notification::TYPE_PAYMENT_OVERDUE,
            [
                'student_name' => $student->full_name,
                'amount' => number_format($studentFee->balance, 2),
                'due_date' => $studentFee->due_date?->format('M d, Y'),
                'days_overdue' => $studentFee->due_date ? now()->diffInDays($studentFee->due_date) : 0,
            ],
            'StudentFee',
            $studentFee->id
        );

        // Send to school admin
        $schoolAdmin = $student->school->owner;
        
        if ($schoolAdmin) {
            $this->notificationService->sendNotification(
                $schoolAdmin,
                Notification::TYPE_PAYMENT_OVERDUE,
                [
                    'student_name' => $student->full_name,
                    'parent_name' => $parent->name,
                    'amount' => number_format($studentFee->balance, 2),
                    'due_date' => $studentFee->due_date?->format('M d, Y'),
                ],
                'StudentFee',
                $studentFee->id
            );
        }
    }
}
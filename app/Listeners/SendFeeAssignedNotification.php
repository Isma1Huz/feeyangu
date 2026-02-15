<?php

namespace App\Listeners;

use App\Events\FeeAssigned;
use App\Models\Notification;
use App\Services\NotificationService;

class SendFeeAssignedNotification
{
    public function __construct(protected NotificationService $notificationService)
    {
    }

    public function handle(FeeAssigned $event): void
    {
        $studentFee = $event->studentFee;
        $student = $studentFee->student;
        $parent = $student->parent;
        $fee = $studentFee->feeStructure;

        if (!$parent) {
            return;
        }

        // Send to parent
        $this->notificationService->sendNotification(
            $parent,
            Notification::TYPE_FEE_ASSIGNED,
            [
                'student_name' => $student->full_name,
                'grade' => $fee->grade?->name,
                'term' => $fee->term?->name,
                'amount' => number_format($studentFee->amount_due, 2),
                'due_date' => $studentFee->due_date?->format('M d, Y') ?? 'No specific date',
            ],
            'StudentFee',
            $studentFee->id
        );
    }
}
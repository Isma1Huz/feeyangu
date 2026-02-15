<?php

namespace Database\Seeders;

use App\Models\NotificationTemplate;
use App\Models\School;
use Illuminate\Database\Seeder;

class NotificationTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $schools = School::all();

        foreach ($schools as $school) {
            // Payment Received Template
            NotificationTemplate::firstOrCreate(
                ['school_id' => $school->id, 'type' => 'payment_received'],
                [
                    'name' => 'Payment Received',
                    'title_template' => 'Payment Received',
                    'message_template' => 'Payment of KSH {{amount}} has been received for {{student_name}} on {{date}}',
                    'email_subject' => 'Payment Confirmation - {{student_name}}',
                    'email_template' => '<p>Dear Parent/Guardian,</p><p>Payment of KSH {{amount}} has been successfully received for {{student_name}} on {{date}}.</p><p>Thank you for your payment.</p>',
                    'sms_template' => 'Payment of KSH {{amount}} for {{student_name}} received on {{date}}. Thank you!',
                    'enabled_channels' => ['in_app', 'email'],
                ]
            );

            // Fee Assigned Template
            NotificationTemplate::firstOrCreate(
                ['school_id' => $school->id, 'type' => 'fee_assigned'],
                [
                    'name' => 'Fee Assigned',
                    'title_template' => 'New Fees Assigned',
                    'message_template' => 'Fees of KSH {{amount}} for {{student_name}} ({{grade}} {{term}}) are due on {{due_date}}',
                    'email_subject' => 'New Fees - {{student_name}}',
                    'email_template' => '<p>Dear Parent/Guardian,</p><p>New fees have been assigned for {{student_name}}.</p><p>Amount: KSH {{amount}}</p><p>Grade: {{grade}} {{term}}</p><p>Due Date: {{due_date}}</p>',
                    'sms_template' => 'Fees of KSH {{amount}} for {{student_name}} due on {{due_date}}',
                    'enabled_channels' => ['in_app', 'email'],
                ]
            );

            // Payment Overdue Template
            NotificationTemplate::firstOrCreate(
                ['school_id' => $school->id, 'type' => 'payment_overdue'],
                [
                    'name' => 'Payment Overdue',
                    'title_template' => 'Payment Overdue',
                    'message_template' => 'Payment for {{student_name}} is {{days_overdue}} days overdue. Amount due: KSH {{amount}}',
                    'email_subject' => 'Payment Overdue - {{student_name}}',
                    'email_template' => '<p>Dear Parent/Guardian,</p><p>Payment for {{student_name}} is {{days_overdue}} days overdue.</p><p>Amount due: KSH {{amount}}</p><p>Please settle the balance at your earliest convenience.</p>',
                    'sms_template' => 'Payment overdue for {{student_name}}. Amount: KSH {{amount}}',
                    'enabled_channels' => ['in_app', 'email', 'sms'],
                ]
            );
        }
    }
}
<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\NotificationLog;
use App\Models\NotificationTemplate;
use App\Models\School;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Send notification to user
     */
    public function sendNotification(
        User $user,
        string $type,
        array $data = [],
        ?string $relatedModel = null,
        ?int $relatedId = null
    ): ?Notification {
        try {
            DB::beginTransaction();

            $school = $user->school;
            
            if (!$school) {
                throw new Exception('User school not found');
            }

            // Get notification template
            $template = NotificationTemplate::where('school_id', $school->id)
                ->where('type', $type)
                ->where('is_active', true)
                ->first();

            if (!$template) {
                Log::warning("Notification template not found for type: {$type}");
                DB::rollBack();
                return null;
            }

            // Render template
            $rendered = $template->render($data);

            // Create notification
            $notification = Notification::create([
                'school_id' => $school->id,
                'user_id' => $user->id,
                'title' => $rendered['title'],
                'message' => $rendered['message'],
                'type' => $type,
                'data' => $data,
                'related_model' => $relatedModel,
                'related_id' => $relatedId,
            ]);

            // Send via enabled channels
            $channels = $template->enabled_channels ?? ['in_app'];

            foreach ($channels as $channel) {
                $this->sendViaChannel($notification, $channel, $rendered, $user, $template);
            }

            DB::commit();

            return $notification;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Failed to send notification: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Send notification to multiple users
     */
    public function sendNotificationToUsers(
        array $userIds,
        string $type,
        array $data = [],
        ?string $relatedModel = null,
        ?int $relatedId = null
    ): array {
        $notifications = [];

        foreach ($userIds as $userId) {
            $user = User::find($userId);
            
            if ($user) {
                $notification = $this->sendNotification($user, $type, $data, $relatedModel, $relatedId);
                
                if ($notification) {
                    $notifications[] = $notification;
                }
            }
        }

        return $notifications;
    }

    /**
     * Send notification via specific channel
     */
    private function sendViaChannel(
        Notification $notification,
        string $channel,
        array $rendered,
        User $user,
        NotificationTemplate $template
    ): void {
        try {
            $log = NotificationLog::create([
                'school_id' => $notification->school_id,
                'notification_id' => $notification->id,
                'channel' => $channel,
                'recipient' => $this->getRecipient($user, $channel),
                'status' => NotificationLog::STATUS_PENDING,
            ]);

            switch ($channel) {
                case NotificationLog::CHANNEL_EMAIL:
                    $this->sendEmailNotification($log, $user, $rendered);
                    break;
                case NotificationLog::CHANNEL_SMS:
                    $this->sendSmsNotification($log, $user, $rendered);
                    break;
                case NotificationLog::CHANNEL_IN_APP:
                    $this->markLogAsSent($log);
                    break;
            }
        } catch (Exception $e) {
            Log::error("Failed to send {$channel} notification: " . $e->getMessage());
            
            if (isset($log)) {
                $log->update([
                    'status' => NotificationLog::STATUS_FAILED,
                    'error_message' => $e->getMessage(),
                ]);
            }
        }
    }

    /**
     * Send email notification
     */
    private function sendEmailNotification(NotificationLog $log, User $user, array $rendered): void
    {
        if (!$user->email) {
            throw new Exception('User email not found');
        }

        // You can use your preferred email service here
        // For now, we'll just log it
        Mail::raw($rendered['email_body'], function ($message) use ($user, $rendered) {
            $message->to($user->email)
                ->subject($rendered['email_subject']);
        });

        $this->markLogAsSent($log);
    }

    /**
     * Send SMS notification
     */
    private function sendSmsNotification(NotificationLog $log, User $user, array $rendered): void
    {
        if (!$user->phone) {
            throw new Exception('User phone not found');
        }

        // Integrate with SMS provider (Twilio, Africa's Talking, etc.)
        // For now, we'll just log it
        Log::info("SMS to {$user->phone}: " . $rendered['sms_body']);

        $this->markLogAsSent($log);
    }

    /**
     * Mark log as sent
     */
    private function markLogAsSent(NotificationLog $log): void
    {
        $log->update([
            'status' => NotificationLog::STATUS_SENT,
            'sent_at' => now(),
        ]);
    }

    /**
     * Get recipient based on channel
     */
    private function getRecipient(User $user, string $channel): string
    {
        return match ($channel) {
            NotificationLog::CHANNEL_EMAIL => $user->email ?? '',
            NotificationLog::CHANNEL_SMS => $user->phone ?? '',
            default => $user->email ?? '',
        };
    }

    /**
     * Get user notifications
     */
    public function getUserNotifications(User $user, int $perPage = 20): \Illuminate\Contracts\Pagination\Paginator
    {
        return Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get unread notifications count
     */
    public function getUnreadCount(User $user): int
    {
        return Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Notification $notification): void
    {
        $notification->markAsRead();
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(User $user): void
    {
        Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    /**
     * Delete old notifications
     */
    public function deleteOldNotifications(int $daysOld = 30): int
    {
        return Notification::where('created_at', '<', now()->subDays($daysOld))
            ->delete();
    }
}
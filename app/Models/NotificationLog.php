<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationLog extends Model
{
    protected $table = 'notification_logs';

    protected $fillable = [
        'school_id',
        'notification_id',
        'channel',
        'recipient',
        'status',
        'response',
        'error_message',
        'sent_at',
    ];

    protected $casts = [
        'response' => 'json',
        'sent_at' => 'datetime',
    ];

    const CHANNEL_IN_APP = 'in_app';
    const CHANNEL_EMAIL = 'email';
    const CHANNEL_SMS = 'sms';

    const STATUS_PENDING = 'pending';
    const STATUS_SENT = 'sent';
    const STATUS_FAILED = 'failed';

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function notification(): BelongsTo
    {
        return $this->belongsTo(Notification::class);
    }
}
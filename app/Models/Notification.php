<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Notification extends Model
{
    protected $fillable = [
        'school_id',
        'user_id',
        'title',
        'message',
        'type',
        'data',
        'is_read',
        'read_at',
        'related_model',
        'related_id',
    ];

    protected $casts = [
        'data' => 'json',
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    // Notification types
    const TYPE_PAYMENT_RECEIVED = 'payment_received';
    const TYPE_PAYMENT_OVERDUE = 'payment_overdue';
    const TYPE_FEE_ASSIGNED = 'fee_assigned';
    const TYPE_STUDENT_ADDED = 'student_added';
    const TYPE_GRADE_CREATED = 'grade_created';
    const TYPE_PAYMENT_PENDING = 'payment_pending';
    const TYPE_SYSTEM_ALERT = 'system_alert';

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(): void
    {
        if (!$this->is_read) {
            $this->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        }
    }

    /**
     * Mark notification as unread
     */
    public function markAsUnread(): void
    {
        $this->update([
            'is_read' => false,
            'read_at' => null,
        ]);
    }

    /**
     * Get display icon based on type
     */
    public function getIconAttribute(): string
    {
        return match ($this->type) {
            self::TYPE_PAYMENT_RECEIVED => 'check-circle',
            self::TYPE_PAYMENT_OVERDUE => 'alert-circle',
            self::TYPE_FEE_ASSIGNED => 'file-text',
            self::TYPE_STUDENT_ADDED => 'user-plus',
            self::TYPE_GRADE_CREATED => 'layers',
            self::TYPE_PAYMENT_PENDING => 'clock',
            self::TYPE_SYSTEM_ALERT => 'bell',
            default => 'info',
        };
    }

    /**
     * Get display color based on type
     */
    public function getColorAttribute(): string
    {
        return match ($this->type) {
            self::TYPE_PAYMENT_RECEIVED => 'green',
            self::TYPE_PAYMENT_OVERDUE => 'red',
            self::TYPE_FEE_ASSIGNED => 'blue',
            self::TYPE_STUDENT_ADDED => 'purple',
            self::TYPE_GRADE_CREATED => 'indigo',
            self::TYPE_PAYMENT_PENDING => 'yellow',
            self::TYPE_SYSTEM_ALERT => 'orange',
            default => 'gray',
        };
    }
}
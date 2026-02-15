<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationTemplate extends Model
{
    protected $fillable = [
        'school_id',
        'name',
        'type',
        'title_template',
        'message_template',
        'email_subject',
        'email_template',
        'sms_template',
        'enabled_channels',
        'is_active',
    ];

    protected $casts = [
        'enabled_channels' => 'json',
        'is_active' => 'boolean',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    /**
     * Render template with data
     */
    public function render(array $data): array
    {
        return [
            'title' => $this->replaceVariables($this->title_template, $data),
            'message' => $this->replaceVariables($this->message_template, $data),
            'email_subject' => $this->replaceVariables($this->email_subject, $data),
            'email_body' => $this->replaceVariables($this->email_template, $data),
            'sms_body' => $this->replaceVariables($this->sms_template, $data),
        ];
    }

    /**
     * Replace template variables
     */
    private function replaceVariables(string $template, array $data): string
    {
        foreach ($data as $key => $value) {
            $template = str_replace("{{$key}}", $value, $template);
        }
        return $template;
    }
}
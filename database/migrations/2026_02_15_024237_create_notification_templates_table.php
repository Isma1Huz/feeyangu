<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            
            $table->string('name');
            $table->string('type'); // payment_received, payment_overdue, etc.
            
            // In-app notification
            $table->text('title_template');
            $table->text('message_template');
            
            // Email notification
            $table->text('email_subject')->nullable();
            $table->longText('email_template')->nullable();
            
            // SMS notification
            $table->text('sms_template')->nullable();
            
            // Enabled channels (in_app, email, sms)
            $table->json('enabled_channels')->default(json_encode(['in_app']));
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->unique(['school_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_templates');
    }
};
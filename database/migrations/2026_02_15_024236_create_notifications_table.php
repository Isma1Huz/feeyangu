<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            
            $table->string('title');
            $table->text('message');
            $table->string('type'); // payment_received, payment_overdue, fee_assigned, etc.
            $table->json('data')->nullable(); // Additional data (fee amount, student name, etc.)
            
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            
            // For linking to related records
            $table->string('related_model')->nullable(); // StudentFee, Payment, Student, etc.
            $table->unsignedBigInteger('related_id')->nullable();
            
            $table->timestamps();
            
            $table->index(['user_id', 'is_read']);
            $table->index(['school_id', 'created_at']);
            $table->index(['type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
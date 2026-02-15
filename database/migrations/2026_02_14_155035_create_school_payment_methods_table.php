<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('school_payment_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
            $table->string('method_name'); // e.g., "School M-Pesa", "KCAB Account"
            $table->string('method_type'); // mpesa, bank_transfer, cash, check, card, paypal
            $table->string('account_holder_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('branch_code')->nullable();
            $table->string('mpesa_number')->nullable(); // For M-Pesa
            $table->string('phone_number')->nullable(); // For mobile payments
            $table->longText('additional_details')->nullable(); // JSON for extra info
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();

            // Indexes
            $table->index('school_id');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('school_payment_methods');
    }
};
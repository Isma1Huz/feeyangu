<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fee_breakdowns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fee_structure_id')->constrained('fee_structures')->cascadeOnDelete();
            $table->string('item_name'); // e.g., "Exam Fees", "School Fees", "Activity Fees"
            $table->decimal('amount', 12, 2);
            $table->text('description')->nullable();
            $table->integer('display_order')->default(0);
            $table->timestamps();

            // Indexes
            $table->index('fee_structure_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fee_breakdowns');
    }
};
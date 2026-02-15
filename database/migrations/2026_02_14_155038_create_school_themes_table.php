<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('school_themes', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('primary_color')->default('#3b82f6'); // Blue
            $table->string('secondary_color')->default('#10b981'); // Green
            $table->string('accent_color')->default('#f59e0b'); // Amber
            $table->string('font_family')->default('Poppins'); // Font
            $table->string('logo_path')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            // Indexes
            $table->index('is_default');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('school_themes');
    }
};
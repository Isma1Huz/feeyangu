<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('platform_settings', function (Blueprint $table) {
            $table->id();
            $table->string('setting_key')->unique();
            $table->longText('setting_value')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('setting_key');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('platform_settings');
    }
};
<?php

namespace Database\Seeders;

use App\Models\PlatformSetting;
use Illuminate\Database\Seeder;

class PlatformSettingSeeder extends Seeder
{
    public function run(): void
    {
        PlatformSetting::create([
            'setting_key' => 'platform_name',
            'setting_value' => 'FEEyangu',
            'description' => 'Platform name',
        ]);

        PlatformSetting::create([
            'setting_key' => 'platform_version',
            'setting_value' => '1.0.0',
            'description' => 'Current platform version',
        ]);

        PlatformSetting::create([
            'setting_key' => 'default_theme_id',
            'setting_value' => '1',
            'description' => 'Default theme for new schools',
        ]);

        PlatformSetting::create([
            'setting_key' => 'platform_fee_percentage',
            'setting_value' => '2.5',
            'description' => 'Percentage fee charged by platform on payments',
        ]);

        PlatformSetting::create([
            'setting_key' => 'payment_reminder_days_before',
            'setting_value' => '3',
            'description' => 'Send reminder X days before fee due date',
        ]);

        PlatformSetting::create([
            'setting_key' => 'max_bulk_import_records',
            'setting_value' => '5000',
            'description' => 'Maximum records for bulk import',
        ]);
    }
}
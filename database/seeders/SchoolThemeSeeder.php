<?php

namespace Database\Seeders;

use App\Models\SchoolTheme;
use Illuminate\Database\Seeder;

class SchoolThemeSeeder extends Seeder
{
    public function run(): void
    {
        SchoolTheme::firstOrCreate(
            ['name' => 'Default Blue'],
            [
                'primary_color' => '#3b82f6',
                'secondary_color' => '#10b981',
                'accent_color' => '#f59e0b',
                'font_family' => 'Inter',
                'is_default' => true,
            ]
        );

        SchoolTheme::firstOrCreate(
            ['name' => 'Professional Green'],
            [
                'primary_color' => '#059669',
                'secondary_color' => '#7c3aed',
                'accent_color' => '#dc2626',
                'font_family' => 'Poppins',
                'is_default' => false,
            ]
        );

        SchoolTheme::firstOrCreate(
            ['name' => 'Modern Purple'],
            [
                'primary_color' => '#7c3aed',
                'secondary_color' => '#ec4899',
                'accent_color' => '#f59e0b',
                'font_family' => 'Roboto',
                'is_default' => false,
            ]
        );
    }
}
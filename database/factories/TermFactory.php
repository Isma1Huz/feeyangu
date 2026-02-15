<?php

namespace Database\Factories;

use App\Models\Term;
use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;

class TermFactory extends Factory
{
    protected $model = Term::class;
    
    private static $termCounter = 0;

    public function definition()
    {
        self::$termCounter++;
        $termNumber = ((self::$termCounter - 1) % 3) + 1;
        $year = now()->year + intdiv(self::$termCounter - 1, 3);

        return [
            'school_id' => School::factory(),
            'name' => "Term {$termNumber}",
            'year' => $year,  // ← DIFFERENT year for each term_number
            'term_number' => $termNumber,
            'start_date' => now()->subMonths(6),
            'end_date' => now()->addMonths(6),
            'is_active' => true,
        ];
    }
}
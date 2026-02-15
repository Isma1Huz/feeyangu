<?php

namespace Database\Factories;

use App\Models\Term;
use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;

class TermFactory extends Factory
{
    protected $model = Term::class;
    
    private static $termCounter = [];

    public function definition()
    {
        $schoolId = School::factory()->create()->id;
        
        if (!isset(self::$termCounter[$schoolId])) {
            self::$termCounter[$schoolId] = 0;
        }
        
        $termNumber = (++self::$termCounter[$schoolId] % 3) + 1;
        $year = now()->year + intdiv(self::$termCounter[$schoolId], 3);

        return [
            'school_id' => $schoolId,
            'name' => "Term {$termNumber}",
            'year' => $year,
            'term_number' => $termNumber,
            'start_date' => now()->subMonths(6),
            'end_date' => now()->addMonths(6),
            'is_active' => true,
        ];
    }
}
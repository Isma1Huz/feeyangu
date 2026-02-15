<?php

namespace Database\Factories;

use App\Models\Term;
use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;

class TermFactory extends Factory
{
    protected $model = Term::class;
    
    private static $globalCounter = 0;

    public function definition()
    {
        $schoolId = School::factory()->create()->id;
        
        $counter = ++self::$globalCounter;
        $termNumber = ($counter % 3) + 1;
        $year = now()->year + intdiv($counter - 1, 3);

        return [
            'school_id' => $schoolId,
            'name' => "Term {$termNumber}",
            'year' => $year,
            'term_number' => $termNumber,
            'start_date' => now()->subMonths(6)->addDays($counter),
            'end_date' => now()->addMonths(6)->addDays($counter),
            'is_active' => true,
        ];
    }
}
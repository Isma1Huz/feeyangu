<?php

namespace Database\Factories;

use App\Models\FeeStructure;
use App\Models\School;
use App\Models\Grade;
use App\Models\Term;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeeStructureFactory extends Factory
{
    protected $model = FeeStructure::class;

    public function definition()
    {
        $school = School::factory()->create();
        $grade = Grade::factory()->create(['school_id' => $school->id]);
        $term = Term::factory()->create(['school_id' => $school->id]);

        return [
            'school_id' => $school->id,
            'grade_id' => $grade->id,
            'term_id' => $term->id,
            'total_amount' => $this->faker->numberBetween(5000, 50000),
            'due_date' => now()->addMonth(),
            'is_active' => true,
        ];
    }
}
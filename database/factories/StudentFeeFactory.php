<?php

namespace Database\Factories;

use App\Models\StudentFee;
use App\Models\Student;
use App\Models\FeeStructure;
use App\Models\School;
use App\Models\Grade;
use App\Models\Term;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFeeFactory extends Factory
{
    protected $model = StudentFee::class;

    public function definition()
    {
        $school = School::factory()->create();
        $grade = Grade::factory()->create(['school_id' => $school->id]);
        $student = Student::factory()->create(['school_id' => $school->id, 'grade_id' => $grade->id]);
        $term = Term::factory()->create(['school_id' => $school->id]);
        $feeStructure = FeeStructure::factory()->create([
            'school_id' => $school->id,
            'grade_id' => $grade->id,
            'term_id' => $term->id,
        ]);

        $amount = $this->faker->numberBetween(5000, 50000);

        return [
            'student_id' => $student->id,
            'fee_structure_id' => $feeStructure->id,
            'amount_due' => $amount,
            'amount_paid' => 0,
            'balance' => $amount,
            'due_date' => now()->addMonth(),
            'status' => 'unpaid',
            'is_overdue' => false,
        ];
    }
}
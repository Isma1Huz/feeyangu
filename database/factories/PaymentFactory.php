<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\StudentFee;
use App\Models\Student;
use App\Models\FeeStructure;
use App\Models\School;
use App\Models\Grade;
use App\Models\Term;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition()
    {
        $school = School::factory()->create();
        $grade = Grade::factory()->create(['school_id' => $school->id]);
        $term = Term::factory()->create(['school_id' => $school->id]);
        $student = Student::factory()->create(['school_id' => $school->id, 'grade_id' => $grade->id]);
        $feeStructure = FeeStructure::factory()->create([
            'school_id' => $school->id,
            'grade_id' => $grade->id,
            'term_id' => $term->id,
        ]);
        
        $studentFee = StudentFee::create([
            'student_id' => $student->id,
            'fee_structure_id' => $feeStructure->id,
            'amount_due' => 10000,
            'amount_paid' => 0,
            'balance' => 10000,
            'status' => 'unpaid',
        ]);

        return [
            'school_id' => $school->id,
            'student_fee_id' => $studentFee->id,
            'amount' => $this->faker->numberBetween(1000, 10000),
            'payment_method' => $this->faker->randomElement(['mpesa', 'bank_transfer', 'cash', 'card']),
            'reference' => $this->faker->unique()->bothify('TXN####???'),
            'payment_status' => 'completed',
            'paid_at' => now(),
        ];
    }
}
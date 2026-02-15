<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\School;
use App\Models\StudentFee;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition()
    {
        $school = School::factory()->create();
        $studentFee = StudentFee::factory()->create(['school_id' => $school->id]);

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
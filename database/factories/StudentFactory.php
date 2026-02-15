<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition()
    {
        return [
            'school_id' => School::factory(),
            'admission_no' => $this->faker->unique()->numerify('ADM####'),
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'email' => $this->faker->unique()->safeEmail,
            'date_of_birth' => $this->faker->dateTimeBetween('-18 years', '-5 years'),
            'is_active' => true,
        ];
    }
}
<?php

namespace Database\Factories;

use App\Models\Grade;
use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;

class GradeFactory extends Factory
{
    protected $model = Grade::class;
    
    private static $gradeCounter = 0;

    public function definition()
    {
        self::$gradeCounter++;
        $code = 'G' . str_pad(self::$gradeCounter, 3, '0', STR_PAD_LEFT);

        return [
            'school_id' => School::factory(),
            'name' => $this->faker->randomElement(['Grade 1', 'Grade 2', 'Form 1', 'Form 2', 'Form 3']),
            'code' => $code,  // ← UNIQUE for each factory call
            'level' => self::$gradeCounter,
            'is_active' => true,
        ];
    }
}
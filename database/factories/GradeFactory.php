<?php

namespace Database\Factories;

use App\Models\Grade;
use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;

class GradeFactory extends Factory
{
    protected $model = Grade::class;
    
    private static $gradeCounter = [];

    public function definition()
    {
        $schoolId = School::factory()->create()->id;
        
        if (!isset(self::$gradeCounter[$schoolId])) {
            self::$gradeCounter[$schoolId] = 0;
        }
        
        $counter = ++self::$gradeCounter[$schoolId];
        $code = 'G' . str_pad($counter, 3, '0', STR_PAD_LEFT);

        return [
            'school_id' => $schoolId,
            'name' => $this->faker->randomElement(['Grade 1', 'Grade 2', 'Form 1', 'Form 2', 'Form 3']),
            'code' => $code,
            'level' => $counter,
            'is_active' => true,
        ];
    }
}
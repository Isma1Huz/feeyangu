<?php

namespace Tests\Unit\Models;

use App\Models\School;
use App\Models\Student;
use App\Models\Grade;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Database\QueryException;

class StudentTest extends TestCase
{
    /**
     * Test student full name accessor
     */
    public function test_student_full_name_accessor()
    {
        $school = School::factory()->create();
        
        $student = Student::create([
            'school_id' => $school->id,
            'admission_no' => 'ADM001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'is_active' => true,
        ]);

        $this->assertEquals('John Doe', $student->full_name);
    }

    /**
     * Test student belongs to school
     */
    public function test_student_belongs_to_school()
    {
        $school = School::factory()->create();
        
        $student = Student::create([
            'school_id' => $school->id,
            'admission_no' => 'ADM001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'is_active' => true,
        ]);

        $this->assertInstanceOf(School::class, $student->school);
        $this->assertEquals($school->id, $student->school->id);
    }

    /**
     * Test student can belong to parent
     */
    public function test_student_can_belong_to_parent()
    {
        $school = School::factory()->create();
        $parent = User::factory()->create(['school_id' => $school->id]);
        
        $student = Student::create([
            'school_id' => $school->id,
            'parent_id' => $parent->id,
            'admission_no' => 'ADM001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'is_active' => true,
        ]);

        $this->assertInstanceOf(User::class, $student->parent);
        $this->assertEquals($parent->id, $student->parent->id);
    }

    /**
     * Test student can belong to grade
     */
    public function test_student_can_belong_to_grade()
    {
        $school = School::factory()->create();
        $grade = Grade::factory()->create(['school_id' => $school->id]);
        
        $student = Student::create([
            'school_id' => $school->id,
            'grade_id' => $grade->id,
            'admission_no' => 'ADM001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'is_active' => true,
        ]);

        $this->assertInstanceOf(Grade::class, $student->grade);
        $this->assertEquals($grade->id, $student->grade->id);
    }

    /**
     * Test admission number must be unique
     */
    public function test_admission_number_must_be_unique()
    {
        $school = School::factory()->create();
        
        Student::create([
            'school_id' => $school->id,
            'admission_no' => 'ADM001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'is_active' => true,
        ]);

        $this->expectException(QueryException::class);
        
        Student::create([
            'school_id' => $school->id,
            'admission_no' => 'ADM001',
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'is_active' => true,
        ]);
    }

    /**
     * Test student is active by default
     */
    public function test_student_is_active_by_default()
    {
        $school = School::factory()->create();
        
        $student = Student::factory()->create([
            'school_id' => $school->id,
        ]);

        $this->assertTrue($student->is_active);
    }
}
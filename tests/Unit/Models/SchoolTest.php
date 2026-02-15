<?php

namespace Tests\Unit\Models;

use App\Models\School;
use App\Models\Grade;
use App\Models\Term;
use App\Models\Student;
use Tests\TestCase;

class SchoolTest extends TestCase
{
    /**
     * Test school can be created
     */
    public function test_school_can_be_created()
    {
        $school = School::create([
            'name' => 'Test School',
            'address' => '123 Main St',
            'phone' => '1234567890',
            'email' => 'school@test.com',
            'owner_id' => null,
            'subscription_status' => 'active',
            'is_active' => true,  // FIXED: Explicitly set
        ]);

        $this->assertDatabaseHas('schools', [
            'name' => 'Test School',
            'email' => 'school@test.com',
        ]);
    }

    /**
     * Test school has many students
     */
    public function test_school_has_many_students()
    {
        $school = School::factory()->create();
        
        Student::factory(5)->create(['school_id' => $school->id]);

        $this->assertCount(5, $school->refresh()->students);
    }

    /**
     * Test school has many grades
     */
    public function test_school_has_many_grades()
    {
        $school = School::factory()->create();
        
        Grade::factory(3)->create(['school_id' => $school->id]);

        $this->assertCount(3, $school->refresh()->grades);
    }

    /**
     * Test school has many terms
     */
    public function test_school_has_many_terms()
    {
        $school = School::factory()->create();
        
        Term::factory(4)->create(['school_id' => $school->id]);

        $this->assertCount(4, $school->refresh()->terms);
    }

    /**
     * Test school is active by default
     */
    public function test_school_is_active_by_default()
    {
        $school = School::factory()->create();

        $this->assertTrue($school->is_active);
    }
}
<?php

namespace Tests\Unit\Models;

use App\Models\School;
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
            'is_active' => true,
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

        $this->assertEquals(5, $school->refresh()->students()->count());
    }

    /**
     * Test school has many grades
     */
    public function test_school_has_many_grades()
    {
        $school = School::factory()->create();
        
        // Create grades with unique codes
        for ($i = 1; $i <= 3; $i++) {
            \App\Models\Grade::create([
                'school_id' => $school->id,
                'name' => "Grade {$i}",
                'code' => "G{$i}",  // ← UNIQUE code
                'level' => $i,
                'is_active' => true,
            ]);
        }

        $this->assertEquals(3, $school->refresh()->grades()->count());
    }

    /**
     * Test school has many terms
     */
    public function test_school_has_many_terms()
    {
        $school = School::factory()->create();
        
        // Create terms with unique year/term_number combinations
        for ($i = 1; $i <= 3; $i++) {
            \App\Models\Term::create([
                'school_id' => $school->id,
                'name' => "Term {$i}",
                'year' => now()->year,
                'term_number' => $i,  // ← UNIQUE term_number
                'start_date' => now()->subMonths(6),
                'end_date' => now()->addMonths(6),
                'is_active' => true,
            ]);
        }

        $this->assertEquals(3, $school->refresh()->terms()->count());
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
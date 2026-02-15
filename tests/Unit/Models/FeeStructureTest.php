<?php

namespace Tests\Unit\Models;

use App\Models\School;
use App\Models\FeeStructure;
use App\Models\Grade;
use App\Models\Term;
use Tests\TestCase;
use Illuminate\Database\QueryException;
class FeeStructureTest extends TestCase
{
    /**
     * Test fee structure can be created
     */
    public function test_fee_structure_can_be_created()
    {
        $school = School::factory()->create();
        $grade = Grade::factory()->create(['school_id' => $school->id]);
        $term = Term::factory()->create(['school_id' => $school->id]);

        $feeStructure = FeeStructure::create([
            'school_id' => $school->id,
            'grade_id' => $grade->id,
            'term_id' => $term->id,
            'total_amount' => 10000,
            'due_date' => now()->addMonth(),
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('fee_structures', [
            'school_id' => $school->id,
            'grade_id' => $grade->id,
            'term_id' => $term->id,
        ]);
    }

    /**
     * Test fee structure belongs to grade
     */
    public function test_fee_structure_belongs_to_grade()
    {
        $school = School::factory()->create();
        $grade = Grade::factory()->create(['school_id' => $school->id]);
        $term = Term::factory()->create(['school_id' => $school->id]);

        $feeStructure = FeeStructure::create([
            'school_id' => $school->id,
            'grade_id' => $grade->id,
            'term_id' => $term->id,
            'total_amount' => 10000,
        ]);

        $this->assertInstanceOf(Grade::class, $feeStructure->grade);
        $this->assertEquals($grade->id, $feeStructure->grade->id);
    }

    /**
     * Test fee structure belongs to term
     */
    public function test_fee_structure_belongs_to_term()
    {
        $school = School::factory()->create();
        $grade = Grade::factory()->create(['school_id' => $school->id]);
        $term = Term::factory()->create(['school_id' => $school->id]);

        $feeStructure = FeeStructure::create([
            'school_id' => $school->id,
            'grade_id' => $grade->id,
            'term_id' => $term->id,
            'total_amount' => 10000,
        ]);

        $this->assertInstanceOf(Term::class, $feeStructure->term);
        $this->assertEquals($term->id, $feeStructure->term->id);
    }

    /**
     * Test fee structure is active by default
     */
    public function test_fee_structure_is_active_by_default()
    {
        $school = School::factory()->create();
        $grade = Grade::factory()->create(['school_id' => $school->id]);
        $term = Term::factory()->create(['school_id' => $school->id]);

        $feeStructure = FeeStructure::factory()->create([
            'school_id' => $school->id,
            'grade_id' => $grade->id,
            'term_id' => $term->id,
        ]);

        $this->assertTrue($feeStructure->is_active);
    }

    /**
     * Test grade and term combination must be unique per school
     */
    public function test_grade_term_combination_must_be_unique_per_school()
    {
        $school = School::factory()->create();
        $grade = Grade::factory()->create(['school_id' => $school->id]);
        $term = Term::factory()->create(['school_id' => $school->id]);

        FeeStructure::create([
            'school_id' => $school->id,
            'grade_id' => $grade->id,
            'term_id' => $term->id,
            'total_amount' => 10000,
        ]);

        $this->expectException(QueryException::class);

        FeeStructure::create([
            'school_id' => $school->id,
            'grade_id' => $grade->id,
            'term_id' => $term->id,
            'total_amount' => 15000,
        ]);
    }
}
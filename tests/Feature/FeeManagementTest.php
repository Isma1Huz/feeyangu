<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\FeeStructure;
use App\Models\Grade;
use App\Models\Term;
use App\Models\Student;
use App\Models\StudentFee;
use App\Models\User;
use Tests\TestCase;

class FeeManagementTest extends TestCase
{
    protected School $school;
    protected User $schoolAdmin;
    protected Grade $grade;
    protected Term $term;

    protected function setUp(): void
    {
        parent::setUp();

        $this->school = School::factory()->create();
        $this->schoolAdmin = User::factory()->create(['school_id' => $this->school->id]);
        $this->schoolAdmin->assignRole('school-admin');
        
        $this->grade = Grade::factory()->create(['school_id' => $this->school->id]);
        $this->term = Term::factory()->create(['school_id' => $this->school->id]);
    }

    /**
     * Test school admin can create fee structure
     */
    public function test_school_admin_can_create_fee_structure()
    {
        $response = $this->actingAs($this->schoolAdmin)
            ->post('/school/fee-structures', [  // FIXED: Correct route
                'grade_id' => $this->grade->id,
                'term_id' => $this->term->id,
                'due_date' => now()->addMonth(),
                'breakdowns' => [
                    [
                        'item_name' => 'Tuition',
                        'amount' => 5000,
                        'description' => 'Monthly tuition',
                    ],
                    [
                        'item_name' => 'Books',
                        'amount' => 2000,
                        'description' => 'Textbooks',
                    ],
                ],
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('fee_structures', [
            'grade_id' => $this->grade->id,
            'term_id' => $this->term->id,
            'total_amount' => 7000,
        ]);
    }

    /**
     * Test school admin can view fee structures list
     */
    public function test_school_admin_can_view_fee_structures_list()
    {
        // Create unique combination for this test
        $grade2 = Grade::factory()->create(['school_id' => $this->school->id, 'code' => 'UNIQUE1']);
        $term2 = Term::factory()->create(['school_id' => $this->school->id, 'term_number' => 2, 'year' => now()->year + 1]);
        
        FeeStructure::factory()->create([
            'school_id' => $this->school->id,
            'grade_id' => $grade2->id,
            'term_id' => $term2->id,
        ]);

        $response = $this->actingAs($this->schoolAdmin)
            ->get('/school/fee-structures');  // FIXED: Correct route

        $response->assertStatus(200);
    }

    /**
     * Test school admin can assign fee to students
     */
    public function test_school_admin_can_assign_fee_to_students()
    {
        $feeStructure = FeeStructure::factory()->create([
            'school_id' => $this->school->id,
            'grade_id' => $this->grade->id,
            'term_id' => $this->term->id,
            'total_amount' => 10000,
        ]);

        $students = Student::factory(3)->create([
            'school_id' => $this->school->id,
            'grade_id' => $this->grade->id,
        ]);

        $response = $this->actingAs($this->schoolAdmin)
            ->post("/school/fee-structures/{$feeStructure->id}/assign-to-students", [  // FIXED: Correct route
                'student_ids' => $students->pluck('id')->toArray(),
            ]);

        $response->assertRedirect();
    }

    /**
     * Test school admin can assign fee to entire grade
     */
    public function test_school_admin_can_assign_fee_to_entire_grade()
    {
        $feeStructure = FeeStructure::factory()->create([
            'school_id' => $this->school->id,
            'grade_id' => $this->grade->id,
            'term_id' => $this->term->id,
            'total_amount' => 10000,
        ]);

        Student::factory(5)->create([
            'school_id' => $this->school->id,
            'grade_id' => $this->grade->id,
        ]);

        $response = $this->actingAs($this->schoolAdmin)
            ->post("/school/fee-structures/{$feeStructure->id}/assign-to-grade");  // FIXED: Correct route

        $response->assertRedirect();
    }

    /**
     * Test fee structure with duplicate grade-term cannot be created
     */
    public function test_fee_structure_with_duplicate_grade_term_cannot_be_created()
    {
        FeeStructure::create([
            'school_id' => $this->school->id,
            'grade_id' => $this->grade->id,
            'term_id' => $this->term->id,
            'total_amount' => 10000,
        ]);

        $response = $this->actingAs($this->schoolAdmin)
            ->post('/school/fee-structures', [  // FIXED: Correct route
                'grade_id' => $this->grade->id,
                'term_id' => $this->term->id,
                'breakdowns' => [
                    [
                        'item_name' => 'Tuition',
                        'amount' => 5000,
                    ],
                ],
            ]);

        $response->assertSessionHasErrors();
    }
}
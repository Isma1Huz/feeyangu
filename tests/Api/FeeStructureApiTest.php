<?php

namespace Tests\Api;

use App\Models\School;
use App\Models\FeeStructure;
use App\Models\Grade;
use App\Models\Term;
use App\Models\User;
use Tests\TestCase;

class FeeStructureApiTest extends TestCase
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
     * Test can list fee structures via API
     */
    public function test_can_list_fee_structures_via_api()
    {
        FeeStructure::factory(3)->create([
            'school_id' => $this->school->id,
            'grade_id' => $this->grade->id,
            'term_id' => $this->term->id,
        ]);

        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->getJson('/api/school/fee-structures');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data',
            'pagination',
        ]);
    }

    /**
     * Test can create fee structure via API
     */
    public function test_can_create_fee_structure_via_api()
    {
        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->postJson('/api/school/fee-structures', [
                'grade_id' => $this->grade->id,
                'term_id' => $this->term->id,
                'due_date' => now()->addMonth(),
                'breakdowns' => [
                    [
                        'item_name' => 'Tuition',
                        'amount' => 5000,
                    ],
                ],
            ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
            'data',
        ]);
    }

    /**
     * Test can view fee structure details via API
     */
    public function test_can_view_fee_structure_details_via_api()
    {
        $feeStructure = FeeStructure::factory()->create([
            'school_id' => $this->school->id,
            'grade_id' => $this->grade->id,
            'term_id' => $this->term->id,
        ]);

        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->getJson("/api/school/fee-structures/{$feeStructure->id}");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data',
            'statistics',
        ]);
    }

    /**
     * Test can update fee structure via API
     */
    public function test_can_update_fee_structure_via_api()
    {
        $feeStructure = FeeStructure::factory()->create([
            'school_id' => $this->school->id,
            'grade_id' => $this->grade->id,
            'term_id' => $this->term->id,
        ]);

        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->putJson("/api/school/fee-structures/{$feeStructure->id}", [
                'grade_id' => $this->grade->id,
                'term_id' => $this->term->id,
                'breakdowns' => [
                    [
                        'item_name' => 'Updated',
                        'amount' => 6000,
                    ],
                ],
            ]);

        $response->assertStatus(200);
    }

    /**
     * Test can get available grades via API
     */
    public function test_can_get_available_grades_via_api()
    {
        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->getJson('/api/school/fee-structures/grades');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name'],
            ],
        ]);
    }

    /**
     * Test can get available terms via API
     */
    public function test_can_get_available_terms_via_api()
    {
        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->getJson('/api/school/fee-structures/terms');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'year'],
            ],
        ]);
    }

    /**
     * Test invalid grade_id returns validation error
     */
    public function test_invalid_grade_id_returns_validation_error()
    {
        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->postJson('/api/school/fee-structures', [
                'grade_id' => 9999,
                'term_id' => $this->term->id,
                'breakdowns' => [
                    [
                        'item_name' => 'Tuition',
                        'amount' => 5000,
                    ],
                ],
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['grade_id']);
    }
}
<?php

namespace Tests\Api;

use App\Models\School;
use App\Models\Student;
use App\Models\User;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class StudentApiTest extends TestCase
{
    protected School $school;
    protected User $schoolAdmin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->school = School::factory()->create();
        $this->schoolAdmin = User::factory()->create(['school_id' => $this->school->id]);
        $this->schoolAdmin->assignRole('school-admin');
    }

    /**
     * Test can list students via API
     */
    public function test_can_list_students_via_api()
    {
        Student::factory(5)->create(['school_id' => $this->school->id]);

        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->getJson('/api/school/students');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data',
            'pagination' => [
                'current_page',
                'per_page',
                'total',
                'last_page',
            ],
        ]);
    }

    /**
     * Test can create student via API
     */
    public function test_can_create_student_via_api()
    {
        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->postJson('/api/school/students', [
                'admission_no' => 'ADM001',
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john@test.com',
                'grade_id' => \App\Models\Grade::factory()->create(['school_id' => $this->school->id])->id,
            ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
            'data' => [
                'id',
                'admission_no',
                'first_name',
                'last_name',
            ],
        ]);
    }

    /**
     * Test can view student details via API
     */
    public function test_can_view_student_details_via_api()
    {
        $student = Student::factory()->create(['school_id' => $this->school->id]);

        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->getJson("/api/school/students/{$student->id}");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'id',
                'admission_no',
                'first_name',
                'last_name',
            ],
            'statistics',
        ]);
    }

    /**
     * Test can update student via API
     */
    public function test_can_update_student_via_api()
    {
        $student = Student::factory()->create(['school_id' => $this->school->id]);

        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->putJson("/api/school/students/{$student->id}", [
                'admission_no' => $student->admission_no,
                'first_name' => 'Updated',
                'last_name' => 'Name',
                'grade_id' => $student->grade_id,
            ]);

        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Student updated successfully',
        ]);
    }

    /**
     * Test can delete student via API
     */
    public function test_can_delete_student_via_api()
    {
        $student = Student::factory()->create(['school_id' => $this->school->id]);

        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->deleteJson("/api/school/students/{$student->id}");

        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Student deleted successfully',
        ]);
    }

    /**
     * Test unauthenticated user cannot access API
     */
    public function test_unauthenticated_user_cannot_access_api()
    {
        $response = $this->getJson('/api/school/students');

        $response->assertStatus(401);  // ← Unauthorized without token
    }

    /**
     * Test user from different school cannot access student
     */
    public function test_user_from_different_school_cannot_access_student()
    {
        $otherSchool = School::factory()->create();
        $otherAdmin = User::factory()->create(['school_id' => $otherSchool->id]);
        $otherAdmin->assignRole('school-admin');

        $student = Student::factory()->create(['school_id' => $this->school->id]);

        $response = $this->actingAs($otherAdmin, 'sanctum')
            ->getJson("/api/school/students/{$student->id}");

        $response->assertStatus(403);  // ← Forbidden - not 404
    }
}
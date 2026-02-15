<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\Student;
use App\Models\User;
use Tests\TestCase;

class StudentManagementTest extends TestCase
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
     * Test school admin can view students list
     */
    public function test_school_admin_can_view_students_list()
    {
        Student::factory(5)->create(['school_id' => $this->school->id]);

        $response = $this->actingAs($this->schoolAdmin)
            ->get('/school/students');  // FIXED: Correct route

        $response->assertStatus(200);
    }

    /**
     * Test school admin can create student
     */
    public function test_school_admin_can_create_student()
    {
        $response = $this->actingAs($this->schoolAdmin)
            ->post('/school/students', [  // FIXED: Correct route
                'admission_no' => 'ADM001',
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john@test.com',
                'grade' => 'Form 1',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('students', [
            'admission_no' => 'ADM001',
            'first_name' => 'John',
        ]);
    }

    /**
     * Test school admin cannot create duplicate admission number
     */
    public function test_school_admin_cannot_create_duplicate_admission_number()
    {
        Student::create([
            'school_id' => $this->school->id,
            'admission_no' => 'ADM001',
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->schoolAdmin)
            ->post('/school/students', [  // FIXED: Correct route
                'admission_no' => 'ADM001',
                'first_name' => 'John',
                'last_name' => 'Doe',
                'grade' => 'Form 1',
            ]);

        $response->assertSessionHasErrors();
    }

    /**
     * Test school admin can view student details
     */
    public function test_school_admin_can_view_student_details()
    {
        $student = Student::factory()->create(['school_id' => $this->school->id]);

        $response = $this->actingAs($this->schoolAdmin)
            ->get("/school/students/{$student->id}");  // FIXED: Correct route

        $response->assertStatus(200);
    }

    /**
     * Test school admin can edit student
     */
    public function test_school_admin_can_edit_student()
    {
        $student = Student::factory()->create(['school_id' => $this->school->id]);

        $response = $this->actingAs($this->schoolAdmin)
            ->put("/school/students/{$student->id}", [  // FIXED: Correct route
                'admission_no' => $student->admission_no,
                'first_name' => 'Updated',
                'last_name' => 'Name',
                'grade' => 'Form 2',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('students', [
            'id' => $student->id,
            'first_name' => 'Updated',
        ]);
    }

    /**
     * Test school admin can delete student
     */
    public function test_school_admin_can_delete_student()
    {
        $student = Student::factory()->create(['school_id' => $this->school->id]);

        $response = $this->actingAs($this->schoolAdmin)
            ->delete("/school/students/{$student->id}");  // FIXED: Correct route

        $response->assertRedirect();
        $this->assertDatabaseHas('students', [
            'id' => $student->id,
            'is_active' => false,
        ]);
    }

    /**
     * Test school admin from other school cannot access student
     */
    public function test_school_admin_from_other_school_cannot_access_student()
    {
        $otherSchool = School::factory()->create();
        $otherAdmin = User::factory()->create(['school_id' => $otherSchool->id]);
        $otherAdmin->assignRole('school-admin');

        $student = Student::factory()->create(['school_id' => $this->school->id]);

        $response = $this->actingAs($otherAdmin)
            ->get("/school/students/{$student->id}");  // FIXED: Correct route

        $response->assertStatus(404);
    }
}
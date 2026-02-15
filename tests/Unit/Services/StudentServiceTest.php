<?php

namespace Tests\Unit\Services;

use App\Models\School;
use App\Models\Student;
use App\Services\StudentService;
use Tests\TestCase;

class StudentServiceTest extends TestCase
{
    protected StudentService $studentService;
    protected School $school;

    protected function setUp(): void
    {
        parent::setUp();

        $this->studentService = app(StudentService::class);
        $this->school = School::factory()->create();
    }

    /**
     * Test get school students
     */
    public function test_get_school_students()
    {
        Student::factory(5)->create(['school_id' => $this->school->id]);

        $students = $this->studentService->getSchoolStudents($this->school);

        $this->assertCount(5, $students->items());
    }

    /**
     * Test get school students with filters
     */
    public function test_get_school_students_with_filters()
    {
        $student1 = Student::factory()->create([
            'school_id' => $this->school->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);

        Student::factory(4)->create(['school_id' => $this->school->id]);

        $students = $this->studentService->getSchoolStudents(
            $this->school,
            15,
            ['search' => 'John']
        );

        $this->assertCount(1, $students->items());
    }

    /**
     * Test create student
     */
    public function test_create_student()
    {
        $student = $this->studentService->createStudent($this->school, [
            'admission_no' => 'ADM001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@test.com',
        ]);

        $this->assertDatabaseHas('students', [
            'id' => $student->id,
            'admission_no' => 'ADM001',
        ]);
    }

    /**
     * Test cannot create duplicate student
     */
    public function test_cannot_create_duplicate_student()
    {
        $this->studentService->createStudent($this->school, [
            'admission_no' => 'ADM001',
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);

        $this->expectException(\Exception::class);

        $this->studentService->createStudent($this->school, [
            'admission_no' => 'ADM001',
            'first_name' => 'Jane',
            'last_name' => 'Doe',
        ]);
    }

    /**
     * Test update student
     */
    public function test_update_student()
    {
        $student = Student::factory()->create(['school_id' => $this->school->id]);

        $updatedStudent = $this->studentService->updateStudent($student, [
            'first_name' => 'Updated',
            'last_name' => 'Name',
        ]);

        $this->assertEquals('Updated', $updatedStudent->first_name);
    }

    /**
     * Test delete student
     */
    public function test_delete_student()
    {
        $student = Student::factory()->create(['school_id' => $this->school->id]);

        $this->studentService->deleteStudent($student);

        $this->assertFalse($student->fresh()->is_active);
    }
}
<?php

namespace Tests\Api;

use App\Models\Payment;
use App\Models\School;
use App\Models\StudentFee;
use App\Models\Student;
use App\Models\User;
use Tests\TestCase;

class PaymentApiTest extends TestCase
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
     * Test can record payment via API
     */
    public function test_can_record_payment_via_api()
    {
        $student = Student::factory()->create(['school_id' => $this->school->id]);
        $studentFee = StudentFee::factory()->create([
            'student_id' => $student->id,
            'school_id' => $this->school->id,
        ]);

        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->postJson('/api/school/payments', [
                'student_fee_id' => $studentFee->id,
                'amount' => 5000,
                'payment_method' => 'mpesa',
                'reference' => 'TXN123456',
            ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['message', 'data']);
    }

    /**
     * Test can list payments via API
     */
    public function test_can_list_payments_via_api()
    {
        $student = Student::factory()->create(['school_id' => $this->school->id]);
        $studentFee = StudentFee::factory()->create([
            'student_id' => $student->id,
            'school_id' => $this->school->id,
        ]);
        Payment::factory()->create([
            'school_id' => $this->school->id,
            'student_fee_id' => $studentFee->id,
        ]);

        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->getJson('/api/school/payments');

        $response->assertStatus(200);
        $response->assertJsonStructure(['data', 'pagination']);
    }

    /**
     * Test can get payment statistics via API
     */
    public function test_can_get_payment_statistics_via_api()
    {
        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->getJson('/api/school/payments/statistics');

        $response->assertStatus(200);
        $response->assertJsonStructure(['data']);
    }

    /**
     * Test cannot record payment exceeding balance
     */
    public function test_cannot_record_payment_exceeding_balance()
    {
        $student = Student::factory()->create(['school_id' => $this->school->id]);
        $studentFee = StudentFee::factory()->create([
            'student_id' => $student->id,
            'school_id' => $this->school->id,
            'amount_due' => 1000,
            'balance' => 1000,
        ]);

        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->postJson('/api/school/payments', [
                'student_fee_id' => $studentFee->id,
                'amount' => 5000,  // Exceeds balance
                'payment_method' => 'mpesa',
            ]);

        $response->assertStatus(422);
    }

    /**
     * Test cannot record zero or negative payment
     */
    public function test_cannot_record_zero_or_negative_payment()
    {
        $student = Student::factory()->create(['school_id' => $this->school->id]);
        $studentFee = StudentFee::factory()->create([
            'student_id' => $student->id,
            'school_id' => $this->school->id,
        ]);

        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->postJson('/api/school/payments', [
                'student_fee_id' => $studentFee->id,
                'amount' => 0,  // Zero amount
                'payment_method' => 'mpesa',
            ]);

        $response->assertStatus(422);
    }
}
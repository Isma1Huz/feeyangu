<?php

namespace Tests\Api;

use App\Models\School;
use App\Models\Payment;
use App\Models\StudentFee;
use App\Models\Student;
use App\Models\FeeStructure;
use App\Models\Grade;
use App\Models\Term;
use App\Models\User;
use Tests\TestCase;

class PaymentApiTest extends TestCase
{
    protected School $school;
    protected User $schoolAdmin;
    protected StudentFee $studentFee;

    protected function setUp(): void
    {
        parent::setUp();

        $this->school = School::factory()->create();
        $this->schoolAdmin = User::factory()->create(['school_id' => $this->school->id]);
        $this->schoolAdmin->assignRole('school-admin');

        $grade = Grade::factory()->create(['school_id' => $this->school->id]);
        $term = Term::factory()->create(['school_id' => $this->school->id]);
        $student = Student::factory()->create(['school_id' => $this->school->id, 'grade_id' => $grade->id]);
        $feeStructure = FeeStructure::factory()->create([
            'school_id' => $this->school->id,
            'grade_id' => $grade->id,
            'term_id' => $term->id,
            'total_amount' => 10000,
        ]);

        $this->studentFee = StudentFee::create([
            'student_id' => $student->id,
            'fee_structure_id' => $feeStructure->id,
            'amount_due' => 10000,
            'amount_paid' => 0,
            'balance' => 10000,
            'status' => 'unpaid',
        ]);
    }

    /**
     * Test can record payment via API
     */
    public function test_can_record_payment_via_api()
    {
        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->postJson('/api/school/payments', [
                'student_fee_id' => $this->studentFee->id,
                'amount' => 5000,
                'payment_method' => 'mpesa',
                'reference' => 'TXN123456',
            ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
            'data' => [
                'id',
                'amount',
                'payment_method',
                'payment_status',
            ],
        ]);

        $this->assertDatabaseHas('payments', [
            'student_fee_id' => $this->studentFee->id,
            'amount' => 5000,
        ]);
    }

    /**
     * Test can list payments via API
     */
    public function test_can_list_payments_via_api()
    {
        Payment::factory(5)->create(['school_id' => $this->school->id]);

        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->getJson('/api/school/payments');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data',
            'pagination',
        ]);
    }

    /**
     * Test can get payment statistics via API
     */
    public function test_can_get_payment_statistics_via_api()
    {
        Payment::factory(3)->create([
            'school_id' => $this->school->id,
            'payment_status' => 'completed',
        ]);

        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->getJson('/api/school/payments/statistics');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'total_payments',
                'total_amount',
                'average_payment',
                'method_breakdown',
                'status_breakdown',
            ],
        ]);
    }

    /**
     * Test cannot record payment exceeding balance
     */
    public function test_cannot_record_payment_exceeding_balance()
    {
        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->postJson('/api/school/payments', [
                'student_fee_id' => $this->studentFee->id,
                'amount' => 15000,
                'payment_method' => 'mpesa',
            ]);

        $response->assertStatus(422);
    }

    /**
     * Test cannot record zero or negative payment
     */
    public function test_cannot_record_zero_or_negative_payment()
    {
        $response = $this->actingAs($this->schoolAdmin, 'sanctum')
            ->postJson('/api/school/payments', [
                'student_fee_id' => $this->studentFee->id,
                'amount' => 0,
                'payment_method' => 'mpesa',
            ]);

        $response->assertStatus(422);
    }
}
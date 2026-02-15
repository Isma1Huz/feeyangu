<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\School;
use App\Models\Grade;
use App\Models\Term;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\FeeStructure;
use App\Models\StudentFee;
use App\Models\Payment;
use App\Models\SchoolPaymentMethod;
use App\Models\Receipt;
use App\Models\ReceiptTemplate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    private array $teachers = [];
    private array $parents = [];
    private array $students = [];
    private array $grades = [];
    private array $terms = [];
    private array $classes = [];
    private School $school;

    public function run(): void
    {
        // Disable foreign key checks for seeding
        DB::statement('PRAGMA foreign_keys=OFF;');

        try {
            $this->createSuperAdmin();
            $this->createSchoolAndAdmin();
            $this->createTeachers();
            $this->createGrades();
            $this->createTerms();
            $this->createClasses();
            $this->createParents();
            $this->createStudents();
            $this->createReceiptTemplate();
            $this->createFeeStructures();
            $this->assignFeesToStudents();
            $this->createPaymentMethods();
            $this->createPaymentsAndReceipts();

            echo "\n✅ Database seeded successfully!\n";
            echo "========================================\n";
            echo "Test Credentials:\n";
            echo "========================================\n";
            echo "Super Admin: admin@feeyangu.com / password123\n";
            echo "School Admin: school@example.com / password123\n";
            echo "Parent: alice.johnson@email.com / password123\n";
            echo "Teacher: mary@stmary.edu / password123\n";
            echo "========================================\n";
            echo "\nData Created:\n";
            echo "- 1 Super Admin\n";
            echo "- 1 School Admin\n";
            echo "- 1 School\n";
            echo "- 4 Teachers\n";
            echo "- 3 Grades\n";
            echo "- 12 Classes\n";
            echo "- 5 Parents\n";
            echo "- 96 Students\n";
            echo "- 3 Terms\n";
            echo "- 9 Fee Structures\n";
            echo "- 288 Student Fees\n";
            echo "- ~144 Payments\n";
            echo "- ~144 Receipts\n";
            echo "========================================\n\n";
        } finally {
            // Re-enable foreign key checks
            DB::statement('PRAGMA foreign_keys=ON;');
        }
    }

    private function createSuperAdmin(): void
    {
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@feeyangu.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password123'),
                'phone' => '+254 (712) 900-0000',
                'email_verified_at' => now(),
                'is_active' => true,
                'school_id' => null,
            ]
        );
        $superAdmin->assignRole('super-admin');
    }

    private function createSchoolAndAdmin(): void
    {
        $schoolAdmin = User::firstOrCreate(
            ['email' => 'school@example.com'],
            [
                'name' => 'John Smith',
                'password' => Hash::make('password123'),
                'phone' => '+254 (712) 123-4567',
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );
        $schoolAdmin->assignRole('school-admin');

        $this->school = School::firstOrCreate(
            ['email' => 'info@stmary.edu'],
            [
                'name' => "Saint Mary's Secondary School",
                'address' => '123 Education Lane, City Center',
                'phone' => '+254 (712) 987-6543',
                'owner_id' => $schoolAdmin->id,
                'subscription_status' => 'active',
                'is_active' => true,
            ]
        );

        $schoolAdmin->update(['school_id' => $this->school->id]);
    }

    private function createTeachers(): void
    {
        $teacherData = [
            ['name' => 'Mary Johnson', 'email' => 'mary@stmary.edu', 'phone' => '+254 (712) 111-0001'],
            ['name' => 'David Brown', 'email' => 'david@stmary.edu', 'phone' => '+254 (712) 111-0002'],
            ['name' => 'Sarah Williams', 'email' => 'sarah@stmary.edu', 'phone' => '+254 (712) 111-0003'],
            ['name' => 'James Davis', 'email' => 'james@stmary.edu', 'phone' => '+254 (712) 111-0004'],
        ];

        foreach ($teacherData as $data) {
            $teacher = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('password123'),
                    'phone' => $data['phone'],
                    'school_id' => $this->school->id,
                    'email_verified_at' => now(),
                    'is_active' => true,
                ]
            );
            $teacher->assignRole('teacher');
            $this->teachers[] = $teacher;
        }
    }

    private function createGrades(): void
    {
        $gradeData = [
            ['name' => 'Grade 10', 'code' => 'G10', 'level' => 10],
            ['name' => 'Grade 11', 'code' => 'G11', 'level' => 11],
            ['name' => 'Grade 12', 'code' => 'G12', 'level' => 12],
        ];

        foreach ($gradeData as $data) {
            $grade = Grade::firstOrCreate(
                ['school_id' => $this->school->id, 'code' => $data['code']],
                [
                    'name' => $data['name'],
                    'level' => $data['level'],
                    'description' => "Academic year {$data['name']}",
                    'is_active' => true,
                ]
            );
            $this->grades[] = $grade;
        }
    }

    private function createTerms(): void
    {
        $currentYear = now()->year;
        $termData = [
            ['name' => 'Term 1', 'number' => 1, 'start' => "$currentYear-01-15", 'end' => "$currentYear-04-15"],
            ['name' => 'Term 2', 'number' => 2, 'start' => "$currentYear-05-01", 'end' => "$currentYear-08-15"],
            ['name' => 'Term 3', 'number' => 3, 'start' => "$currentYear-09-01", 'end' => "$currentYear-12-15"],
        ];

        foreach ($termData as $data) {
            $term = Term::firstOrCreate(
                ['school_id' => $this->school->id, 'name' => $data['name'], 'year' => $currentYear],
                [
                    'term_number' => $data['number'],
                    'start_date' => $data['start'],
                    'end_date' => $data['end'],
                    'is_active' => $data['number'] == 1,
                ]
            );
            $this->terms[] = $term;
        }
    }

    private function createClasses(): void
    {
        $classNames = ['A', 'B', 'C', 'D'];

        foreach ($this->grades as $gradeIndex => $grade) {
            foreach ($classNames as $classIndex => $className) {
                $class = SchoolClass::create([
                    'school_id' => $this->school->id,
                    'grade_id' => $grade->id,
                    'name' => $className,
                    'class_teacher_id' => $this->teachers[$classIndex % count($this->teachers)]->id,
                    'capacity' => 40,
                    'description' => "{$grade->name} Class {$className}",
                    'is_active' => true,
                ]);
                $this->classes[] = $class;
            }
        }
    }

    private function createParents(): void
    {
        $parentData = [
            ['name' => 'Alice Johnson', 'email' => 'alice.johnson@email.com', 'phone' => '+254 (712) 222-0001'],
            ['name' => 'Bob Wilson', 'email' => 'bob.wilson@email.com', 'phone' => '+254 (712) 222-0002'],
            ['name' => 'Carol Davis', 'email' => 'carol.davis@email.com', 'phone' => '+254 (712) 222-0003'],
            ['name' => 'Diana Martinez', 'email' => 'diana.martinez@email.com', 'phone' => '+254 (712) 222-0004'],
            ['name' => 'Eve Anderson', 'email' => 'eve.anderson@email.com', 'phone' => '+254 (712) 222-0005'],
        ];

        foreach ($parentData as $data) {
            $parent = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'phone' => $data['phone'],
                    'password' => Hash::make('password123'),
                    'email_verified_at' => now(),
                    'is_active' => true,
                    'school_id' => null,
                ]
            );
            $parent->assignRole('parent');
            $this->parents[] = $parent;
        }
    }

    private function createStudents(): void
    {
        $studentFirstNames = ['John', 'Emma', 'Michael', 'Sarah', 'David', 'Jessica', 'Daniel', 'Lauren'];
        $studentLastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];

        $admissionCounter = 1001;

        foreach ($this->classes as $class) {
            for ($i = 0; $i < 8; $i++) {
                $firstName = $studentFirstNames[array_rand($studentFirstNames)];
                $lastName = $studentLastNames[array_rand($studentLastNames)];
                $parentIndex = ($admissionCounter - 1001) % count($this->parents);

                $student = Student::create([
                    'school_id' => $this->school->id,
                    'grade_id' => $class->grade_id,
                    'class_id' => $class->id,
                    'parent_id' => $this->parents[$parentIndex]->id,
                    'admission_no' => 'STM' . $admissionCounter,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => strtolower($firstName . '.' . $lastName . '@student.stmary.edu'),
                    'date_of_birth' => $this->randomDate('2005-01-01', '2010-12-31'),
                    'is_active' => true,
                ]);
                $this->students[] = $student;
                $admissionCounter++;
            }
        }
    }

    private function createReceiptTemplate(): void
    {
        $defaultHTML = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .container { width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
        .school-name { font-size: 20px; font-weight: bold; }
        .school-details { margin-top: 5px; font-size: 11px; }
        .receipt-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
        .receipt-number { text-align: right; margin-bottom: 20px; font-size: 11px; }
        .info-section { margin-bottom: 20px; }
        .info-row { display: flex; margin-bottom: 8px; }
        .info-label { width: 150px; font-weight: bold; }
        .info-value { flex: 1; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table th { background-color: #f5f5f5; padding: 10px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold; }
        .table td { padding: 10px; border-bottom: 1px solid #ddd; }
        .total-section { text-align: right; margin-bottom: 20px; }
        .total-row { font-size: 14px; font-weight: bold; margin-bottom: 10px; }
        .footer { text-align: center; border-top: 2px solid #000; padding-top: 15px; margin-top: 30px; font-size: 11px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="school-name">{{SCHOOL_NAME}}</div>
            <div class="school-details">
                <div>{{SCHOOL_ADDRESS}}</div>
                <div>Phone: {{SCHOOL_PHONE}} | Email: {{SCHOOL_EMAIL}}</div>
            </div>
        </div>

        <div class="receipt-title">PAYMENT RECEIPT</div>
        <div class="receipt-number">Receipt #: {{RECEIPT_NUMBER}}</div>

        <div class="info-section">
            <div class="info-row">
                <div class="info-label">Date:</div>
                <div class="info-value">{{PAYMENT_DATE}}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Student Name:</div>
                <div class="info-value">{{STUDENT_NAME}}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Admission No:</div>
                <div class="info-value">{{ADMISSION_NO}}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Grade:</div>
                <div class="info-value">{{GRADE}}</div>
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Payment Received</td>
                    <td style="text-align: right;">KSH {{AMOUNT_PAID}}</td>
                </tr>
                <tr>
                    <td style="text-align: right; font-weight: bold;">Total Payment:</td>
                    <td style="text-align: right; font-weight: bold;">KSH {{AMOUNT_PAID}}</td>
                </tr>
            </tbody>
        </table>

        <div class="total-section">
            <div class="total-row">Amount Paid: KSH {{AMOUNT_PAID}}</div>
        </div>

        <div class="footer">
            <p>Thank you for your payment. Please keep this receipt for your records.</p>
            <p style="margin-top: 10px;">© 2024 {{SCHOOL_NAME}}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
HTML;

        ReceiptTemplate::firstOrCreate(
            ['school_id' => $this->school->id, 'name' => 'Default Receipt'],
            [
                'template_html' => $defaultHTML,
                'description' => 'Default receipt template',
                'is_default' => true,
                'is_active' => true,
            ]
        );
    }

    private function createFeeStructures(): void
    {
        $breakdowns = [
            ['item_name' => 'Tuition Fee', 'amount' => 50000],
            ['item_name' => 'Laboratory Fee', 'amount' => 5000],
            ['item_name' => 'Sports Fee', 'amount' => 3000],
            ['item_name' => 'Examination Fee', 'amount' => 2000],
        ];

        $totalAmount = array_sum(array_column($breakdowns, 'amount'));

        foreach ($this->grades as $grade) {
            foreach ($this->terms as $term) {
                FeeStructure::create([
                    'school_id' => $this->school->id,
                    'grade_id' => $grade->id,
                    'term_id' => $term->id,
                    'total_amount' => $totalAmount,
                    'due_date' => now()->addDays(30)->format('Y-m-d'),
                    'is_active' => true,
                ]);
            }
        }
    }

    private function assignFeesToStudents(): void
    {
        $feeStructures = FeeStructure::all();

        foreach ($this->students as $student) {
            foreach ($feeStructures as $feeStructure) {
                if ($feeStructure->grade_id == $student->grade_id) {
                    StudentFee::create([
                        'student_id' => $student->id,
                        'fee_structure_id' => $feeStructure->id,
                        'amount_due' => $feeStructure->total_amount,
                        'amount_paid' => 0,
                        'balance' => $feeStructure->total_amount,
                        'status' => 'unpaid',
                        'due_date' => $feeStructure->due_date,
                        'is_overdue' => false,
                    ]);
                }
            }
        }
    }

    private function createPaymentMethods(): void
    {
        $paymentMethods = [
            [
                'method_name' => 'M-Pesa',
                'method_type' => 'mpesa',
                'mpesa_number' => '0712345678',
                'is_active' => true,
                'display_order' => 1,
            ],
            [
                'method_name' => 'Bank Transfer',
                'method_type' => 'bank_transfer',
                'bank_name' => 'Kenya Commercial Bank',
                'account_holder_name' => "Saint Mary's Secondary School",
                'account_number' => '1234567890',
                'branch_code' => 'KCB-NAIROBI',
                'is_active' => true,
                'display_order' => 2,
            ],
            [
                'method_name' => 'Cash Payment',
                'method_type' => 'cash',
                'account_holder_name' => 'School Office',
                'is_active' => true,
                'display_order' => 3,
            ],
        ];

        foreach ($paymentMethods as $method) {
            SchoolPaymentMethod::create(
                array_merge(['school_id' => $this->school->id], $method)
            );
        }
    }

    private function createPaymentsAndReceipts(): void
    {
        $template = ReceiptTemplate::where('school_id', $this->school->id)->first();
        $paidStudents = array_slice($this->students, 0, (int)(count($this->students) * 0.5));

        foreach ($paidStudents as $student) {
            $studentFees = StudentFee::where('student_id', $student->id)->get();

            foreach ($studentFees as $fee) {
                $amountPaid = (int)($fee->amount_due * 0.8);

                $payment = Payment::create([
                    'school_id' => $this->school->id,
                    'student_fee_id' => $fee->id,
                    'amount' => $amountPaid,
                    'payment_method' => 'mpesa',
                    'payment_status' => 'completed',
                    'reference' => 'MPY' . strtoupper(uniqid()),
                    'paid_at' => now()->subDays(random_int(1, 30)),
                ]);

                $receiptHtml = $this->generateReceiptHTML($student, $payment);

                Receipt::create([
                    'school_id' => $this->school->id,
                    'student_id' => $student->id,
                    'payment_id' => $payment->id,
                    'receipt_template_id' => $template?->id,
                    'receipt_number' => 'RCP-' . strtoupper(uniqid()),
                    'receipt_html' => $receiptHtml,
                    'generated_at' => now(),
                ]);

                $fee->update([
                    'amount_paid' => $amountPaid,
                    'balance' => $fee->amount_due - $amountPaid,
                    'status' => 'partially_paid',
                ]);
            }
        }

        // Create some pending payments
        $pendingStudents = array_slice($paidStudents, 0, 3);

        foreach ($pendingStudents as $student) {
            $studentFees = StudentFee::where('student_id', $student->id)
                ->where('status', 'partially_paid')
                ->first();

            if ($studentFees) {
                Payment::create([
                    'school_id' => $this->school->id,
                    'student_fee_id' => $studentFees->id,
                    'amount' => $studentFees->balance,
                    'payment_method' => 'bank_transfer',
                    'payment_status' => 'pending',
                    'reference' => 'BTX' . strtoupper(uniqid()),
                    'created_at' => now()->subDays(5),
                ]);
            }
        }
    }

    private function randomDate($startDate, $endDate)
    {
        $timestamp = random_int(
            strtotime($startDate),
            strtotime($endDate)
        );

        return date('Y-m-d', $timestamp);
    }

    private function generateReceiptHTML($student, $payment): string
    {
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <style>
        * { margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .container { width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
        .school-name { font-size: 20px; font-weight: bold; }
        .school-details { margin-top: 5px; font-size: 11px; }
        .receipt-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
        .receipt-number { text-align: right; margin-bottom: 20px; font-size: 11px; }
        .info-section { margin-bottom: 20px; }
        .info-row { display: flex; margin-bottom: 8px; }
        .info-label { width: 150px; font-weight: bold; }
        .info-value { flex: 1; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table th { background-color: #f5f5f5; padding: 10px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold; }
        .table td { padding: 10px; border-bottom: 1px solid #ddd; }
        .total-section { text-align: right; margin-bottom: 20px; }
        .total-row { font-size: 14px; font-weight: bold; margin-bottom: 10px; }
        .footer { text-align: center; border-top: 2px solid #000; padding-top: 15px; margin-top: 30px; font-size: 11px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="school-name">{$this->school->name}</div>
            <div class="school-details">
                <div>{$this->school->address}</div>
                <div>Phone: {$this->school->phone} | Email: {$this->school->email}</div>
            </div>
        </div>

        <div class="receipt-title">PAYMENT RECEIPT</div>
        <div class="receipt-number">Receipt #: RCP-{$payment->id}</div>

        <div class="info-section">
            <div class="info-row">
                <div class="info-label">Date:</div>
                <div class="info-value">{$payment->paid_at->format('M d, Y')}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Student Name:</div>
                <div class="info-value">{$student->full_name}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Admission No:</div>
                <div class="info-value">{$student->admission_no}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Grade:</div>
                <div class="info-value">{$student->grade->name}</div>
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Payment Received</td>
                    <td style="text-align: right;">KSH {$payment->amount}</td>
                </tr>
                <tr>
                    <td style="text-align: right; font-weight: bold;">Total Payment:</td>
                    <td style="text-align: right; font-weight: bold;">KSH {$payment->amount}</td>
                </tr>
            </tbody>
        </table>

        <div class="total-section">
            <div class="total-row">Amount Paid: KSH {$payment->amount}</div>
        </div>

        <div class="footer">
            <p>Thank you for your payment. Please keep this receipt for your records.</p>
            <p style="margin-top: 10px;">© 2024 {$this->school->name}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
HTML;
    }
}
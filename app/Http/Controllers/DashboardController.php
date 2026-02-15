<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\Payment;
use App\Models\StudentFee;
use App\Models\User;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth');
    }

    /**
     * Super Admin Dashboard
     */
    public function superAdminDashboard(): Response
    {
        // $this->authorize('view schools');

        // Key Metrics
        $totalSchools = School::where('is_active', true)->count();
        $totalStudents = Student::count();
        $totalParents = User::whereHas('roles', function ($q) {
            $q->where('name', 'parent');
        })->count();
        
        // Financial Metrics
        $totalFeesAssigned = StudentFee::sum('amount_due');
        $totalFeesCollected = Payment::where('payment_status', 'completed')->sum('amount');
        $totalFeesPending = StudentFee::whereIn('status', ['unpaid', 'partially_paid', 'overdue'])->sum('balance');
        
        // Collection Rate
        $collectionRate = $totalFeesAssigned > 0 
            ? round(($totalFeesCollected / $totalFeesAssigned) * 100, 2) 
            : 0;

        // Recent Schools
        $recentSchools = School::orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($school) {
                return [
                    'id' => $school->id,
                    'name' => $school->name,
                    'students' => $school->students()->count(),
                    'fees_collected' => Payment::where('school_id', $school->id)
                        ->where('payment_status', 'completed')
                        ->sum('amount'),
                    'status' => $school->subscription_status,
                    'created_at' => $school->created_at->format('M d, Y'),
                ];
            });

        // Top Schools by Collection
        $topSchools = School::where('is_active', true)
            ->get()
            ->map(function ($school) {
                $collected = Payment::where('school_id', $school->id)
                    ->where('payment_status', 'completed')
                    ->sum('amount');
                
                return [
                    'id' => $school->id,
                    'name' => $school->name,
                    'collected' => $collected,
                    'students' => $school->students()->count(),
                ];
            })
            ->sortByDesc('collected')
            ->take(10)
            ->values();

        // Payment Methods Breakdown
        $paymentMethodStats = Payment::where('payment_status', 'completed')
            ->selectRaw('payment_method, COUNT(*) as count, SUM(amount) as total')
            ->groupBy('payment_method')
            ->get()
            ->map(function ($item) {
                return [
                    'method' => $item->payment_method,
                    'count' => $item->count,
                    'total' => (float) $item->total,
                ];
            });

        // Fee Status Breakdown
        $feeStatusStats = StudentFee::selectRaw('status, COUNT(*) as count, SUM(amount_due) as total')
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => $item->status,
                    'count' => $item->count,
                    'total' => (float) $item->total,
                ];
            });

        // Monthly Trend (Last 12 months)
        $monthlyTrend = collect(range(11, 0))->map(function ($monthsAgo) {
            $date = now()->subMonths($monthsAgo);
            
            $collected = Payment::where('payment_status', 'completed')
                ->whereYear('paid_at', $date->year)
                ->whereMonth('paid_at', $date->month)
                ->sum('amount');

            return [
                'month' => $date->format('M Y'),
                'collected' => (float) $collected,
            ];
        });

        // Overdue Fees
        $overdueCount = StudentFee::where('is_overdue', true)->count();
        $overdueAmount = StudentFee::where('is_overdue', true)->sum('balance');

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'total_schools' => $totalSchools,
                'total_students' => $totalStudents,
                'total_parents' => $totalParents,
                'total_fees_assigned' => (float) $totalFeesAssigned,
                'total_fees_collected' => (float) $totalFeesCollected,
                'total_fees_pending' => (float) $totalFeesPending,
                'collection_rate' => $collectionRate,
                'overdue_count' => $overdueCount,
                'overdue_amount' => (float) $overdueAmount,
            ],
            'recent_schools' => $recentSchools,
            'top_schools' => $topSchools,
            'payment_method_stats' => $paymentMethodStats,
            'fee_status_stats' => $feeStatusStats,
            'monthly_trend' => $monthlyTrend,
        ]);
    }

    /**
     * School Admin Dashboard
     */
    public function schoolAdminDashboard(): Response
    {
        $this->authorize('manage students');

        $user = Auth::user();
        $school = $user->school;

        if (!$school) {
            abort(403, 'School not assigned');
        }

        // School Metrics
        $totalStudents = $school->students()->count();
        $totalParents = User::whereHas('students', function ($q) use ($school) {
            $q->where('school_id', $school->id);
        })->distinct('id')->count();

        // Financial Metrics
        $totalFeesAssigned = StudentFee::whereHas('student', function ($q) use ($school) {
            $q->where('school_id', $school->id);
        })->sum('amount_due');

        $totalFeesCollected = Payment::where('school_id', $school->id)
            ->where('payment_status', 'completed')
            ->sum('amount');

        $totalFeesPending = StudentFee::whereHas('student', function ($q) use ($school) {
            $q->where('school_id', $school->id);
        })->whereIn('status', ['unpaid', 'partially_paid', 'overdue'])->sum('balance');

        $collectionRate = $totalFeesAssigned > 0 
            ? round(($totalFeesCollected / $totalFeesAssigned) * 100, 2) 
            : 0;

        // Fee Structure Breakdown
        $feeStructures = $school->feeStructures()
            ->with(['studentFees'])
            ->get()
            ->map(function ($fee) {
                $assigned = $fee->studentFees()->count();
                $collected = Payment::whereHas('studentFee', function ($q) use ($fee) {
                    $q->where('fee_structure_id', $fee->id);
                })
                ->where('payment_status', 'completed')
                ->sum('amount');

                return [
                    'id' => $fee->id,
                    'grade' => $fee->grade,
                    'term' => $fee->term,
                    'amount' => (float) $fee->total_amount,
                    'assigned' => $assigned,
                    'collected' => (float) $collected,
                    'collection_rate' => $assigned > 0 
                        ? round(($collected / ($fee->total_amount * $assigned)) * 100, 2) 
                        : 0,
                ];
            });

        // Payment Methods
        $paymentMethods = $school->paymentMethods()
            ->where('is_active', true)
            ->get()
            ->map(function ($method) use ($school) {
                $count = Payment::where('school_id', $school->id)
                    ->where('payment_method', $method->method_type)
                    ->where('payment_status', 'completed')
                    ->count();

                $total = Payment::where('school_id', $school->id)
                    ->where('payment_method', $method->method_type)
                    ->where('payment_status', 'completed')
                    ->sum('amount');

                return [
                    'type' => $method->method_type,
                    'display_name' => $this->getPaymentMethodName($method->method_type),
                    'count' => $count,
                    'total' => (float) $total,
                ];
            });

        // Recent Payments
        $recentPayments = Payment::where('school_id', $school->id)
            ->where('payment_status', 'completed')
            ->orderBy('paid_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'student' => $payment->studentFee->student->full_name,
                    'admission_no' => $payment->studentFee->student->admission_no,
                    'amount' => (float) $payment->amount,
                    'method' => $payment->payment_method,
                    'date' => $payment->paid_at->format('M d, Y H:i'),
                ];
            });

        // Top Paying Students
        $topStudents = Student::where('school_id', $school->id)
            ->get()
            ->map(function ($student) {
                $paid = Payment::whereHas('studentFee', function ($q) use ($student) {
                    $q->where('student_id', $student->id);
                })
                ->where('payment_status', 'completed')
                ->sum('amount');

                return [
                    'id' => $student->id,
                    'name' => $student->full_name,
                    'admission_no' => $student->admission_no,
                    'paid' => (float) $paid,
                ];
            })
            ->sortByDesc('paid')
            ->take(10)
            ->values();

        // Overdue Students
        $overdueStudents = StudentFee::whereHas('student', function ($q) use ($school) {
            $q->where('school_id', $school->id);
        })
        ->where('is_overdue', true)
        ->get()
        ->groupBy('student_id')
        ->map(function ($fees, $studentId) {
            $student = Student::find($studentId);
            $totalOverdue = $fees->sum('balance');

            return [
                'id' => $student->id,
                'name' => $student->full_name,
                'admission_no' => $student->admission_no,
                'total_overdue' => (float) $totalOverdue,
                'overdue_count' => $fees->count(),
            ];
        })
        ->values()
        ->take(10);

        // Monthly Trend
        $monthlyTrend = collect(range(11, 0))->map(function ($monthsAgo) use ($school) {
            $date = now()->subMonths($monthsAgo);
            
            $collected = Payment::where('school_id', $school->id)
                ->where('payment_status', 'completed')
                ->whereYear('paid_at', $date->year)
                ->whereMonth('paid_at', $date->month)
                ->sum('amount');

            return [
                'month' => $date->format('M'),
                'collected' => (float) $collected,
            ];
        });

        // Grade Breakdown
        $gradeBreakdown = Student::where('school_id', $school->id)
            ->selectRaw('grade, COUNT(*) as count')
            ->groupBy('grade')
            ->get()
            ->map(function ($item) use ($school) {
                $paid = Payment::whereHas('studentFee.student', function ($q) use ($school, $item) {
                    $q->where('school_id', $school->id)->where('grade', $item->grade);
                })
                ->where('payment_status', 'completed')
                ->sum('amount');

                $assigned = StudentFee::whereHas('student', function ($q) use ($school, $item) {
                    $q->where('school_id', $school->id)->where('grade', $item->grade);
                })
                ->sum('amount_due');

                return [
                    'grade' => $item->grade,
                    'students' => $item->count,
                    'collected' => (float) $paid,
                    'assigned' => (float) $assigned,
                ];
            });

        // Pending Payments
        $pendingPayments = Payment::where('school_id', $school->id)
            ->where('payment_status', 'pending')
            ->count();

        return Inertia::render('School/Dashboard', [
            'school' => $school,
            'metrics' => [
                'total_students' => $totalStudents,
                'total_parents' => $totalParents,
                'total_fees_assigned' => (float) $totalFeesAssigned,
                'total_fees_collected' => (float) $totalFeesCollected,
                'total_fees_pending' => (float) $totalFeesPending,
                'collection_rate' => $collectionRate,
                'pending_payments' => $pendingPayments,
            ],
            'fee_structures' => $feeStructures,
            'payment_methods' => $paymentMethods,
            'recent_payments' => $recentPayments,
            'top_students' => $topStudents,
            'overdue_students' => $overdueStudents,
            'monthly_trend' => $monthlyTrend,
            'grade_breakdown' => $gradeBreakdown,
        ]);
    }

    /**
     * Parent Dashboard
     */
    public function parentDashboard(): Response
    {
        $this->authorize('view own students');

        $user = Auth::user();
        $students = $user->students()->get();

        if ($students->isEmpty()) {
            return Inertia::render('Parent/Dashboard', [
                'students' => [],
                'summary' => null,
            ]);
        }

        // Summary across all student fees
        $totalFeesAssigned = StudentFee::whereIn('student_id', $students->pluck('id'))->sum('amount_due');
        $totalFeesPaid = StudentFee::whereIn('student_id', $students->pluck('id'))->sum('amount_paid');
        $totalFeesBalance = StudentFee::whereIn('student_id', $students->pluck('id'))->sum('balance');

        $unpaidCount = StudentFee::whereIn('student_id', $students->pluck('id'))
            ->where('status', 'unpaid')
            ->count();

        $overdueCount = StudentFee::whereIn('student_id', $students->pluck('id'))
            ->where('is_overdue', true)
            ->count();

        // Student Details with Fees
        $studentsWithFees = $students->map(function ($student) {
            $totalDue = StudentFee::where('student_id', $student->id)->sum('amount_due');
            $totalPaid = StudentFee::where('student_id', $student->id)->sum('amount_paid');
            $balance = $totalDue - $totalPaid;
            $unpaid = StudentFee::where('student_id', $student->id)
                ->whereIn('status', ['unpaid', 'partially_paid', 'overdue'])
                ->count();

            return [
                'id' => $student->id,
                'name' => $student->full_name,
                'admission_no' => $student->admission_no,
                'grade' => $student->grade,
                'school' => [
                    'id' => $student->school->id,
                    'name' => $student->school->name,
                    'logo' => $student->school->logo_path,
                ],
                'fees' => [
                    'total_due' => (float) $totalDue,
                    'total_paid' => (float) $totalPaid,
                    'balance' => (float) $balance,
                    'unpaid_count' => $unpaid,
                    'completion_rate' => $totalDue > 0 ? round(($totalPaid / $totalDue) * 100, 2) : 0,
                ],
            ];
        });

        // Recent Payments
        $recentPayments = Payment::whereHas('studentFee.student', function ($q) use ($students) {
            $q->whereIn('id', $students->pluck('id'));
        })
        ->where('payment_status', 'completed')
        ->orderBy('paid_at', 'desc')
        ->take(10)
        ->get()
        ->map(function ($payment) {
            return [
                'id' => $payment->id,
                'student' => $payment->studentFee->student->full_name,
                'amount' => (float) $payment->amount,
                'method' => $payment->payment_method,
                'reference' => $payment->reference,
                'date' => $payment->paid_at->format('M d, Y'),
                'receipt_id' => $payment->receipt_id,
            ];
        });

        // Pending Fees by Student
        $pendingFees = $students->map(function ($student) {
            $fees = StudentFee::where('student_id', $student->id)
                ->whereIn('status', ['unpaid', 'partially_paid', 'overdue'])
                ->get()
                ->map(function ($fee) {
                    return [
                        'id' => $fee->id,
                        'grade' => $fee->feeStructure->grade,
                        'term' => $fee->feeStructure->term,
                        'amount_due' => (float) $fee->amount_due,
                        'amount_paid' => (float) $fee->amount_paid,
                        'balance' => (float) $fee->balance,
                        'status' => $fee->status,
                        'due_date' => $fee->due_date?->format('M d, Y'),
                        'is_overdue' => $fee->is_overdue,
                    ];
                });

            return [
                'student_id' => $student->id,
                'student_name' => $student->full_name,
                'fees' => $fees,
            ];
        })->filter(function ($item) {
            return !$item['fees']->isEmpty();
        })->values();

        return Inertia::render('Parent/Dashboard', [
            'students' => $studentsWithFees,
            'summary' => [
                'total_fees_assigned' => (float) $totalFeesAssigned,
                'total_fees_paid' => (float) $totalFeesPaid,
                'total_fees_balance' => (float) $totalFeesBalance,
                'unpaid_count' => $unpaidCount,
                'overdue_count' => $overdueCount,
                'payment_completion_rate' => $totalFeesAssigned > 0 
                    ? round(($totalFeesPaid / $totalFeesAssigned) * 100, 2) 
                    : 0,
            ],
            'recent_payments' => $recentPayments,
            'pending_fees' => $pendingFees,
        ]);
    }

    /**
     * Get payment method display name
     */
    private function getPaymentMethodName(string $method): string
    {
        $methods = [
            'mpesa' => 'M-Pesa',
            'bank_transfer' => 'Bank Transfer',
            'bank_check' => 'Check',
            'cash' => 'Cash',
            'card' => 'Card',
            'paypal' => 'PayPal',
        ];

        return $methods[$method] ?? ucfirst($method);
    }
}
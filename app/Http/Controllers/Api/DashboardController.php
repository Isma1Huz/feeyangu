<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\Payment;
use App\Models\StudentFee;
use App\Models\User;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __construct()
    {
    }

    /**
     * Super Admin Dashboard Data
     */
    public function superAdminDashboard(): JsonResponse
    {
        $this->authorize('view schools');

        $totalSchools = School::where('is_active', true)->count();
        $totalStudents = Student::count();
        $totalParents = User::whereHas('roles', function ($q) {
            $q->where('name', 'parent');
        })->count();

        $totalFeesAssigned = StudentFee::sum('amount_due');
        $totalFeesCollected = Payment::where('payment_status', 'completed')->sum('amount');
        $totalFeesPending = StudentFee::whereIn('status', ['unpaid', 'partially_paid', 'overdue'])->sum('balance');

        $collectionRate = $totalFeesAssigned > 0 
            ? round(($totalFeesCollected / $totalFeesAssigned) * 100, 2) 
            : 0;

        $overdueCount = StudentFee::where('is_overdue', true)->count();
        $overdueAmount = StudentFee::where('is_overdue', true)->sum('balance');

        return response()->json([
            'data' => [
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
            ],
        ]);
    }

    /**
     * School Admin Dashboard Data
     */
    public function schoolAdminDashboard(): JsonResponse
    {
        $this->authorize('manage students');

        $user = Auth::user();
        $school = $user->school;

        if (!$school) {
            return response()->json(['message' => 'School not assigned'], 403);
        }

        $totalStudents = $school->students()->count();
        $totalParents = User::whereHas('students', function ($q) use ($school) {
            $q->where('school_id', $school->id);
        })->distinct('id')->count();

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

        $pendingPayments = Payment::where('school_id', $school->id)
            ->where('payment_status', 'pending')
            ->count();

        return response()->json([
            'data' => [
                'metrics' => [
                    'total_students' => $totalStudents,
                    'total_parents' => $totalParents,
                    'total_fees_assigned' => (float) $totalFeesAssigned,
                    'total_fees_collected' => (float) $totalFeesCollected,
                    'total_fees_pending' => (float) $totalFeesPending,
                    'collection_rate' => $collectionRate,
                    'pending_payments' => $pendingPayments,
                ],
            ],
        ]);
    }

    /**
     * Parent Dashboard Data
     */
    public function parentDashboard(): JsonResponse
    {
        $this->authorize('view own students');

        $user = Auth::user();
        $students = $user->students()->get();

        if ($students->isEmpty()) {
            return response()->json([
                'data' => [
                    'students' => [],
                    'summary' => null,
                ],
            ]);
        }

        $totalFeesAssigned = StudentFee::whereIn('student_id', $students->pluck('id'))->sum('amount_due');
        $totalFeesPaid = StudentFee::whereIn('student_id', $students->pluck('id'))->sum('amount_paid');
        $totalFeesBalance = StudentFee::whereIn('student_id', $students->pluck('id'))->sum('balance');

        $unpaidCount = StudentFee::whereIn('student_id', $students->pluck('id'))
            ->where('status', 'unpaid')
            ->count();

        $overdueCount = StudentFee::whereIn('student_id', $students->pluck('id'))
            ->where('is_overdue', true)
            ->count();

        return response()->json([
            'data' => [
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
            ],
        ]);
    }
}
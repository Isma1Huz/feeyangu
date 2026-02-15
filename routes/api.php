<?php

use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FeeStructureController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PaymentMethodController;
use App\Http\Controllers\Api\ReceiptController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\StudentFeeController;
use App\Http\Controllers\Api\GradeController;
use App\Http\Controllers\Api\TermController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // ============== SUPER ADMIN API ROUTES ==============
    Route::middleware('role:super-admin')->prefix('admin')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'superAdminDashboard']);
        Route::apiResource('schools', SchoolController::class);
        Route::get('schools/{school}/statistics', [SchoolController::class, 'statistics']);
        Route::get('schools/{school}/payment-methods', [SchoolController::class, 'paymentMethods']);
        Route::get('schools/{school}/customization', [SchoolController::class, 'customization']);
    });

    // ============== SCHOOL ADMIN API ROUTES ==============
    Route::middleware('role:school-admin')->prefix('school')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'schoolAdminDashboard']);
        
        // Students API
        Route::apiResource('students', StudentController::class);
        Route::get('students/{student}/statistics', [StudentController::class, 'statistics']);
        Route::get('students/grades', [StudentController::class, 'grades']);
        Route::get('students/available-parents', [StudentController::class, 'availableParents']);
        Route::get('students/by-grade', [StudentController::class, 'byGrade']);

        // Fee Structures API
        Route::apiResource('fee-structures', FeeStructureController::class);
        Route::get('fee-structures/{feeStructure}/statistics', [FeeStructureController::class, 'statistics']);
        Route::get('fee-structures/grades', [FeeStructureController::class, 'grades']);
        Route::get('fee-structures/terms', [FeeStructureController::class, 'terms']);
        Route::post('fee-structures/{feeStructure}/assign-to-students', [FeeStructureController::class, 'assignToStudents']);
        Route::post('fee-structures/{feeStructure}/assign-to-grade', [FeeStructureController::class, 'assignToGrade']);

        // Student Fees API
        Route::get('students/{student}/fees', [StudentFeeController::class, 'index']);
        Route::get('student-fees/{studentFee}', [StudentFeeController::class, 'show']);
        Route::get('students/{student}/fees/summary', [StudentFeeController::class, 'summary']);
        Route::get('students/{student}/fees/by-status/{status}', [StudentFeeController::class, 'byStatus']);

        // Payments API
        Route::apiResource('payments', PaymentController::class, ['except' => ['update']]);
        Route::post('payments/{payment}/approve', [PaymentController::class, 'approve']);
        Route::post('payments/{payment}/reject', [PaymentController::class, 'reject']);
        Route::get('payments/statistics', [PaymentController::class, 'statistics']);
        Route::get('students/{studentId}/payments/history', [PaymentController::class, 'studentHistory']);

        // Payment Methods API
        Route::apiResource('payment-methods', PaymentMethodController::class);
        Route::post('payment-methods/reorder', [PaymentMethodController::class, 'reorder']);
        Route::post('payment-methods/{paymentMethod}/toggle', [PaymentMethodController::class, 'toggle']);

        // Receipts API
        Route::get('receipts', [ReceiptController::class, 'index']);
        Route::get('receipts/{receipt}', [ReceiptController::class, 'show']);

        // Grades
        Route::apiResource('grades', GradeController::class);
        Route::apiResource('terms', TermController::class);
        Route::apiResource('classes', ClassController::class);

    });

    // ============== PARENT API ROUTES ==============
    Route::middleware('role:parent')->prefix('parent')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'parentDashboard']);
        
        // Student fees
        Route::get('students/{student}/fees', [StudentFeeController::class, 'index']);
        Route::get('student-fees/{studentFee}', [StudentFeeController::class, 'show']);
        Route::get('students/{student}/fees/summary', [StudentFeeController::class, 'summary']);

        // Payments
        Route::post('payments', [PaymentController::class, 'store']);
        Route::get('students/{studentId}/payments/history', [PaymentController::class, 'studentHistory']);

        // Receipts
        Route::get('receipts', [ReceiptController::class, 'index']);
        Route::get('receipts/{receipt}', [ReceiptController::class, 'show']);
    });

    // Notifications
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::get('notifications/recent', [NotificationController::class, 'recent']);
    Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead']);
    Route::post('notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('notifications/{notification}', [NotificationController::class, 'delete']);
});
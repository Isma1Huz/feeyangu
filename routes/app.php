<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FeeStructureController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\ParentPaymentController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentFeeController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\TermController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    
    // ============== SUPER ADMIN ROUTES ==============
    Route::middleware('role:super-admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'superAdminDashboard'])->name('dashboard');
        
        // School Management
        Route::resource('schools', SchoolController::class);
        Route::post('schools/{school}/payment-methods', [SchoolController::class, 'updatePaymentMethods'])->name('schools.updatePaymentMethods');
        Route::post('schools/{school}/customization', [SchoolController::class, 'updateCustomization'])->name('schools.updateCustomization');
    });

    // ============== SCHOOL ADMIN ROUTES ==============
    Route::middleware('role:school-admin')->prefix('school')->name('school.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'schoolAdminDashboard'])->name('dashboard');
        
        // Student Management
        Route::resource('students', StudentController::class);
        Route::post('students/bulk-import', [StudentController::class, 'bulkImport'])->name('students.bulkImport');
        Route::get('students/export', [StudentController::class, 'export'])->name('students.export');
        Route::post('students/{student}/link-parent', [StudentController::class, 'linkParent'])->name('students.linkParent');
        Route::get('students/{student}/fees', [StudentController::class, 'showFees'])->name('students.showFees');

        // Fee Structure Management
        Route::resource('fee-structures', FeeStructureController::class);
        Route::post('fee-structures/{feeStructure}/assign-to-students', [FeeStructureController::class, 'assignToStudents'])->name('fee-structures.assignToStudents');
        Route::post('fee-structures/{feeStructure}/assign-to-grade', [FeeStructureController::class, 'assignToGrade'])->name('fee-structures.assignToGrade');

        // Student Fees
        Route::resource('student-fees', StudentFeeController::class, ['except' => ['create', 'store', 'edit', 'update', 'destroy']]);
        Route::get('students/{student}/student-fees', [StudentFeeController::class, 'index'])->name('student-fees.student');

        // Payment Management
        Route::resource('payments', PaymentController::class, ['except' => ['create', 'edit', 'update']]);
        Route::post('payments/{payment}/approve', [PaymentController::class, 'approve'])->name('payments.approve');
        Route::post('payments/{payment}/reject', [PaymentController::class, 'reject'])->name('payments.reject');
        Route::get('payments/export', [PaymentController::class, 'export'])->name('payments.export');
        Route::get('payments/statistics', [PaymentController::class, 'statistics'])->name('payments.statistics');

        // Payment Methods
        Route::resource('payment-methods', PaymentMethodController::class);
        Route::post('payment-methods/reorder', [PaymentMethodController::class, 'reorder'])->name('payment-methods.reorder');
        Route::post('payment-methods/{paymentMethod}/toggle', [PaymentMethodController::class, 'toggle'])->name('payment-methods.toggle');

        // Receipts
        Route::get('receipts', [ReceiptController::class, 'index'])->name('receipts.index');
        Route::get('receipts/{receipt}', [ReceiptController::class, 'show'])->name('receipts.show');
        Route::get('receipts/{receipt}/download', [ReceiptController::class, 'download'])->name('receipts.download');
        
        // Receipt Templates
        Route::get('receipt-templates', [ReceiptController::class, 'templates'])->name('receipt-templates.index');
        Route::get('receipt-templates/create', [ReceiptController::class, 'createTemplate'])->name('receipt-templates.create');
        Route::post('receipt-templates', [ReceiptController::class, 'storeTemplate'])->name('receipt-templates.store');


         // Grades
        Route::resource('grades', GradeController::class);

        // Terms
        Route::resource('terms', TermController::class);

        // Classes
        Route::get('grades/{grade}/classes', [ClassController::class, 'index'])->name('classes.index');
        Route::get('grades/{grade}/classes/create', [ClassController::class, 'create'])->name('classes.create');
        Route::post('grades/{grade}/classes', [ClassController::class, 'store'])->name('classes.store');
        Route::get('grades/{grade}/classes/{class}', [ClassController::class, 'show'])->name('classes.show');
        Route::get('grades/{grade}/classes/{class}/edit', [ClassController::class, 'edit'])->name('classes.edit');
        Route::put('grades/{grade}/classes/{class}', [ClassController::class, 'update'])->name('classes.update');
        Route::delete('grades/{grade}/classes/{class}', [ClassController::class, 'destroy'])->name('classes.destroy');

    });

    // ============== PARENT ROUTES ==============
    Route::middleware('role:parent')->prefix('parent')->name('parent.')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'parentDashboard'])->name('dashboard');
        
        // View own student fees
        Route::get('students/{student}/fees', [StudentFeeController::class, 'parentView'])->name('student-fees.view');

        // Make payments
        Route::get('student-fees/{studentFee}/pay', [ParentPaymentController::class, 'show'])->name('payments.show');
        Route::post('student-fees/{studentFee}/pay', [ParentPaymentController::class, 'process'])->name('payments.process');
        Route::get('payment-confirmation', [ParentPaymentController::class, 'confirmation'])->name('payments.confirmation');
        Route::get('students/{student}/payment-history', [ParentPaymentController::class, 'history'])->name('payments.history');

        // View receipts
        Route::get('receipts', [ReceiptController::class, 'parentList'])->name('receipts.index');
        Route::get('receipts/{receipt}', [ReceiptController::class, 'parentView'])->name('receipts.show');
        Route::get('receipts/{receipt}/download', [ReceiptController::class, 'download'])->name('receipts.download');
    });

    // Notifications
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::post('notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
    Route::delete('notifications/{notification}', [NotificationController::class, 'delete'])->name('notifications.delete');
});


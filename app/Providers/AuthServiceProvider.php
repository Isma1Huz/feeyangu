<?php

namespace App\Providers;

use App\Models\FeeStructure;
use App\Models\Payment;
use App\Models\Receipt;
use App\Models\School;
use App\Models\SchoolPaymentMethod;
use App\Models\Student;
use App\Models\StudentFee;
use App\Policies\FeeStructurePolicy;
use App\Policies\PaymentMethodPolicy;
use App\Policies\PaymentPolicy;
use App\Policies\ReceiptPolicy;
use App\Policies\SchoolPolicy;
use App\Policies\StudentFeePolicy;
use App\Policies\StudentPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        School::class => SchoolPolicy::class,
        Student::class => StudentPolicy::class,
        FeeStructure::class => FeeStructurePolicy::class,
        StudentFee::class => StudentFeePolicy::class,
        Payment::class => PaymentPolicy::class,
        Receipt::class => ReceiptPolicy::class,
        SchoolPaymentMethod::class => PaymentMethodPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}
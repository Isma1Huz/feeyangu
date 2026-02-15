<?php

namespace App\Providers;

use App\Events\FeeAssigned;
use App\Events\PaymentOverdue;
use App\Events\PaymentReceived;
use App\Listeners\SendFeeAssignedNotification;
use App\Listeners\SendPaymentOverdueNotification;
use App\Listeners\SendPaymentReceivedNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        
        PaymentReceived::class => [
            SendPaymentReceivedNotification::class,
        ],
        
        FeeAssigned::class => [
            SendFeeAssignedNotification::class,
        ],
        
        PaymentOverdue::class => [
            SendPaymentOverdueNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
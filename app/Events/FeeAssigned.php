<?php

namespace App\Events;

use App\Models\StudentFee;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FeeAssigned
{
    use Dispatchable, SerializesModels;

    public function __construct(public StudentFee $studentFee)
    {
    }
}
<?php

namespace App\Jobs;

use App\Models\FeeStructure;
use App\Models\Student;
use App\Models\StudentFee;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class AssignFeesToStudents implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected int $feeStructureId;
    protected array $studentIds;

    public function __construct(int $feeStructureId, array $studentIds)
    {
        $this->feeStructureId = $feeStructureId;
        $this->studentIds = $studentIds;
    }

    public function handle(): void
    {
        try {
            $feeStructure = FeeStructure::findOrFail($this->feeStructureId);

            $assigned = 0;
            $skipped = 0;

            foreach ($this->studentIds as $studentId) {
                try {
                    $student = Student::findOrFail($studentId);

                    // Only assign if student is in the correct grade
                    if ($student->grade_id !== $feeStructure->grade_id) {
                        $skipped++;
                        continue;
                    }

                    // Check if already assigned
                    if (StudentFee::where('student_id', $studentId)
                        ->where('fee_structure_id', $this->feeStructureId)
                        ->exists()) {
                        $skipped++;
                        continue;
                    }

                    StudentFee::create([
                        'student_id' => $studentId,
                        'fee_structure_id' => $this->feeStructureId,
                        'amount_due' => $feeStructure->total_amount,
                        'amount_paid' => 0,
                        'balance' => $feeStructure->total_amount,
                        'due_date' => $feeStructure->due_date,
                        'status' => 'unpaid',
                        'is_overdue' => false,
                    ]);

                    $assigned++;
                } catch (\Exception $e) {
                    Log::error("Failed to assign fee to student {$studentId}", [
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            Log::info("Fee assignment completed", [
                'fee_structure_id' => $this->feeStructureId,
                'assigned' => $assigned,
                'skipped' => $skipped,
            ]);
        } catch (\Exception $e) {
            Log::error("Fee assignment job failed", [
                'fee_structure_id' => $this->feeStructureId,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
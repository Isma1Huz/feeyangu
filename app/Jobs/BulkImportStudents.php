<?php

namespace App\Jobs;

use App\Models\School;
use App\Models\Student;
use App\Models\Grade;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class BulkImportStudents implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected int $schoolId;
    protected string $filePath;
    protected bool $autoNotifyParents;

    public function __construct(int $schoolId, string $filePath, bool $autoNotifyParents = false)
    {
        $this->schoolId = $schoolId;
        $this->filePath = $filePath;
        $this->autoNotifyParents = $autoNotifyParents;
    }

    public function handle(): void
    {
        try {
            $school = School::findOrFail($this->schoolId);
            $content = Storage::get($this->filePath);
            $lines = explode("\n", trim($content));

            $imported = 0;
            $failed = 0;
            $errors = [];

            // Skip header
            $header = str_getcsv(array_shift($lines));
            
            foreach ($lines as $index => $line) {
                if (empty(trim($line))) {
                    continue;
                }

                try {
                    $row = str_getcsv($line);
                    
                    // Expected CSV columns: admission_no, first_name, last_name, email, date_of_birth, grade_name, class_name
                    $gradeCode = $row[5] ?? null;
                    
                    // Find grade by code
                    $grade = $gradeCode ? Grade::where('school_id', $school->id)
                        ->where('code', $gradeCode)
                        ->first() : null;

                    $data = [
                        'admission_no' => $row[0] ?? null,
                        'first_name' => $row[1] ?? null,
                        'last_name' => $row[2] ?? null,
                        'email' => $row[3] ?? null,
                        'date_of_birth' => !empty($row[4]) ? \Carbon\Carbon::createFromFormat('Y-m-d', $row[4]) : null,
                        'grade_id' => $grade?->id,
                    ];

                    // Validate required fields
                    if (empty($data['admission_no']) || empty($data['first_name']) || empty($data['last_name'])) {
                        $failed++;
                        $errors[] = "Row " . ($index + 2) . ": Missing required fields (admission_no, first_name, last_name)";
                        continue;
                    }

                    // Check if student already exists
                    if (Student::where('school_id', $school->id)
                        ->where('admission_no', $data['admission_no'])
                        ->exists()) {
                        $failed++;
                        $errors[] = "Row " . ($index + 2) . ": Admission number already exists";
                        continue;
                    }

                    Student::create([
                        'school_id' => $school->id,
                        'admission_no' => $data['admission_no'],
                        'first_name' => $data['first_name'],
                        'last_name' => $data['last_name'],
                        'email' => $data['email'],
                        'date_of_birth' => $data['date_of_birth'],
                        'grade_id' => $data['grade_id'],
                        'is_active' => true,
                    ]);

                    $imported++;
                } catch (\Exception $e) {
                    $failed++;
                    $errors[] = "Row " . ($index + 2) . ": " . $e->getMessage();
                }
            }

            Log::info("Bulk import completed for school {$school->id}", [
                'imported' => $imported,
                'failed' => $failed,
                'errors' => $errors,
            ]);

            // Clean up file
            Storage::delete($this->filePath);
        } catch (\Exception $e) {
            Log::error("Bulk import failed for school {$this->schoolId}", [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
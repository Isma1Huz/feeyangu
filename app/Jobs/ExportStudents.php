<?php

namespace App\Jobs;

use App\Models\School;
use App\Models\Student;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ExportStudents implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected int $schoolId;
    protected array $filters;

    public function __construct(int $schoolId, array $filters = [])
    {
        $this->schoolId = $schoolId;
        $this->filters = $filters;
    }

    public function handle(): void
    {
        try {
            $school = School::findOrFail($this->schoolId);
            
            $query = Student::where('school_id', $school->id);

            if (!empty($this->filters['grade'])) {
                $query->where('grade', $this->filters['grade']);
            }

            if (!empty($this->filters['is_active'])) {
                $query->where('is_active', (bool)$this->filters['is_active']);
            }

            $students = $query->get();

            // Create CSV
            $filename = "students_export_" . $school->id . "_" . now()->format('Y-m-d_H-i-s') . ".csv";
            $filepath = "exports/" . $filename;

            $handle = fopen("php://temp", 'w');

            // Add header
            fputcsv($handle, [
                'Admission No',
                'First Name',
                'Last Name',
                'Email',
                'Date of Birth',
                'Grade',
                'Status',
                'Created At',
            ]);

            // Add data
            foreach ($students as $student) {
                fputcsv($handle, [
                    $student->admission_no,
                    $student->first_name,
                    $student->last_name,
                    $student->email,
                    $student->date_of_birth?->format('Y-m-d'),
                    $student->grade,
                    $student->is_active ? 'Active' : 'Inactive',
                    $student->created_at->format('Y-m-d H:i:s'),
                ]);
            }

            rewind($handle);
            $csv = stream_get_contents($handle);
            fclose($handle);

            Storage::put($filepath, $csv, 'private');

            Log::info("Students export completed", [
                'school_id' => $school->id,
                'filename' => $filename,
                'count' => $students->count(),
            ]);
        } catch (\Exception $e) {
            Log::error("Students export failed", [
                'school_id' => $this->schoolId,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
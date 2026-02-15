<?php

namespace App\Models;

use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SchoolClass extends Model
{
    use BelongsToSchool;

    protected $table = 'school_classes';

    protected $fillable = [
        'school_id',
        'grade_id',
        'name',
        'class_teacher_id',
        'capacity',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function grade(): BelongsTo
    {
        return $this->belongsTo(Grade::class);
    }

    public function classTeacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'class_teacher_id');
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'class_id');
    }

    /**
     * Get student count
     */
    public function getStudentCountAttribute(): int
    {
        return $this->students()->count();
    }

    /**
     * Check if class is full
     */
    public function isFull(): bool
    {
        return $this->capacity && $this->students()->count() >= $this->capacity;
    }

    /**
     * Get available capacity
     */
    public function getAvailableCapacityAttribute(): int
    {
        if (!$this->capacity) {
            return PHP_INT_MAX;
        }

        return max(0, $this->capacity - $this->students()->count());
    }
}
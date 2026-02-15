<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use  HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'school_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Relation: User belongs to a School (for school admin & staff)
    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    // Relation: Parent has many students
    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'parent_id');
    }

    // Relation: School Owner (Super Admin owns school)
    public function ownedSchool(): HasMany
    {
        return $this->hasMany(School::class, 'owner_id');
    }

    // Helper: Check if user is Super Admin
    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super-admin');
    }

    // Helper: Check if user is School Admin
    public function isSchoolAdmin(): bool
    {
        return $this->hasRole('school-admin') && $this->school_id !== null;
    }

    // Helper: Check if user is Parent
    public function isParent(): bool
    {
        return $this->hasRole('parent');
    }
}
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'role' => 'required|in:school-admin,parent',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'school_name' => 'required_if:role,school-admin|string|max:255',
            'agree_terms' => 'required|accepted',
        ]);

        // Create user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // If school admin, create school
        if ($validated['role'] === 'school-admin') {
            $school = School::create([
                'name' => $validated['school_name'],
                'owner_id' => $user->id,
                'is_active' => false, // Pending activation
                'subscription_status' => 'inactive',
            ]);

            $user->school_id = $school->id;
            $user->save();
        }

        // Assign role
        $user->assignRole($validated['role']);

        // Login user
        auth()->login($user);

        // Redirect based on role
        if ($user->hasRole('school-admin')) {
            return redirect('/school/dashboard');
        } else {
            return redirect('/parent/dashboard');
        }
    }
}
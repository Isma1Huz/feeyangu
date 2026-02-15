<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()['cache']->forget('spatie.permission.cache');

        // Create Roles
        $superAdmin = Role::firstOrCreate(['name' => 'super-admin', 'guard_name' => 'web']);
        $schoolAdmin = Role::firstOrCreate(['name' => 'school-admin', 'guard_name' => 'web']);
        $teacher = Role::firstOrCreate(['name' => 'teacher', 'guard_name' => 'web']);
        $parent = Role::firstOrCreate(['name' => 'parent', 'guard_name' => 'web']);
        $student = Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']);

        // Super Admin Permissions
        $superAdminPerms = [
            // School Management
            'manage schools',
            'view schools',
            'create school',
            'edit school',
            'delete school',
            'manage school subscriptions',
            
            // User Management
            'manage users',
            'view users',
            'create user',
            'edit user',
            'delete user',
            
            // Platform Management
            'manage roles',
            'manage permissions',
            'view platform reports',
            'view platform analytics',
            'manage platform settings',
            'manage themes',
            
            // School Customization
            'customize school',
            'manage receipt templates',
        ];

        // School Admin Permissions
        $schoolAdminPerms = [
            // Student Management
            'manage students',
            'view students',
            'create student',
            'edit student',
            'delete student',
            'bulk import students',
            'bulk export students',
            
            // Fee Management
            'manage fees',
            'view fees',
            'create fee structure',
            'edit fee structure',
            'delete fee structure',
            'assign fees',
            'view fee breakdowns',
            'create fee breakdown',
            'edit fee breakdown',
            
            // Payment Management
            'view payments',
            'record payment',
            'view payment methods',
            'manage payment methods',
            'generate receipt',
            
            // Reporting
            'view school reports',
            'export financial transactions',
            'view student payment history',
            
            // Customization
            'customize school profile',
            'manage receipt templates',
            'upload school logo',
            
            // User Management for School
            'manage school users',
            'create school user',
            'edit school user',
            'delete school user',
        ];

        // Teacher Permissions
        $teacherPerms = [
            'view students',
            'view own class',
            'view grades',
            'view student performance',
            'submit grades',
            'view fees',
            'view payments',
        ];

        // Parent Permissions
        $parentPerms = [
            'view own students',
            'view own fees',
            'view own payments',
            'make payment',
            'download receipt',
            'view payment history',
        ];

        // Student Permissions
        $studentPerms = [
            'view own profile',
            'view own fees',
            'view own grades',
        ];

        // Create Permissions
        $allPermissions = array_merge($superAdminPerms, $schoolAdminPerms, $teacherPerms, $parentPerms, $studentPerms);
        
        foreach ($allPermissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        // Assign Permissions to Roles
        $superAdmin->syncPermissions(Permission::all());
        $schoolAdmin->syncPermissions($schoolAdminPerms);
        $teacher->syncPermissions($teacherPerms);
        $parent->syncPermissions($parentPerms);
        $student->syncPermissions($studentPerms);
    }
}
<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Run migrations
        $this->artisan('migrate');

        // Seed basic data
        $this->artisan('db:seed', ['--class' => 'RolePermissionSeeder']);
    }

    /**
     * Act as a user for API testing
     */
    protected function actingAsApi($user)
    {
        return Sanctum::actingAs(
            $user,
            ['*'] // all permissions
        );
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }
}
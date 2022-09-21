<?php

namespace Database\Seeders;

use App\Models\Pool;
use App\Models\User;
use Illuminate\Database\Seeder;
use Database\Helpers\ApiEnums;

class UserSeederAdmin extends Seeder
{
    /**
     * Seeds initial user records into that database.
     * These users are only useful for testing locally.
     *
     * @return void
     */
    public function run()
    {
        // This is the admin users which owns everything
        User::factory()->create([
            'first_name' => 'Admin',
            'last_name' => 'Test',
            'email' => 'admin@test.com',
            'sub' => 'admin@test.com',
            'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeederLocal extends Seeder
{
    /**
     * Seeds initial user records into that database.
     * These users are only useful for testing locally.
     *
     * @return void
     */
    public function run()
    {
        // Note: to manually promote a Sign In Canada user to admin, refer to instructions in documentation/sign-in-canada.md.

        // shared auth users for testing
        User::factory()
            ->asApplicant()
            ->asRequestResponder()
            ->asCommunityManager()
            ->asAdmin()
            ->asPoolOperator(['digital-community-management', 'office-of-indigenous-initiatives'])
            ->withExperiences()
            ->withSkills()
            ->asGovEmployee()
            ->create([
                'first_name' => 'Admin',
                'last_name' => 'Test',
                'email' => 'admin@test.com',
                'sub' => 'admin@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asAdmin()
            ->withExperiences()
            ->asGovEmployee()
            ->create([
                'first_name' => 'Platform',
                'last_name' => 'Admin',
                'email' => 'platform@test.com',
                'sub' => 'platform@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asCommunityManager()
            ->withExperiences()
            ->asGovEmployee()
            ->create([
                'first_name' => 'Community',
                'last_name' => 'Manager',
                'email' => 'community@test.com',
                'sub' => 'community@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asRequestResponder()
            ->withExperiences()
            ->asGovEmployee()
            ->create([
                'first_name' => 'Request',
                'last_name' => 'Responder',
                'email' => 'request@test.com',
                'sub' => 'request@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asPoolOperator(['digital-community-management', 'office-of-indigenous-initiatives'])
            ->withExperiences()
            ->asGovEmployee()
            ->create([
                'first_name' => 'Pool',
                'last_name' => 'Operator',
                'email' => 'pool@test.com',
                'sub' => 'pool@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->withExperiences()
            ->withSkills()
            ->create([
                'first_name' => 'Applicant',
                'last_name' => 'Test',
                'email' => 'applicant@test.com',
                'sub' => 'applicant@test.com',
            ]);

        User::factory()
            ->create([
                'first_name' => 'No Role',
                'last_name' => 'Test',
                'email' => 'noroles@test.com',
                'sub' => 'noroles@test.com',
            ]);
    }
}

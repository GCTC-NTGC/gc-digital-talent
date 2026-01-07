<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\Pool;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserTestSeeder extends Seeder
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

        $digitalCommunityId = Community::select('id')->where('key', 'digital')->sole()->id;
        $atipCommunityId = Community::select('id')->where('key', 'atip')->sole()->id;
        $testCommunityId = Community::select('id')->where('key', 'test-community')->sole()->id;
        $financeCommunityId = Community::select('id')->where('key', 'finance')->sole()->id;

        // shared auth users for testing
        User::factory()
            ->asApplicant()
            ->asCommunityAdmin([$digitalCommunityId, $atipCommunityId, $testCommunityId])
            ->asAdmin()
            ->withGovEmployeeProfile()
            ->create([
                'first_name' => 'Dale',
                'last_name' => 'Monroe',
                'email' => 'admin@test.com',
                'email_verified_at' => '2026-01-01',
                'sub' => 'admin@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asAdmin()
            ->withGovEmployeeProfile()
            ->create([
                'first_name' => 'Dara',
                'last_name' => 'Kennedy',
                'email' => 'platform@test.com',
                'sub' => 'platform@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->withNonGovProfile()
            ->withCommunityInterests([$digitalCommunityId, $atipCommunityId, $testCommunityId, $financeCommunityId])
            ->create([
                'first_name' => 'Gul',
                'last_name' => 'Fields',
                'email' => 'applicant@test.com',
                'email_verified_at' => '2026-01-01',
                'sub' => 'applicant@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->withGovEmployeeProfile()
            ->withCommunityInterests([$digitalCommunityId, $atipCommunityId, $financeCommunityId])
            ->create([
                'first_name' => 'Jaime',
                'last_name' => 'Bilodeau',
                'email' => 'applicant-employee@test.com',
                'email_verified_at' => '2026-01-01',
                'sub' => 'applicant-employee@test.com',
            ]);

        User::factory()
            ->create([
                'first_name' => 'Hilary',
                'last_name' => 'Seward',
                'email' => 'noroles@test.com',
                'sub' => 'noroles@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asProcessOperator(Pool::factory()->create()->id)
            ->withGovEmployeeProfile()
            ->create([
                'first_name' => 'Hui',
                'last_name' => 'Wells',
                'email' => 'process@test.com',
                'sub' => 'process@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asCommunityRecruiter([$digitalCommunityId, $atipCommunityId])
            ->withGovEmployeeProfile()
            ->create([
                'first_name' => 'Ji-Min',
                'last_name' => 'Holland',
                'email' => 'recruiter@test.com',
                'sub' => 'recruiter@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asCommunityAdmin([$digitalCommunityId, $atipCommunityId])
            ->withGovEmployeeProfile()
            ->create([
                'first_name' => 'Kyo',
                'last_name' => 'Waters',
                'email' => 'community@test.com',
                'sub' => 'community@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asCommunityTalentCoordinator([$digitalCommunityId, $atipCommunityId])
            ->withGovEmployeeProfile()
            ->create([
                'first_name' => 'Berlin',
                'last_name' => 'Sky',
                'email' => 'talent-coordinator@test.com',
                'sub' => 'talent-coordinator@test.com',
            ]);
    }
}

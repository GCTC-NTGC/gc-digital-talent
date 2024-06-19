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

        // shared auth users for testing
        User::factory()
            ->asApplicant()
            ->asRequestResponder()
            ->asCommunityManager()
            ->asAdmin()
            ->asPoolOperator(['digital-community-management', 'office-of-indigenous-initiatives'])
            ->withSkillsAndExperiences()
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
            ->withSkillsAndExperiences()
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
            ->withSkillsAndExperiences()
            ->asGovEmployee()
            ->create([
                'first_name' => 'Community',
                'last_name' => 'Manager',
                'email' => 'legacy-community@test.com',
                'sub' => 'legacy-community@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asRequestResponder()
            ->withSkillsAndExperiences()
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
            ->withSkillsAndExperiences()
            ->asGovEmployee()
            ->create([
                'first_name' => 'Pool',
                'last_name' => 'Operator',
                'email' => 'pool@test.com',
                'sub' => 'pool@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
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

        User::factory()
            ->asApplicant()
            ->asProcessOperator(Pool::factory()->create()->id)
            ->asGovEmployee()
            ->create([
                'first_name' => 'Process',
                'last_name' => 'Operator',
                'email' => 'process@test.com',
                'sub' => 'process@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asCommunityRecruiter([$digitalCommunityId, $atipCommunityId])
            ->asGovEmployee()
            ->create([
                'first_name' => 'Community',
                'last_name' => 'Recruiter',
                'email' => 'recruiter@test.com',
                'sub' => 'recruiter@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asCommunityAdmin([$digitalCommunityId, $atipCommunityId])
            ->asGovEmployee()
            ->create([
                'first_name' => 'Community',
                'last_name' => 'Admin',
                'email' => 'community@test.com',
                'sub' => 'community@test.com',
            ]);
    }
}

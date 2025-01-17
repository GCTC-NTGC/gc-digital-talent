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

        // shared auth users for testing
        User::factory()
            ->asApplicant()
            ->asRequestResponder()
            ->asCommunityManager()
            ->asCommunityAdmin([$digitalCommunityId, $atipCommunityId])
            ->asAdmin()
            ->asPoolOperator(['digital-community-management', 'office-of-indigenous-initiatives'])
            ->withSkillsAndExperiences()
            ->asGovEmployee()
            ->create([
                'first_name' => 'Dale',
                'last_name' => 'Monroe',
                'email' => 'admin@test.com',
                'sub' => 'admin@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asAdmin()
            ->withSkillsAndExperiences()
            ->asGovEmployee()
            ->create([
                'first_name' => 'Dara',
                'last_name' => 'Kennedy',
                'email' => 'platform@test.com',
                'sub' => 'platform@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asCommunityManager()
            ->withSkillsAndExperiences()
            ->asGovEmployee()
            ->create([
                'first_name' => 'Darcy',
                'last_name' => 'Hussein',
                'email' => 'legacy-community@test.com',
                'sub' => 'legacy-community@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asRequestResponder()
            ->withSkillsAndExperiences()
            ->asGovEmployee()
            ->create([
                'first_name' => 'Denver',
                'last_name' => 'Reagan',
                'email' => 'request@test.com',
                'sub' => 'request@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asPoolOperator(['digital-community-management', 'office-of-indigenous-initiatives'])
            ->withSkillsAndExperiences()
            ->asGovEmployee()
            ->create([
                'first_name' => 'Fang',
                'last_name' => 'Dupont',
                'email' => 'pool@test.com',
                'sub' => 'pool@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->withSkillsAndExperiences()
            ->withEmployeeProfile()
            ->withCommunityInterests([$testCommunityId])
            ->create([
                'first_name' => 'Gul',
                'last_name' => 'Fields',
                'email' => 'applicant@test.com',
                'sub' => 'applicant@test.com',
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
            ->asGovEmployee()
            ->create([
                'first_name' => 'Hui',
                'last_name' => 'Wells',
                'email' => 'process@test.com',
                'sub' => 'process@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asCommunityRecruiter([$digitalCommunityId, $atipCommunityId])
            ->asGovEmployee()
            ->create([
                'first_name' => 'Ji-Min',
                'last_name' => 'Holland',
                'email' => 'recruiter@test.com',
                'sub' => 'recruiter@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asCommunityAdmin([$digitalCommunityId, $atipCommunityId])
            ->asGovEmployee()
            ->create([
                'first_name' => 'Kyo',
                'last_name' => 'Waters',
                'email' => 'community@test.com',
                'sub' => 'community@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asManager()
            ->create([
                'first_name' => 'Maisy',
                'last_name' => 'Ware',
                'email' => 'manager@test.com',
                'sub' => 'manager@test.com',
            ]);
    }
}

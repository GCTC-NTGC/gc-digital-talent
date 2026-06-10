<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\Department;
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
        // Note: to manually promote a user to admin, refer to instructions in documentation/authentication.md.

        $digitalCommunityId = Community::select('id')->where('key', 'digital')->sole()->id;
        $atipCommunityId = Community::select('id')->where('key', 'atip')->sole()->id;
        $testCommunityId = Community::select('id')->where('key', 'test-community')->sole()->id;
        $financeCommunityId = Community::select('id')->where('key', 'finance')->sole()->id;

        $departmentId = Department::select('id')->where('department_number', 56)->sole()->id;

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
                'work_email' => 'Dale_Monroe_Admin@gc.ca',
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
                'work_email' => 'Dara_Kennedy_Platform@gc.ca',
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
                'work_email' => 'Gul_Fields_Applicant@gc.ca',
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
                'work_email' => 'Jaime_Bilodeau_Employee@gc.ca',
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
                'work_email' => 'Hui_Wells_Process@gc.ca',
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
                'work_email' => 'Ji-Min_Holland_Recruiter@gc.ca',
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
                'work_email' => 'Kyo_Waters_Community@gc.ca',
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
                'work_email' => 'Berlin_Sky_Coordinator@gc.ca',
            ]);

        User::factory()
            ->asApplicant()
            ->asDepartmentAdmin([$departmentId])
            ->withGovEmployeeProfile()
            ->create([
                'first_name' => 'Brutus',
                'last_name' => 'Sackville',
                'email' => 'department-admin@test.com',
                'sub' => 'department-admin@test.com',
                'work_email' => 'Brutus_Sackville_Department@gc.ca',
            ]);

        User::factory()
            ->asApplicant()
            ->asDepartmentHRAdvisor([$departmentId])
            ->withGovEmployeeProfile()
            ->create([
                'first_name' => 'Archibald',
                'last_name' => 'Bird',
                'email' => 'department-advisor@test.com',
                'sub' => 'department-advisor@test.com',
                'work_email' => 'Archibald_Bird_Advisor@gc.ca',
            ]);
    }
}

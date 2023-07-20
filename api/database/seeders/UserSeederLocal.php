<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Team;
use Illuminate\Database\Seeder;
use Database\Helpers\ApiEnums;

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
        // collect roles and teams for assignment
        $roles = Role::all();
        $baseUserRole = $roles->sole(function ($r) {
            return $r->name == "base_user";
        });
        $applicantRole = $roles->sole(function ($r) {
            return $r->name == "applicant";
        });
        $poolOperatorRole = $roles->sole(function ($r) {
            return $r->name == "pool_operator";
        });
        $platformAdminRole = $roles->sole(function ($r) {
            return $r->name == "platform_admin";
        });
        $requestResponderRole = $roles->sole(function ($r) {
            return $r->name == "request_responder";
        });
        $dcmTeam = Team::where('name', 'digital-community-management')->sole();
        $testTeam = Team::where('name', 'test-team')->sole();

        // shared auth users for testing
        User::factory()
            ->asApplicant()
            ->asRequestResponder()
            ->asAdmin()
            ->asPoolOperator(['digital-community-management', 'test-team'])
            ->withExperiences()
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
            ->create([
                'first_name' => 'Platform',
                'last_name' => 'Admin',
                'email' => 'platform@test.com',
                'sub' => 'platform@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asRequestResponder()
            ->withExperiences()
            ->create([
                'first_name' => 'Request',
                'last_name' => 'Responder',
                'email' => 'request@test.com',
                'sub' => 'request@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->asPoolOperator(['digital-community-management', 'test-team'])
            ->withExperiences()
            ->create([
                'first_name' => 'Pool',
                'last_name' => 'Operator',
                'email' => 'pool@test.com',
                'sub' => 'pool@test.com',
            ]);

        User::factory()
            ->asApplicant()
            ->withExperiences()
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

        $fakeEmailDomain = '@talent.test';
        // users with sub values from Sign In Canada, redirecting to localhost
        User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'petertgiles' . $fakeEmailDomain,
                'sub' => '4810df0d-fcb6-4353-af93-b25c0a5a9c3e',
            ]);
        User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'yonikid15' . $fakeEmailDomain,
                'sub' => 'c65dd054-db44-4bf6-af39-37eedb39305d',
            ]);
        User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'JamesHuf' . $fakeEmailDomain,
                'sub' => 'e64b8057-0eaf-4a19-a14a-4a93fa2e8a04',
            ]);
        User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'brindasasi' . $fakeEmailDomain,
                'sub' => '2e72b97b-017a-4ed3-a803-a8773c2e1b14',
            ]);
        User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'tristan-orourke' . $fakeEmailDomain,
                'sub' => 'd9f27aca-b2ea-4c4a-9459-25bb7a7b77f6',
            ]);
        User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'vd1992' . $fakeEmailDomain,
                'sub' => '2f3ee3fb-91ab-478e-a675-c56fdc043dc6',
            ]);
        User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'mnigh' . $fakeEmailDomain,
                'sub' => 'c736bdff-c1f2-4538-b648-43a9743481a3',
            ]);
        User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'patcon' . $fakeEmailDomain,
                'sub' => '88f7d707-01df-4f56-8eed-a823d16c232c',
            ]);
    }
}

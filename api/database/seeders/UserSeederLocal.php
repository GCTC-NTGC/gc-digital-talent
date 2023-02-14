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
        $teamAdminRole = $roles->sole(function ($r) {
            return $r->name == "team_admin";
        });
        $superAdminRole = $roles->sole(function ($r) {
            return $r->name == "super_admin";
        });
        $dcmTeam = Team::where('name', 'digital-community-management')->sole();

        // shared auth users for testing
        User::updateOrCreate([
            'sub' => 'admin@test.com',
        ], [
            'first_name' => 'Admin',
            'last_name' => 'Test',
            'email' => 'admin@test.com',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
        ])
            ->syncRoles([$teamAdminRole], $dcmTeam)
            ->syncRoles([$baseUserRole, $applicantRole, $superAdminRole], null);
        User::updateOrCreate(
            [
                'sub' => 'applicant@test.com',
            ],
            [
                'first_name' => 'Applicant',
                'last_name' => 'Test',
                'email' => 'applicant@test.com',
                'legacy_roles' => [ApiEnums::LEGACY_ROLE_APPLICANT]
            ]
        )->syncRoles([$baseUserRole, $applicantRole]);
        User::updateOrCreate(
            [
                'sub' => 'noroles@test.com',
            ],
            [
                'first_name' => 'No Role',
                'last_name' => 'Test',
                'email' => 'noroles@test.com',
                'legacy_roles' => []
            ]
        )->syncRoles([$baseUserRole]);

        $fakeEmailDomain = '@talent.test';
        // users with sub values from Sign In Canada, redirecting to localhost
        User::updateOrCreate(
            [
                'sub' => '4810df0d-fcb6-4353-af93-b25c0a5a9c3e',
            ],
            [
                'email' => 'petertgiles' . $fakeEmailDomain,
                'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
            ]
        )->syncRoles([$baseUserRole, $applicantRole, $superAdminRole]);
        User::updateOrCreate(
            [
                'sub' => 'c65dd054-db44-4bf6-af39-37eedb39305d',
            ],
            [
                'email' => 'yonikid15' . $fakeEmailDomain,

                'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
            ]
        )->syncRoles([$baseUserRole, $applicantRole, $superAdminRole]);
        User::updateOrCreate(
            [
                'sub' => 'e64b8057-0eaf-4a19-a14a-4a93fa2e8a04',
            ],
            [
                'email' => 'JamesHuf' . $fakeEmailDomain,
                'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
            ]
        )->syncRoles([$baseUserRole, $applicantRole, $superAdminRole]);
        User::updateOrCreate(
            [
                'sub' => '2e72b97b-017a-4ed3-a803-a8773c2e1b14',
            ],
            [
                'email' => 'brindasasi' . $fakeEmailDomain,
                'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
            ]
        )->syncRoles([$baseUserRole, $applicantRole, $superAdminRole]);
        User::updateOrCreate(
            [
                'sub' => 'd9f27aca-b2ea-4c4a-9459-25bb7a7b77f6',
            ],
            [
                'email' => 'tristan-orourke' . $fakeEmailDomain,
                'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
            ]
        )->syncRoles([$baseUserRole, $applicantRole, $superAdminRole]);
        User::updateOrCreate(
            [
                'sub' => '2f3ee3fb-91ab-478e-a675-c56fdc043dc6',
            ],
            [
                'email' => 'vd1992' . $fakeEmailDomain,
                'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
            ]
        )->syncRoles([$baseUserRole, $applicantRole, $superAdminRole]);
        User::updateOrCreate(
            [
                'sub' => 'c736bdff-c1f2-4538-b648-43a9743481a3',
            ],
            [
                'email' => 'mnigh' . $fakeEmailDomain,
                'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
            ]
        )->syncRoles([$baseUserRole, $applicantRole, $superAdminRole]);
        User::updateOrCreate(
            [
                'sub' => '88f7d707-01df-4f56-8eed-a823d16c232c',
            ],
            [
                'email' => 'patcon' . $fakeEmailDomain,
                'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
            ]
        )->syncRoles([$baseUserRole, $applicantRole, $superAdminRole]);
    }
}

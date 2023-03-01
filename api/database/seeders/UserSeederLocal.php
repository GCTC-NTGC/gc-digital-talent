<?php

namespace Database\Seeders;

use App\Models\User;
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
        // shared auth users for testing
        User::factory()->afterCreating(function ($user) {
            $user->attachRoles(["base_user", "applicant", "request_responder", "platform_admin"]);
        })->create([
            'first_name' => 'Admin',
            'last_name' => 'Test',
            'email' => 'admin@test.com',
            'sub' => 'admin@test.com',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT],
        ]);
        User::factory()->afterCreating(function ($user) {
            $user->attachRoles(["base_user", "applicant"]);
        })->create([
            'first_name' => 'Applicant',
            'last_name' => 'Test',
            'email' => 'applicant@test.com',
            'sub' => 'applicant@test.com',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'first_name' => 'No Role',
            'last_name' => 'Test',
            'email' => 'noroles@test.com',
            'sub' => 'noroles@test.com',
            'legacy_roles' => []
        ]);

        $fakeEmailDomain = '@talent.test';
        // users with sub values from Sign In Canada, redirecting to localhost
        User::factory()->create([
            'email' => 'petertgiles'.$fakeEmailDomain,
            'sub' => '4810df0d-fcb6-4353-af93-b25c0a5a9c3e',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'gggrant'.$fakeEmailDomain,
            'sub' => 'cd537460-1fee-40bd-ada6-8ee40b6f63c9',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'yonikid15'.$fakeEmailDomain,
            'sub' => 'c65dd054-db44-4bf6-af39-37eedb39305d',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'JamesHuf'.$fakeEmailDomain,
            'sub' => 'e64b8057-0eaf-4a19-a14a-4a93fa2e8a04',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'brindasasi'.$fakeEmailDomain,
            'sub' => '2e72b97b-017a-4ed3-a803-a8773c2e1b14',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'tristan-orourke'.$fakeEmailDomain,
            'sub' => 'd9f27aca-b2ea-4c4a-9459-25bb7a7b77f6',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'vd1992'.$fakeEmailDomain,
            'sub' => '2f3ee3fb-91ab-478e-a675-c56fdc043dc6',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'mnigh'.$fakeEmailDomain,
            'sub' => 'c736bdff-c1f2-4538-b648-43a9743481a3',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'rvany'.$fakeEmailDomain,
            'sub' => 'a46a681f-31c0-42c8-8be3-97466d77f96a',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'patcon'.$fakeEmailDomain,
            'sub' => '88f7d707-01df-4f56-8eed-a823d16c232c',
            'legacy_roles' => [ApiEnums::LEGACY_ROLE_ADMIN, ApiEnums::LEGACY_ROLE_APPLICANT]
        ]);
    }
}

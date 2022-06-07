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
        User::factory()->create([
            'email' => 'admin@test.com',
            'sub' => 'admin@test.com',
            'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'applicant@test.com',
            'sub' => 'applicant@test.com',
            'roles' => [ApiEnums::ROLE_APPLICANT]
        ]);

        $fakeEmailDomain = '@talent.test';
        // users with sub values from Sign In Canada, redirecting to localhost
        User::factory()->create([
            'email' => 'petertgiles'.$fakeEmailDomain,
            'sub' => '4810df0d-fcb6-4353-af93-b25c0a5a9c3e',
            'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'gggrant'.$fakeEmailDomain,
            'sub' => 'cd537460-1fee-40bd-ada6-8ee40b6f63c9',
            'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'yonikid15'.$fakeEmailDomain,
            'sub' => 'c65dd054-db44-4bf6-af39-37eedb39305d',
            'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'JamesHuf'.$fakeEmailDomain,
            'sub' => 'e64b8057-0eaf-4a19-a14a-4a93fa2e8a04',
            'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'brindasasi'.$fakeEmailDomain,
            'sub' => '2e72b97b-017a-4ed3-a803-a8773c2e1b14',
            'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'tristan-orourke'.$fakeEmailDomain,
            'sub' => 'd9f27aca-b2ea-4c4a-9459-25bb7a7b77f6',
            'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'vd1992'.$fakeEmailDomain,
            'sub' => '2f3ee3fb-91ab-478e-a675-c56fdc043dc6',
            'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'mnigh'.$fakeEmailDomain,
            'sub' => 'c736bdff-c1f2-4538-b648-43a9743481a3',
            'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'rvany'.$fakeEmailDomain,
            'sub' => 'a46a681f-31c0-42c8-8be3-97466d77f96a',
            'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
        ]);
        User::factory()->create([
            'email' => 'patcon'.$fakeEmailDomain,
            'sub' => '88f7d707-01df-4f56-8eed-a823d16c232c',
            'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeederUat extends Seeder
{
    /**
     * Seeds initial user records into that database.
     * These users are only useful for testing on UAT server.
     *
     * @return void
     */
    public function run()
    {
        $fakeEmailDomain = '@talent.test';

        // users with sub values from Sign In Canada, redirecting to uat-talentcloud.tbs-sct.gc.ca

        // Ensure we don't create duplicates if users already exist, since we don't truncate tables by default (unlike on local).
        User::updateOrCreate(
            ['email' => 'tristan-orourke'.$fakeEmailDomain],
            [
                'first_name' => 'tristan-orourke',
                'last_name' => 'Talent',
                'sub' => 'b4c734a1-dcf3-4fb8-a860-c642700cb0b8',
                'roles' => ['ADMIN']
            ]
        );

        // TODO: Add Gray and DCMO users.

        // TODO: Add devs back in once subs are known.
    }
}

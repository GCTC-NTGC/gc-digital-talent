<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Database\Helpers\ApiEnums;

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
        // users with sub values from Sign In Canada, redirecting to uat-talentcloud.tbs-sct.gc.ca
        // Ensure we don't create duplicates if users already exist, since we don't truncate tables by default (unlike on local).
        User::updateOrCreate(
            ['sub' => 'c0967038-f2bb-42cc-8bb3-4b90e9f77f89'],
            [
                'first_name' => 'Wanda',
                'last_name' => 'Maximoff',
                'email' => 'usertester923@gmail.com',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => 'b4c734a1-dcf3-4fb8-a860-c642700cb0b8'],
            [
                'first_name' => 'Tristan',
                'last_name' => "O'Rourke",
                'email' => "tristan.o'rourke@tbs-sct.gc.ca",
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => '5d0ce9a8-8164-46a5-9fe1-b7a2b42d61fc'],
            [
                'first_name' => 'Peter',
                'last_name' => 'Giles',
                'email' => 'peter.giles@tbs-sct.gc.ca',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => 'fcd5d233-66d9-4ac6-81e0-fabf379b0a70'],
            [
                'first_name' => 'Biruntha',
                'last_name' => 'Sasikumar',
                'email' => 'biruntha.sasikumar@tbs-sct.gc.ca',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => 'b9305997-b221-43f7-9c25-bc0d460b6464'],
            [
                'first_name' => 'Maddy',
                'last_name' => 'Test',
                'email' => 'testing@gmail.com',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => 'a5bf84fe-7003-44df-bbdd-ce2d35cac2fb'],
            [
                'first_name' => 'Yonathan',
                'last_name' => 'Kidanemariam',
                'email' => 'Yonathan.Kidanemariam@tbs-sct.gc.ca',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => 'ecbf3c81-9bc0-4d9e-bb88-8a4554b651ea'],
            [
                'first_name' => 'Julie',
                'last_name' => 'Harrison',
                'email' => 'julie.harrison@tbs-sct.gc.ca',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => '43a2b0f0-218b-447b-9208-9254b487ebab'],
            [
                'first_name' => 'Corinne',
                'last_name' => 'Fraser',
                'email' => 'corinne.fraser@tbs-sct.gc.ca',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => 'ebd3e68a-0369-4d3f-92f0-46532638a54c'],
            [
                'first_name' => 'Eric',
                'last_name' => 'Sizer',
                'email' => 'eric.sizer@tbs-sct.gc.ca',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => '5c3315f2-2802-4a0a-9954-815544344cc4'],
            [
                'first_name' => 'Biruntha',
                'last_name' => 'Sasikumar',
                'email' => 'ts@test.com',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => 'cfab235d-192c-42c8-930e-6e8ee2707068'],
            [
                'first_name' => 'Jamie',
                'last_name' => 'Estey',
                'email' => 'jamie.estey@tbs-sct.gc.ca',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => '8fc3674f-4ae9-4ad2-a62d-378717211677'],
            [
                'first_name' => 'Brinda',
                'last_name' => 'Sasikumar',
                'email' => 'ad@test.com',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => '3451d853-6531-4923-94ae-4b5eaea8a4b2'],
            [
                'first_name' => 'UAUser',
                'last_name' => 'Test1',
                'email' => 'madeleine.daigle@tbs-sct.gc.ca',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => '345e5bc5-3906-495e-9900-986e5e7747d2'],
            [
                'first_name' => 'Marie Madeleine',
                'last_name' => 'Daigle',
                'email' => 'maddy.daigle@gmail.com',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => 'c7301a8b-4c62-4767-b131-69920ff39e72'],
            [
                'first_name' => 'Jerbo',
                'last_name' => 'Testcandon',
                'email' => 'jerryescandon@gmail.com',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => 'c04defba-8470-4118-a5d8-1b3c1e4d800d'],
            [
                'first_name' => 'Rosalie',
                'last_name' => 'McGrath',
                'email' => 'rosalie.mcgrath@tbs-sct.gc.ca',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => 'b1e156d1-a1ff-4c3d-a86e-c875922394ca'],
            [
                'first_name' => 'Gray',
                'last_name' => "O'Byrne",
                'email' => 'gray.obyrne@tbs-sct.gc.ca',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => '49baaa3f-ff93-4cf7-9d0c-a389a40ac290'],
            [
                'first_name' => 'Daria',
                'last_name' => 'Petrova',
                'email' => 'daria.petrova@tbs-sct.gc.ca',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => '2ccb3e5e-6b5f-49eb-95e1-e1b4628fb492'],
            [
                'first_name' => 'Security',
                'last_name' => 'Test',
                'email' => 'secuity@test.test',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
        User::updateOrCreate(
            ['sub' => 'fddd293e-0882-49fa-94bb-30854f06f0cd'],
            [
                'first_name' => 'Jamie',
                'last_name' => 'Estey',
                'email' => 'Jamie.estey@tbs-sct.gc.ca',
                'roles' => [ApiEnums::ROLE_ADMIN, ApiEnums::ROLE_APPLICANT]
            ]
        );
    }
}

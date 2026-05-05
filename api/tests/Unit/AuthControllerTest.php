<?php

namespace Tests\Unit;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

use function PHPUnit\Framework\assertNotNull;
use function PHPUnit\Framework\assertSame;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    public function testNewUserCreationOnLogin()
    {
        $this->seed(RolePermissionSeeder::class);

        // starting with zero users
        assertSame(0, count(User::all()));

        // JWT payload
        // {
        //     "sub": "1234567890",
        //     "nonce": "abc",
        //     "state": "abc",
        //     "iat": 1516239022
        //   }
        Http::fakeSequence()
            ->push([
                'id_token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibm9uY2UiOiJhYmMiLCJzdGF0ZSI6ImFiYyIsImlhdCI6MTUxNjIzOTAyMn0.p4GMaQjmIcUAxjAZ7Y51C1q1mu5sVXJLdX1zybt4jFc',
            ], 200)
            ->whenEmpty(Http::response());

        $response = $this->withSession([
            'state' => 'abc',
            'nonce' => 'abc',
        ])->call('GET', '/auth-callback', [
            'state' => 'abc',
            'nonce' => 'abc',
            'code' => 'code',
        ]);

        // ensure a user was created bringing the count up to one, with the expected sub per payload above and last sign in set
        assertSame(1, count(User::all()));
        $newUser = User::where('sub', '1234567890')->sole();
        $this->assertModelExists($newUser);
        assertNotNull($newUser->last_sign_in_at);

        $response = $this->withSession([
            'state' => 'abc',
            'nonce' => 'abc',
        ])->call('GET', '/auth-callback', [
            'state' => 'abc',
            'nonce' => 'abc',
            'code' => 'code',
        ]);

        // ensure no users were created from the second request and the users stayed constant
        assertSame(1, count(User::all()));
        $newUser = User::where('sub', '1234567890')->sole();
        $this->assertModelExists($newUser);
        assertNotNull($newUser->last_sign_in_at);

        // assert new user has expected roles
        $expectedRoleNames = [
            Role::where('name', 'base_user')->sole()->name,
            Role::where('name', 'applicant')->sole()->name,
        ];
        $actualRoleNames = $newUser->roles->map(function ($role) {
            return $role->name;
        })->toArray();
        $this->assertEqualsCanonicalizing($actualRoleNames, $expectedRoleNames);
    }

    public function testIdTokenClaimsAreSavedToUser()
    {
        $this->seed(RolePermissionSeeder::class);

        // JWT payload with claims
        // {
        //   "sub": "9876543210",
        //   "nonce": "xyz",
        //   "state": "xyz",
        //   "given_name": "John",
        //   "family_name": "Doe",
        //   "email": "john.doe@gc.ca",
        //   "phone_number": "+1234567890",
        //   "locale": "fr-CA",
        //   "iat": 1516239022
        // }
        Http::fakeSequence()
            ->push([
                'id_token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODc2NTQzMjEwIiwibm9uY2UiOiJ4eXoiLCJzdGF0ZSI6Inh5eiIsImdpdmVuX25hbWUiOiJKb2huIiwiZmFtaWx5X25hbWUiOiJEb2UiLCJlbWFpbCI6ImpvaG4uZG9lQGdjLmNhIiwicGhvbmVfbnVtYmVyIjoiKzEyMzQ1Njc4OTAiLCJsb2NhbGUiOiJmci1DQSIsImlhdCI6MTUxNjIzOTAyMn0.3wKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9Qw',
            ], 200)
            ->whenEmpty(Http::response());

        $response = $this->withSession([
            'state' => 'xyz',
            'nonce' => 'xyz',
        ])->call('GET', '/auth-callback', [
            'state' => 'xyz',
            'nonce' => 'xyz',
            'code' => 'code',
        ]);

        $user = User::where('sub', '9876543210')->sole();
        $this->assertModelExists($user);
        $this->assertSame('John', $user->first_name);
        $this->assertSame('Doe', $user->last_name);
        $this->assertSame('john.doe@gc.ca', $user->email);
        $this->assertSame('+1234567890', $user->telephone);
        $this->assertSame('FR', $user->preferred_lang); // returned as Language::FR->name
    }

    public function testExistingUserEmailIsUpdatedOnLogin()
    {
        $this->seed(RolePermissionSeeder::class);

        // Create an existing user with the same email but different sub
        $existingUser = User::factory()->create([
            'sub' => 'oldsub',
            'email' => 'duplicate@gc.ca',
            'work_email' => 'duplicate@gc.ca',
        ]);

        // JWT payload with duplicate email
        // {
        //   "sub": "newsub",
        //   "nonce": "dup",
        //   "state": "dup",
        //   "email": "duplicate@gc.ca"
        // }
        Http::fakeSequence()
            ->push([
                'id_token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuZXdzdWIiLCJub25jZSI6ImR1cCIsInN0YXRlIjoiZHVwIiwiZW1haWwiOiJkdXBsaWNhdGVAZ2MuY2EiLCJpYXQiOjE1MTYyMzkwMjJ9.3wKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9QwKk9Qw',
            ], 200)
            ->whenEmpty(Http::response());

        $response = $this->withSession([
            'state' => 'dup',
            'nonce' => 'dup',
        ])->call('GET', '/auth-callback', [
            'state' => 'dup',
            'nonce' => 'dup',
            'code' => 'code',
        ]);

        // The existing user's email should be backed up
        $existingUser->refresh();
        $this->assertNull($existingUser->email);
        $this->assertNull($existingUser->work_email);
        $this->assertSame('duplicate@gc.ca', $existingUser->email_backup);
        $this->assertSame('duplicate@gc.ca', $existingUser->work_email_backup);

        // The new user should have the duplicate email
        $newUser = User::where('sub', 'newsub')->sole();
        $this->assertSame('duplicate@gc.ca', $newUser->email);
        $this->assertSame('duplicate@gc.ca', $newUser->work_email);
    }
}

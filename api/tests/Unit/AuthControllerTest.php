<?php

namespace Tests\Unit;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
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

        Artisan::call('key:generate');
        Artisan::call('config:cache');
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
}

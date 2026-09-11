<?php

namespace Tests\Unit;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

use function PHPUnit\Framework\assertEqualsCanonicalizing;

class UserAuthorizationBasicScopeTest extends TestCase
{
    use RefreshDatabase;

    protected static function createApplicant()
    {
        return User::factory()
            ->asApplicant()
            ->create();
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    // a guest should be able to view no users
    public function testViewBasicAsGuest(): void
    {
        // no $actor User or mock for guest

        $someoneElse = self::createApplicant();

        $userIds = User::whereAuthorizedToViewBasicInfo()->get()->pluck('id');
        assertEqualsCanonicalizing([], $userIds->toArray());
    }

    // an applicant should be able to view just themselves
    public function testViewBasicAsApplicant(): void
    {
        $actor = self::createApplicant();

        Auth::shouldReceive('user')
            ->andReturn($actor);

        $someoneElse = self::createApplicant();

        $userIds = User::whereAuthorizedToViewBasicInfo()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $actor->id,
        ], $userIds->toArray());
    }

    // a platform admin should be able to view any user
    public function testViewBasicAsPlatformAdmin(): void
    {
        $actor = User::factory()
            ->asAdmin()
            ->create();

        Auth::shouldReceive('user')
            ->andReturn($actor);

        $someoneElse = self::createApplicant();

        $userIds = User::whereAuthorizedToViewBasicInfo()->get()->pluck('id');
        assertEqualsCanonicalizing([
            $actor->id,
            $someoneElse->id,
        ], $userIds->toArray());
    }
}

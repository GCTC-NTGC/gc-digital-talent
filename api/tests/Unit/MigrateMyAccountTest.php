<?php

namespace Tests\Unit;

use App\GraphQL\Mutations\MigrateMyAccount;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use GraphQL\Error\Error;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Nuwave\Lighthouse\Exceptions\AuthorizationException;
use Tests\TestCase;

class MigrateMyAccountTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    private function createActor(): User
    {
        return User::factory()->create([
            'sub' => 'actor-sub',
            'email' => 'test@example.com',
            'work_email' => 'test@gc.ca',
            'telephone' => '5551234567',
        ]);
    }

    private function createTarget(string $sub = 'target-sub'): User
    {
        return User::factory()->create([
            'sub' => $sub,
            'email' => null,
            'email_backup' => 'test@example.com',
            'telephone' => '5551234567',
            'last_sign_in_iss' => null,
        ]);
    }

    private function assertUserUnchanged(User $user): void
    {
        $fresh = User::withTrashed()->find($user->id);
        $this->assertNull($fresh->deleted_at);
        $this->assertEquals($user->sub, $fresh->sub);
        $this->assertEquals($user->email, $fresh->email);
        $this->assertEquals($user->work_email, $fresh->work_email);
    }

    public function testThrowsIfFeatureFlagDisabled()
    {
        Config::set('feature.auth_in_app_migration', false);
        $actor = $this->createActor();
        $target = $this->createTarget();
        Auth::login($actor);

        try {
            (new MigrateMyAccount())(null, []);
            $this->fail('Expected an Error to be thrown');
        } catch (Error $e) {
            $this->assertEquals('Feature is not enabled.', $e->getMessage());
        }

        $this->assertUserUnchanged($actor);
        $this->assertUserUnchanged($target);
    }

    public function testFeatureFlagIsCheckedBeforeAuthentication()
    {
        Config::set('feature.auth_in_app_migration', false);
        Auth::logout();

        $this->expectException(Error::class);
        $this->expectExceptionMessage('Feature is not enabled.');

        (new MigrateMyAccount())(null, []);
    }

    public function testThrowsIfNotAuthenticated()
    {
        Config::set('feature.auth_in_app_migration', true);
        $actor = $this->createActor();
        $target = $this->createTarget();
        Auth::logout();

        try {
            (new MigrateMyAccount())(null, []);
            $this->fail('Expected an AuthorizationException to be thrown');
        } catch (AuthorizationException $e) {
            // expected
        }

        $this->assertUserUnchanged($actor);
        $this->assertUserUnchanged($target);
    }

    public function testThrowsIfNoPossibleTargets()
    {
        Config::set('feature.auth_in_app_migration', true);
        $actor = $this->createActor();
        Auth::login($actor);

        try {
            (new MigrateMyAccount())(null, []);
            $this->fail('Expected an Error to be thrown');
        } catch (Error $e) {
            $this->assertEquals('Need one possible target to migrate.', $e->getMessage());
        }

        $this->assertUserUnchanged($actor);
    }

    public function testThrowsIfMultiplePossibleTargets()
    {
        Config::set('feature.auth_in_app_migration', true);
        $actor = $this->createActor();
        $target1 = $this->createTarget('target-sub-1');
        $target2 = $this->createTarget('target-sub-2');
        Auth::login($actor);

        try {
            (new MigrateMyAccount())(null, []);
            $this->fail('Expected an Error to be thrown');
        } catch (Error $e) {
            $this->assertEquals('Need one possible target to migrate.', $e->getMessage());
        }

        $this->assertUserUnchanged($actor);
        $this->assertUserUnchanged($target1);
        $this->assertUserUnchanged($target2);
    }

    public function testMigratesIfExactlyOnePossibleTarget()
    {
        Config::set('feature.auth_in_app_migration', true);
        Log::spy();
        $actor = $this->createActor();
        $target = $this->createTarget();
        Auth::login($actor);

        $result = (new MigrateMyAccount())(null, []);

        $this->assertTrue($result);

        // originating account is cleared and soft deleted
        $freshActor = User::withTrashed()->find($actor->id);
        $this->assertSoftDeleted($freshActor);
        $this->assertNull($freshActor->sub);
        $this->assertNull($freshActor->email);
        $this->assertEquals('test@example.com', $freshActor->email_backup);
        $this->assertNull($freshActor->work_email);
        $this->assertEquals('test@gc.ca', $freshActor->work_email_backup);

        // target account takes over the sub
        $freshTarget = User::find($target->id);
        $this->assertNotNull($freshTarget);
        $this->assertEquals('actor-sub', $freshTarget->sub);

        Log::shouldHaveReceived('info')
            ->with('Account migration complete', [
                'originating user ID' => $actor->id,
                'target user ID' => $target->id,
                'transferred sub' => 'actor-sub',
                'overwritten sub' => 'target-sub',
            ])
            ->once();
    }
}

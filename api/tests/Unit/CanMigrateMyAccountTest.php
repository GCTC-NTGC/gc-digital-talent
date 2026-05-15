<?php

namespace Tests\Unit;

use App\GraphQL\Queries\CanMigrateMyAccount;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class CanMigrateMyAccountTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function testCannotMigrateIfFeatureFlagDisabled()
    {
        Config::set('feature.auth_in_app_migration', false);
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'telephone' => '+1 (555) 123-4567',
        ]);
        // Create a possible migration target that would match if the flag were enabled
        User::factory()->create([
            'email_backup' => 'test@example.com',
            'telephone' => '+1 555 123 4567',
            'last_sign_in_iss' => null,
        ]);
        Auth::login($user);
        $result = (new CanMigrateMyAccount())();
        $this->assertFalse($result);
    }

    public function testCannotMigrateIfNotAuthenticated()
    {
        Config::set('feature.auth_in_app_migration', true);
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'telephone' => '+1 (555) 123-4567',
        ]);
        // Create a possible migration target that would match if authenticated
        User::factory()->create([
            'email_backup' => 'test@example.com',
            'telephone' => '+1 555 123 4567',
            'last_sign_in_iss' => null,
        ]);
        Auth::logout();
        $result = (new CanMigrateMyAccount())();
        $this->assertFalse($result);
    }

    public function testCannotMigrateIfNoPossibleTargets()
    {
        Config::set('feature.auth_in_app_migration', true);
        $user = User::factory()->create();
        Auth::login($user);
        $result = (new CanMigrateMyAccount())();
        $this->assertFalse($result);
    }

    public function testCannotMigrateIfMultiplePossibleTargets()
    {
        Config::set('feature.auth_in_app_migration', true);
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'telephone' => '+1 (555) 123-4567',
        ]);
        // Create two possible targets
        User::factory()->create([
            'email_backup' => 'test@example.com',
            'telephone' => '+1 555 123 4567',
            'last_sign_in_iss' => null,
        ]);
        User::factory()->create([
            'email_backup' => 'test@example.com',
            'telephone' => '+1 555 123 4567',
            'last_sign_in_iss' => null,
        ]);
        Auth::login($user);
        $result = (new CanMigrateMyAccount())();
        $this->assertFalse($result);
    }

    public function testCanMigrateIfExactlyOnePossibleTarget()
    {
        Config::set('feature.auth_in_app_migration', true);
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'telephone' => '+1 (555) 123-4567',
        ]);
        // Create one possible target
        User::factory()->create([
            'email_backup' => ' test@example.com ',
            'telephone' => '+1 555 123 4567',
            'last_sign_in_iss' => null,
        ]);
        Auth::login($user);
        $result = (new CanMigrateMyAccount())();
        $this->assertTrue($result);
    }

    public function testCannotMigrateIfTargetWasLastLoggedInWithCanadalogin()
    {
        Config::set('feature.auth_in_app_migration', true);
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'telephone' => '+1 (555) 123-4567',
        ]);
        // Target with CanadaLogin as last_sign_in_iss
        User::factory()->create([
            'email_backup' => 'test@example.com',
            'telephone' => '+1 555 123 4567',
            'last_sign_in_iss' => 'https://auth.login-connexion.canada.ca/oauth2',
        ]);
        Auth::login($user);
        $result = (new CanMigrateMyAccount())();
        $this->assertFalse($result);
    }

    public function testCannotMigrateIfTargetIsSoftDeleted()
    {
        Config::set('feature.auth_in_app_migration', true);
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'telephone' => '+1 (555) 123-4567',
        ]);
        $target = User::factory()->create([
            'email_backup' => 'test@example.com',
            'telephone' => '+1 555 123 4567',
            'last_sign_in_iss' => null,
        ]);
        $target->delete();
        Auth::login($user);
        $result = (new CanMigrateMyAccount())();
        $this->assertFalse($result);
    }
}

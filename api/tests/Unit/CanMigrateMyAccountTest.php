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
            'telephone' => '5551234567',
        ]);
        // Create a possible migration target that would match if the flag were enabled
        User::factory()->create([
            'email_backup' => 'test@example.com',
            'telephone' => '5551234567',
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
            'telephone' => '5551234567',
        ]);
        // Create a possible migration target that would match if authenticated
        User::factory()->create([
            'email_backup' => 'test@example.com',
            'telephone' => '5551234567',
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
            'telephone' => '5551234567',
        ]);
        // Create two possible targets
        User::factory()->create([
            'email_backup' => 'test@example.com',
            'telephone' => '5551234567',
            'last_sign_in_iss' => null,
        ]);
        User::factory()->create([
            'email_backup' => 'test@example.com',
            'telephone' => '5551234567',
            'last_sign_in_iss' => null,
        ]);
        Auth::login($user);
        $result = (new CanMigrateMyAccount())();
        $this->assertFalse($result);
    }

    public function testCanMigrateIfExactlyOnePossibleTargetWithNoLastSignIn()
    {
        Config::set('feature.auth_in_app_migration', true);
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'telephone' => '5551234567',
        ]);
        // Create one possible target
        User::factory()->create([
            'email_backup' => 'test@example.com',
            'telephone' => '5551234567',
            'last_sign_in_iss' => null,
        ]);
        Auth::login($user);
        $result = (new CanMigrateMyAccount())();
        $this->assertTrue($result);
    }

    public function testCanMigrateIfExactlyOnePossibleTargetWithSicLastSignIn()
    {
        Config::set('feature.auth_in_app_migration', true);
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'telephone' => '5551234567',
        ]);
        // Create one possible target
        User::factory()->create([
            'email_backup' => 'test@example.com',
            'telephone' => '5551234567',
            'last_sign_in_iss' => 'auth.id.tbs-sct.gc.ca',
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
            'telephone' => '5551234567',
        ]);
        // Target with CanadaLogin as last_sign_in_iss
        User::factory()->create([
            'email_backup' => 'test@example.com',
            'telephone' => '5551234567',
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
            'telephone' => '5551234567',
        ]);
        $target = User::factory()->create([
            'email_backup' => 'test@example.com',
            'telephone' => '5551234567',
            'last_sign_in_iss' => null,
        ]);
        $target->delete();
        Auth::login($user);
        $result = (new CanMigrateMyAccount())();
        $this->assertFalse($result);
    }

    public function testEmailMatchingTrimsAndIsCaseInsensitive()
    {
        Config::set('feature.auth_in_app_migration', true);
        $user = User::factory()->create([
            'email' => ' Test@Example.com ',
            'telephone' => '5551234567',
        ]);
        // Create a possible migration target with different case and extra spaces
        User::factory()->create([
            'email_backup' => '  test@example.COM',
            'telephone' => '5551234567',
            'last_sign_in_iss' => null,
        ]);
        Auth::login($user);
        $result = (new CanMigrateMyAccount())();
        $this->assertTrue($result, 'Email matching should trim and be case-insensitive');
    }

    public function testTelephoneMatchingOnlyMatchesDigits()
    {
        Config::set('feature.auth_in_app_migration', true);
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'telephone' => '(555) 123-4567', // formatted with non-digit characters
        ]);
        // Create a possible migration target with only digits
        User::factory()->create([
            'email_backup' => 'test@example.com',
            'telephone' => '5551234567', // only digits
            'last_sign_in_iss' => null,
        ]);
        Auth::login($user);
        $result = (new CanMigrateMyAccount())();
        $this->assertTrue($result, 'Telephone matching should ignore non-digit characters and match only digits');
    }

    public function testTelephoneMatchingIgnoresLeadingOnes()
    {
        Config::set('feature.auth_in_app_migration', true);
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'telephone' => '+1 (555) 123-4567', // leading 1
        ]);
        // Create a possible migration target without leading 1
        User::factory()->create([
            'email_backup' => 'test@example.com',
            'telephone' => '5551234567',
            'last_sign_in_iss' => null,
        ]);
        Auth::login($user);
        $result = (new CanMigrateMyAccount())();
        $this->assertTrue($result, 'Telephone matching should ignore leading 1');
    }

    public function testTelephoneMatchingIgnoresLeadingZeros()
    {
        Config::set('feature.auth_in_app_migration', true);
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'telephone' => '00 555 1234567', // leading 0
        ]);
        // Create a possible migration target without leading 0
        User::factory()->create([
            'email_backup' => 'test@example.com',
            'telephone' => '5551234567',
            'last_sign_in_iss' => null,
        ]);
        Auth::login($user);
        $result = (new CanMigrateMyAccount())();
        $this->assertTrue($result, 'Telephone matching should ignore leading 0');
    }
}

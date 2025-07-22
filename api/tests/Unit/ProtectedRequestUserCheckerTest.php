<?php

namespace Tests\Unit;

use App\Checkers\ProtectedRequestUserChecker;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class ProtectedRequestUserCheckerTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;

    protected RoutingRoute $testRoute;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->adminUser = User::factory()
            ->asApplicant()
            ->asAdmin()
            ->create([
                'email' => 'platform-admin-user@test.com',
                'sub' => 'platform-admin-user@test.com',
            ]);

        $this->testRoute = new RoutingRoute('get', '/test', fn () => null);
    }

    /**
     * @dataProvider userCheckerProvider
     */
    public function testHasPermission(string|array $permission, ?bool $isProtectedRequest, bool $expected)
    {
        Request::merge(['isProtectedRequest' => $isProtectedRequest]);
        Route::shouldReceive('current')->andReturn($this->testRoute);
        $checker = new ProtectedRequestUserChecker($this->adminUser);
        $result = $checker->currentUserHasPermission($permission);

        $this->assertEquals($expected, $result);
    }

    public static function userCheckerProvider()
    {
        /**
         * [
         *   string|array $permission - Permissions to be checked
         *   ?bool $isProtectedRequest - If this is a protected request
         *   bool $expected - The expected result of the check
         * ]
         */
        return [
            // Single permission checks
            'limited permission unprotected' => [
                'view-any-skill',
                null,
                true,
            ],
            'limited permission protected' => [
                'view-any-skill',
                true,
                true,
            ],
            'privileged permission protected' => [
                'create-any-classification',
                true,
                true,
            ],
            'privileged permission unprotected' => [
                'create-any-classification',
                null,
                false,
            ],
            'unknown permission unprotected' => [
                'not-a-real-permission',
                null,
                false,
            ],

            // permission array checks checks
            'limited permission array unprotected' => [
                ['view-any-skill', 'view-any-skillFamily'],
                null,
                true,
            ],
            'limited permission array protected' => [
                ['view-any-skill', 'view-any-skillFamily'],
                true,
                true,
            ],
            'privileged permission array protected' => [
                ['create-any-classification', 'create-any-department'],
                true,
                true,
            ],
            'privileged permission array unprotected' => [
                ['create-any-classification', 'create-any-department'],
                null,
                false,
            ],
            'unknown permission array unprotected' => [
                ['not-a-real-permission', 'another-not-real-permission'],
                null,
                false,
            ],
        ];
    }
}

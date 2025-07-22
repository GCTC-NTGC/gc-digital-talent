<?php

namespace Tests\Unit;

use App\Checkers\ProtectedRequestUserChecker;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\DataProvider;
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

    #[DataProvider('userCheckerProvider')]
    public function test_has_permission(array|string $permission, ?bool $requireAll, ?bool $isProtectedRequest, bool $expected)
    {
        Request::merge(['isProtectedRequest' => $isProtectedRequest]);
        Route::shouldReceive('current')->andReturn($this->testRoute);
        $checker = new ProtectedRequestUserChecker($this->adminUser);
        $actual = $checker->currentUserHasPermission(permission: $permission, requireAll: $requireAll);

        $this->assertEquals($expected, $actual);
    }

    public static function userCheckerProvider()
    {
        $limited = 'view-any-skill';
        $limitedArr = [$limited, 'view-any-skillFamily'];

        $privileged = 'create-any-classification';
        $privilegedArr = [$privileged, 'create-any-department'];

        $mixed = [$limited, $privileged];

        return [
            // Single permission checks
            'limited permission unprotected' => [
                'permission' => $limited,
                'requireAll' => false,
                'isProtectedRequest' => null,
                'expected' => true,
            ],
            'limited permission protected' => [
                'permission' => $limited,
                'requireAll' => false,
                'isProtectedRequest' => true,
                'expected' => true,
            ],
            'privileged permission unprotected' => [
                'permission' => $privileged,
                'requireAll' => false,
                'isProtectedRequest' => null,
                'expected' => false,
            ],
            'privileged permission protected' => [
                'permission' => $privileged,
                'requireAll' => false,
                'isProtectedRequest' => true,
                'expected' => true,
            ],
            'unknown permission unprotected' => [
                'permission' => 'not-a-real-permission',
                'requireAll' => false,
                'isProtectedRequest' => null,
                'expected' => false,
            ],

            // Array permission checks
            'limited permission some array unprotected' => [
                'permission' => $limitedArr,
                'requireAll' => false,
                'isProtectedRequest' => null,
                'expected' => true,
            ],
            'limited permission some array protected' => [
                'permission' => $limitedArr,
                'requireAll' => false,
                'isProtectedRequest' => true,
                'expected' => true,
            ],
            'privileged permission some array unprotected' => [
                'permission' => $privilegedArr,
                'requireAll' => false,
                'isProtectedRequest' => null,
                'expected' => false,
            ],
            'privileged permission some array protected' => [
                'permission' => $privilegedArr,
                'requireAll' => false,
                'isProtectedRequest' => true,
                'expected' => true,
            ],
            'unknown permission some array unprotected' => [
                'permission' => ['not-a-real-permission', 'another-not-real-permission'],
                'requireAll' => false,
                'isProtectedRequest' => null,
                'expected' => false,
            ],
            'limited permission all array unprotected' => [
                'permission' => $limitedArr,
                'requireAll' => true,
                'isProtectedRequest' => null,
                'expected' => true,
            ],
            'limited permission all array protected' => [
                'permission' => $limitedArr,
                'requireAll' => true,
                'isProtectedRequest' => true,
                'expected' => true,
            ],
            'privileged permission all array unprotected' => [
                'permission' => $privilegedArr,
                'requireAll' => true,
                'isProtectedRequest' => null,
                'expected' => false,
            ],
            'privileged permission all array protected' => [
                'permission' => $privilegedArr,
                'requireAll' => true,
                'isProtectedRequest' => true,
                'expected' => true,
            ],
            'mixed permission some array unprotected' => [
                'permission' => $mixed,
                'requireAll' => false,
                'isProtectedRequest' => null,
                'expected' => true,
            ],
            'mixed permission some array protected' => [
                'permission' => $mixed,
                'requireAll' => false,
                'isProtectedRequest' => true,
                'expected' => true,
            ],
            'mixed permission all array unprotected' => [
                'permission' => $mixed,
                'requireAll' => true,
                'isProtectedRequest' => null,
                'expected' => false,
            ],
            'mixed permission all array protected' => [
                'permission' => $mixed,
                'requireAll' => true,
                'isProtectedRequest' => true,
                'expected' => true,
            ],

        ];
    }
}

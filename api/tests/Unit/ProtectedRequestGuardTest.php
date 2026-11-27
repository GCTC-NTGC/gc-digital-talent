<?php

namespace Tests\Unit;

use App\Http\Middleware\ProtectedRequest;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;
use LogicException;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ProtectedRequestGuardTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;

    protected RoutingRoute $testRoute;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);

        $this->adminUser = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'platform-admin-user@test.com',
                'sub' => 'platform-admin-user@test.com',
            ]);

        $this->testRoute = new RoutingRoute('get', '/test', fn () => null);
    }

    #[DataProvider('userCheckerProvider')]
    public function testHasPermission(array|string $permission, ?bool $requireAll, ?bool $isProtectedRequest, bool $expected)
    {
        Request::instance()->attributes->remove('isProtectedRequest');
        if ($isProtectedRequest) {
            Request::instance()->attributes->set('isProtectedRequest', true);
        }
        Route::shouldReceive('current')->andReturn($this->testRoute);
        $actual = $this->adminUser->hasPermission(permission: $permission, requireAll: $requireAll);

        $this->assertEquals($expected, $actual);
    }

    public function testQueryStringCannotGrantProtectedAccess()
    {
        $request = HttpRequest::create('/graphql?isProtectedRequest=true', 'POST');
        $this->app->instance('request', $request);
        Route::shouldReceive('current')->andReturn($this->testRoute);

        $this->assertFalse($this->adminUser->hasPermission('create-any-classification'));
        $this->assertFalse($this->adminUser->hasRole('platform_admin'));
        $this->assertTrue($this->adminUser->hasPermission('view-any-skill'));
    }

    public function testRequestBodyCannotGrantProtectedAccess()
    {
        $request = HttpRequest::create('/graphql', 'POST', ['isProtectedRequest' => 'true']);
        $this->app->instance('request', $request);
        Route::shouldReceive('current')->andReturn($this->testRoute);

        $this->assertFalse($this->adminUser->hasPermission('create-any-classification'));
        $this->assertFalse($this->adminUser->hasRole('platform_admin'));
        $this->assertTrue($this->adminUser->hasPermission('view-any-skill'));
    }

    public function testAdminPathGrantsProtectedAccess()
    {
        $request = HttpRequest::create('/admin/graphql', 'POST');
        (new ProtectedRequest())->handle($request, fn ($request) => $request);
        $this->app->instance('request', $request);
        Route::shouldReceive('current')->andReturn($this->testRoute);

        $this->assertTrue($this->adminUser->hasPermission('create-any-classification'));
        $this->assertTrue($this->adminUser->hasRole('platform_admin'));
        $this->assertTrue($this->adminUser->hasPermission('view-any-skill'));
    }

    // Checks through User on real routes, so the guard is proven wired into Laratrust's checks
    public function testUnprotectedRouteBlocksPrivilegedChecks()
    {
        $response = $this->actingAs($this->adminUser, 'api')->getJson($this->registerCheckRoute('/test-checks'));

        $response->assertExactJson([
            'privilegedPermission' => false,
            'privilegedRole' => false,
            'limitedPermission' => true,
            'limitedRole' => true,
        ]);
    }

    public function testProtectedRouteAllowsPrivilegedChecks()
    {
        $response = $this->actingAs($this->adminUser, 'api')->getJson($this->registerCheckRoute('/admin/test-checks'));

        $response->assertExactJson([
            'privilegedPermission' => true,
            'privilegedRole' => true,
            'limitedPermission' => true,
            'limitedRole' => true,
        ]);
    }

    public function testAbilityIsBlocked()
    {
        $this->expectException(LogicException::class);

        $this->adminUser->ability('platform_admin', 'create-any-classification');
    }

    private function registerCheckRoute(string $uri): string
    {
        Route::get($uri, fn () => [
            'privilegedPermission' => $this->adminUser->isAbleTo('create-any-classification'),
            'privilegedRole' => $this->adminUser->hasRole('platform_admin'),
            'limitedPermission' => $this->adminUser->isAbleTo('view-any-skill'),
            'limitedRole' => $this->adminUser->hasRole('base_user'),
        ]);

        return $uri;
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

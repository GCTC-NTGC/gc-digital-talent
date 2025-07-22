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

use function PHPUnit\Framework\assertFalse;
use function PHPUnit\Framework\assertTrue;

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

    public function testCanUseLimitedPermissionUnprotected()
    {
        // simulate a regular request context
        Request::merge(['isProtectedRequest' => null]);
        $checker = new ProtectedRequestUserChecker($this->adminUser);

        // a limited permission can be used in an unprotected request
        $limitedPermission = 'view-any-skill';

        assertTrue($checker->currentUserHasPermission($limitedPermission));
    }

    public function testCanUseLimitedPermissionProtected()
    {
        // simulate a protected request context
        Request::merge(['isProtectedRequest' => true]);
        $checker = new ProtectedRequestUserChecker($this->adminUser);

        // a limited permission can be used in an protected request
        $limitedPermission = 'view-any-skill';

        assertTrue($checker->currentUserHasPermission($limitedPermission));
    }

    public function testCanUsePrivilegedPermissionProtected()
    {
        // simulate a protected request context
        Request::merge(['isProtectedRequest' => true]);
        $checker = new ProtectedRequestUserChecker($this->adminUser);

        // a privileged permission can be used only in a protected request
        $privilegedPermission = 'create-any-classification';

        assertTrue($checker->currentUserHasPermission($privilegedPermission));
    }

    public function testCanNotUsePrivilegedPermissionUnprotected()
    {
        // simulate an unprotected request context
        Request::merge(['isProtectedRequest' => null]);
        Route::expects('current')->andReturn($this->testRoute);
        $checker = new ProtectedRequestUserChecker($this->adminUser);

        // a privileged permission can be used only in a protected request
        $privilegedPermission = 'create-any-classification';

        assertFalse($checker->currentUserHasPermission($privilegedPermission));
    }

    public function testCanNotUseUnknownPermissionUnprotected()
    {
        // simulate an unprotected request context
        Request::merge(['isProtectedRequest' => null]);
        $checker = new ProtectedRequestUserChecker($this->adminUser);

        // an unknown permission can not be used in a protected request
        $unknownPermission = 'not-a-real-permission';

        assertFalse($checker->currentUserHasPermission($unknownPermission));
    }

    public function testCanUseLimitedArrayPermissionUnprotected()
    {
        // simulate a regular request context
        Request::merge(['isProtectedRequest' => null]);
        $checker = new ProtectedRequestUserChecker($this->adminUser);

        // a limited permission can be used in an unprotected request
        $limitedPermission = ['view-any-skill', 'view-any-skillFamily'];

        assertTrue($checker->currentUserHasPermission($limitedPermission));
    }

    public function testCanUseLimitedArrayPermissionProtected()
    {
        // simulate a protected request context
        Request::merge(['isProtectedRequest' => true]);
        $checker = new ProtectedRequestUserChecker($this->adminUser);

        // a limited permission can be used in an protected request
        $limitedPermission = ['view-any-skill', 'view-any-skillFamily'];

        assertTrue($checker->currentUserHasPermission($limitedPermission));
    }

    public function testCanUsePrivilegedArrayPermissionProtected()
    {
        // simulate a protected request context
        Request::merge(['isProtectedRequest' => true]);
        $checker = new ProtectedRequestUserChecker($this->adminUser);

        // a privileged permission can be used only in a protected request
        $privilegedPermission = ['create-any-classification', 'create-any-department'];

        assertTrue($checker->currentUserHasPermission($privilegedPermission));
    }

    public function testCanNotUsePrivilegedArrayPermissionUnprotected()
    {
        // simulate an unprotected request context
        Request::merge(['isProtectedRequest' => null]);
        Route::expects('current')->andReturn($this->testRoute);
        $checker = new ProtectedRequestUserChecker($this->adminUser);

        // a privileged permission can be used only in a protected request
        $privilegedPermission = ['create-any-classification', 'create-any-department'];

        assertFalse($checker->currentUserHasPermission($privilegedPermission));
    }
}

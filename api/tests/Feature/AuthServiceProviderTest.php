<?php

use App\Models\User;
use App\Models\Role;
use App\Providers\AuthServiceProvider;
use App\Services\OpenIdBearerTokenService;
use Lcobucci\JWT\Token\DataSet;
use Tests\TestCase;
use Mockery\MockInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthServiceProviderTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @var MockInterface
     */
    private $mockApp;

    /**
     * @var MockInterface
     */
    private $mockAuthProvider;

    /**
     * @var AuthServiceProvider
     */
    private $provider;

    protected function setUp(): void
    {
        parent::setUp();

        $this->mockAuthProvider = Mockery::mock();
        $this->mockAuthProvider->shouldReceive('viaRequest');

        $this->mockApp = Mockery::mock(ArrayAccess::class);
        $this->mockApp
            ->shouldReceive('offsetGet')
            ->with('auth')
            ->andReturn($this->mockAuthProvider);

        $this->provider = new AuthServiceProvider($this->mockApp);
    }

    /**
     * @test
     * The test checks a an HttpException with status 401 is thrown if an exception occurs during token validation
     */
    public function test401IfException()
    {
        $fakeToken = 'fake-token';
        $mockTokenService = Mockery::mock(OpenIdBearerTokenService::class);
        $mockTokenService->shouldReceive('validateAndGetClaims')
            ->with($fakeToken)
            ->andThrow(new Exception);

        try {
            $this->provider->resolveUserOrAbort($fakeToken, $mockTokenService);
            $this->fail('HttpException was not thrown');
        } catch (HttpException $e) {
            $this->assertEquals(401, $e->getStatusCode(), 'Unexpected status code on HttpException');
        }
    }

    /**
     * @test
     * The test checks a an HttpException with status 401 is thrown if an error occurs during token validation
     */
    public function test401IfError()
    {
        $fakeToken = 'fake-token';
        $mockTokenService = Mockery::mock(OpenIdBearerTokenService::class);
        $mockTokenService->shouldReceive('validateAndGetClaims')
            ->with($fakeToken)
            ->andThrow(new Error);

        try {
            $this->provider->resolveUserOrAbort($fakeToken, $mockTokenService);
            $this->fail('HttpException was not thrown');
        } catch (HttpException $e) {
            $this->assertEquals(401, $e->getStatusCode(), 'Unexpected status code on HttpException');
        }
    }

    /**
     * @test
     * The test checks that a user is automatically created if it doesn't yet exist (by sub)
     * Also check that the new user has no roles
     */
    public function testUserIsAutoCreatedWhenMissing()
    {
        $this->seed(RolePermissionSeeder::class);

        $testSub = 'test-sub';

        // DataSet is a final class, and so we need to use it as a proxied partial mock.
        // See: https://docs.mockery.io/en/latest/reference/final_methods_classes.html#dealing-with-final-classes-methods
        $mockClaims = Mockery::mock(new DataSet(['sub' => $testSub], ''));

        $fakeToken = 'fake-token';
        $mockTokenService = Mockery::mock(OpenIdBearerTokenService::class);
        $mockTokenService->shouldReceive('validateAndGetClaims')
            ->with($fakeToken)
            ->andReturn($mockClaims);

        // starting off, they shouldn't exist
        $this->assertDatabaseMissing('users', ['sub' => $testSub]);

        // this resolve should auto-create them
        $resolvedUser = $this->provider->resolveUserOrAbort($fakeToken, $mockTokenService);

        // they should exist now, but should not be admin
        $newUser = User::where('sub', $testSub)->sole();
        $this->assertModelExists($newUser);

        $expectedRoleNames = [
            Role::where('name', 'base_user')->sole()->name,
            Role::where('name', 'applicant')->sole()->name,
        ];
        $actualRoleNames = $newUser->roles->map(function ($role) {
            return $role->name;
        })->toArray();

        $this->assertEqualsCanonicalizing($actualRoleNames, $expectedRoleNames);
    }

    /**
     * @test
     * The test checks that a user is not automatically created if it already exists(by sub)
     */
    public function testUserIsNotAutoCreatedWhenAlreadyExisting()
    {
        $testSub = 'test-sub';
        $testRoles = ["TEST"];

        $mockClaims = Mockery::mock(new DataSet(['sub' => $testSub], ''));

        $fakeToken = 'fake-token';
        $mockTokenService = Mockery::mock(OpenIdBearerTokenService::class);
        $mockTokenService->shouldReceive('validateAndGetClaims')
            ->with($fakeToken)
            ->andReturn($mockClaims);

        // starting off, they shouldn't exist
        $this->assertDatabaseMissing('users', ['sub' => $testSub]);

        // manually add the user with the sub
        $existingUser = new User;
        $existingUser->sub = $testSub;
        $existingUser->first_name = 'test';
        $existingUser->save();

        // they should exist now
        $this->assertDatabaseHas('users', ['sub' => $testSub, 'first_name' => 'test']);
        // this should not recreate them - that would wipe out the test role on our test user
        $resolvedUser = $this->provider->resolveUserOrAbort($fakeToken, $mockTokenService);
        // make sure our test user did not get wiped
        $this->assertDatabaseHas('users', ['sub' => $testSub, 'first_name' => 'test']);
    }
}

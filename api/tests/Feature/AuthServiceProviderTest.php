<?php

namespace Tests\Feature;

use App\Exceptions\AuthenticationException;
use App\Models\Role;
use App\Models\User;
use App\Providers\AuthServiceProvider;
use App\Services\OpenIdBearerTokenService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Lcobucci\JWT\Token\DataSet;
use Lcobucci\JWT\Validation\ConstraintViolation;
use Lcobucci\JWT\Validation\RequiredConstraintsViolated;
use Mockery\MockInterface;
use Tests\TestCase;

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

        $this->mockAuthProvider = \Mockery::mock();
        $this->mockAuthProvider->shouldReceive('viaRequest');

        $this->mockApp = \Mockery::mock(\ArrayAccess::class);
        $this->mockApp
            ->shouldReceive('offsetGet')
            ->with('auth')
            ->andReturn($this->mockAuthProvider);

        $this->provider = new AuthServiceProvider($this->mockApp);
    }

    /**
     * @test
     * The test checks if an AuthenticationException is thrown if a ConstraintViolation occurs during token validation
     */
    public function testAuthenticationExceptionWithInvalidToken()
    {
        $fakeToken = 'fake-token';
        $mockTokenService = \Mockery::mock(OpenIdBearerTokenService::class);
        $mockTokenService->shouldReceive('validateAndGetClaims')
            ->with($fakeToken)
            ->andThrow(new RequiredConstraintsViolated('mock error', [
                new ConstraintViolation('constraint 1'),
                new ConstraintViolation('constraint 2'),
            ]));
        try {
            $this->provider->resolveUserOrAbort($fakeToken, $mockTokenService);
            $this->fail('AuthenticationException was not thrown');
        } catch (AuthenticationException $e) {
            $this->assertEquals('invalid_token', $e->getExtensions()['reason'], 'Unexpected reason on AuthenticationException');
        }
    }

    /**
     * @test
     * The test checks if an HttpException with status 401 is thrown if an error occurs during token validation
     */
    public function testAuthenticationExceptionOnTokenValidation()
    {
        $fakeToken = 'fake-token';
        $mockTokenService = \Mockery::mock(OpenIdBearerTokenService::class);
        $mockTokenService->shouldReceive('validateAndGetClaims')
            ->with($fakeToken)
            ->andThrow(new \Error);

        try {
            $this->provider->resolveUserOrAbort($fakeToken, $mockTokenService);
            $this->fail('HttpException was not thrown');
        } catch (AuthenticationException $e) {
            $this->assertEquals('token_validation', $e->getExtensions()['reason'], 'Unexpected reason on AuthenticationException');
        }
    }

    /**
     * @test
     * The test checks that a user is not automatically created if it already exists(by sub)
     */
    public function testUserIsNotAutoCreatedWhenAlreadyExisting()
    {
        $testSub = 'test-sub';
        $testRoles = ['TEST'];

        $mockClaims = \Mockery::mock(new DataSet(['sub' => $testSub], ''));

        $fakeToken = 'fake-token';
        $mockTokenService = \Mockery::mock(OpenIdBearerTokenService::class);
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

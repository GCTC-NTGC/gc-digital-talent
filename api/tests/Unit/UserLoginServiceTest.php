<?php

namespace Tests\Unit;

use App\Models\User;
use App\Services\UserLoginService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Lcobucci\JWT\Token\DataSet;
use Tests\TestCase;

class UserLoginServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        User::factory()->create(['sub' => 'existing-sub']);

        config([
            'app.url' => 'https://app.test',
            'app.dev_url' => 'https://dev.test',
            'oauth.post_login_redirect' => 'https://app.test/after-login',
            'oauth.post_login_registration_redirect' => 'https://app.test/register',
            'oauth.dev_post_login_redirect' => 'https://dev.test/after-login',
            'oauth.dev_post_login_registration_redirect' => 'https://dev.test/register',
        ]);
    }

    private function redirectFor(array $session, bool $newUser): array
    {
        $request = Request::create('/auth-callback');
        $request->setLaravelSession($this->app['session.store']);
        foreach ($session as $key => $value) {
            $request->session()->put($key, $value);
        }

        $sub = $newUser ? 'new-sub-'.uniqid() : 'existing-sub';
        $location = (new UserLoginService())
            ->completeLogin($request, new DataSet(['sub' => $sub], ''), ['access_token' => 'abc'])
            ->getTargetUrl();

        $uri = strtok($location, '?');
        parse_str(parse_url($location, PHP_URL_QUERY), $query);

        return [$uri, $query];
    }

    public function testExistingUserGoesToFromPath()
    {
        [$uri, $query] = $this->redirectFor(['from' => '/en/applicant'], false);

        $this->assertSame('https://app.test/en/applicant', $uri);
        $this->assertSame('abc', $query['access_token']);
        $this->assertArrayNotHasKey('from', $query);
    }

    public function testExistingUserWithoutFromGoesToDefault()
    {
        [$uri] = $this->redirectFor([], false);

        $this->assertSame('https://app.test/after-login', $uri);
    }

    public function testNewUserGoesToRegistrationWithFrom()
    {
        [$uri, $query] = $this->redirectFor(['from' => '/en/applicant'], true);

        $this->assertSame('https://app.test/register', $uri);
        $this->assertSame('/en/applicant', $query['from']);
    }

    public function testAbsoluteFromIsDiscarded()
    {
        [$uri] = $this->redirectFor(['from' => 'https://evil.test/'], false);

        $this->assertSame('https://app.test/after-login', $uri);
    }

    public function testDevServerUsesDevRedirects()
    {
        [$existingUri] = $this->redirectFor(['devServer' => true, 'from' => '/en'], false);
        [$newUri] = $this->redirectFor(['devServer' => true], true);

        $this->assertSame('https://dev.test/en', $existingUri);
        $this->assertSame('https://dev.test/register', $newUri);
    }
}

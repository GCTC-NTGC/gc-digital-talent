<?php

namespace Tests\Feature;

use App\Contracts\BearerTokenService;
use App\Models\User;
use App\Services\DummyBearerTokenService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Foundation\Bootstrap\LoadConfiguration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use RuntimeException;
use Tests\TestCase;

class DummyAuthTest extends TestCase
{
    use RefreshDatabase;

    private const DUMMY_CONFIG = [
        'auth.login_provider' => 'dummy',
        'app.vertical' => 'uat',
        'oauth.client_id' => '',
        'oauth.client_secret' => '',
    ];

    /**
     * Config applied on top of DUMMY_CONFIG when the app boots.
     *
     * @var array<string, mixed>
     */
    private array $configOverrides = [];

    /**
     * Routes and bindings are chosen when the app boots, so set the config right after it
     * loads. Changing env vars instead is unreliable: Laravel caches the env repository
     * across test apps, so a later boot reloads .env over them.
     */
    public function createApplication()
    {
        $app = require __DIR__.'/../../bootstrap/app.php';
        $app->afterBootstrapping(LoadConfiguration::class, function ($app) {
            $app['config']->set([...self::DUMMY_CONFIG, ...$this->configOverrides]);
        });
        $app->make(Kernel::class)->bootstrap();

        return $app;
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        config([
            'app.url' => 'http://app.test',
            'oauth.post_login_redirect' => 'http://app.test/after-login',
            'oauth.post_login_registration_redirect' => 'http://app.test/register',
        ]);
    }

    private function queryFromRedirect($response): array
    {
        parse_str(parse_url($response->headers->get('Location'), PHP_URL_QUERY), $query);

        return $query;
    }

    public static function unsafeEnvProvider(): array
    {
        return [
            'production vertical' => [['app.vertical' => 'production'], 'APP_ENV_VERTICAL=production'],
            'client id set' => [['oauth.client_id' => 'real-client'], 'OAUTH_API_CLIENT_ID'],
            'client secret set' => [['oauth.client_secret' => 'real-secret'], 'OAUTH_API_CLIENT_ID'],
        ];
    }

    #[DataProvider('unsafeEnvProvider')]
    public function testRefusesToBootInUnsafeEnvironment(array $config, string $message)
    {
        $this->configOverrides = $config;

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage($message);
        $this->createApplication();
    }

    public function testDummyTokenServiceIsBound()
    {
        $this->assertInstanceOf(DummyBearerTokenService::class, $this->app->make(BearerTokenService::class));
    }

    public function testLoginShowsFormWithWarning()
    {
        $this->get('/login?from=/en/applicant')
            ->assertOk()
            ->assertSee('Test authentication')
            ->assertSee('name="sub"', false)
            ->assertSessionHas('from', '/en/applicant');
    }

    public function testFormLoginCreatesUserAndHandsOffTokens()
    {
        $response = $this->post('/login', [
            'sub' => 'new-sub',
            'claims' => json_encode(['given_name' => 'Ada', 'family_name' => 'Lovelace', 'locale' => 'fr']),
        ]);

        $response->assertRedirect();
        $this->assertStringStartsWith('http://app.test/register?', $response->headers->get('Location'));
        $query = $this->queryFromRedirect($response);
        $this->assertSame('Bearer', $query['token_type']);
        $this->assertSame('new-sub', app(DummyBearerTokenService::class)->validateAndGetClaims($query['access_token'])->get('sub'));

        $user = User::where('sub', 'new-sub')->sole();
        $this->assertSame('Ada', $user->first_name);
        $this->assertSame('Lovelace', $user->last_name);
        $this->assertTrue($user->looking_for_french);
        $this->assertTrue($user->hasRole('applicant'));
    }

    public function testFormLoginOnlyAppliesProvidedClaims()
    {
        User::factory()->create(['sub' => 'existing-sub', 'first_name' => 'Old', 'last_name' => 'Name']);

        $response = $this->post('/login', [
            'sub' => 'existing-sub',
            'claims' => json_encode(['given_name' => '']),
        ]);

        $this->assertStringStartsWith('http://app.test/after-login?', $response->headers->get('Location'));
        $user = User::where('sub', 'existing-sub')->sole();
        $this->assertEmpty($user->first_name);
        $this->assertSame('Name', $user->last_name);
    }

    public function testFormLoginRejectsMissingSubAndInvalidClaims()
    {
        $this->post('/login', ['claims' => '{}'])->assertSessionHasErrors('sub');
        $this->post('/login', ['sub' => 'a-sub', 'claims' => 'not json'])->assertSessionHasErrors('claims');
        $this->post('/login', ['sub' => 'a-sub', 'claims' => '[1, 2]'])->assertSessionHasErrors('claims');
        $this->assertSame(0, User::count());
    }

    public function testRefreshIsRejected()
    {
        $this->post('/refresh', ['refresh_token' => 'anything'])->assertUnauthorized();
    }

    public function testTokenRouteCreatesUserAndReturnsTokens()
    {
        $response = $this->postJson('/api/dummy-auth/token', [
            'sub' => 'script-sub',
            'claims' => ['given_name' => 'Grace', 'email' => 'grace@example.org'],
        ]);

        $response->assertOk()->assertJsonStructure(['access_token', 'id_token', 'token_type']);
        $user = User::where('sub', 'script-sub')->sole();
        $this->assertSame('Grace', $user->first_name);
        $this->assertSame('grace@example.org', $user->email);
    }

    public function testTokenRouteTakesEmailFromAnotherUser()
    {
        $other = User::factory()->create(['sub' => 'other-sub', 'email' => 'shared@example.org']);

        $this->postJson('/api/dummy-auth/token', [
            'sub' => 'script-sub',
            'claims' => ['email' => 'shared@example.org'],
        ])->assertOk();

        $this->assertSame('shared@example.org', User::where('sub', 'script-sub')->sole()->email);
        $this->assertNull($other->fresh()->email);
        $this->assertSame('shared@example.org', $other->fresh()->email_backup);
    }

    public function testTokenRouteRejectsBadInput()
    {
        $this->postJson('/api/dummy-auth/token', [])->assertStatus(422);
        $this->postJson('/api/dummy-auth/token', ['sub' => 'a-sub', 'claims' => [1, 2]])->assertStatus(422);
    }

    public function testDummyTokenAuthenticatesExistingUser()
    {
        $user = User::factory()->create(['sub' => 'existing-sub']);

        $this->withToken(app(DummyBearerTokenService::class)->issueToken('existing-sub'))
            ->postJson('/graphql', ['query' => '{ me { id } }'])
            ->assertJsonPath('data.me.id', $user->id);
    }

    public function testDummyTokenForUnknownSubIsRejected()
    {
        $this->withToken(app(DummyBearerTokenService::class)->issueToken('unknown-sub'))
            ->postJson('/graphql', ['query' => '{ me { id } }'])
            ->assertJsonPath('data.me', null);
        $this->assertSame(0, User::where('sub', 'unknown-sub')->count());
    }

    public function testLogoutRedirectsOnlyWithinTheApp()
    {
        $this->get('/api/dummy-auth/logout?post_logout_redirect_uri='.urlencode('http://app.test/en/logged-out'))
            ->assertRedirect('http://app.test/en/logged-out');

        $this->get('/api/dummy-auth/logout?post_logout_redirect_uri='.urlencode('https://evil.test/'))
            ->assertRedirect('http://app.test');

        $this->get('/api/dummy-auth/logout?post_logout_redirect_uri='.urlencode('http://app.test.evil.test/'))
            ->assertRedirect('http://app.test');
    }
}

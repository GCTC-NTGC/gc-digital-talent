<?php

namespace Tests\Unit;

use App\Services\CanadaLoginBearerTokenService;
use DateTimeImmutable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer;
use Lcobucci\JWT\Signer\Key\InMemory;
use Psr\Clock\ClockInterface;
use Tests\TestCase;

class CanadaLoginBearerTokenTest extends TestCase
{
    /**
     * @var App\Contracts\BearerTokenService
     */
    protected $service_provider;

    protected \DateInterval $allowableClockSkew;

    const fakeRootUrl = 'http://test.com';

    const fakeConfigUrl = self::fakeRootUrl.'/config';

    const fakeJwksUrl = self::fakeRootUrl.'/jwks';

    const fakeAudience = 'fake-development-client-key';

    private function getToken(
        string $subject = '1234567890',
        string $issuer = self::fakeRootUrl,
        string|array|null $audience = self::fakeAudience,
        int $expiresAt = 2147483647,
        int $issuedAt = 0,
        string $keyId = 'key1',
        string $privateKeyResource = 'key1.pem',
    ): string {
        $config = Configuration::forAsymmetricSigner(
            new Signer\Rsa\Sha256(),
            InMemory::file(__DIR__.'/resources/'.$privateKeyResource),
            InMemory::file(__DIR__.'/resources/'.str_replace('.pem', '-cert.pem', $privateKeyResource)),
        );

        $builder = $config->builder()
            ->withHeader('kid', $keyId)
            ->withHeader('typ', 'JWT')
            ->relatedTo($subject)
            ->issuedBy($issuer)
            ->issuedAt((new DateTimeImmutable())->setTimestamp($issuedAt))
            ->expiresAt((new DateTimeImmutable())->setTimestamp($expiresAt));

        foreach ((array) $audience as $audienceValue) {
            $builder = $builder->permittedFor(strval($audienceValue));
        }

        return $builder->getToken($config->signer(), $config->signingKey())->toString();
    }

    protected bool $fakeIntrospectionIsActive;

    protected DateTimeImmutable $fakeIntrospectionExpiry;

    protected function setUp(): void
    {
        parent::setUp(); // initializes Http facade
        Cache::flush(); // Start with fresh cache
        config(['oauth.client_id' => self::fakeAudience]);

        $fakeIntrospectionUrl = self::fakeRootUrl.'/introspection';

        Http::fake([
            self::fakeConfigUrl => Http::response('{ '.
                '"issuer" : "'.self::fakeRootUrl.'", '.
                '"jwks_uri" : "'.self::fakeJwksUrl.'",'.
                '"introspection_endpoint" : "'.$fakeIntrospectionUrl.'"'.
                '}'),
            self::fakeJwksUrl => Http::response(file_get_contents('tests/Unit/resources/jwks.json')),
            $fakeIntrospectionUrl => function () {
                return Http::response(json_encode([
                    'active' => $this->fakeIntrospectionIsActive,
                    'exp' => $this->fakeIntrospectionExpiry->getTimestamp(),
                ]));
            },
        ]);

        // generate keys and tokens for testing at https://jwt.io/#debugger-io
        // make sure you set algorithm to RS256

        Carbon::setTestNow('2020-01-01 00:02:00');
        $this->allowableClockSkew = \DateInterval::createFromDateString('4 minutes');
        $this->service_provider = new CanadaLoginBearerTokenService(
            self::fakeConfigUrl,
            $this->app->make(ClockInterface::class),
            $this->allowableClockSkew
        );
    }

    protected function setIntrospectionResponse(bool $isActive, ?DateTimeImmutable $expiry = null)
    {
        if (is_null($expiry)) {
            // calculate an expiry time stamp
            if ($isActive) {
                $expiry = Carbon::now()->add('minutes', 1)->toDateTimeImmutable();
            } else {
                $expiry = Carbon::now()->sub('minutes', 1)->toDateTimeImmutable();
            }
        }

        $this->fakeIntrospectionIsActive = $isActive;
        $this->fakeIntrospectionExpiry = $expiry;
    }

    /**
     * A valid token is provided and validated.  The test checks that the right sub value is returned.
     */
    public function testAcceptsGoodTokenAndReturnsCorrectSub()
    {
        $token = $this->getToken();
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",               -- should be validated by key1 (see the resources directory)
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",         -- arbitrary subscriber string
        "iss": "http://test.com",    -- arbitrary issuer
        "exp": 2147483647,           -- expires at end of time
        "iat": 0                     -- issued at beginning of time
        }
         */
        $this->setIntrospectionResponse(true);
        $claims = $this->service_provider->validateAndGetClaims($token);
        $this->assertEquals('1234567890', $claims->get('sub'));
    }

    /**
     * An empty string is provided and should be rejected.
     */
    public function testRejectsEmptyToken()
    {
        $this->expectException(\Exception::class);
        $token = '';
        $this->service_provider->validateAndGetClaims($token);
    }

    /**
     * A nonsense string is provided and should be rejected.
     */
    public function testRejectsNonsenseToken()
    {
        $this->expectException(\Exception::class);
        $token = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        $this->service_provider->validateAndGetClaims($token);
    }

    /**
     * A token is provided but has the wrong issuer and should be rejected.
     */
    public function testRejectsIncorrectIssuer()
    {
        $this->expectException(\Exception::class);
        $token = $this->getToken(issuer: 'http://wrongdomain.com');
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",
        "iss": "http://wrongdomain.com",
        "exp": 2147483647,
        "iat": 0
        }
         */
        $this->service_provider->validateAndGetClaims($token);
    }

    /**
     * A token is provided but has the wrong audience and should be rejected.
     */
    public function testRejectsIncorrectAudience()
    {
        $this->expectException(\Exception::class);
        $token = $this->getToken(audience: 'wrong-client-id');
        $this->service_provider->validateAndGetClaims($token);
    }

    /**
     * A token is provided but has expired and should be rejected.
     */
    public function testRejectsExpiredToken()
    {
        $this->expectException(\Exception::class);
        $token = $this->getToken(expiresAt: 1);
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",
        "iss": "http://test.com",
        "exp": 1,
        "iat": 0
        }
         */
        $this->service_provider->validateAndGetClaims($token);
    }

    /**
     * A token is provided but the issuing datetime is in the future and should be rejected.
     */
    public function testRejectsFutureToken()
    {
        $this->expectException(\Exception::class);
        $token = $this->getToken(issuedAt: 2147483646);
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",
        "iss": "http://test.com",
        "exp": 2147483647,
        "iat": 2147483646
        }
         */
        $this->service_provider->validateAndGetClaims($token);
    }

    /**
     * This is a good and valid token but was not signed by the expected key so it should be rejected
     */
    public function testRejectsTokenSignedWithDifferentKey()
    {
        $this->expectException(\Exception::class);
        // this token actually signed with key2
        $token = $this->getToken(privateKeyResource: 'key2.pem');
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",
        "iss": "http://test.com",
        "exp": 2147483647,
        "iat": 0
        }
         */
        $this->service_provider->validateAndGetClaims($token);
    }

    /**
     * A token is provided but has expired within allowable clock skew and should be accepted.
     */
    public function testAcceptsExpiredTokenWithinAllowableSkew()
    {
        $token = $this->getToken(expiresAt: 1577836860);
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",
        "iss": "http://test.com",
        "exp": 1577836860, //2020-01-01 00:01:00
        "iat": 0
        }
         */
        $this->setIntrospectionResponse(true);
        $claims = $this->service_provider->validateAndGetClaims($token);  // will throw an exception for rejected tokens

        // checks that the test was properly set up
        $this->assertTrue(Carbon::now() > $claims->get('exp'), 'test value for now was not after strict expiry date');
        $this->assertTrue(Carbon::now() < $claims->get('exp')->add($this->allowableClockSkew), 'test value for now was not within the expiry date plus allowed skew');
    }

    /**
     * A valid token is provided and validated.  The test checks that the right sub value is returned.
     */
    public function testThatIntrospectionCanRejectAValidToken()
    {
        $token = $this->getToken();
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",               -- should be validated by key1 (see the resources directory)
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",         -- arbitrary subscriber string
        "iss": "http://test.com",    -- arbitrary issuer
        "exp": 2147483647,           -- expires at end of time
        "iat": 0                     -- issued at beginning of time
        }
         */
        $this->setIntrospectionResponse(false);
        $this->expectException(\Exception::class);
        $claims = $this->service_provider->validateAndGetClaims($token);
    }

    /**
     * If a second introspection call is made in quick succession, the second response should be a cached one.
     */
    public function testThatASecondQuickIntrospectionRequestIsCached()
    {
        $token = $this->getToken();
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",               -- should be validated by key1 (see the resources directory)
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",         -- arbitrary subscriber string
        "iss": "http://test.com",    -- arbitrary issuer
        "exp": 2147483647,           -- expires at end of time
        "iat": 0                     -- issued at beginning of time
        }
         */
        $this->setIntrospectionResponse(true);

        Http::assertSentCount(0);
        $this->service_provider->validateAndGetClaims($token);
        Http::assertSentCount(3); // calls config, jwks, and introspection

        $this->travel(1)->second();
        $this->service_provider->validateAndGetClaims($token);
        Http::assertSentCount(3); // hasn't changed, used cached response
    }

    /**
     * If a second introspection call is made much later, the second response should not be a cached one.
     */
    public function testThatASecondLongIntrospectionRequestIsNotCached()
    {
        $token = $this->getToken();
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",               -- should be validated by key1 (see the resources directory)
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",         -- arbitrary subscriber string
        "iss": "http://test.com",    -- arbitrary issuer
        "exp": 2147483647,           -- expires at end of time
        "iat": 0                     -- issued at beginning of time
        }
         */
        $this->setIntrospectionResponse(true);

        Http::assertSentCount(0);
        $this->service_provider->validateAndGetClaims($token);
        Http::assertSentCount(3); // calls config, jwks, and introspection

        // advance the clock by cache time
        $this->travel((int) config('oauth.introspection_cache_time'))->seconds();
        $this->service_provider->validateAndGetClaims($token);
        Http::assertSentCount(4); // made an extra call since it's not cached anymore
    }

    /**
     * If a second introspection call is made in quick succession, but the token is expired, the second response should not be a cached one.
     */
    public function testThatASecondQuickIntrospectionRequestIsNotCachedWhenExpired()
    {
        $token = $this->getToken(expiresAt: 1577836805);
        /** analyze token at https://jwt.io/
        {
        "kid": "key1",               -- should be validated by key1 (see the resources directory)
        "typ": "JWT",
        "alg": "RS256"
        }
        {
        "sub": "1234567890",         -- arbitrary subscriber string
        "iss": "http://test.com",    -- arbitrary issuer
        "exp": 1577836805,           -- expires at 2020-01-01 00:00:05 GMT
        "iat": 0                     -- issued at beginning of time
        }
         */
        Http::assertSentCount(0);

        Carbon::setTestNow('2020-01-01 00:00:00'); // not yet expired
        $this->setIntrospectionResponse(true, Carbon::createFromTimeString('2020-01-01 00:00:05')->toImmutable());
        $this->service_provider->validateAndGetClaims($token);

        $this->expectException(\Exception::class);

        // advance the clock by 6 seconds (more than 5 second expiry but less than the 10 second cache time)
        Carbon::setTestNow('2020-01-01 00:00:06');
        $this->setIntrospectionResponse(false, Carbon::createFromTimeString('2020-01-01 00:00:05')->toImmutable());
        $this->service_provider->validateAndGetClaims($token); // throws exception because token is expired, not cached
    }
}

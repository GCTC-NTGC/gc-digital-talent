<?php

namespace Tests\Unit;

use App\Services\OpenIdBearerTokenService;
use DateTimeImmutable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Psr\Clock\ClockInterface;
use Tests\TestCase;

class OpenIdBearerTokenTest extends TestCase
{
    /**
     * @var OpenIdBearerTokenService
     */
    protected $service_provider;

    protected \DateInterval $allowableClockSkew;

    const fakeRootUrl = 'http://test.com';

    const fakeConfigUrl = self::fakeRootUrl.'/config';

    const fakeJwksUrl = self::fakeRootUrl.'/jwks';

    protected bool $fakeIntrospectionIsActive;

    protected DateTimeImmutable $fakeIntrospectionExpiry;

    protected function setUp(): void
    {
        parent::setUp(); // initializes Http facade

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
        $this->service_provider = new OpenIdBearerTokenService(
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
}

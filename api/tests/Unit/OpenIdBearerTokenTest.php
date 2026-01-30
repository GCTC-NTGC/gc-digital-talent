<?php

namespace Tests\Unit;

use App\Services\OpenIdBearerTokenService;
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

    const fakeRootUrl = 'http://example.org';

    const fakeConfigUrl = self::fakeRootUrl.'/config';

    const fakeIntrospectionUrl = self::fakeRootUrl.'/introspection';

    protected array $fakeIntrospectionData = [];

    protected function setUp(): void
    {
        parent::setUp(); // initializes Http facade

        Http::fake([
            self::fakeConfigUrl => Http::response('{ '.
                '"issuer" : "'.self::fakeRootUrl.'", '.
                '"introspection_endpoint" : "'.self::fakeIntrospectionUrl.'"'.
                '}'),

            self::fakeIntrospectionUrl => fn () => Http::response(json_encode($this->fakeIntrospectionData)),
        ]);

        Carbon::setTestNow('2020-01-01 00:02:00');
        $this->allowableClockSkew = \DateInterval::createFromDateString('4 minutes');
        $this->service_provider = new OpenIdBearerTokenService(
            self::fakeConfigUrl,
            $this->app->make(ClockInterface::class),
            $this->allowableClockSkew
        );
    }

    /**
     * A valid token is provided and validated.  The test checks that the right sub value is returned.
     */
    public function testAcceptsGoodTokenAndReturnsCorrectSub()
    {
        $token = 'opaque-value';
        $this->fakeIntrospectionData = [
            'active' => true,
            'exp' => 2147483647, // end of time
            'sub' => '1234567890',
        ];
        $sub = $this->service_provider->getSubWithIntrospection($token);
        $this->assertEquals('1234567890', $sub);
    }

    /**
     * An bad token is provided and should be rejected.
     */
    public function testRejectsBadToken()
    {
        $token = 'opaque-value';
        $this->fakeIntrospectionData = [
            'active' => false,
        ];
        $sub = $this->service_provider->getSubWithIntrospection($token);
        $this->assertNull($sub);
    }

    /**
     * If a second introspection call is made in quick succession, the second response should be a cached one.
     */
    public function testThatASecondQuickIntrospectionRequestIsCached()
    {
        $token = 'opaque-value';
        $this->fakeIntrospectionData = [
            'active' => true,
            'exp' => 2147483647, // end of time
            'sub' => '1234567890',
        ];

        Http::assertSentCount(0);
        $this->service_provider->getSubWithIntrospection($token);
        Http::assertSentCount(2); // calls config and introspection

        $this->travel(1)->second();
        $this->service_provider->getSubWithIntrospection($token);
        Http::assertSentCount(2); // hasn't changed, used cached response
    }

    /**
     * If a second introspection call is made much later, the second response should not be a cached one.
     */
    public function testThatASecondLongIntrospectionRequestIsNotCached()
    {
        $token = 'opaque-value';
        $this->fakeIntrospectionData = [
            'active' => true,
            'exp' => 2147483647, // end of time
            'sub' => '1234567890',
        ];

        Http::assertSentCount(0);
        $this->service_provider->getSubWithIntrospection($token);
        Http::assertSentCount(2); // calls config and introspection

        // advance the clock by 30 seconds
        $this->travel(30)->seconds();
        $this->service_provider->getSubWithIntrospection($token);
        Http::assertSentCount(3); // made an extra call since it's not cached anymore
    }

    /**
     * If a second introspection call is made in quick succession, but the token is expired, the second response should not be a cached one.
     */
    public function testThatASecondQuickIntrospectionRequestIsNotCachedWhenExpired()
    {
        $token = 'opaque-value';

        HTTP::assertSentCount(0);

        Carbon::setTestNow('2020-01-01 00:00:00'); // not yet expired

        $this->fakeIntrospectionData = [
            'active' => true,
            'exp' => 1577836805, // expires at 2020-01-01 00:00:05 GMT
            'sub' => '1234567890',
        ];

        $sub1 = $this->service_provider->getSubWithIntrospection($token);
        $this->assertEquals('1234567890', $sub1);

        // advance the clock by 6 seconds (more than 5 second expiry but less than the 10 second cache time)
        Carbon::setTestNow('2020-01-01 00:00:06');

        $this->fakeIntrospectionData = [
            'active' => false,
        ];
        $sub2 = $this->service_provider->getSubWithIntrospection($token);
        $this->assertNull($sub2); // no sub because token is expired, not cached
    }
}

<?php

namespace Tests\Unit;

use App\Services\PrivateKeyJwtAuthenticationService;
use Illuminate\Support\Carbon;
use Jose\Component\Core\AlgorithmManager;
use Jose\Component\Core\JWK;
use Jose\Component\KeyManagement\JWKFactory;
use Jose\Component\Signature\Algorithm\RS256;
use Jose\Component\Signature\JWSVerifier;
use Jose\Component\Signature\Serializer\CompactSerializer;
use Psr\Clock\ClockInterface;
use Tests\TestCase;

class PrivateKeyJwtAuthenticationServiceTest extends TestCase
{
    private string $jwkPath;

    private JWK $jwk;

    protected function setUp(): void
    {
        parent::setUp();

        $this->jwkPath = sys_get_temp_dir().'/oauth-client-jwk-test-'.uniqid().'.json';
        $this->jwk = JWKFactory::createRSAKey(2048, [
            'use' => 'sig',
            'alg' => 'RS256',
            'kid' => 'test-kid',
        ]);
        file_put_contents($this->jwkPath, json_encode($this->jwk));
    }

    protected function tearDown(): void
    {
        @unlink($this->jwkPath);
        parent::tearDown();
    }

    private function makeService(?string $jwkPath = null): PrivateKeyJwtAuthenticationService
    {
        return new PrivateKeyJwtAuthenticationService(
            'test-client-id',
            $jwkPath ?? $this->jwkPath,
            $this->app->make(ClockInterface::class),
            60,
        );
    }

    public function testReturnsAssertionTypeAndValidSignedAssertion()
    {
        Carbon::setTestNow('2020-01-01 00:00:00');

        $params = $this->makeService()->paramsFor('https://example.com/token');

        $this->assertSame('urn:ietf:params:oauth:client-assertion-type:jwt-bearer', $params['client_assertion_type']);
        $this->assertArrayNotHasKey('client_secret', $params);

        $jws = (new CompactSerializer())->unserialize($params['client_assertion']);

        // verify the signature using only the public half of the key, as CanadaLogin would via jwks.json
        $verifier = new JWSVerifier(new AlgorithmManager([new RS256()]));
        $this->assertTrue($verifier->verifyWithKey($jws, $this->jwk->toPublic(), 0));

        $claims = json_decode($jws->getPayload(), true);
        $this->assertSame('test-client-id', $claims['iss']);
        $this->assertSame('test-client-id', $claims['sub']);
        $this->assertSame('https://example.com/token', $claims['aud']);
        $this->assertNotEmpty($claims['jti']);
        $this->assertSame(1577836800, $claims['iat']);
        $this->assertSame(1577836860, $claims['exp']);

        $header = json_decode(base64_decode(strtr(explode('.', $params['client_assertion'])[0], '-_', '+/')), true);
        $this->assertSame('test-kid', $header['kid']);
        $this->assertSame('RS256', $header['alg']);
    }

    public function testThrowsWhenKeyFileMissing()
    {
        unlink($this->jwkPath);

        $this->expectException(\RuntimeException::class);

        $this->makeService()->paramsFor('https://example.com/token');
    }
}

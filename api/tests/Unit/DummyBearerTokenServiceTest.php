<?php

namespace Tests\Unit;

use App\Services\DummyBearerTokenService;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;
use Throwable;

class DummyBearerTokenServiceTest extends TestCase
{
    private DummyBearerTokenService $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = new DummyBearerTokenService();
    }

    private static function encode(array|string $data): string
    {
        return rtrim(strtr(base64_encode(is_string($data) ? $data : json_encode($data)), '+/', '-_'), '=');
    }

    public function testIssuedTokenRoundTrips()
    {
        $token = $this->service->issueToken('test-sub', ['given_name' => 'Ada', 'email' => '']);

        $claims = $this->service->validateAndGetClaims($token);

        $this->assertSame('test-sub', $claims->get('sub'));
        $this->assertSame(DummyBearerTokenService::ISSUER, $claims->get('iss'));
        $this->assertSame('Ada', $claims->get('given_name'));
        $this->assertTrue($claims->has('email'));
        $this->assertFalse($claims->has('family_name'));
    }

    public function testIssuedTokenIsJwtShapedWithNoSignatureOrExpiry()
    {
        $token = $this->service->issueToken('test-sub');

        $this->assertMatchesRegularExpression('/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.$/', $token);
        [$header, $payload] = explode('.', $token);
        $this->assertSame('none', json_decode(base64_decode(strtr($header, '-_', '+/')), true)['alg']);
        $this->assertArrayNotHasKey('exp', json_decode(base64_decode(strtr($payload, '-_', '+/')), true));
    }

    public function testClaimsCannotOverrideIssuerOrSub()
    {
        $token = $this->service->issueToken('test-sub', ['iss' => 'someone-else', 'sub' => 'other-sub']);

        $claims = $this->service->validateAndGetClaims($token);

        $this->assertSame('test-sub', $claims->get('sub'));
        $this->assertSame(DummyBearerTokenService::ISSUER, $claims->get('iss'));
    }

    public static function invalidTokenProvider(): array
    {
        $header = self::encode(['alg' => 'none']);
        $iss = DummyBearerTokenService::ISSUER;

        return [
            'two parts' => [$header.'.'.self::encode(['iss' => $iss, 'sub' => 'test-sub'])],
            'payload not json' => [$header.'.'.self::encode('not-json').'.'],
            'payload not an object' => [$header.'.'.self::encode('"text"').'.'],
            'wrong issuer' => [$header.'.'.self::encode(['iss' => 'oxauth', 'sub' => 'test-sub']).'.'],
            'missing sub' => [$header.'.'.self::encode(['iss' => $iss]).'.'],
            'empty sub' => [$header.'.'.self::encode(['iss' => $iss, 'sub' => '']).'.'],
        ];
    }

    #[DataProvider('invalidTokenProvider')]
    public function testInvalidTokensAreRejected(string $token)
    {
        $this->expectException(Throwable::class);
        $this->service->validateAndGetClaims($token);
    }
}

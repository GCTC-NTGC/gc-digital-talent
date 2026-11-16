<?php

namespace App\Services;

use App\Contracts\BearerTokenService;
use Illuminate\Support\Str;
use InvalidArgumentException;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Token\DataSet;

/**
 * Issues and accepts unsigned, JWT-shaped tokens so the app can run without any
 * external auth provider. Anyone can mint a token for any user, so this must
 * never be used in production.
 *
 * Tokens have no signature. They are still JWT-shaped because the frontend decodes
 * the access token. The exp claim only tells the frontend when to refresh; the API
 * ignores it, so a token keeps working after it expires.
 */
class DummyBearerTokenService implements BearerTokenService
{
    public const ISSUER = 'gc-digital-talent-dummy';

    public const LIFETIME_SECONDS = 3600;

    private JoseEncoder $encoder;

    public function __construct()
    {
        $this->encoder = new JoseEncoder();
    }

    public function validateAndGetClaims(string $bearerToken): DataSet
    {
        $parts = explode('.', $bearerToken);
        if (count($parts) !== 3) {
            throw new InvalidArgumentException('Dummy token must have three parts');
        }

        $claims = $this->encoder->jsonDecode($this->encoder->base64UrlDecode($parts[1]));
        if (! is_array($claims)) {
            throw new InvalidArgumentException('Dummy token payload must be an object');
        }
        if (($claims['iss'] ?? null) !== self::ISSUER) {
            throw new InvalidArgumentException('Dummy token has the wrong issuer');
        }
        if (! is_string($claims['sub'] ?? null) || $claims['sub'] === '') {
            throw new InvalidArgumentException('Dummy token is missing a sub');
        }

        return new DataSet($claims, $bearerToken);
    }

    /**
     * Build an unsigned token carrying the given claims.
     *
     * @param  array<string, mixed>  $claims  extra claims, e.g. given_name or email
     */
    public function issueToken(string $sub, array $claims = []): string
    {
        return $this->tokenFor($this->claimsFor($sub, $claims));
    }

    /**
     * The full set of claims a token for this sub carries, ready for tokenFor().
     *
     * @param  array<string, mixed>  $claims  extra claims, e.g. given_name or email
     * @return array<string, mixed>
     */
    public function claimsFor(string $sub, array $claims = []): array
    {
        $now = now()->getTimestamp();

        return [
            ...$claims,
            'iss' => self::ISSUER,
            'sub' => $sub,
            'iat' => $now,
            'exp' => $now + self::LIFETIME_SECONDS,
            // keeps a refreshed token different from the one it replaces
            'jti' => (string) Str::uuid(),
        ];
    }

    /**
     * @param  array<string, mixed>  $claims  from claimsFor()
     */
    public function tokenFor(array $claims): string
    {
        $header = ['typ' => 'JWT', 'alg' => 'none'];

        return $this->encoder->base64UrlEncode($this->encoder->jsonEncode($header))
            .'.'.$this->encoder->base64UrlEncode($this->encoder->jsonEncode($claims))
            .'.';
    }
}

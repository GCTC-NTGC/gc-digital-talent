<?php

use App\Support\Azure\AzureKeyVaultApi;
use Jose\Component\Core\JWK;
use Jose\Component\Core\Util\Base64UrlSafe;
use Jose\Component\Signature\Algorithm\RS256;
use Jose\Component\Signature\Algorithm\SignatureAlgorithm;

// An implementation of Jose signing algorithm using Azure key vault
final class AzureKeyVaultRS256 implements SignatureAlgorithm
{
    public function __construct(protected AzureKeyVaultApi $api) {}

    /**
     * Splits a key identifier into its parts.
     * eg: https://myvault.vault.azure.net/keys/CreateSoftKeyTest/78deebed173b48e48f55abf87ed4cf71
     *
     * @return array{vaultBaseUrl: string, keyName: string, keyVersion: string}
     */
    protected static function parseKid(string $kid): array
    {
        $parts = parse_url($kid);
        throw_unless(
            is_array($parts) && isset($parts['scheme'], $parts['host'], $parts['path']),
            new RuntimeException('Invalid key identifier')
        );

        $segments = explode('/', trim($parts['path'], '/'));
        throw_unless(
            count($segments) === 3 && $segments[0] === 'keys' && $segments[1] !== '' && $segments[2] !== '',
            new RuntimeException('Invalid key identifier')
        );

        $port = isset($parts['port']) ? ':'.$parts['port'] : '';

        return [
            'vaultBaseUrl' => $parts['scheme'].'://'.$parts['host'].$port,
            'keyName' => $segments[1],
            'keyVersion' => $segments[2],
        ];
    }

    public function name(): string
    {
        return 'RS256';
    }

    public function allowedKeyTypes(): array
    {
        return ['RSA'];
    }

    public function sign(JWK $key, string $input): string
    {
        $keyParts = self::parseKid($key->get('kid'));
        $digest = Base64UrlSafe::encodeUnpadded(hash('sha256', $input, true));
        $result = $this->api->sign($keyParts['keyId'], $keyParts['keyVersion'], $this->name(), $digest)['value']; // returns base64url

        return Base64UrlSafe::decodeNoPadding($result);                        // builder wants raw bytes
    }

    public function verify(JWK $key, string $input, string $signature): bool
    {
        return (new RS256())->verify($key, $input, $signature); // public key is enough
    }
}

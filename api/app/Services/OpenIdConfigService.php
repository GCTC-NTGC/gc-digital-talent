<?php
namespace App\Services;

use App\Services\Contracts\AuthConfigInterface;
use Illuminate\Support\Facades\Cache;

class OpenIdConfigService implements AuthConfigInterface
{
    private function getConfigObject() : object{
        $jsonString = Cache::remember('openid_config_json_string', 60, function() { // only get content every minute
            $root = env('AUTH_SERVER_ROOT');
            $config_uri = $root . '/.well-known/openid-configuration';
            return file_get_contents($config_uri);
        });

        return json_decode($jsonString);
    }

    public function getIssuer(): string
    {
        $obj = $this->getConfigObject();

        return data_get($obj, 'issuer');
    }

    public function getJwksUri(): string
    {
        $obj = $this->getConfigObject();

        return data_get($obj, 'jwks_uri');
    }
}

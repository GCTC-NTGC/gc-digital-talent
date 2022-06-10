<?php
namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class OpenIdConfigurationService
{
    private string $configUri;

    public function __construct(string $configUri)
    {
        $this->configUri = $configUri;
    }

    private function getJsonObject()
    {
        $jsonString = Cache::remember('openid_config_json_string', 60, function() { // only get content every minute
            return Http::get($this->configUri)->body();
        });

        return json_decode($jsonString);
    }

    // get a configuration property from the openid configuration json document
    public function getFieldValue(string $fieldName, $default = null): ?string
    {
        $jsonObject = $this->getJsonObject();

        $fieldValue = data_get($jsonObject, $fieldName);

        if(empty($fieldValue) && !empty($default))
            return $default;

        return $fieldValue;
    }
}

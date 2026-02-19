<?php

namespace App\Logging\Azure;

use App\Contracts\ManagedIdentityService;
use Illuminate\Support\Facades\App;
use Monolog\Logger;

class CreateAzureLogger
{
    /**
     * Create a custom Monolog instance.
     */
    public function __invoke(array $config): Logger
    {
        $logger = new Logger('azure');
        $logger->pushHandler(new AzureHandler(
            level: $config['level'],
            identityService: App::make(ManagedIdentityService::class),
            endpoint: $config['endpoint'],
            dcrImmutableId: $config['dcrImmutableId'],
            streamName: $config['streamName'],
            column01: $config['column01'],
            column02: $config['column02']
        ));

        return $logger;
    }
}

<?php

namespace App\Logging\Azure;

use App\Contracts\ManagedIdentityService;
use App\Logging\TbsLoggingStandardProcessor;
use Illuminate\Support\Facades\App;
use Monolog\Handler\BufferHandler;
use Monolog\Logger;

class CreateAzureLogger
{
    /**
     * Create a custom Monolog instance.
     */
    public function __invoke(array $config): Logger
    {
        $logger = new Logger('azure');
        $logger->pushProcessor(new TbsLoggingStandardProcessor());

        $baseHandler = new AzureHandler(
            // logger config
            level: $config['level'],
            identityService: App::make(ManagedIdentityService::class),
            endpoint: $config['endpoint'],
            dcrImmutableId: $config['dcrImmutableId'],
            streamName: $config['streamName'],
        );
        $baseHandler->setFormatter(new AzureAppLogsFormatter());

        $logger->pushHandler(new BufferHandler(
            handler: $baseHandler,
            level: $config['level'],
            bufferLimit: $config['bufferLimit'],
            flushOnOverflow: true
        ));

        return $logger;
    }
}

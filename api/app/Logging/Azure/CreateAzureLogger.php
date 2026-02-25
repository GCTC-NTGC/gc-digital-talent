<?php

namespace App\Logging\Azure;

use App\Contracts\ManagedIdentityService;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
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
            // logger config
            level: $config['level'],
            identityService: App::make(ManagedIdentityService::class),
            endpoint: $config['endpoint'],
            dcrImmutableId: $config['dcrImmutableId'],
            streamName: $config['streamName'],
            // logged values
            applicationId: config('app.url'),
            sourceIp: Request::ip(),
            xForwardedIp: Request::header('X-Forwarded-For'),
            correlationId: Request::cookie('ai_session'),
            sourceUserId: Auth::user()?->getAuthIdentifier(),
        ));

        return $logger;
    }
}

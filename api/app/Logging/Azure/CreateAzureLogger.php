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
            level: $config['level'],
            identityService: App::make(ManagedIdentityService::class),
            endpoint: $config['endpoint'],
            dcrImmutableId: $config['dcrImmutableId'],
            streamName: $config['streamName'],
            applicationID: config('app.url'),
            // context
            // correlationID
            // eventAction
            // eventID
            // eventStatus
            // eventText
            // group
            host: Request::getHost(),
            sourceIP: Request::ip(),
            sourceUserID: Auth::user()?->getAuthIdentifier(),
            // targetUserID
            // timeGenerated
            // xForwardedIP
        ));

        return $logger;
    }
}

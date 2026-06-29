<?php

namespace App\Logging\Azure;

use App\Contracts\ManagedIdentityService;
use App\Logging\TbsLoggingStandardProcessor;
use Illuminate\Console\Events\CommandFinished;
use Illuminate\Queue\Events\JobAttempted;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Event;
use Monolog\Handler\BufferHandler;
use Monolog\Logger;

class CreateAzureLogger
{
    /**
     * Create a custom Monolog instance.
     */
    public function __invoke(array $config): Logger
    {
        // base handler handles sending events to Azure
        $baseHandler = new AzureHandler(
            level: $config['level'],
            identityService: App::make(ManagedIdentityService::class),
            endpoint: $config['endpoint'],
            dcrImmutableId: $config['dcrImmutableId'],
            streamName: $config['streamName'],
        )
            ->setFormatter(new AzureAppLogsFormatter());

        // wrapping handler will buffer events before sending them on as a group
        $wrappingHandler = new BufferHandler(
            handler: $baseHandler,
            level: $config['level'],
            bufferLimit: $config['bufferLimit'],
            flushOnOverflow: true
        );

        // manually flush the buffer when an artisan command finishes or after a job was attempted (success or failure)
        Event::listen([CommandFinished::class, JobAttempted::class], function () use ($wrappingHandler) {
            $wrappingHandler->flush();
        });

        return new Logger('azure', [$wrappingHandler], [new TbsLoggingStandardProcessor()]);
    }
}

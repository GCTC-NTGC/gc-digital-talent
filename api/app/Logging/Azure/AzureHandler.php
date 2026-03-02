<?php

declare(strict_types=1);

namespace App\Logging\Azure;

use App\Contracts\ManagedIdentityService;
use App\Logging\ApiHandler;
use Illuminate\Support\Facades\Http;
use Monolog\Level;

/**
 * Sends log messages through Azure endpoints
 *
 * @see https://learn.microsoft.com/en-us/azure/azure-monitor/logs/logs-ingestion-api-overview#rest-api-call
 */
class AzureHandler extends ApiHandler
{
    /**
     * @param  ManagedIdentityService  $identityService  The service that can provide access token based on the managed identity.
     * @param  non-empty-string  $endpoint  The REST API endpoint for the Logs Ingestion API can either be a data collection endpoint (DCE) or the DCR logs ingestion endpoint.
     * @param  non-empty-string  $dcrImmutableId  The DCR Immutable ID is generated for the DCR when it's created. You can retrieve it from the Overview page for the DCR in the Azure portal.
     * @param  non-empty-string  $streamName  Stream Name refers to the stream in the DCR that should handle the custom data.
     */
    public function __construct(
        // logger config
        public ManagedIdentityService $identityService,
        public string $endpoint,
        public string $dcrImmutableId,
        public string $streamName,

        $level = Level::Critical,
        bool $bubble = true,
    ) {
        parent::__construct($level, $bubble);
    }

    protected function send(string $content, array $records): void
    {
        Http::withToken($this->identityService->getAccessToken())
            ->withQueryParameters(['api-version' => '2023-01-01'])
            ->withBody($content, 'application/json')
            ->post($this->endpoint.'/dataCollectionRules/'.$this->dcrImmutableId.'/streams/'.$this->streamName)
            ->throwUnlessStatus(204);
    }
}

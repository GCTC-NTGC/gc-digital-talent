<?php

declare(strict_types=1);

namespace App\Logging\Azure;

use App\Contracts\ManagedIdentityService;
use Illuminate\Support\Facades\Http;
use Monolog\Formatter\FormatterInterface;
use Monolog\Handler\AbstractProcessingHandler;
use Monolog\Handler\HandlerInterface;
use Monolog\Level;
use Monolog\LogRecord;

/**
 * Sends notifications through Azure endpoints
 *
 * @see https://learn.microsoft.com/en-us/azure/azure-monitor/logs/logs-ingestion-api-overview#rest-api-call
 */
class AzureHandler extends AbstractProcessingHandler
{
    /**
     * Instance of the AzureRecord util class preparing data for Azure API.
     */
    private AzureRecord $azureRecord;

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
        // logged values
        public ?string $applicationId,
        public ?string $sourceIp,
        public ?string $xForwardedIp,
        public ?string $correlationId,
        public ?string $sourceUserId,

        $level = Level::Critical,
        bool $bubble = true,
    ) {
        parent::__construct($level, $bubble);

        $this->azureRecord = new AzureRecord(
            applicationId: $applicationId,
            sourceIp: $sourceIp,
            sourceUserId: $sourceUserId,
            xForwardedIp: $xForwardedIp,
            correlationId: $correlationId,
            formatter: null,
        );
    }

    public function getAzureRecord(): AzureRecord
    {
        return $this->azureRecord;
    }

    /**
     * {@inheritDoc}
     */
    protected function write(LogRecord $record): void
    {
        Http::withToken($this->identityService->getAccessToken())
            ->post(
                $this->endpoint.'/dataCollectionRules/'.$this->dcrImmutableId.'/streams/'.$this->streamName.'?api-version=2023-01-01',
                [
                    $this->azureRecord->getAzureData($record),
                ]
            )
            ->throwUnlessStatus(204);
    }

    public function setFormatter(FormatterInterface $formatter): HandlerInterface
    {
        parent::setFormatter($formatter);
        $this->azureRecord->setFormatter($formatter);

        return $this;
    }

    public function getFormatter(): FormatterInterface
    {
        $formatter = parent::getFormatter();
        $this->azureRecord->setFormatter($formatter);

        return $formatter;
    }
}

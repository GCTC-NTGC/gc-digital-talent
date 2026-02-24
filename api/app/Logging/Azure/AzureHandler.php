<?php

declare(strict_types=1);

namespace App\Logging\Azure;

use App\Contracts\ManagedIdentityService;
use Monolog\Formatter\FormatterInterface;
use Monolog\Handler\AbstractProcessingHandler;
use Monolog\Handler\Curl\Util;
use Monolog\Handler\HandlerInterface;
use Monolog\Handler\MissingExtensionException;
use Monolog\Level;
use Monolog\LogRecord;
use Monolog\Utils;

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
     *
     * @throws MissingExtensionException If the curl extension is missing
     */
    public function __construct(
        public ManagedIdentityService $identityService,
        public string $endpoint,
        public string $dcrImmutableId,
        public string $streamName,
        public ?string $applicationID = null,
        public ?array $context = null,
        public ?string $correlationID = null,
        public ?string $eventAction = null,
        public ?string $eventID = null,
        public ?string $eventStatus = null,
        public ?string $eventText = null,
        public ?string $group = null,
        public ?string $host = null,
        public ?string $sourceIP = null,
        public ?string $sourceUserID = null,
        public ?string $targetUserID = null,
        public ?string $xForwardedIP = null,

        $level = Level::Critical,
        bool $bubble = true,
    ) {
        if (! \extension_loaded('curl')) {
            throw new MissingExtensionException('The curl extension is needed to use the AzureHandler');
        }

        parent::__construct($level, $bubble);

        $this->azureRecord = new AzureRecord(
            applicationID: $applicationID,
            correlationID: $correlationID,
            eventAction: $eventAction,
            eventID: $eventID,
            eventStatus: $eventStatus,
            group: $group,
            host: $host,
            sourceIP: $sourceIP,
            sourceUserID: $sourceUserID,
            targetUserID: $targetUserID,
            xForwardedIP: $xForwardedIP,
            formatter: null,
        );
    }

    public function getAzureRecord(): AzureRecord
    {
        return $this->azureRecord;
    }

    public function getConstructedUrl(): string
    {
        return $this->endpoint.'/dataCollectionRules/'.$this->dcrImmutableId.'/streams/'.$this->streamName.'?api-version=2023-01-01';
    }

    /**
     * {@inheritDoc}
     */
    protected function write(LogRecord $record): void
    {
        $postData = [$this->azureRecord->getAzureData($record)];
        $postString = Utils::jsonEncode($postData);
        $accessToken = $this->identityService->getAccessToken();

        $ch = curl_init();
        $options = [
            CURLOPT_URL => $this->getConstructedUrl(),
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer '.$accessToken,
                'Content-type: application/json',
            ],
            CURLOPT_POSTFIELDS => $postString,
        ];

        curl_setopt_array($ch, $options);

        Util::execute($ch);
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

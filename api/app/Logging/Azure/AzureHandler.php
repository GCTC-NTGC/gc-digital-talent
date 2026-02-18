<?php

declare(strict_types=1);

namespace App\Logging\Azure;

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
     * Endpoint
     * The REST API endpoint for the Logs Ingestion API can either be a data collection endpoint (DCE) or the DCR logs ingestion endpoint.
     *
     * @var non-empty-string
     */
    private string $endpoint;

    /**
     * DCR Immutable ID
     * The DCR Immutable ID is generated for the DCR when it's created. You can retrieve it from the Overview page for the DCR in the Azure portal.
     *
     * @var non-empty-string
     */
    private string $dcrImmutableId;

    /**
     * Stream Name
     * Stream Name refers to the stream in the DCR that should handle the custom data.
     *
     * @var non-empty-string
     */
    private string $streamName;

    /**
     * Instance of the AzureRecord util class preparing data for Azure API.
     */
    private AzureRecord $azureRecord;

    /**
     * @param  non-empty-string  $endpoint  Endpoint
     * @param  non-empty-string  $dcrImmutableId  DCR Immutable ID
     * @param  non-empty-string  $streamName  Stream Name
     * @param  string|null  $column01  First placeholder column
     * @param  string|null  $column02  Second placeholder column
     *
     * @throws MissingExtensionException If the curl extension is missing
     */
    public function __construct(
        string $endpoint,
        string $dcrImmutableId,
        string $streamName,
        ?string $column01 = null,
        ?string $column02 = null,
        $level = Level::Critical,
        bool $bubble = true,
    ) {
        if (! \extension_loaded('curl')) {
            throw new MissingExtensionException('The curl extension is needed to use the AzureHandler');
        }

        parent::__construct($level, $bubble);

        $this->endpoint = $endpoint;
        $this->dcrImmutableId = $dcrImmutableId;
        $this->streamName = $streamName;

        $this->azureRecord = new AzureRecord(
            $column01,
            $column02,
        );
    }

    public function getAzureRecord(): AzureRecord
    {
        return $this->azureRecord;
    }

    public function getEndpoint(): string
    {
        return $this->endpoint;
    }

    public function getDcrImmutableId(): string
    {
        return $this->dcrImmutableId;
    }

    public function getStreamName(): string
    {
        return $this->streamName;
    }

    public function getConstructedUrl(): string
    {
        return $this->getEndpoint().'/dataCollectionRules/'.$this->getDcrImmutableId().'/streams/'.$this->getStreamName().'?api-version=2023-01-01';
    }

    /**
     * {@inheritDoc}
     */
    protected function write(LogRecord $record): void
    {
        $postData = $this->azureRecord->getAzureData($record);
        $postString = Utils::jsonEncode($postData);

        $ch = curl_init();
        $options = [
            CURLOPT_URL => $this->getConstructedUrl(),
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: '.'X',
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

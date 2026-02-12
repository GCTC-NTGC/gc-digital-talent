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
 */
class AzureHandler extends AbstractProcessingHandler
{
    /**
     * Azure endpoint URL
     *
     * @var non-empty-string
     */
    private string $endpointUrl;

    /**
     * Instance of the AzureRecord util class preparing data for Azure API.
     */
    private AzureRecord $azureRecord;

    /**
     * @param  non-empty-string  $endpointUrl  Azure endpoint URL
     * @param  string|null  $channel  Slack channel (encoded ID or name)
     * @param  string|null  $username  Name of a bot
     * @param  bool  $useAttachment  Whether the message should be added to Slack as attachment (plain text otherwise)
     * @param  string|null  $iconEmoji  The emoji name to use (or null)
     * @param  bool  $useShortAttachment  Whether the the context/extra messages added to Slack as attachments are in a short style
     * @param  bool  $includeContextAndExtra  Whether the attachment should include context and extra data
     * @param  string[]  $excludeFields  Dot separated list of fields to exclude from slack message. E.g. ['context.field1', 'extra.field2']
     *
     * @throws MissingExtensionException If the curl extension is missing
     */
    public function __construct(
        string $endpointUrl,
        ?string $channel = null,
        ?string $username = null,
        bool $useAttachment = true,
        ?string $iconEmoji = null,
        bool $useShortAttachment = false,
        bool $includeContextAndExtra = false,
        $level = Level::Critical,
        bool $bubble = true,
        array $excludeFields = []
    ) {
        if (! \extension_loaded('curl')) {
            throw new MissingExtensionException('The curl extension is needed to use the AzureHandler');
        }

        parent::__construct($level, $bubble);

        $this->endpointUrl = $endpointUrl;

        $this->azureRecord = new AzureRecord(
            $channel,
            $username,
            $useAttachment,
            $iconEmoji,
            $useShortAttachment,
            $includeContextAndExtra,
            $excludeFields
        );
    }

    public function getAzureRecord(): AzureRecord
    {
        return $this->azureRecord;
    }

    public function getEndpointUrl(): string
    {
        return $this->endpointUrl;
    }

    /**
     * {@inheritDoc}
     */
    protected function write(LogRecord $record): void
    {
        $postData = $this->azureRecord->getSlackData($record);
        $postString = Utils::jsonEncode($postData);

        $ch = curl_init();
        $options = [
            CURLOPT_URL => $this->endpointUrl,
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => ['Content-type: application/json'],
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

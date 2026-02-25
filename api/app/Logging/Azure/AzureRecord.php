<?php

declare(strict_types=1);

namespace App\Logging\Azure;

use Monolog\Formatter\FormatterInterface;
use Monolog\LogRecord;

class AzureRecord
{
    public function __construct(
        public ?string $applicationId,
        public ?string $sourceIp,
        public ?string $sourceUserId,
        public ?string $xForwardedIp,
        public ?string $correlationId,

        public ?FormatterInterface $formatter,
    ) {}

    /**
     * Returns required data in format that Azure
     * is expecting.
     *
     * @phpstan-return mixed[]
     */
    public function getAzureData(LogRecord $record): array
    {
        $dataArray = [];

        // some context fields may be pulled out if recognized
        $context = $record->context;

        $dataArray['TimeGenerated'] = $record->datetime->format('c');
        $dataArray['LogLevel'] = $record->level->getName();
        if (array_key_exists('EventID', $context)) {
            $dataArray['EventID'] = $context['EventID'];
            unset($context['EventID']);
        }
        if ($this->applicationId !== null) {
            $dataArray['ApplicationID'] = $this->applicationId;
        }
        if ($this->sourceIp !== null) {
            $dataArray['SourceIP'] = $this->sourceIp;
        }
        if ($this->xForwardedIp !== null) {
            $dataArray['XForwardedIP'] = $this->xForwardedIp;
        }
        if ($this->correlationId !== null) {
            $dataArray['CorrelationID'] = $this->correlationId;
        }
        if ($this->sourceUserId !== null) {
            $dataArray['SourceUserID'] = $this->sourceUserId;
        }
        if (array_key_exists('TargetUserID', $context)) {
            $dataArray['TargetUserID'] = $context['TargetUserID'];
            unset($context['TargetUserID']);
        }
        if (array_key_exists('EventStatus', $context)) {
            $dataArray['EventStatus'] = $context['EventStatus'];
            unset($context['EventStatus']);
        }
        if (array_key_exists('EventAction', $context)) {
            $dataArray['EventAction'] = $context['EventAction'];
            unset($context['EventAction']);
        }

        $dataArray['EventText'] = $record->message;
        $dataArray['Context'] = $context;

        return $dataArray;
    }

    /**
     * @return $this
     */
    public function setFormatter(?FormatterInterface $formatter = null): self
    {
        $this->formatter = $formatter;

        return $this;
    }
}

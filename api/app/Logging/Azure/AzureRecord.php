<?php

declare(strict_types=1);

namespace App\Logging\Azure;

use Monolog\Formatter\FormatterInterface;
use Monolog\LogRecord;

class AzureRecord
{
    public function __construct(
        public ?string $applicationID,
        public ?string $correlationID,
        public ?string $eventAction,
        public ?string $eventID,
        public ?string $eventStatus,
        public ?string $group,
        public ?string $host,
        public ?string $sourceIP,
        public ?string $sourceUserID,
        public ?string $targetUserID,

        public ?string $xForwardedIP,
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

        if ($this->applicationID !== null) {
            $dataArray['ApplicationID'] = $this->applicationID;
        }
        $dataArray['Context'] = $record->context;
        if ($this->correlationID !== null) {
            $dataArray['CorrelationID'] = $this->correlationID;
        }
        if ($this->eventAction !== null) {
            $dataArray['EventAction'] = $this->eventAction;
        }
        if ($this->eventID !== null) {
            $dataArray['EventID'] = $this->eventID;
        }
        if ($this->eventStatus !== null) {
            $dataArray['EventStatus'] = $this->eventStatus;
        }
        $dataArray['EventText'] = $record->message;
        if ($this->group !== null) {
            $dataArray['Group'] = $this->group;
        }
        if ($this->host !== null) {
            $dataArray['Host'] = $this->host;
        }
        $dataArray['LogLevel'] = $record->level->getName();
        if ($this->sourceIP !== null) {
            $dataArray['SourceIP'] = $this->sourceIP;
        }
        if ($this->sourceUserID !== null) {
            $dataArray['SourceUserID'] = $this->sourceUserID;
        }
        if ($this->targetUserID !== null) {
            $dataArray['TargetUserID'] = $this->targetUserID;
        }

        $dataArray['TimeGenerated'] = $record->datetime->format('c');

        if ($this->xForwardedIP !== null) {
            $dataArray['XForwardedIP'] = $this->xForwardedIP;
        }

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
